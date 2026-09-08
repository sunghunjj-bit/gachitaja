/* =============================================================
 * 가치타자 — 랭킹 화면 UI (ranking.js)
 *
 * - 탭: 전체 / 오늘 / 부서별
 * - 이름 자동 마스킹(본인은 전체 이름 표시)
 * - TOP 3 트로피 강조
 * - "나의 순위 27위 / 142명" 표시
 * 데이터는 RankingStore(js/storage.js) 에서만 가져온다.
 * ============================================================= */
(function (global) {
  'use strict';

  function maskName(name) {
    const s = Array.from(String(name || ''));
    if (s.length <= 1) return s.join('');
    if (s.length === 2) return s[0] + '○';
    return s[0] + '○'.repeat(s.length - 2) + s[s.length - 1];
  }

  function fmtPct(v) { return Math.round((v || 0) * 100) + '%'; }
  function fmtSec(v) { return (v || 0).toFixed(2) + '초'; }

  const Ranking = {
    els: {},
    tab: 'all',
    deptFilter: null,

    init() {
      const $ = (id) => document.getElementById(id);
      this.els = {
        tabs: Array.from(document.querySelectorAll('#screen-ranking .tab')),
        list: $('ranking-list'),
        empty: $('ranking-empty'),
        myRank: $('ranking-myrank'),
        deptWrap: $('dept-filter-wrap'),
        deptSelect: $('ranking-dept'),
      };

      (global.DEPARTMENTS || []).forEach((d) => {
        const o = document.createElement('option');
        o.value = d; o.textContent = d;
        this.els.deptSelect.appendChild(o);
      });

      this.els.tabs.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.els.tabs.forEach((b) => b.classList.toggle('is-active', b === btn));
          this.tab = btn.dataset.tab;
          this.render();
        });
      });

      this.els.deptSelect.addEventListener('change', () => {
        this.deptFilter = this.els.deptSelect.value;
        this.render();
      });
    },

    /** 랭킹 화면 진입 시 호출 */
    open() {
      const me = global.App && global.App.player;
      if (me && !this.deptFilter) {
        this.deptFilter = me.department;
        this.els.deptSelect.value = me.department;
      }
      this.render();
    },

    async render() {
      const me = global.App && global.App.player;
      this.els.deptWrap.hidden = this.tab !== 'dept';

      const dept = this.tab === 'dept'
        ? (this.deptFilter || (me && me.department) || (global.DEPARTMENTS || [])[0])
        : null;
      if (this.tab === 'dept' && dept) this.els.deptSelect.value = dept;

      const reqId = (this._reqId = (this._reqId || 0) + 1);
      this.els.list.innerHTML = '';
      this.els.empty.hidden = true;
      this.els.myRank.hidden = true;
      if (global.RankingStore.hasBoard()) {
        this.els.empty.hidden = false;
        this.els.empty.textContent = '공용 랭킹 불러오는 중…';
      }

      let board = [];
      let failed = false;
      try {
        board = await global.RankingStore.getLeaderboard(this.tab, { department: dept });
      } catch (e) {
        failed = true;
      }
      if (reqId !== this._reqId) return; // 더 최신 요청이 있으면 무시

      const myKey = me ? global.RankingStore.playerKey(me.name, me.department) : null;

      this.els.list.innerHTML = '';
      this.els.empty.hidden = board.length > 0;
      this.els.empty.textContent = failed
        ? '공용 랭킹을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
        : '아직 기록이 없습니다. 첫 주자가 되어보세요!';

      board.slice(0, 10).forEach((r) => {
        const isMe = myKey && r.key === myKey;
        const li = document.createElement('li');
        li.className = 'rank-row' + (r.rank <= 3 ? ' top' + r.rank : '') + (isMe ? ' is-me' : '');

        const medal = r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank;
        const shownName = isMe ? (me.name + ' (나)') : maskName(r.playerName);

        li.innerHTML =
          '<span class="rk-pos">' + medal + '</span>' +
          '<span class="rk-name">' + escapeHtml(shownName) + '</span>' +
          '<span class="rk-dept">' + escapeHtml(r.department) + '</span>' +
          '<span class="rk-score">' + r.score + '</span>' +
          '<span class="rk-sub">정확도 ' + fmtPct(r.accuracy) + ' · 콤보 ' + (r.maxCombo || 0) + ' · ' + fmtSec(r.averageResponseTime) + '</span>';
        this.els.list.appendChild(li);
      });

      // 나의 순위
      if (me) {
        const idx = board.findIndex((r) => r.key === myKey);
        if (idx >= 0) {
          this.els.myRank.textContent = '나의 순위 ' + (idx + 1) + '위 / ' + board.length + '명';
          this.els.myRank.hidden = false;
        } else {
          this.els.myRank.textContent = this.tab === 'today'
            ? '오늘은 아직 기록이 없습니다.'
            : (this.tab === 'dept' ? '이 부서에 내 기록이 없습니다.' : '아직 내 기록이 없습니다.');
          this.els.myRank.hidden = false;
        }
      } else {
        this.els.myRank.hidden = true;
      }
    },
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  global.Ranking = Ranking;
  global.maskName = maskName;
})(window);
