/**
 * Project: Rock Paper Scissors
 * File: js/main.js
 * Date: March 13, 2022
 * Description: Application Entry Point.
 *              Orchestrates the instantiation of Game and UI modules.
 *              Includes console-based "Easter Eggs" for curious developers.
 * 
 * Authorship:
 * Created by: Amey Thakur (https://github.com/Amey-Thakur) & Mega Satish (https://github.com/msatmod)
 * Repository: https://github.com/Amey-Thakur/ROCK-PAPER-SCISSORS
 * License: MIT
 */

import Game from './Game.js';
import UI from './UI.js';

// =========================================
//   CONSOLE EASTER EGG ✊✋✌️
// =========================================
console.log(
    "%c✊🏻✋🏻✌🏻 Rock Paper Scissors",
    "font-size: 24px; font-weight: bold; color: #3b82f6; text-shadow: 2px 2px 0 #1e3a5f;"
);
console.log(
    "%c🎲 The classic game of chance and strategy! Redesigned for a Premium Experience.",
    "font-size: 14px; color: #64748b;"
);
console.log(
    "%c🤖 Developed by Amey Thakur & Mega Satish",
    "font-size: 12px; color: #22c55e;"
);
console.log(
    "%c🔗 https://github.com/Amey-Thakur/ROCK-PAPER-SCISSORS",
    "font-size: 12px; color: #2563eb;"
);
console.log(
    "%c⚠️ This game is protected. Please respect the authors' work!",
    "font-size: 12px; color: #f59e0b; font-weight: bold;"
);

// =========================================
//   SECURITY MEASURES 🔒
// =========================================
(function initSecurity() {
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });
    document.addEventListener('selectstart', function (e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
    });
    // Note: Standard debug keys blocking retained from original constraint
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'u')) e.preventDefault();
    });
})();

// =========================================
//   APP INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    const ui = new UI(game);
    ui.init();
});
