/*
================================================================
Rock Paper Scissors - Game Logic
================================================================
Project: Rock Paper Scissors
Description: Core game mechanics (rules, scoring, AI logic).

Created by: Amey Thakur (https://github.com/Amey-Thakur) & Mega Satish (https://github.com/msatmod)
Repository: https://github.com/Amey-Thakur/ROCK-PAPER-SCISSORS
License: MIT
Date Released: 2022-03-12
================================================================
*/

class GameLogic {
    constructor() {
        this.choices = ['rock', 'paper', 'scissors'];
        this.playerHistory = { rock: 0, paper: 0, scissors: 0 };
        this.lastMove = null;

        // Survival Mode State
        this.lives = 5;
        this.maxLives = 5;
        this.isGameOver = false;

        // Load High Score
        const savedHighScore = localStorage.getItem('rps_high_score');
        this.highScore = savedHighScore ? parseInt(savedHighScore) : 0;

        this.score = { player: 0, computer: 0 };
    }

    getComputerChoice() {
        if (this.isGameOver) return null;

        // Smart AI: Counter the player's most frequent move
        const totalMoves = this.playerHistory.rock + this.playerHistory.paper + this.playerHistory.scissors;

        if (totalMoves > 3) {
            const mostLikely = Object.keys(this.playerHistory).reduce((a, b) =>
                this.playerHistory[a] > this.playerHistory[b] ? a : b
            );

            if (mostLikely === 'rock') return 'paper';
            if (mostLikely === 'paper') return 'scissors';
            if (mostLikely === 'scissors') return 'rock';
        }

        const randomIndex = Math.floor(Math.random() * this.choices.length);
        return this.choices[randomIndex];
    }

    getWinner(playerChoice, computerChoice) {
        if (this.isGameOver) return null;

        // Track Player Move for AI
        this.playerHistory[playerChoice]++;
        this.lastMove = playerChoice;

        if (playerChoice === computerChoice) {
            return 'draw';
        }

        let result;
        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            this.score.player++;
            this.checkHighScore();
            result = 'win';
        } else {
            this.lives--; // Lose a life
            if (this.lives <= 0) {
                this.lives = 0;
                this.isGameOver = true;
            }
            result = 'lose';
        }

        return result;
    }

    checkHighScore() {
        if (this.score.player > this.highScore) {
            this.highScore = this.score.player;
            localStorage.setItem('rps_high_score', this.highScore.toString());
        }
    }

    getScore() {
        return {
            ...this.score,
            lives: this.lives,
            highScore: this.highScore,
            isGameOver: this.isGameOver
        };
    }

    resetGame() {
        this.score = { player: 0, computer: 0 };
        this.lives = this.maxLives;
        this.isGameOver = false;
        this.playerHistory = { rock: 0, paper: 0, scissors: 0 };
    }
}

// Export for use in UI
window.gameLogic = new GameLogic();
