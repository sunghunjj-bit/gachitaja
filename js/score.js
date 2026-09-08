/* =============================================================
 * 가치타자 — 점수 계산 (score.js)
 * 모든 점수 규칙을 한곳에 모아 향후 쉽게 수정할 수 있도록 분리.
 * CONFIG.SCORE / CONFIG.GRADES 값을 사용한다.
 * ============================================================= */
(function (global) {
  'use strict';

  const S = () => global.CONFIG.SCORE;

  const Score = {
    /**
     * 정답 획득 점수.
     * @param {number} responseSec  문제 표시 후 정답까지 걸린 시간(초)
     * @param {number} combo        이번 정답을 포함한 연속 정답 수
     * @returns {{total:number, base:number, fast:number, comboBonus:number}}
     */
    answer(responseSec, combo) {
      const c = S();
      const base = c.correct;

      const t = Math.max(0, Math.min(responseSec, c.fastBonusWithinSec));
      const fast = Math.round(c.fastBonusMax * (1 - t / c.fastBonusWithinSec));

      const comboBonus = Math.min(Math.max(combo - 1, 0) * c.comboBonusPerStep, c.comboBonusCap);

      return { total: base + fast + comboBonus, base: base, fast: fast, comboBonus: comboBonus };
    },

    /** 오답 후보 단어를 완성했을 때 */
    wrong() { return S().wrong; },

    /** 정답 단어를 놓쳤을 때(바닥까지 떨어짐) */
    missed() { return S().missedAnswer; },

    /** 콤보 도달 메시지 (없으면 null) */
    comboMessage(combo) { return S().comboMessages[combo] || null; },

    /** 최종 점수 → 등급 */
    grade(finalScore) {
      const list = global.CONFIG.GRADES;
      for (let i = 0; i < list.length; i++) {
        if (finalScore >= list[i].min) return list[i].grade;
      }
      return list[list.length - 1].grade;
    },
  };

  global.Score = Score;
})(window);
