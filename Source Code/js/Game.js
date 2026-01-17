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

        // Load Score from LocalStorage
        const savedScore = localStorage.getItem('rps_score');
        this.score = savedScore ? JSON.parse(savedScore) : { player: 0, computer: 0 };
    }

    getComputerChoice() {
        // Smart AI: Counter the player's most frequent move
        // Only kick in after some data is collected
        const totalMoves = this.playerHistory.rock + this.playerHistory.paper + this.playerHistory.scissors;

        if (totalMoves > 3) {
            const mostLikely = Object.keys(this.playerHistory).reduce((a, b) =>
                this.playerHistory[a] > this.playerHistory[b] ? a : b
            );

            // Return the counter to the most likely move
            if (mostLikely === 'rock') return 'paper';
            if (mostLikely === 'paper') return 'scissors';
            if (mostLikely === 'scissors') return 'rock';
        }

        // Fallback to Random
        const randomIndex = Math.floor(Math.random() * this.choices.length);
        return this.choices[randomIndex];
    }

    getWinner(playerChoice, computerChoice) {
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
            result = 'win';
        } else {
            this.score.computer++;
            result = 'lose';
        }

        // Save Score
        this.saveScore();
        return result;
    }

    getScore() {
        return this.score;
    }

    saveScore() {
        localStorage.setItem('rps_score', JSON.stringify(this.score));
    }

    resetScore() {
        this.score = {
            player: 0,
            computer: 0
        };
        this.saveScore();

        // Optional: Reset AI memory on score reset? 
        // Let's keep AI memory for a challenge, or reset it too.
        // Let's reset it to be fair.
        this.playerHistory = { rock: 0, paper: 0, scissors: 0 };
    }
}

// Export for use in UI
window.gameLogic = new GameLogic();
