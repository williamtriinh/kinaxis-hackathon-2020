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
const FallingObjects = require("./fallingObjects.js");

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", () => {

    // Initialize the canvas properties
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);

    const keyboard = new Keyboard();
    const player = new Player(keyboard);
    const fallingObjects = new FallingObjects();
    const render = new Render(canvas, ctx);
    const game = new Game(render, player, keyboard, fallingObjects);

    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "KeyW":
                keyboard.up = 1;
                break;
            case "KeyS":
                keyboard.down = 1;
                break;
            case "KeyA":
                keyboard.left = 1;
                break;
            case "KeyD":
                keyboard.right = 1;
                break;
        }
    });

    window.addEventListener("keyup", (ev) => {
        switch (ev.code) {
            case "KeyW":
                keyboard.up = 0;
                break;
            case "KeyS":
                keyboard.down = 0;
                break;
            case "KeyA":
                keyboard.left = 0;
                break;
            case "KeyD":
                keyboard.right = 0;
                break;
        }
    });
    
    game.init();

});