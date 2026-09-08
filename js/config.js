/* =============================================================
 * 가치타자 — 전역 설정값 (config.js)
 * 게임 엔진과 분리된 "튜닝 파일". 숫자만 바꿔도 난이도/점수가 바뀐다.
 * ============================================================= */
(function (global) {
  'use strict';

  const CONFIG = {
    /* 게임 기본 */
    GAME_DURATION: 60,          // 초. 정확히 60초.
    CATEGORIES: ['혁신경영', '고객만족경영', '윤리경영', '인권경영', '친환경경영'],

    /* -------------------------------------------------------
     * 난이도 단계 (전체 화면에 흩어진 후보 중 정답을 찾아 타이핑)
     *  remainingMax / remainingMin : "남은 시간(초)" 구간
     *  choiceCount  : 화면에 흩뿌려지는 후보 단어 수 (정답 1개 포함)
     *  questionSec  : 한 문제를 푸는 제한시간(초). 지나면 -150 & 다음 문제
     * ------------------------------------------------------- */
    LEVELS: [
      { key: 'L1',    label: 'LEVEL 1',    remainingMax: 60, remainingMin: 45, choiceCount: 5, questionSec: 15.0 },
      { key: 'L2',    label: 'LEVEL 2',    remainingMax: 45, remainingMin: 25, choiceCount: 6, questionSec: 15.0 },
      { key: 'L3',    label: 'LEVEL 3',    remainingMax: 25, remainingMin: 10, choiceCount: 7, questionSec: 15.0 },
      { key: 'FINAL', label: 'FINAL RUSH', remainingMax: 10, remainingMin: 0,  choiceCount: 8, questionSec: 12.0 },
    ],
    FINAL_RUSH_AT: 10,          // 남은 시간이 이 값 이하이면 FINAL RUSH 연출

    /* -------------------------------------------------------
     * 점수 (계산식은 js/score.js 에서 이 값들을 사용)
     * ------------------------------------------------------- */
    SCORE: {
      correct: 500,             // 정답 기본점
      fastBonusMax: 300,        // 빠른 정답 최대 보너스
      fastBonusWithinSec: 4.0,  // 이 시간 안에 맞히면 보너스(선형 감소, 0초=만점 / 4초=0)
      wrong: -100,              // 오답 후보 단어를 완성해버림(진짜 실수)
      missedAnswer: 0,          // 제한시간 초과 = 감점 없이 그냥 다음 문제 (시간 손해가 곧 페널티)
      comboBonusPerStep: 20,    // 콤보 보너스 = combo * 20
      comboBonusCap: 400,       // 콤보 보너스 상한
      comboMessages: { 2: 'GOOD!', 5: 'GREAT!', 10: 'PERFECT!', 20: 'AWESOME!' },
    },

    /* -------------------------------------------------------
     * 등급 기준 (위에서부터 검사, 최종점수 >= min 이면 해당 등급)
     * ------------------------------------------------------- */
    GRADES: [
      { grade: 'S+', min: 9000 },
      { grade: 'S',  min: 7000 },
      { grade: 'A',  min: 5000 },
      { grade: 'B',  min: 3000 },
      { grade: 'C',  min: -Infinity },
    ],

    /* 후보 단어 흩뿌리기(스캐터) 세부 */
    SCATTER: {
      marginPct: 5,            // 영역 가장자리 여백(%)
      jitter: 0.28,            // 격자 셀 안에서 랜덤하게 흔들리는 비율(0~0.5)
      // 열 수는 단어 수 + 영역 비율로 자동 계산됨 (game.js _placeWords)
    },

    /* 입력 검증 */
    NAME: { min: 1, max: 12 },

    /* 저장소 / 랭킹
     * ─────────────────────────────────────────────────────────
     *  sheetApiUrl 을 비워두면 → 이 브라우저 안에서만 개인 랭킹 동작
     *  sheetApiUrl 에 Google Apps Script 웹앱 주소(끝이 exec 인 URL)를 넣으면
     *    → 결과 화면 "전체 랭킹 등록" 버튼이 생기고, 전체/오늘/부서별 랭킹이
     *       모든 직원 공용(구글시트)으로 표시됩니다.
     *  설정 방법: 같은 폴더 SETUP_RANKING.md 참고
     * ───────────────────────────────────────────────────────── */
    STORAGE: {
      sheetApiUrl: 'https://script.google.com/macros/s/AKfycbzE_-JIoA6eRhG6O3cLoFFEJOMiCTTIA4v7NKZ9BdzQQtUWu8anJnXxPluzPtlypkwM/exec',
      autoSubmit: true,                       // true 면 게임 끝나면 자동 등록(버튼 없이)
      localKey: 'gachitaja_records_v1',
      muteKey: 'gachitaja_muted_v1',
      seenHowToKey: 'gachitaja_howto_seen_v1',
    },
  };

  global.CONFIG = CONFIG;
})(window);
