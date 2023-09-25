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
