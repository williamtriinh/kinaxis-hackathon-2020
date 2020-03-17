/**
 * The "entry" file where the canvas is created and the different components
 * that make up the game (such as the Game, Render) are instantiated.
 * 
 * This code shouldn't be touched
 */

const Game = require("./Game.js");
const Render = require("./Render.js");
const Player = require("./Player.js");
const Keyboard = require("./Keyboard.js");
const FallingObjectManager = require("./FallingObjectManager.js")

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", () => {

    document.getElementsByClassName("game")[0].appendChild(canvas);

    // Instantiate the game components
    const keyboard = new Keyboard();
    const player = new Player(keyboard);
    const render = new Render(canvas, ctx);
    const fallingObjectsManager = new FallingObjectManager();
    const game = new Game(render, player, keyboard, fallingObjectsManager);

    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                keyboard.up = 1;
                break;
            case "KeyS":
            case "ArrowDown":
                keyboard.down = 1;
                break;
            case "KeyA":
            case "ArrowLeft":
                keyboard.left = 1;
                break;
            case "KeyD":
            case "ArrowRight":
                keyboard.right = 1;
                break;
        }
    });

    window.addEventListener("keyup", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                keyboard.up = 0;
                break;
            case "KeyS":
            case "ArrowDown":
                keyboard.down = 0;
                break;
            case "KeyA":
            case "ArrowLeft":
                keyboard.left = 0;
                break;
            case "KeyD":
            case "ArrowRight":
                keyboard.right = 0;
                break;
        }
    });

    window.addEventListener("resize", () => render.resizeGame());
    
    game.init();

});