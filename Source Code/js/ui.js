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

// Loading Screen Logic (Simulated Progress with Failsafe)
window.addEventListener('load', () => {
    startLoading();
});

// Fallback: If window.load doesn't fire within 3 seconds of DOMContentLoaded, force start
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!window.loadingStarted) startLoading();
    }, 3000);
});

function startLoading() {
    if (window.loadingStarted) return;
    window.loadingStarted = true;

    const loadingBar = document.getElementById('loading-bar');
    const loadingScreen = document.getElementById('loading-screen');
    let progress = 0;

    // Simulate loading progress - Matching THE-MATH-GAME timing
    const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 300); // 300ms pause at 100%
        }

        if (loadingBar) loadingBar.style.width = progress + '%';
    }, 200);

    // Absolute Failsafe: Remove screen after 4 seconds max
    setTimeout(() => {
        clearInterval(interval);
        loadingScreen.classList.add('hidden');
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const choices = document.querySelectorAll('.btn-choice');
    const playerHand = document.getElementById('player-hand');
    const computerHand = document.getElementById('computer-hand');
    const statusMsg = document.getElementById('status-msg');
    const playerScoreElem = document.getElementById('player-score');

    // Survival Mode Elements
    const livesContainer = document.getElementById('lives-container');
    const highScoreElem = document.getElementById('high-score');
    const gameOverModal = document.getElementById('game-over-modal');
    const finalScoreElem = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');
    const shareBtn = document.getElementById('share-btn');
    const shareCard = document.getElementById('share-card');
    const shareScoreVal = document.getElementById('share-score-val');
    const shareHighScore = document.getElementById('share-high-score');

    const icons = {
        rock: '✊🏻',
        paper: '✋🏻',
        scissors: '✌🏻'
    };

    let isIterating = false;

    // Initialize Game UI
    initUI();

    // Event Listeners
    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            const playerChoice = choice.dataset.choice;
            const state = window.gameLogic.getScore();

            if (!isIterating && !state.isGameOver) {
                window.soundManager.playClick();
                playRound(playerChoice);
            }
        });
    });

    restartBtn.addEventListener('click', () => {
        window.soundManager.playClick();
        window.gameLogic.resetGame();
        initUI();
        gameOverModal.classList.add('hidden');
        statusMsg.textContent = "Choose your weapon!";
        statusMsg.style.color = "var(--text-primary)";
    });

    shareBtn.addEventListener('click', () => {
        window.soundManager.playClick();
        shareScore();
    });

    // Mute Button Logic
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => {
        const isMuted = window.soundManager.toggleMute();
        muteBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        window.soundManager.playClick(); // Will only play if not muted (logic in sound.js handles this check? actually playClick calls playTone which checks muted. So if muted, no sound.)
        // Actually, if we just muted, we might want one last "click" or silence? 
        // Logic: if isMuted is true, playTone returns early. So silence. Correct.
    });

    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (isIterating || !document.getElementById('game-over-modal').classList.contains('hidden')) return;

        const key = e.key.toLowerCase();
        let choice = null;

        if (key === 'r') choice = 'rock';
        if (key === 'p') choice = 'paper';
        if (key === 's') choice = 'scissors';

        if (choice) {
            // Find the button to trigger visual feedback if needed? 
            // Or just call logic directly. Let's trigger the button click to re-use logic
            const btn = document.querySelector(`.btn-choice[data-choice="${choice}"]`);
            if (btn) btn.click();
        }
    });

    function shareScore() {
        // Populate Data
        const state = window.gameLogic.getScore();
        shareScoreVal.textContent = state.player;
        shareHighScore.textContent = state.highScore;

        // Check availability
        if (typeof html2canvas === 'undefined') {
            const msg = "Error: Library not loaded. Check connection.";
            statusMsg.textContent = msg;
            alert(msg);
            return;
        }

        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

        // Generate Canvas
        html2canvas(shareCard, {
            scale: 2, // High resolution
            backgroundColor: null,
            useCORS: true,
            logging: false,
            allowTaint: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `RPS-Survivor-Score-${state.player}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();

            shareBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            setTimeout(() => {
                shareBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error("html2canvas error:", err);
            statusMsg.textContent = "Error generating image!";
            shareBtn.innerHTML = originalText;
        });
    }

    function initUI() {
        const state = window.gameLogic.getScore();
        updateScoreBoard();
        renderHearts(state.lives);
    }

    function renderHearts(lives) {
        livesContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('i');
            heart.classList.add('fas', 'fa-heart', 'heart');
            if (i >= lives) {
                heart.classList.add('lost');
            }
            livesContainer.appendChild(heart);
        }
    }

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

            // Safety check if game ended during animation
            if (!computerChoice) {
                isIterating = false;
                return;
            }

            const result = window.gameLogic.getWinner(playerChoice, computerChoice);
            const state = window.gameLogic.getScore();

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
            updateStatus(result);
            updateScoreBoard();
            renderHearts(state.lives);

            // Play Sounds & Effects
            if (result === 'win') {
                window.soundManager.playWin();
                spawnParticles(playerScoreElem);
            } else if (result === 'lose') {
                window.soundManager.playLose();
            } else {
                window.soundManager.playDraw();
            }

            // Check Game Over
            if (state.isGameOver) {
                setTimeout(() => showGameOver(state.player, state.highScore), 1000);
            }

            isIterating = false;
        }, 1500); // 1.5s animation duration
    }

    function showGameOver(finalScore, highScore) {
        finalScoreElem.textContent = finalScore;
        document.getElementById('final-high-score').textContent = highScore;
        gameOverModal.classList.remove('hidden');
        window.soundManager.playLose(); // Play lose sound again or valid game over sound
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

    function updateStatus(result) {
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
        highScoreElem.textContent = score.highScore;

        // Simple animation for score update
        playerScoreElem.classList.add('pop');
        setTimeout(() => {
            playerScoreElem.classList.remove('pop');
        }, 300);
    }
});
 
