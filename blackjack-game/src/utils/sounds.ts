// Simple sound utility using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private createBeep(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.audioContext || !this.enabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  playCardDeal() {
    this.createBeep(800, 0.1, 0.05);
  }

  playCardFlip() {
    this.createBeep(600, 0.15, 0.03);
  }

  playWin() {
    // Play a pleasant ascending tone
    setTimeout(() => this.createBeep(523, 0.2, 0.1), 0);   // C
    setTimeout(() => this.createBeep(659, 0.2, 0.1), 100); // E
    setTimeout(() => this.createBeep(784, 0.3, 0.1), 200); // G
  }

  playLoss() {
    // Play a descending tone
    setTimeout(() => this.createBeep(400, 0.3, 0.08), 0);
    setTimeout(() => this.createBeep(350, 0.3, 0.08), 150);
  }

  playBust() {
    // Play a harsh buzzing sound
    this.createBeep(150, 0.5, 0.15);
  }

  playBlackjack() {
    // Play an exciting fanfare
    setTimeout(() => this.createBeep(523, 0.15, 0.1), 0);   // C
    setTimeout(() => this.createBeep(659, 0.15, 0.1), 100); // E
    setTimeout(() => this.createBeep(784, 0.15, 0.1), 200); // G
    setTimeout(() => this.createBeep(1047, 0.4, 0.12), 300); // C (octave)
  }

  playTick() {
    this.createBeep(1000, 0.05, 0.03);
  }

  playShuffle() {
    // Simulate shuffling sound with rapid low-frequency beeps
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.createBeep(200 + Math.random() * 100, 0.05, 0.02), i * 50);
    }
  }
}

export const soundManager = new SoundManager();

// Convenience functions
export const playCardDeal = () => soundManager.playCardDeal();
export const playCardFlip = () => soundManager.playCardFlip();
export const playWin = () => soundManager.playWin();
export const playLoss = () => soundManager.playLoss();
export const playBust = () => soundManager.playBust();
export const playBlackjack = () => soundManager.playBlackjack();
export const playTick = () => soundManager.playTick();
export const playShuffle = () => soundManager.playShuffle();
export const setSoundEnabled = (enabled: boolean) => soundManager.setEnabled(enabled);