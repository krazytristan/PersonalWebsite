// Web Audio API pure synthesized tactile sound effects
class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = false; // default to false so no auto-play audio annoyance
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.playBlip(600, 0.04);
    }
    return this.enabled;
  }

  playBlip(freq = 440, duration = 0.03, type = "sine") {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio error safety
    }
  }

  playClick() {
    this.playBlip(780, 0.025, "triangle");
  }

  playPop() {
    this.playBlip(320, 0.05, "sine");
  }

  playSuccess() {
    if (!this.enabled) return;
    this.playBlip(523.25, 0.06); // C5
    setTimeout(() => this.playBlip(659.25, 0.08), 50); // E5
  }
}

export const sounds = new SoundController();
