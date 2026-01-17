/*
================================================================
Rock Paper Scissors - Audio System
================================================================
Project: Rock Paper Scissors
Description: Procedural audio generation using Web Audio API.
             No external assets required.

Created by: Amey Thakur (https://github.com/Amey-Thakur) & Mega Satish (https://github.com/msatmod)
Repository: https://github.com/Amey-Thakur/ROCK-PAPER-SCISSORS
License: MIT
Date Released: 2022-03-12
================================================================
*/

class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    // Helper to create simple beep/boop sounds
    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;

        // Resume context if suspended (browser policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playClick() {
        this.playTone(800, 'sine', 0.1, 0.05);
    }

    playWin() {
        // Victory fanfare (arpeggio)
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'square', 0.2, 0.1), i * 100);
        });
    }

    playLose() {
        // Sad melody
        const now = this.ctx.currentTime;
        [392.00, 369.99, 349.23, 311.13].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.1), i * 150);
        });
    }

    playDraw() {
        this.playTone(300, 'sawtooth', 0.2, 0.05);
        setTimeout(() => this.playTone(300, 'sawtooth', 0.2, 0.05), 150);
    }
}

window.soundManager = new SoundManager();
