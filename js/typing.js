/* =============================================================
 * 가치타자 — 한글 타이핑 엔진 (typing.js)
 *
 * 책임:
 *  - <input> 의 IME(한글 조합) 상태를 정확히 추적한다.
 *  - 입력이 바뀔 때마다 현재 후보 단어들과 비교한다.
 *  - "완성된 입력값"이 후보와 정확히 일치하면 Enter 없이 즉시 판정한다.
 *  - IME 조합 중간 상태에서는 오답 판정을 하지 않는다.
 *
 * 판정은 이 파일이 직접 하지 않고 콜백(onJudge)으로 game.js 에 넘긴다.
 * ============================================================= */
(function (global) {
  'use strict';

  /**
   * 단어 정규화: 대소문자 통일 + 가운뎃점/띄어쓰기/구분기호 제거.
   *  "신고·회피" → "신고회피",  "RE 100" → "re100"
   * 이렇게 하면 키보드로 치기 어려운 '·' 를 입력하지 않아도 정답 인정.
   */
  function normalize(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .replace(/[\s·∙・‧⋅.,/\\\-_()~+'"`]/g, '')
      .trim();
  }

  class TypingEngine {
    /**
     * @param {HTMLInputElement} inputEl
     * @param {object} handlers
     * @param {(word:object)=>void} handlers.onJudge   후보 단어와 완전일치 시 호출
     * @param {(info:object)=>void} handlers.onInput   입력값이 바뀔 때마다(표시 갱신용)
     */
    constructor(inputEl, handlers) {
      this.el = inputEl;
      this.onJudge = handlers.onJudge || function () {};
      this.onInput = handlers.onInput || function () {};
      this.candidates = [];       // [{id, text, normalized, isAnswer, ...}]
      this.isComposing = false;
      this.enabled = false;
      this._muteResidual = false;  // 판정 직후 IME 가 뱉는 잔여 이벤트 무시용
      this._muteTimer = 0;

      this._onCompStart = () => { this.isComposing = true; };
      this._onCompEnd = () => {
        this.isComposing = false;
        // 조합이 끝난 시점의 최종값으로 한 번 더 검사 (오답 판정도 이때 허용)
        this._evaluate(true);
      };
      this._onInputEvt = () => { this._evaluate(false); };
      this._onKeyDown = (e) => {
        // 실제 키 입력이 들어오면 = 사용자가 다시 치는 중 → 잔여 무시 해제
        this._muteResidual = false;
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!this.isComposing) this._evaluate(true);
        }
      };

      this.el.addEventListener('compositionstart', this._onCompStart);
      this.el.addEventListener('compositionend', this._onCompEnd);
      this.el.addEventListener('input', this._onInputEvt);
      this.el.addEventListener('keydown', this._onKeyDown);
    }

    setCandidates(list) {
      this.candidates = list.map((c) => ({
        ...c,
        normalized: c.normalized || normalize(c.text),
      }));
    }

    enable() {
      this.enabled = true;
      this.clear();
      this.focus();
    }

    disable() {
      this.enabled = false;
      this.clear();
    }

    clear() {
      this.el.value = '';
      this.isComposing = false;
      this._armMute();
      this.onInput({ raw: '', normalized: '', prefixHit: false });
    }

    _armMute() {
      this._muteResidual = true;
      clearTimeout(this._muteTimer);
      this._muteTimer = setTimeout(() => { this._muteResidual = false; }, 300);
    }

    focus() {
      // 게임 화면에서만. 모바일 키보드 호출 위해 실제 focus 사용.
      try { this.el.focus({ preventScroll: true }); } catch (e) { this.el.focus(); }
    }

    /**
     * @param {boolean} allowWrong  오답(잘못된 후보 완성) 판정을 허용할지.
     *   input 이벤트 중(조합 가능성) 에는 false, compositionend/Enter 에는 true.
     */
    _evaluate(allowWrong) {
      if (!this.enabled) return;

      // 판정 직후 IME 가 이전 글자를 되뱉는 잔여 이벤트 → 입력창 비우고 무시
      if (this._muteResidual) {
        if (this.el.value) this.el.value = '';
        this.isComposing = false;
        this.onInput({ raw: '', normalized: '', prefixHit: false });
        return;
      }

      const raw = this.el.value;
      const norm = normalize(raw);

      // 표시 갱신용 정보
      const prefixHit = norm.length > 0 && this.candidates.some((c) => c.normalized.startsWith(norm));
      this.onInput({ raw, normalized: norm, prefixHit });

      if (norm.length === 0) return;

      const exact = this.candidates.find((c) => c.normalized === norm);

      if (exact) {
        // 정답 단어면 조합 중이어도 즉시 인정.
        // 오답 단어면 조합이 끝난 뒤(allowWrong)에만 판정.
        if (exact.isAnswer || allowWrong) {
          this._resetInputHard();
          this.onJudge(exact);
        }
        return;
      }

      // 어떤 후보와도 접두어가 맞지 않는 "쓸모없는" 입력은 조용히 비움(감점 아님).
      if (allowWrong && !this.isComposing && !prefixHit && norm.length >= 2) {
        this._resetInputHard();
        this.onInput({ raw: '', normalized: '', prefixHit: false });
      }
    }

    _resetInputHard() {
      const wasComposing = this.isComposing;
      this.el.value = '';
      this.isComposing = false;
      this._armMute();
      // 조합 중이었을 때만 blur/focus 로 IME 세션을 확실히 끊는다
      if (this.enabled && wasComposing) {
        this.el.blur();
        this.focus();
      }
    }

    destroy() {
      this.el.removeEventListener('compositionstart', this._onCompStart);
      this.el.removeEventListener('compositionend', this._onCompEnd);
      this.el.removeEventListener('input', this._onInputEvt);
      this.el.removeEventListener('keydown', this._onKeyDown);
    }
  }

  global.normalizeWord = normalize;
  global.TypingEngine = TypingEngine;
})(window);
