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
        this.score = {
            player: 0,
            computer: 0
        };
        this.choices = ['rock', 'paper', 'scissors'];
    }

    getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * this.choices.length);
        return this.choices[randomIndex];
    }

    getWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }

        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            this.score.player++;
            return 'win';
        } else {
            this.score.computer++;
            return 'lose';
        }
    }

    getScore() {
        return this.score;
    }

    resetScore() {
        this.score = {
            player: 0,
            computer: 0
        };
    }
}

// Export for use in UI
window.gameLogic = new GameLogic();
