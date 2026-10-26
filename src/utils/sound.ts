// Web Audio API synthesizer for alert sounds and focus noise generators

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private currentAmbientType: string | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play pleasant checkmark chime
  playCheckmarkSound() {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Play motivational celebration chime
  playSuccessFanfare() {
    try {
      const ctx = this.initContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {
      // fallback
    }
  }

  // Play timer bell
  playTimerBell() {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
      osc.frequency.exponentialRampToValueAtTime(392.00, ctx.currentTime + 1.2); // G4

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      // fallback
    }
  }

  // Ambient sound synthesizer
  startAmbient(type: 'rain' | 'whitenoise' | 'binaural40', volume: number = 0.3) {
    this.stopAmbient();
    try {
      const ctx = this.initContext();
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(volume, ctx.currentTime);
      this.ambientGain.connect(ctx.destination);

      if (type === 'binaural40') {
        // 40Hz Gamma Focus Tone (Left: 200Hz, Right: 240Hz)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        oscL.type = 'sine';
        oscL.frequency.value = 200;
        oscR.type = 'sine';
        oscR.frequency.value = 240;

        if (pannerL && pannerR) {
          pannerL.pan.value = -0.8;
          pannerR.pan.value = 0.8;
          oscL.connect(pannerL);
          oscR.connect(pannerR);
          pannerL.connect(this.ambientGain);
          pannerR.connect(this.ambientGain);
        } else {
          oscL.connect(this.ambientGain);
          oscR.connect(this.ambientGain);
        }

        oscL.start();
        oscR.start();
        this.ambientSource = this.ambientGain; // store reference
      } else {
        // Synthesize Pink Noise / Rain buffer
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Pink noise with subtle rain filter
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
          } else {
            // White noise
            data[i] = white * 0.15;
          }
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        if (type === 'rain') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 900;
          noise.connect(filter);
          filter.connect(this.ambientGain);
        } else {
          noise.connect(this.ambientGain);
        }

        noise.start();
        this.ambientSource = noise;
      }

      this.isAmbientPlaying = true;
      this.currentAmbientType = type;
    } catch {
      // AudioContext unavailable
    }
  }

  setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        if ('stop' in this.ambientSource && typeof (this.ambientSource as AudioBufferSourceNode).stop === 'function') {
          (this.ambientSource as AudioBufferSourceNode).stop();
        }
      } catch {
        // ignore
      }
      this.ambientSource = null;
    }
    this.isAmbientPlaying = false;
    this.currentAmbientType = null;
  }

  getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  getCurrentAmbientType(): string | null {
    return this.currentAmbientType;
  }
}

export const soundManager = new SoundManager();
