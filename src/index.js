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

window.addEventListener("load", () => {

    // Retrieve the canvas
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // Instantiate the game components
    const keyboard = new Keyboard();
    const player = new Player(keyboard);
    const render = new Render(canvas, ctx);
    const fallingObjectsManager = new FallingObjectManager();
    const game = new Game(render, player, keyboard, fallingObjectsManager);

    window.addEventListener("keypress", (ev) => {
        switch (ev.code)
        {
            case "KeyE":
                Keyboard.prototype.use = 1;
                break;
            case "KeyJ":
                Keyboard.prototype.scrollLeft = 1;
                break;
            case "KeyL":
                Keyboard.prototype.scrollRight = 1;
                break;
        }
    });

    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                Keyboard.prototype.up = 1;
                break;
            case "KeyS":
            case "ArrowDown":
                Keyboard.prototype.down = 1;
                break;
            case "KeyA":
            case "ArrowLeft":
                Keyboard.prototype.left = 1;
                break;
            case "KeyD":
            case "ArrowRight":
                Keyboard.prototype.right = 1;
                break;
        }
    });

    window.addEventListener("keyup", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                Keyboard.prototype.up = 0;
                break;
            case "KeyS":
            case "ArrowDown":
                Keyboard.prototype.down = 0;
                break;
            case "KeyA":
            case "ArrowLeft":
                Keyboard.prototype.left = 0;
                break;
            case "KeyD":
            case "ArrowRight":
                Keyboard.prototype.right = 0;
                break;
        }
    });

    window.addEventListener("resize", () => render.resizeGame());

    // When the play button is pressed
    document.getElementById("menu__play-btn").addEventListener("click", () => {
        document.getElementsByClassName("game__menu")[0].style["display"] = "none";
        document.getElementsByClassName("game__ui__wrapper")[0].style["display"] = "flex";
        document.querySelector("canvas").style["display"] = "block";
        game.init();
    });

});