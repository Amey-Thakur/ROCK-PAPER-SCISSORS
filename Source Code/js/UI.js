/**
 * Project: Rock Paper Scissors
 * File: js/UI.js
 * Date: March 13, 2022
 * Description: User Interface (UI) Controller.
 *              Manages the DOM interactions, event listeners, and visual feedback mechanisms.
 *              Adheres to a "Playful yet Clean" aesthetic philosophy.
 * 
 * Authorship:
 * Created by: Amey Thakur (https://github.com/Amey-Thakur) & Mega Satish (https://github.com/msatmod)
 * Repository: https://github.com/Amey-Thakur/ROCK-PAPER-SCISSORS
 * License: MIT
 */

export default class UI {
    constructor(gameInstance) {
        this.game = gameInstance;

        // DOM Element Caching (Performance Optimization)
        this.choices = document.querySelectorAll('.choice');
        this.scoreEl = document.getElementById('score');
        this.resultEl = document.getElementById('result');
        this.restartBtn = document.getElementById('restart');
        this.modal = document.querySelector('.modal');
        this.streakEl = document.getElementById('streak-display'); // New Element for "Hook"

        // Bind methods to context
        this.play = this.play.bind(this);
        this.clearModal = this.clearModal.bind(this);
        this.restartGame = this.restartGame.bind(this);
    }

    /**
     * Initialization Sequence.
     * Sets up event listeners for user interaction.
     */
    init() {
        this.choices.forEach(choice => choice.addEventListener('click', this.play));
        window.addEventListener('click', this.clearModal);
        this.restartBtn.addEventListener('click', this.restartGame);
        this.updateScoreBoard();
    }

    /**
     * Primary Game Loop Trigger.
     * Executed upon user input (click).
     * 
     * @param {Event} e - The click event object.
     */
    play(e) {
        this.restartBtn.style.display = 'inline-block';

        // Identify user intent via ID (rock, paper, or scissors)
        // Detailed check to handle click on icon vs container if structure varies
        const playerChoice = e.target.id || e.target.parentElement.id;

        if (!['rock', 'paper', 'scissors'].includes(playerChoice)) return; // Guard clause

        const computerChoice = this.game.getComputerChoice();
        const winner = this.game.getWinner(playerChoice, computerChoice);

        // Update Logical State
        this.game.updateScore(winner);

        // Update Visual State
        this.updateScoreBoard();
        this.showModal(winner, computerChoice);
    }

    /**
     * Modal Visualization Module.
     * Dynamically injects HTML content to display round results with visual flair.
     * 
     * @param {string} winner - 'player', 'computer', or 'draw'
     * @param {string} computerChoice - The choice made by the opponent.
     */
    showModal(winner, computerChoice) {
        let content = '';
        const formattedChoice = computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1);

        // Font Awesome Icon Mapping
        const iconClass = `fas fa-hand-${computerChoice} fa-10x`;

        if (winner === 'player') {
            content = `
        <h1 class="text-win">You Win!</h1>
        <div class="result-icon win-anim"><i class="${iconClass}"></i></div>
        <p>Computer chose <strong>${formattedChoice}</strong></p>
        <p class="sub-text">Great validation of your strategy!</p>
      `;
        } else if (winner === 'computer') {
            content = `
        <h1 class="text-lose">You Lose</h1>
        <div class="result-icon lose-anim"><i class="${iconClass}"></i></div>
        <p>Computer chose <strong>${formattedChoice}</strong></p>
        <p class="sub-text">Better luck next probability cycle.</p>
      `;
        } else {
            content = `
        <h1 class="text-draw">It's A Draw</h1>
        <div class="result-icon draw-anim"><i class="${iconClass}"></i></div>
        <p>Computer chose <strong>${formattedChoice}</strong></p>
        <p class="sub-text">Synchronization achieved.</p>
      `;
        }

        this.resultEl.innerHTML = content;
        this.modal.style.display = 'flex'; // Flex for centering
    }

    /**
     * Scoreboard Synchronization.
     * Reflects the internal game state to the DOM.
     */
    updateScoreBoard() {
        const score = this.game.getScore();
        const streak = this.game.getStreak();

        this.scoreEl.innerHTML = `
      <div class="score-card player">
        <p>Player</p>
        <span class="score-val">${score.player}</span>
      </div>
      <div class="score-card computer">
        <p>Computer</p>
        <span class="score-val">${score.computer}</span>
      </div>
    `;

        // Streak Hook Logic
        if (this.streakEl) {
            if (streak > 0) {
                this.streakEl.innerHTML = `🔥 Streak: ${streak}`;
                this.streakEl.classList.add('active');
            } else {
                this.streakEl.innerHTML = '';
                this.streakEl.classList.remove('active');
            }
        }
    }

    /**
     * Reset Handler.
     * Resets both logic and UI.
     */
    restartGame() {
        this.game.reset();
        this.updateScoreBoard();
        this.restartBtn.style.display = 'none'; // Hide until played again
    }

    /**
     * Modal Dismissal Logic.
     * Closes the modal when clicking outside the content area.
     * 
     * @param {Event} e 
     */
    clearModal(e) {
        if (e.target === this.modal) {
            this.modal.style.display = 'none';
        }
    }
}
