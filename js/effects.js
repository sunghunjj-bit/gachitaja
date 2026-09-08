/* =============================================================
 * 가치타자 — 아케이드 연출 & 사운드 (effects.js)
 *
 * - 픽셀 폭발, 점수 팝업, 콤보/센터 메시지, FINAL RUSH, TIME UP, NEW RECORD
 * - 사운드: Web Audio 로 간단한 8bit 효과음 합성 (외부 파일 불필요)
 *   assets/sounds/ 에 파일을 넣고 Sound.useFiles(map) 로 교체 가능.
 *
 * 성능: 파티클 수를 제한하고 setTimeout 으로 정리. transform 만 애니메이션.
 * ============================================================= */
(function (global) {
  'use strict';

  /* ---------------- Sound ---------------- */
  const Sound = {
    ctx: null,
    muted: false,
    _buffers: {},   // name -> AudioBuffer (파일 사용 시)

    init() {
      this.muted = localStorage.getItem(global.CONFIG.STORAGE.muteKey) === '1';
    },
    _ensureCtx() {
      if (!this.ctx) {
        const AC = global.AudioContext || global.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    unlock() { this._ensureCtx(); },

    setMuted(v) {
      this.muted = !!v;
      localStorage.setItem(global.CONFIG.STORAGE.muteKey, this.muted ? '1' : '0');
    },
    toggleMuted() { this.setMuted(!this.muted); return this.muted; },

    // 파일 기반으로 바꾸고 싶을 때: Sound.useFiles({correct:'assets/sounds/correct.wav', ...})
    async useFiles(map) {
      const ctx = this._ensureCtx();
      if (!ctx) return;
      await Promise.all(Object.entries(map).map(async ([name, url]) => {
        try {
          const res = await fetch(url);
          const buf = await res.arrayBuffer();
          this._buffers[name] = await ctx.decodeAudioData(buf);
        } catch (e) { /* 파일 없으면 합성음 사용 */ }
      }));
    },

    _tone(freq, dur, type, gain, when) {
      const ctx = this._ensureCtx();
      if (!ctx) return;
      const t0 = (when || ctx.currentTime);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain || 0.15, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    },

    play(name) {
      if (this.muted) return;
      const ctx = this._ensureCtx();
      if (!ctx) return;

      if (this._buffers[name]) {
        const src = ctx.createBufferSource();
        src.buffer = this._buffers[name];
        src.connect(ctx.destination);
        src.start();
        return;
      }

      const now = ctx.currentTime;
      switch (name) {
        case 'correct':
          this._tone(660, 0.09, 'square', 0.16, now);
          this._tone(990, 0.12, 'square', 0.16, now + 0.08);
          break;
        case 'wrong':
          this._tone(200, 0.18, 'sawtooth', 0.18, now);
          this._tone(140, 0.22, 'sawtooth', 0.16, now + 0.1);
          break;
        case 'missed':
          this._tone(160, 0.3, 'triangle', 0.16, now);
          break;
        case 'combo':
          this._tone(880, 0.07, 'square', 0.14, now);
          this._tone(1320, 0.09, 'square', 0.14, now + 0.06);
          break;
        case 'count':
          this._tone(523, 0.12, 'square', 0.14, now);
          break;
        case 'go':
          this._tone(784, 0.16, 'square', 0.18, now);
          this._tone(1046, 0.2, 'square', 0.18, now + 0.12);
          break;
        case 'gameover':
          this._tone(392, 0.2, 'square', 0.16, now);
          this._tone(294, 0.24, 'square', 0.16, now + 0.18);
          this._tone(196, 0.4, 'square', 0.16, now + 0.4);
          break;
        case 'record':
          [523, 659, 784, 1046].forEach((f, i) => this._tone(f, 0.12, 'square', 0.15, now + i * 0.1));
          break;
        case 'tick':
          this._tone(1200, 0.04, 'square', 0.1, now);
          break;
        default:
          break;
      }
    },
  };

  /* ---------------- 비주얼 ---------------- */
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  const Effects = {
    sound: Sound,

    /** 픽셀 폭발. container 기준 (x,y) 픽셀 좌표 */
    explode(container, x, y, color) {
      const N = 12;
      for (let i = 0; i < N; i++) {
        const p = el('div', 'particle');
        const ang = (Math.PI * 2 * i) / N + Math.random() * 0.4;
        const dist = 26 + Math.random() * 42;
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        if (color) p.style.background = color;
        p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
        p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
        container.appendChild(p);
        setTimeout(() => p.remove(), 620);
      }
    },

    /** 점수 팝업 "+800" / "-100" */
    scorePopup(container, x, y, value) {
      const pos = value >= 0;
      const s = el('div', 'score-pop ' + (pos ? 'pos' : 'neg'), (pos ? '+' : '') + value);
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      container.appendChild(s);
      setTimeout(() => s.remove(), 900);
    },

    /** 화면 중앙 짧은 메시지 (GOOD! / PERFECT! 등) */
    centerMessage(overlayEl, text, extraCls) {
      overlayEl.hidden = false;
      overlayEl.className = 'overlay-center center-msg ' + (extraCls || '');
      overlayEl.textContent = text;
      // 재트리거를 위해 애니메이션 리셋
      overlayEl.style.animation = 'none';
      void overlayEl.offsetWidth;
      overlayEl.style.animation = '';
      clearTimeout(overlayEl._t);
      overlayEl._t = setTimeout(() => { overlayEl.hidden = true; }, 850);
    },

    comboFlash(overlayEl, combo, message) {
      this.centerMessage(overlayEl, message || (combo + ' COMBO'), 'combo-msg');
    },

    countdown(overlayEl, onStep, onDone) {
      const seq = ['3', '2', '1', 'START!'];
      let i = 0;
      overlayEl.hidden = false;
      const tick = () => {
        if (i >= seq.length) {
          overlayEl.hidden = true;
          onDone && onDone();
          return;
        }
        overlayEl.className = 'overlay-center countdown-num' + (seq[i] === 'START!' ? ' is-go' : '');
        overlayEl.textContent = seq[i];
        overlayEl.style.animation = 'none';
        void overlayEl.offsetWidth;
        overlayEl.style.animation = '';
        onStep && onStep(seq[i]);
        i++;
        setTimeout(tick, seq[i - 1] === 'START!' ? 600 : 800);
      };
      tick();
    },

    setFinalRush(gameScreenEl, bannerEl, on) {
      gameScreenEl.classList.toggle('final-rush', on);
      if (bannerEl) {
        if (on) {
          bannerEl.hidden = false;
          setTimeout(() => { if (bannerEl) bannerEl.hidden = true; }, 1400);
        }
      }
    },

    shake(node) {
      node.classList.remove('shake');
      void node.offsetWidth;
      node.classList.add('shake');
      setTimeout(() => node.classList.remove('shake'), 380);
    },
  };

  global.Effects = Effects;
})(window);
