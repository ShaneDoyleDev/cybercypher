import tileData from "./tileData.js";
import { shuffle, getRandomNumber } from "./utils.js";

// ---------------------
// DOM Selectors
// ---------------------

const menuContent = document.querySelector(".menu-content");
const menuFrame = document.querySelector(".menu-frame");
const gridContainer = document.querySelector(".grid-container");
const grid = document.querySelector(".grid");
const playerLivesDisplay = document.querySelector(".player-lives-display");
const timeRemaining = document.querySelector(".time-remaining");
const interactiveMenu = document.querySelector(".interactive-menu");
const interactiveMenuContent = document.querySelector(
  ".interactive-menu-content"
);
const menuButtons = document.querySelectorAll(".menu-button");
const instructionsText = document.querySelector(".instructions-text");
const instructionsButton = document.querySelector(".instructions-button");
const instructionsBackButton = document.querySelector(
  ".instructions-back-button"
);
const gameBackButton = document.querySelector(".back-button");

// --------------------------
// Global Variables & Constants
// --------------------------

const TIMEOUT_DURATION = 1000;
let gameDifficulty;
let playerLives;
let timerSeconds;
let countdownInterval;

const gameDifficulties = {
  novice: {
    playerLives: 12,
    timerSeconds: 90,
  },
  pro: {
    playerLives: 8,
    timerSeconds: 60,
  },
  elite: {
    playerLives: 5,
    timerSeconds: 30,
  },
};

// --------------
// UI Templates
// --------------

const victoryScreenHTML = `
    <div class="ui-template-screen crt">
        <img class="access-granted"
  src="../assets/images/access-granted.svg"
  alt="an access granted symbol"
/>
        <button class="button restart-button"><span class="icon-rotate-ccw"></span>Play again</button>
        <video class="victory-video-background" autoplay muted>
            <source src="../assets/videos/matrix-effect.mp4" type="video/mp4">
        </video>
    </div>
`;

const gameOverScreenHTML = `
    <div class="ui-template-screen crt">
        <h1 class="game-over-title">❌ Access Denied ❌</h1>
        <button class="button restart-button">Try again</button>
    </div>
`;

// ---------------------
// Utility Functions
// ---------------------

/**
 * Creates a DOM element for a tile with an image face and a back.
 *
 * @param {Object} tileData - Object with 'name' (tile identifier) and 'imgSrc' (image URL).
 * @returns {HTMLElement} - Tile element with an image face and a back div.
 */
function createTileElement(tileData) {
  const tileElement = document.createElement("div");
  const tileFace = document.createElement("img");
  const tileBack = document.createElement("div");

  tileElement.setAttribute("data-name", tileData.name);
  tileFace.src = tileData.imgSrc;
  tileFace.alt = tileData.name;

  tileElement.classList.add("tile");
  tileFace.classList.add("tile-face");
  tileBack.classList.add("tile-back");

  tileElement.addEventListener("click", handleTileClick);

  tileElement.append(tileFace);
  tileElement.append(tileBack);

  return tileElement;
}
