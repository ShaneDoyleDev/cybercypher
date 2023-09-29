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
const countdownBarContainer = document.querySelector(
  ".countdown-bar-container"
);
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
  src="assets/images/access-granted.svg"
  alt="an access granted symbol"
/>
        <button class="button restart-button"><span class="icon-rotate-ccw"></span>Play again</button>
        <video class="victory-video-background" autoplay muted>
            <source src="assets/videos/matrix-effect.mp4" type="video/mp4">
        </video>
    </div>
`;

const gameOverScreenHTML = `
    <div class="ui-template-screen crt">
        <img class="warning-triangle"
  src="assets/images/warning-triangle.svg"
  alt="a warning triangle"
/>
        <button class="button restart-button"><span class="icon-rotate-ccw"></span>Try again</button>
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

/**
 * Handles a click event on a tile. When a tile is clicked, a random glitch video effect plays over the tile. If two tiles are "activated" (revealed),mit checks if they match.
 *
 * @param {Event} event - The click event object.
 */
function handleTileClick(event) {
  const randomNum = getRandomNumber(1, 3);
  const videoElementHTML = `
    <video class="glitch-video" autoplay muted>
        <source src="assets/videos/glitch-effect-${randomNum}.mp4" type="video/mp4" />
    </video>
  `;
  event.currentTarget.insertAdjacentHTML("beforeend", videoElementHTML);
  setTimeout(() => document.querySelector(".glitch-video").remove(), 300);

  event.currentTarget.classList.add("reveal-tile", "activated", "no-click");
  const selectedTiles = document.querySelectorAll(".activated");
  selectedTiles.length === 2 && checkForMatchingTiles(selectedTiles);
}

/**
 * Checks if two tiles match based on 'data-name'.
 * On a match, tiles are marked and click events removed.
 * On mismatch, tiles flip back and player's lives decrement.
 *
 * @param {Array} tiles - Contains two tiles ([firstTile, secondTile]) to check.
 */
function checkForMatchingTiles([firstTile, secondTile]) {
  if (
    firstTile.getAttribute("data-name") === secondTile.getAttribute("data-name")
  ) {
    [firstTile, secondTile].forEach((tile) => {
      tile.classList.add("matched");
      tile.classList.remove("activated");
      tile.removeEventListener("click", handleTileClick);
      document.querySelectorAll(".matched").length === 16 &&
        showVictoryScreen();
    });
  } else {
    grid.classList.add("no-click");
    setTimeout(() => {
      grid.classList.remove("no-click");
      [firstTile, secondTile].forEach((tile) => {
        tile.classList.remove("reveal-tile", "activated", "no-click");
      });
    }, TIMEOUT_DURATION);
    decrementPlayerLives();
    if (playerLives === 0) showGameOverScreen();
  }
}

// -----------------
// Timer Functions
// -----------------

/**
 * Initializes a countdown based on the given duration in seconds.
 * Updates a visual representation and ends the game once time runs out.
 *
 * @param {number} totalSeconds - Duration of the countdown in seconds.
 */
function initCountdown(totalSeconds) {
  const startTime = Date.now();

  countdownInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const totalMilliseconds = totalSeconds * 1000;
    const elapsedPercentage = (elapsedTime / totalMilliseconds) * 100;

    if (elapsedPercentage >= 70) {
      countdownBarContainer.classList.add("warning-flash");
    } else {
      countdownBarContainer.classList.remove("warning-flash");
    }

    timeRemaining.style.width = `${elapsedPercentage}%`;
    if (elapsedTime >= totalMilliseconds) {
      clearInterval(countdownInterval);
      showGameOverScreen();
    }
  }, 10);
}

// ---------------------
// Game Logic Functions
// ---------------------

/**
 * Populates the grid with shuffled tiles.
 *
 * @param {Array} tileData - Array of tile information.
 */
function generateTiles(tileData) {
  shuffle(tileData).forEach((tile) => {
    grid.appendChild(createTileElement(tile));
  });
}

/**
 * Clears all tiles from the grid.
 */
function clearTiles() {
  grid.innerHTML = "";
}

/**
 * Decreases the player's lives count and updates the display.
 */
function decrementPlayerLives() {
  playerLives--;
  playerLivesDisplay.textContent = playerLives;
}

/**
 * Stops the countdown, plays a random glitch video, and then displays the victory screen.
 * Offers an option to restart the game.
 */
function showVictoryScreen() {
  countdownBarContainer.classList.remove("warning-flash");
  clearInterval(countdownInterval);
  const randomNum = getRandomNumber(1, 3);
  const videoElementHTML = `
    <video class="glitch-video" autoplay muted>
        <source src="assets/videos/glitch-effect-${randomNum}.mp4" type="video/mp4" />
    </video>
  `;
  grid.insertAdjacentHTML("beforeend", videoElementHTML);
  setTimeout(() => {
    grid.innerHTML = "";
    grid.insertAdjacentHTML("beforeend", victoryScreenHTML);
    document
      .querySelector(".restart-button")
      .addEventListener("click", restartGame);
  }, TIMEOUT_DURATION - 500);
}

/**
 * Stops the countdown, plays a random glitch video, and then displays the game over screen.
 * Offers an option to restart the game.
 */
function showGameOverScreen() {
  countdownBarContainer.classList.remove("warning-flash");
  clearInterval(countdownInterval);

  const randomNum = getRandomNumber(1, 3);
  const videoElementHTML = `
    <video class="glitch-video" autoplay muted>
        <source src="assets/videos/glitch-effect-${randomNum}.mp4" type="video/mp4" />
    </video>
  `;
  grid.insertAdjacentHTML("beforeend", videoElementHTML);

  setTimeout(() => {
    grid.innerHTML = "";
    grid.insertAdjacentHTML("beforeend", gameOverScreenHTML);
    document
      .querySelector(".restart-button")
      .addEventListener("click", restartGame);
  }, TIMEOUT_DURATION - 500);
}

// ---------------------
// Game State Functions
// ---------------------

/**
 * Handles the menu button click, sets game difficulty, updates lives, and starts the game.
 * @param {Event} event - The click event object.
 */
function handleMenuButtonClick(event) {
  gameDifficulty = event.currentTarget.textContent.toLowerCase();
  playerLives = gameDifficulties[gameDifficulty].playerLives;
  timerSeconds = gameDifficulties[gameDifficulty].timerSeconds;
  playerLivesDisplay.textContent = playerLives;
  startGame();
}

/**
 * Initiates the game by revealing the grid, setting the countdown, and populating tiles.
 */
function startGame() {
  revealGrid();
  clearTiles();
  initCountdown(timerSeconds);
  generateTiles(tileData);
}

/**
 * Reveals the game grid and hides the menu frame and content.
 */
function revealGrid() {
  menuContent.classList.add("hide");
  menuFrame.classList.add("hide");
  gridContainer.classList.remove("hide");
}

/**
 * Hides the game grid and reveals the menu frame and content.
 */
function revealMenu() {
  menuContent.classList.remove("hide");
  menuFrame.classList.remove("hide");
  gridContainer.classList.add("hide");
}

/**
 * Plays a random glitch video and displays the game instructions.
 */
function revealInstructions() {
  const randomNum = getRandomNumber(1, 3);
  const videoElementHTML = `
    <video class="glitch-video" autoplay muted>
        <source src="assets/videos/glitch-effect-${randomNum}.mp4" type="video/mp4" />
    </video>
  `;
  interactiveMenu.insertAdjacentHTML("beforeend", videoElementHTML);
  setTimeout(() => document.querySelector(".glitch-video").remove(), 300);
  instructionsText.classList.remove("hide");
  interactiveMenuContent.classList.add("hide");
}

/**
 * Plays a random glitch video and hides the game instructions, revealing the main menu.
 */
function hideInstructions() {
  const randomNum = getRandomNumber(1, 3);
  const videoElementHTML = `
    <video class="glitch-video" autoplay muted>
        <source src="assets/videos/glitch-effect-${randomNum}.mp4" type="video/mp4" />
    </video>
  `;
  interactiveMenu.insertAdjacentHTML("beforeend", videoElementHTML);
  setTimeout(() => document.querySelector(".glitch-video").remove(), 300);
  instructionsText.classList.add("hide");
  interactiveMenuContent.classList.remove("hide");
}

/**
 * Resets and restarts the game, including reinitializing lives, timer, and tiles.
 */
function restartGame() {
  document.querySelector(".victory-screen")?.remove();
  document.querySelector(".game-over-screen")?.remove();
  playerLives = gameDifficulties[gameDifficulty].playerLives;
  timerSeconds = gameDifficulties[gameDifficulty].timerSeconds;
  playerLivesDisplay.textContent = playerLives;
  clearTiles();
  initCountdown(timerSeconds);
  generateTiles(tileData);
}

// ---------------------
// Event Listeners
// ---------------------
menuButtons.forEach((button) => {
  button.addEventListener("click", handleMenuButtonClick);
});

instructionsButton.addEventListener("click", revealInstructions);

instructionsBackButton.addEventListener("click", hideInstructions);

gameBackButton.addEventListener("click", () => {
  clearInterval(countdownInterval);
  revealMenu();
});
