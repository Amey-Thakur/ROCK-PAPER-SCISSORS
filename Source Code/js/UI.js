/*
================================================================
Rock Paper Scissors - UI Controller
================================================================
Project: Rock Paper Scissors
Description: DOM manipulation and UI animations.

Created by: Amey Thakur (https://github.com/Amey-Thakur) & Mega Satish (https://github.com/msatmod)
Repository: https://github.com/Amey-Thakur/ROCK-PAPER-SCISSORS
License: MIT
Date Released: 2022-03-12
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    const choices = document.querySelectorAll('.btn-choice');
    const playerHand = document.getElementById('player-hand');
    const computerHand = document.getElementById('computer-hand');
    const statusMsg = document.getElementById('status-msg');
    const playerScoreElem = document.getElementById('player-score');
    const computerScoreElem = document.getElementById('computer-score');

    const icons = {
        rock: '✊🏻',
        paper: '✋🏻',
        scissors: '✌🏻'
    };

    let isIterating = false;

    // Initialize
    updateScoreBoard();

    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            const playerChoice = choice.dataset.choice;
            if (!isIterating) {
                playRound(playerChoice);
            }
        });
    });

    function playRound(playerChoice) {
        isIterating = true;

        // Reset hands to rock before animation
        playerHand.textContent = icons['rock'];
        computerHand.textContent = icons['rock'];

        // Add shake animation
        playerHand.classList.add('shake');
        computerHand.classList.add('shake');

        statusMsg.textContent = "Wait...";
        statusMsg.style.color = "var(--text-secondary)";

        // Wait for animation
        setTimeout(() => {
            const computerChoice = window.gameLogic.getComputerChoice();
            const result = window.gameLogic.getWinner(playerChoice, computerChoice);

            // Remove shake and update icons
            playerHand.classList.remove('shake');
            computerHand.classList.remove('shake');

            playerHand.textContent = icons[playerChoice];
            computerHand.textContent = icons[computerChoice];

            // Add pop animation
            playerHand.classList.add('pop');
            computerHand.classList.add('pop');

            setTimeout(() => {
                playerHand.classList.remove('pop');
                computerHand.classList.remove('pop');
            }, 500);

            // Update UI
            updateStatus(result, playerChoice, computerChoice);
            updateScoreBoard();

            isIterating = false;
        }, 1500); // 1.5s animation duration
    }

    function updateStatus(result, pChoice, cChoice) {
        let msg = "";
        let color = "";

        if (result === 'win') {
            msg = "You Win!";
            color = "var(--color-win)";
        } else if (result === 'lose') {
            msg = "You Lose!";
            color = "var(--color-lose)";
        } else {
            msg = "It's a Draw!";
            color = "var(--color-draw)";
        }

        statusMsg.textContent = msg;
        statusMsg.style.color = color;
    }

    function updateScoreBoard() {
        const score = window.gameLogic.getScore();
        playerScoreElem.textContent = score.player;
        computerScoreElem.textContent = score.computer;

        // Simple animation for score update
        playerScoreElem.classList.add('pop');
        computerScoreElem.classList.add('pop');
        setTimeout(() => {
            playerScoreElem.classList.remove('pop');
            computerScoreElem.classList.remove('pop');
        }, 300);
    }
});
