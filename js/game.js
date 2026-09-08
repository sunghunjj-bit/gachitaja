/* =============================================================
 * 가치타자 — 게임 엔진 (game.js)
 *
 * 책임: 60초 타이머, 문제 출제, 낙하 시스템, 난이도 상승, 정답/오답 판정,
 *       점수/콤보 집계, 결과 레코드 생성.
 * 문제 데이터(data/questions.js), 점수식(js/score.js), 타이핑(js/typing.js),
 * 연출(js/effects.js) 과 분리되어 있다.
 * ============================================================= */
(function (global) {
  'use strict';

  const C = global.CONFIG;
  const norm = global.normalizeWord;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* 전체 단어 풀(자동 후보 생성 보충용) */
  const ALL_WORDS = (function () {
    const set = new Set();
    (global.QUESTION_BANK || []).forEach((q) => set.add(q.answer));
    (global.EXTRA_DISTRACTORS || []).forEach((w) => set.add(w));
    return Array.from(set);
  })();

  /* 분야 균형 + 게임 내 중복 없음 큐 */
  function buildQueue() {
    const byCat = {};
    C.CATEGORIES.forEach((c) => (byCat[c] = []));
    (global.QUESTION_BANK || []).forEach((q) => { if (byCat[q.category]) byCat[q.category].push(q); });
    C.CATEGORIES.forEach((c) => shuffle(byCat[c]));

    const queue = [];
    let row = 0, added = true;
    while (added) {
      added = false;
      shuffle(C.CATEGORIES.slice()).forEach((c) => {
        if (byCat[c][row]) { queue.push(byCat[c][row]); added = true; }
      });
      row++;
    }
    return queue;
  }

  function levelFor(remaining) {
    for (const lv of C.LEVELS) {
      if (remaining > lv.remainingMin) return lv;
    }
    return C.LEVELS[C.LEVELS.length - 1];
  }

  function distractorPool(q) {
    const same = (global.QUESTION_BANK || [])
      .filter((x) => x.category === q.category && x !== q).map((x) => x.answer);
    const others = (global.QUESTION_BANK || [])
      .filter((x) => x.category !== q.category).map((x) => x.answer)
      .concat(global.EXTRA_DISTRACTORS || []);
    return shuffle(same).concat(shuffle(others));
  }

  // 두 단어가 한쪽이 다른 쪽을 포함하면 충돌(입력 혼동) → 같은 화면에 두지 않음
  function clashes(word, chosen) {
    const a = norm(word);
    return chosen.some((p) => {
      const b = norm(p);
      return a === b || a.indexOf(b) === 0 || b.indexOf(a) === 0;
    });
  }

  function buildChoices(q, count) {
    const picks = [q.answer];

    // 1순위: 문제에 지정된 헷갈리는 후보(choices)  2순위: 같은 분야 정답들  3순위: 전체 단어
    const curated = (q.choices && q.choices.length)
      ? shuffle(q.choices.filter((c) => norm(c) !== norm(q.answer)))
      : [];
    const source = curated
      .concat(shuffle(distractorPool(q)))
      .concat(shuffle(ALL_WORDS.slice()));

    for (const c of source) {
      if (picks.length >= count) break;
      if (clashes(c, picks)) continue;
      picks.push(c);
    }
    return shuffle(picks);
  }

  /* ===================== Game ===================== */
  const Game = {
    running: false,
    typing: null,
    els: {},
    _raf: 0,
    _wordSeq: 0,

    init() {
      const $ = (id) => document.getElementById(id);
      this.els = {
        screenGame: $('screen-game'),
        area: $('fall-area'),
        hudPlayer: $('hud-player'),
        hudTime: $('hud-time'),
        timePanel: $('time-panel'),
        timeBar: $('time-bar'),
        qTimer: $('q-timer'),
        rushCount: $('rush-count'),
        hudScore: $('hud-score'),
        hudCombo: $('hud-combo'),
        hudQ: $('hud-qnum'),
        hudLevel: $('hud-level'),
        qCat: $('q-category'),
        qText: $('q-text'),
        countdown: $('countdown-overlay'),
        centerMsg: $('center-message'),
        rushBanner: $('final-rush-banner'),
        typeEcho: $('type-echo'),
        typeInput: $('type-input'),
        btnMute: $('btn-mute'),
      };

      this.typing = new global.TypingEngine(this.els.typeInput, {
        onJudge: (word) => this._judge(word),
        onInput: (info) => this._renderEcho(info),
      });

      // 포커스 유지: 게임 영역 클릭 시 입력창으로
      this.els.screenGame.addEventListener('mousedown', (e) => {
        if (this.running && e.target.id !== 'btn-mute') {
          setTimeout(() => this.typing.focus(), 0);
        }
      });

      this.els.btnMute.addEventListener('click', () => {
        const muted = global.Effects.sound.toggleMuted();
        this.els.btnMute.textContent = muted ? '🔇' : '🔊';
        this.els.btnMute.classList.toggle('is-muted', muted);
      });
      this.els.btnMute.textContent = global.Effects.sound.muted ? '🔇' : '🔊';
    },

    /** @param {{name,department}} player @param {(record,extra)=>void} onEnd */
    start(player, onEnd) {
      this.player = player;
      this.onEnd = onEnd;

      this.state = {
        score: 0, combo: 0, maxCombo: 0,
        correctCount: 0, wrongCount: 0, missedCount: 0,
        responseTimes: [],
        qNum: 0, q: null, questionShownAt: 0,
        words: [], questionDeadline: 0, questionDuration: 0,
        levelKey: null, finalRushOn: false,
        lastSecShown: null,
        advancing: false,
      };
      this.queue = buildQueue();
      this._lastQ = null;

      this.els.hudPlayer.textContent = player.name;
      this.els.screenGame.classList.remove('final-rush');
      this.els.timePanel.classList.remove('warn', 'danger');
      this.els.timeBar.style.width = '100%';
      this.els.qTimer.style.transition = 'none';
      this.els.qTimer.style.width = '100%';
      this.els.qTimer.classList.remove('low');
      this.els.rushCount.hidden = true;
      this._setHud();
      this.els.hudLevel.textContent = C.LEVELS[0].label;
      this._clearWords();

      this.running = true;
      this.typing.enable();
      this._start = performance.now();
      this._lastFrame = this._start;

      this._nextQuestion();
      this._raf = requestAnimationFrame((t) => this._loop(t));
    },

    stop() {
      this.running = false;
      cancelAnimationFrame(this._raf);
      this.typing.disable();
      global.Effects.setFinalRush(this.els.screenGame, this.els.rushBanner, false);
      this.els.rushCount.hidden = true;
      this._clearWords();
    },

    /* ---------------- 내부 ---------------- */
    _setHud() {
      const s = this.state;
      this.els.hudScore.textContent = s.score;
      this.els.hudCombo.textContent = s.combo;
    },

    _renderEcho(info) {
      this.els.typeEcho.textContent = info.raw || '';
      this.els.typeEcho.classList.toggle('miss', !!info.raw && !info.prefixHit);

      // 입력과 앞부분이 일치하는 낙하 단어를 '현재 가사'처럼 강조
      const n = info.normalized || '';
      (this.state && this.state.words || []).forEach((w) => {
        w.el.classList.toggle('near', n.length > 0 && w.normalized.indexOf(n) === 0);
      });
    },

    _areaMetrics() {
      const h = this.els.area.clientHeight || 360;
      const w = this.els.area.clientWidth || 600;
      return { h, w };
    },

    /* 후보 단어를 화면 전체에 격자+지터로 흩뿌린다 (겹침 최소화) */
    _placeWords() {
      const s = this.state;
      const cfg = C.SCATTER;
      const n = s.words.length;
      const { w: areaW, h: areaH } = this._areaMetrics();
      const cols = Math.max(2, Math.min(n, Math.round(Math.sqrt(n * (areaW / areaH) * 0.62))));
      const rows = Math.ceil(n / cols);
      const m = cfg.marginPct;
      const cellW = (100 - 2 * m) / cols;
      const cellH = (100 - 2 * m) / rows;

      const cells = shuffle(
        Array.from({ length: cols * rows }, (_, i) => i)
      ).slice(0, n);

      s.words.forEach((w, i) => {
        const cell = cells[i];
        const cx = cell % cols;
        const cy = Math.floor(cell / cols);
        const jx = (Math.random() - 0.5) * cfg.jitter * cellW;
        const jy = (Math.random() - 0.5) * cfg.jitter * cellH;
        w.xPct = m + cellW * (cx + 0.5) + jx;
        w.yPct = m + cellH * (cy + 0.5) + jy;
        w.el.style.left = w.xPct + '%';
        w.el.style.top = w.yPct + '%';
      });
    },

    _clearWords() {
      (this.state && this.state.words || []).forEach((w) => w.el.remove());
      // 혹시 남은 노드 정리
      this.els.area.querySelectorAll('.fall-word').forEach((n) => n.remove());
      if (this.state) { this.state.words = []; }
    },

    _makeWord(text, isAnswer) {
      const w = {
        id: 'w' + (++this._wordSeq),
        text: text,
        normalized: norm(text),
        isAnswer: isAnswer,
      };
      const el = document.createElement('div');
      el.className = 'fall-word';
      el.style.animationDelay = (-Math.random() * 4).toFixed(2) + 's';
      el.textContent = text;
      w.el = el;
      this.els.area.appendChild(el);
      return w;
    },

    _syncCandidates() {
      this.typing.setCandidates(this.state.words.map((w) => ({
        id: w.id, text: w.text, normalized: w.normalized, isAnswer: w.isAnswer,
      })));
    },

    _nextQuestion() {
      const s = this.state;
      s.advancing = false;

      if (!this.queue.length) {
        this.queue = buildQueue();
        if (this._lastQ && this.queue[0] === this._lastQ && this.queue.length > 1) {
          this.queue.push(this.queue.shift());
        }
      }
      const q = this.queue.shift();
      this._lastQ = q;
      s.q = q;
      s.qNum += 1;
      s.questionShownAt = performance.now();

      this.els.qCat.textContent = '[' + q.category + ']';
      this.els.qText.textContent = q.question;
      this.els.hudQ.textContent = s.qNum;

      const remaining = this._remaining();
      const level = levelFor(remaining);
      s.levelKey = level.key;
      this.els.hudLevel.textContent = level.label;

      const picks = shuffle(buildChoices(q, level.choiceCount));

      this._clearWords();
      s.words = picks.map((text) => this._makeWord(text, norm(text) === norm(q.answer)));
      this._placeWords();
      this._syncCandidates();
      this.typing.clear();

      // 문제별 제한시간
      s.questionDuration = level.questionSec * 1000;
      s.questionDeadline = performance.now() + s.questionDuration;
      this.els.qTimer.style.transition = 'none';
      this.els.qTimer.style.width = '100%';
      void this.els.qTimer.offsetWidth;
      this.els.qTimer.style.transition = 'width ' + level.questionSec + 's linear';
      this.els.qTimer.style.width = '0%';
      this.els.qTimer.classList.remove('low');
    },

    _remaining() {
      const elapsed = (performance.now() - this._start) / 1000;
      return Math.max(0, C.GAME_DURATION - elapsed);
    },

    /* 남은 시간 표시: 큰 숫자 + 게이지 + 색상/펄스 + 마지막 10초 강조 */
    _updateTime(remaining) {
      const sec = Math.ceil(remaining);
      const els = this.els;

      els.hudTime.textContent = sec;
      els.timeBar.style.width = Math.max(0, (remaining / C.GAME_DURATION) * 100) + '%';

      const warn = remaining <= 20 && remaining > 10;
      const danger = remaining <= 10;
      els.timePanel.classList.toggle('warn', warn);
      els.timePanel.classList.toggle('danger', danger);

      // 마지막 10초: 큰 카운트 숫자
      if (danger) {
        if (els.rushCount.hidden) els.rushCount.hidden = false;
        els.rushCount.textContent = sec;
      } else if (!els.rushCount.hidden) {
        els.rushCount.hidden = true;
      }

      // 매 1초 변화: 숫자 튀기기 + 초읽기 사운드(마지막 10초)
      if (sec !== this.state.lastSecShown) {
        this.state.lastSecShown = sec;
        els.hudTime.classList.remove('tick');
        void els.hudTime.offsetWidth;
        els.hudTime.classList.add('tick');
        if (danger && sec > 0) {
          global.Effects.sound.play('tick');
          els.rushCount.classList.remove('beat');
          void els.rushCount.offsetWidth;
          els.rushCount.classList.add('beat');
        }
      }
    },

    _onLevelChange(level) {
      const s = this.state;
      s.levelKey = level.key;
      this.els.hudLevel.textContent = level.label;

      // 레벨이 오르면 다음 문제부터 후보 수 증가·제한시간 단축이 적용됨
      // (현재 진행 중인 문제는 그대로 두어 혼란 방지)
    },

    _loop(now) {
      if (!this.running) return;

      let dt = (now - this._lastFrame) / 1000;
      this._lastFrame = now;
      if (dt > 0.05) dt = 0.05;          // 탭 전환 등으로 튀는 것 방지

      const remaining = this._remaining();
      this._updateTime(remaining);

      const level = levelFor(remaining);
      if (level.key !== this.state.levelKey) this._onLevelChange(level);

      if (remaining <= C.FINAL_RUSH_AT && !this.state.finalRushOn) {
        this.state.finalRushOn = true;
        global.Effects.setFinalRush(this.els.screenGame, this.els.rushBanner, true);
      }

      // 후보는 화면에 고정. 문제별 제한시간이 지나면 놓침 처리.
      const s = this.state;
      const qLeft = s.questionDeadline - now;
      if (!s.advancing && qLeft <= 1500) this.els.qTimer.classList.add('low');
      if (!s.advancing && qLeft <= 0) {
        this._handleMissed();
        return this._continue();
      }

      if (remaining <= 0) {
        this._endGame();
        return;
      }
      this._raf = requestAnimationFrame((t) => this._loop(t));
    },

    _continue() {
      if (this.running) this._raf = requestAnimationFrame((t) => this._loop(t));
    },

    _wordCenter(w) {
      const r = w.el.getBoundingClientRect();
      const a = this.els.area.getBoundingClientRect();
      return { x: r.left + r.width / 2 - a.left, y: r.top + r.height / 2 - a.top };
    },

    _judge(word) {
      if (!this.running || this.state.advancing) return;
      // word: 타이핑 엔진이 넘긴 후보 { id, text, isAnswer, ... }
      if (word.isAnswer) this._handleCorrect(word);
      else this._handleWrong(word);
    },

    _handleCorrect(word) {
      const s = this.state;
      s.advancing = true;

      const w = s.words.find((x) => x.id === word.id) || s.words.find((x) => x.isAnswer);
      const rt = (performance.now() - s.questionShownAt) / 1000;

      s.combo += 1;
      s.maxCombo = Math.max(s.maxCombo, s.combo);
      s.correctCount += 1;
      s.responseTimes.push(rt);

      const sc = global.Score.answer(rt, s.combo);
      s.score += sc.total;

      if (w) {
        const c = this._wordCenter(w);
        global.Effects.explode(this.els.area, c.x, c.y);
        global.Effects.scorePopup(this.els.area, c.x, c.y, sc.total);
      }
      global.Effects.sound.play('correct');

      const msg = global.Score.comboMessage(s.combo);
      if (msg) {
        global.Effects.centerMessage(this.els.centerMsg, msg, 'combo-msg');
        global.Effects.sound.play('combo');
      } else if (s.combo >= 2) {
        global.Effects.centerMessage(this.els.centerMsg, s.combo + ' COMBO', 'combo-small');
      }

      this.els.hudCombo.classList.add('pulse');
      setTimeout(() => this.els.hudCombo.classList.remove('pulse'), 200);

      this._setHud();
      this._nextQuestion();
    },

    _handleWrong(word) {
      const s = this.state;
      s.score += global.Score.wrong();
      s.wrongCount += 1;
      s.combo = 0;

      global.Effects.sound.play('wrong');
      global.Effects.shake(this.els.area);
      this.els.area.classList.add('flash-bad');
      setTimeout(() => this.els.area.classList.remove('flash-bad'), 260);
      global.Effects.scorePopup(this.els.area, this._areaMetrics().w / 2, this._areaMetrics().h - 40, global.Score.wrong());
      global.Effects.centerMessage(this.els.centerMsg, 'MISS', 'miss-msg');

      this._setHud();
      this.typing.clear();
    },

    _handleMissed() {
      const s = this.state;
      if (s.advancing) return;
      s.advancing = true;
      s.score += global.Score.missed();
      s.wrongCount += 1;
      s.missedCount += 1;
      s.combo = 0;

      global.Effects.sound.play('missed');
      global.Effects.shake(this.els.area);
      global.Effects.centerMessage(this.els.centerMsg, 'MISSED!', 'miss-msg');
      global.Effects.scorePopup(this.els.area, this._areaMetrics().w / 2, this._areaMetrics().h - 40, global.Score.missed());

      this._setHud();
      this._nextQuestion();
    },

    _endGame() {
      this.running = false;
      cancelAnimationFrame(this._raf);
      this.typing.disable();
      global.Effects.setFinalRush(this.els.screenGame, this.els.rushBanner, false);
      this.els.rushCount.hidden = true;
      this.els.timeBar.style.width = '0%';
      this._clearWords();
      global.Effects.sound.play('gameover');

      const s = this.state;
      const answered = s.correctCount + s.wrongCount;
      const accuracy = answered > 0 ? s.correctCount / answered : 0;
      const avg = s.responseTimes.length
        ? s.responseTimes.reduce((a, b) => a + b, 0) / s.responseTimes.length : 0;

      const record = {
        playerName: this.player.name,
        department: this.player.department,
        score: s.score,
        correctCount: s.correctCount,
        wrongCount: s.wrongCount,
        accuracy: Math.round(accuracy * 1000) / 1000,
        maxCombo: s.maxCombo,
        averageResponseTime: Math.round(avg * 100) / 100,
        playedAt: Date.now(),
      };

      this.onEnd(record, { missedCount: s.missedCount, questionCount: s.qNum });
    },
  };

  global.Game = Game;
})(window);
