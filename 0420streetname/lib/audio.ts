// Web Audio API sound generator for local-first zero-asset kitchen chimes

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined' || this.isMuted) return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Tactile mechanical micro-click for items, modifiers, seats
  playTap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Ignore
    }
  }

  // Authentic thermal chit printer head buzz and zip
  playThermalPrint() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 4 rapid stepper motor pulses
      for (let i = 0; i < 4; i++) {
        const pulseTime = now + i * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(480 + (i % 2) * 60, pulseTime);

        gain.gain.setValueAtTime(0.06, pulseTime);
        gain.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(pulseTime);
        osc.stop(pulseTime + 0.04);
      }

      // Final paper tear noise
      const tearTime = now + 0.32;
      const oscTear = ctx.createOscillator();
      const gainTear = ctx.createGain();
      oscTear.type = 'sawtooth';
      oscTear.frequency.setValueAtTime(2200, tearTime);
      oscTear.frequency.exponentialRampToValueAtTime(600, tearTime + 0.06);

      gainTear.gain.setValueAtTime(0.07, tearTime);
      gainTear.gain.exponentialRampToValueAtTime(0.001, tearTime + 0.06);

      oscTear.connect(gainTear);
      gainTear.connect(ctx.destination);

      oscTear.start(tearTime);
      oscTear.stop(tearTime + 0.06);
    } catch {
      // Ignore
    }
  }

  // Bell ding when an order or course is FIRED to kitchen
  playKitchenFire() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Dual resonant bell
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, now); // E6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.9);
      osc2.stop(now + 0.9);
    } catch {
      // AudioContext blocked until first user interaction
    }
  }

  // Affirmative bump click for kitchen line cooks
  playItemBump() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.07); // E5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // Urgent two-tone for 20m+ overdue tickets
  playRushAlert() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.15);
      osc.frequency.setValueAtTime(440, now + 0.3);
      osc.frequency.setValueAtTime(880, now + 0.45);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Ignore
    }
  }

  // Soft cash register / payment settled chime
  playPaymentSettled() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();
