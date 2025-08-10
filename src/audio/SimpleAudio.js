class SimpleAudio {
  static init() {
    if (this.ctx) return this.ctx;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.15; // overall volume
    this.masterGain.connect(this.ctx.destination);
    this.musicNodes = [];
    return this.ctx;
  }

  static async ensureRunning() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state !== 'running') {
      try { await this.ctx.resume(); } catch (_) {}
    }
  }

  static playTone({ freq = 440, dur = 0.15, type = 'square', vol = 0.4 }) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  static playCoin() {
    this.playTone({ freq: 880, dur: 0.12, type: 'sine', vol: 0.5 });
    setTimeout(() => this.playTone({ freq: 1320, dur: 0.08, type: 'sine', vol: 0.4 }), 70);
  }

  static playJump() {
    this.playTone({ freq: 440, dur: 0.08, type: 'square', vol: 0.35 });
    setTimeout(() => this.playTone({ freq: 660, dur: 0.07, type: 'square', vol: 0.3 }), 60);
  }

  static playHit() {
    this.playTone({ freq: 220, dur: 0.18, type: 'sawtooth', vol: 0.45 });
  }

  static startMusic() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    this.stopMusic();
    const tempo = 110; // bpm
    const beat = 60 / tempo;
    const t0 = this.ctx.currentTime + 0.05;
    const pattern = [
      { n: 392, l: 1 }, { n: 523, l: 1 }, { n: 659, l: 2 },
      { n: 523, l: 1 }, { n: 392, l: 1 }, { n: 330, l: 2 },
    ];
    const loopDur = pattern.reduce((a, b) => a + b.l, 0) * beat;
    const scheduleLoop = (offsetBase) => {
      let t = t0 + offsetBase;
      pattern.forEach(({ n, l }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + l * beat - 0.01);
        osc.connect(gain).connect(this.masterGain);
        osc.start(t);
        osc.stop(t + l * beat);
        this.musicNodes.push(osc, gain);
        t += l * beat;
      });
    };
    // Schedule immediate and repeating via intervals
    scheduleLoop(0);
    this.musicTimer = setInterval(() => scheduleLoop(loopDur), loopDur * 1000);
  }

  static stopMusic() {
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
    if (this.musicNodes) {
      this.musicNodes.forEach((n) => { try { n.disconnect(); } catch (_) {} });
      this.musicNodes = [];
    }
  }

  static playWinJingle() {
    // simple 4-note
    this.playTone({ freq: 523, dur: 0.12, type: 'sine', vol: 0.5 });
    setTimeout(() => this.playTone({ freq: 659, dur: 0.12, type: 'sine', vol: 0.5 }), 120);
    setTimeout(() => this.playTone({ freq: 784, dur: 0.2, type: 'sine', vol: 0.55 }), 240);
    setTimeout(() => this.playTone({ freq: 1046, dur: 0.25, type: 'sine', vol: 0.6 }), 460);
  }
}

window.SimpleAudio = SimpleAudio;


