/* =============================================================
 * 가치타자 — 기록 저장 / 랭킹 데이터 접근 (storage.js)
 *
 * 두 가지 저장소를 함께 씁니다.
 *  1) LocalStore  — 이 브라우저의 내 기록 (개인 최고기록·오프라인 대비)
 *  2) SheetStore  — Google Apps Script + 구글시트 = 전 직원 공용 랭킹
 *
 * CONFIG.STORAGE.sheetApiUrl 이 비어 있으면 공용 랭킹 없이 로컬만 사용합니다.
 * 설정 방법: 같은 폴더 SETUP_RANKING.md
 *
 * 저장 레코드:
 *   { playerName, department, score, correctCount, wrongCount,
 *     accuracy, maxCombo, averageResponseTime, playedAt }
 *
 * ⚠ 프런트엔드 코드에는 비밀번호/API Secret/관리자 키를 넣지 않습니다.
 *   Apps Script 웹앱 주소(/exec)는 공개돼도 무방한 값입니다(익명 기록 추가 전용).
 * ============================================================= */
(function (global) {
  'use strict';

  const S = global.CONFIG.STORAGE;
  const playerKey = (name, dept) => `${name}${dept}`;

  function isSameLocalDay(ts, ref) {
    const a = new Date(ts), b = new Date(ref || Date.now());
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  /* 동점 처리: 점수 → 정확도 → 평균 응답시간(빠를수록) → 최고 콤보 */
  function compareRecords(a, b) {
    if (b.score !== a.score) return b.score - a.score;
    if ((b.accuracy || 0) !== (a.accuracy || 0)) return (b.accuracy || 0) - (a.accuracy || 0);
    const at = a.averageResponseTime || Infinity;
    const bt = b.averageResponseTime || Infinity;
    if (at !== bt) return at - bt;
    return (b.maxCombo || 0) - (a.maxCombo || 0);
  }

  function bestPerPlayer(records) {
    const map = new Map();
    for (const r of records) {
      if (!r || r.playerName == null) continue;
      const k = playerKey(r.playerName, r.department);
      const cur = map.get(k);
      if (!cur || compareRecords(r, cur) < 0) map.set(k, r);
    }
    return Array.from(map.entries()).map(([key, rec]) => ({ key, ...rec }));
  }

  /* ===================== LocalStore ===================== */
  const LocalStore = {
    all() {
      try {
        const arr = JSON.parse(localStorage.getItem(S.localKey) || '[]');
        return Array.isArray(arr) ? arr : [];
      } catch (e) { return []; }
    },
    insert(record) {
      const arr = this.all();
      arr.push(record);
      // 브라우저 저장 폭주 방지: 최근 200개만
      localStorage.setItem(S.localKey, JSON.stringify(arr.slice(-200)));
      return record;
    },
    clear() { localStorage.removeItem(S.localKey); },
  };

  /* ===================== SheetStore (공용 랭킹) ===================== */
  const SheetStore = {
    get url() { return (S.sheetApiUrl || '').trim(); },
    enabled() { return !!this.url; },

    async submit(record) {
      // text/plain 으로 보내 CORS preflight 를 피함 (Apps Script 제약)
      const res = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'score', ...record }),
        redirect: 'follow',
      });
      if (!res.ok) throw new Error('등록 실패 (' + res.status + ')');
      let out = {};
      try { out = await res.json(); } catch (e) { /* 무시 */ }
      if (out && out.ok === false) throw new Error(out.error || '등록 실패');
      return out;
    },

    async fetchAll() {
      const res = await fetch(this.url, { method: 'GET', redirect: 'follow' });
      if (!res.ok) throw new Error('랭킹 불러오기 실패 (' + res.status + ')');
      const data = await res.json();
      const rows = Array.isArray(data) ? data : (data && data.rows) || [];
      return rows.map((r) => ({
        playerName: r.playerName,
        department: r.department,
        score: Number(r.score) || 0,
        correctCount: Number(r.correctCount) || 0,
        wrongCount: Number(r.wrongCount) || 0,
        accuracy: Number(r.accuracy) || 0,
        maxCombo: Number(r.maxCombo) || 0,
        averageResponseTime: Number(r.averageResponseTime) || 0,
        playedAt: Number(r.playedAt) || Date.now(),
      }));
    },
  };

  /* ===================== 공개 API ===================== */
  let _cache = { at: 0, rows: null };
  const CACHE_MS = 15000;

  async function loadRows(force) {
    if (SheetStore.enabled()) {
      if (!force && _cache.rows && Date.now() - _cache.at < CACHE_MS) return _cache.rows;
      const rows = await SheetStore.fetchAll();
      _cache = { at: Date.now(), rows };
      return rows;
    }
    return LocalStore.all();
  }

  const RankingStore = {
    playerKey,
    hasBoard() { return SheetStore.enabled(); },
    isLocal: !SheetStore.enabled(),

    /** 내 기록을 이 브라우저에 저장 (항상) */
    saveLocal(record) { return LocalStore.insert(record); },

    /** 공용 랭킹(구글시트)에 등록 — 실패 시 throw */
    async submitToBoard(record) {
      if (!SheetStore.enabled()) throw new Error('공용 랭킹이 설정되지 않았습니다.');
      const out = await SheetStore.submit(record);
      _cache = { at: 0, rows: null }; // 다음 조회 때 새로고침
      return out;
    },

    /** 개인 최고 점수 (항상 로컬 기준) */
    getBestScore(name, dept) {
      const mine = LocalStore.all().filter((r) => r.playerName === name && r.department === dept);
      if (!mine.length) return null;
      return Math.max.apply(null, mine.map((r) => r.score));
    },

    /**
     * 리더보드 (1인 1최고기록).
     * @param {'all'|'today'|'dept'} tab
     * @param {{department?:string, force?:boolean}} opts
     */
    async getLeaderboard(tab, opts) {
      opts = opts || {};
      let rows = await loadRows(opts.force);

      if (tab === 'today') rows = rows.filter((r) => isSameLocalDay(r.playedAt));
      else if (tab === 'dept') rows = rows.filter((r) => r.department === opts.department);

      const bests = bestPerPlayer(rows).sort(compareRecords);
      bests.forEach((r, i) => { r.rank = i + 1; });
      return bests;
    },

    async getPlayerRank(name, dept, tab, opts) {
      const board = await this.getLeaderboard(tab || 'all', opts);
      const key = playerKey(name, dept);
      const idx = board.findIndex((r) => r.key === key);
      return { rank: idx >= 0 ? idx + 1 : null, total: board.length, entry: idx >= 0 ? board[idx] : null };
    },

    /** 이 브라우저의 개인 기록만 삭제 (공용 시트는 건드리지 않음) */
    clearLocal() { LocalStore.clear(); _cache = { at: 0, rows: null }; },
  };

  global.RankingStore = RankingStore;
})(window);
