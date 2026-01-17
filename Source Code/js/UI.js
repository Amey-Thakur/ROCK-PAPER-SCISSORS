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

    // New Elements
    const scoreElem = document.getElementById('current-score');
    const highScoreElem = document.getElementById('high-score');
    const livesContainer = document.getElementById('lives-container');
    const modal = document.getElementById('game-over-modal');
    const finalScoreElem = document.getElementById('final-score');
    const restartBtn = document.getElementById('btn-restart');

    const icons = {
        rock: '✊🏻',
        paper: '✋🏻',
        scissors: '✌🏻'
    };

    let isIterating = false;

    // Initialize
    updateUI();

    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            const playerChoice = choice.dataset.choice;
            if (!isIterating) {
                window.soundManager.playClick();
                playRound(playerChoice);
            }
        });
    });

    restartBtn.addEventListener('click', () => {
        window.soundManager.playClick();
        window.gameLogic.resetGame();
        modal.classList.remove('active');
        updateUI();
        statusMsg.textContent = "Choose your weapon!";
        statusMsg.style.color = "var(--text-primary)";
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
            updateUI();

            // Play Sounds & Effects
            if (result === 'win') {
                window.soundManager.playWin();
                spawnParticles(scoreElem);
            } else if (result === 'lose') {
                window.soundManager.playLose();
            } else {
                window.soundManager.playDraw();
            }

            // Check Game Over
            if (window.gameLogic.getStats().gameOver) {
                setTimeout(showGameOver, 1000);
            }

            isIterating = false;
        }, 1500); // 1.5s animation duration
    }

    function spawnParticles(target) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity + 'px';
            const ty = Math.sin(angle) * velocity + 'px';

            particle.style.setProperty('--tx', tx);
            particle.style.setProperty('--ty', ty);
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }
    }

    function updateStatus(result, pChoice, cChoice) {
        let msg = "";
        let color = "";

        if (result === 'win') {
            msg = "You Win!";
            color = "var(--color-win)";
        } else if (result === 'lose') {
            msg = "You Lose! (-1 Heart)";
            color = "var(--color-lose)";
        } else {
            msg = "It's a Draw!";
            color = "var(--color-draw)";
        }

        statusMsg.textContent = msg;
        statusMsg.style.color = color;
    }

    function updateUI() {
        const stats = window.gameLogic.getStats();

        scoreElem.textContent = stats.score;
        highScoreElem.textContent = stats.highScore;

        // Update Lives
        let hearts = "";
        for (let i = 0; i < stats.lives; i++) hearts += "❤️";
        for (let i = stats.lives; i < 3; i++) hearts += "🖤"; // Broken/Empty heart
        livesContainer.textContent = hearts;
    }

    function showGameOver() {
        const stats = window.gameLogic.getStats();
        finalScoreElem.textContent = stats.score;
        modal.classList.remove('hidden');
        modal.classList.add('active');
    }
});
