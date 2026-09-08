/* =============================================================
 * 가치타자 — 화면 전환 & 전체 흐름 (app.js)
 * 시작 → (최초 1회 HOW TO) → 카운트다운 → 게임 → 결과 → 랭킹
 * ============================================================= */
(function (global) {
  'use strict';

  const C = global.CONFIG;
  const $ = (id) => document.getElementById(id);

  const App = {
    player: null,
    prevScreen: 'screen-start',

    init() {
      global.Effects.sound.init();
      global.Game.init();
      global.Ranking.init();

      this._fillDepartments();
      this._bindStart();
      this._bindHowto();
      this._bindResult();
      this._bindRanking();

      this.show('screen-start');
    },

    show(id) {
      document.querySelectorAll('.screen').forEach((s) => {
        s.classList.toggle('is-active', s.id === id);
      });
      global.scrollTo(0, 0);
    },

    /* ---------- 시작 화면 ---------- */
    _fillDepartments() {
      const sel = $('input-department');
      (global.DEPARTMENTS || []).forEach((d) => {
        const o = document.createElement('option');
        o.value = d; o.textContent = d;
        sel.appendChild(o);
      });
    },

    _validate() {
      const dept = $('input-department').value;
      const rawName = $('input-name').value;
      const name = rawName.replace(/\s+/g, ' ').trim();
      const err = $('login-error');

      if (!dept) { err.textContent = '부서를 선택하세요.'; return null; }
      if (!name) { err.textContent = '이름을 입력하세요.'; return null; }
      if (Array.from(name).length < C.NAME.min || Array.from(name).length > C.NAME.max) {
        err.textContent = `이름은 ${C.NAME.min}~${C.NAME.max}자로 입력하세요.`;
        return null;
      }
      if (!/^[가-힣a-zA-Z0-9·.\-\s]+$/.test(name)) {
        err.textContent = '이름에 사용할 수 없는 문자가 있습니다.';
        return null;
      }
      err.textContent = '';
      return { name, department: dept };
    },

    _bindStart() {
      $('btn-start').addEventListener('click', () => {
        global.Effects.sound.unlock();
        const p = this._validate();
        if (!p) return;
        this.player = p;
        global.App.player = p;

        if (localStorage.getItem(C.STORAGE.seenHowToKey)) {
          this._beginGame();
        } else {
          this._howtoReturnsTo = null;
          this.show('screen-howto');
        }
      });

      $('input-name').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') $('btn-start').click();
      });

      $('btn-open-ranking').addEventListener('click', () => {
        this.prevScreen = 'screen-start';
        this.show('screen-ranking');
        global.Ranking.open();
      });

      $('btn-open-howto').addEventListener('click', () => {
        this._howtoReturnsTo = 'screen-start';
        this.show('screen-howto');
      });
    },

    /* ---------- HOW TO ---------- */
    _bindHowto() {
      $('btn-ready').addEventListener('click', () => {
        localStorage.setItem(C.STORAGE.seenHowToKey, '1');
        if (this._howtoReturnsTo === 'screen-start') {
          this._howtoReturnsTo = null;
          this.show('screen-start');
          return;
        }
        this._beginGame();
      });
      $('btn-howto-back').addEventListener('click', () => {
        localStorage.setItem(C.STORAGE.seenHowToKey, '1');
        this.show(this._howtoReturnsTo === 'screen-start' ? 'screen-start' : 'screen-start');
        this._howtoReturnsTo = null;
      });
    },

    /* ---------- 게임 시작(카운트다운 포함) ---------- */
    _beginGame() {
      this.show('screen-game');
      this._resetGameHud();
      global.Effects.sound.unlock();
      global.Effects.countdown(
        $('countdown-overlay'),
        (step) => global.Effects.sound.play(step === 'START!' ? 'go' : 'count'),
        () => global.Game.start(this.player, (record, extra) => this._onGameEnd(record, extra))
      );
    },

    _resetGameHud() {
      $('hud-time').textContent = C.GAME_DURATION;
      $('hud-score').textContent = '0';
      $('hud-combo').textContent = '0';
      $('hud-qnum').textContent = '0';
      $('q-category').textContent = '준비';
      $('q-text').textContent = '잠시 후 시작합니다...';
      $('type-echo').textContent = '';
    },

    /* ---------- 결과 ---------- */
    async _onGameEnd(record, extra) {
      this._lastRecord = record;
      this._boardSubmitted = false;

      const prevBest = global.RankingStore.getBestScore(record.playerName, record.department);
      global.RankingStore.saveLocal(record);

      const isNew = prevBest != null && record.score > prevBest;
      const personalBest = Math.max(prevBest == null ? -Infinity : prevBest, record.score);

      $('result-title').textContent = 'TIME UP';
      $('result-grade').textContent = global.Score.grade(record.score);
      $('r-name').textContent = record.playerName;
      $('r-dept').textContent = record.department;
      $('r-score').textContent = record.score;
      $('r-correct').textContent = record.correctCount;
      $('r-wrong').textContent = record.wrongCount + (extra && extra.missedCount ? ` (놓침 ${extra.missedCount})` : '');
      $('r-accuracy').textContent = Math.round(record.accuracy * 100) + '%';
      $('r-combo').textContent = record.maxCombo;
      $('r-avgtime').textContent = record.averageResponseTime.toFixed(2) + '초';
      $('r-best').textContent = personalBest === -Infinity ? record.score : personalBest;

      $('result-newrecord').hidden = !isNew;
      this.show('screen-result');
      if (isNew) global.Effects.sound.play('record');

      const hasBoard = global.RankingStore.hasBoard();
      const submitBtn = $('btn-submit-board');
      const submitStatus = $('submit-status');
      submitBtn.hidden = !hasBoard || C.STORAGE.autoSubmit;
      submitBtn.disabled = false;
      submitBtn.textContent = '🏆 전체 랭킹에 등록';
      submitStatus.textContent = hasBoard ? '' : '(이 브라우저에만 저장됨)';

      // 순위 표시
      if (!hasBoard) {
        const ri = await global.RankingStore.getPlayerRank(record.playerName, record.department, 'all');
        $('r-rank').textContent = ri.rank ? `${ri.rank}위 / ${ri.total}명 (이 브라우저)` : '-';
      } else if (C.STORAGE.autoSubmit) {
        $('r-rank').textContent = '등록 중…';
        this._submitToBoard();
      } else {
        $('r-rank').textContent = '「전체 랭킹에 등록」 시 반영';
      }
    },

    async _submitToBoard() {
      const record = this._lastRecord;
      if (!record || this._boardSubmitted) return;
      const btn = $('btn-submit-board');
      const status = $('submit-status');
      btn.disabled = true;
      btn.textContent = '등록 중…';
      status.textContent = '';
      try {
        await global.RankingStore.submitToBoard(record);
        this._boardSubmitted = true;
        btn.hidden = true;
        status.textContent = '✓ 전체 랭킹에 등록되었습니다';
        const ri = await global.RankingStore.getPlayerRank(
          record.playerName, record.department, 'all', { force: true });
        $('r-rank').textContent = ri.rank ? `${ri.rank}위 / ${ri.total}명` : '집계 중';
      } catch (e) {
        btn.disabled = false;
        btn.textContent = '🏆 다시 시도';
        status.textContent = '⚠ 등록 실패: ' + (e && e.message || '네트워크 오류');
        $('r-rank').textContent = '등록 후 반영';
      }
    },

    _bindResult() {
      $('btn-retry').addEventListener('click', () => {
        global.Effects.sound.unlock();
        this._beginGame();
      });
      $('btn-submit-board').addEventListener('click', () => this._submitToBoard());
      $('btn-result-ranking').addEventListener('click', () => {
        this.prevScreen = 'screen-result';
        this.show('screen-ranking');
        global.Ranking.open();
      });
      $('btn-result-home').addEventListener('click', () => this.show('screen-start'));
    },

    /* ---------- 랭킹 ---------- */
    _bindRanking() {
      $('btn-ranking-back').addEventListener('click', () => {
        this.show(this.prevScreen || 'screen-start');
      });
      $('btn-ranking-clear').addEventListener('click', async () => {
        const msg = global.RankingStore.hasBoard()
          ? '이 브라우저에 저장된 내 기록만 삭제합니다.\n(전체 공용 랭킹에는 영향 없음)\n계속할까요?'
          : '이 브라우저에 저장된 모든 가치타자 기록을 삭제합니다.\n계속할까요?';
        if (!confirm(msg)) return;
        global.RankingStore.clearLocal();
        global.Ranking.render();
      });
    },
  };

  global.App = App;
  document.addEventListener('DOMContentLoaded', () => App.init());
})(window);
