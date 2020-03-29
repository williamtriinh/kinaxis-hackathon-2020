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
const FallingObjectManager = require("./FallingObjectManager.js");
const { gui } = require("./GUI");
const { gameController } = require("./GameController");
const { screenManager, screens } = require("./ScreenManager");

window.addEventListener("load", () => {

    const cursor = document.getElementById("cursor");

    // Retrieve the canvas
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // Instantiate the game components
    const keyboard = new Keyboard();
    const player = new Player(keyboard);
    const render = new Render(canvas, ctx);
    const fallingObjectsManager = new FallingObjectManager();
    const game = new Game(render, player, keyboard, fallingObjectsManager);

    // Keyboard event listeners
    window.addEventListener("keypress", (ev) => {
        switch (ev.code) {
            case "KeyE":
                Keyboard.prototype.use = 1;
                break;
            case "KeyJ":
                Keyboard.prototype.scrollLeft = 1;
                break;
            case "KeyL":
                Keyboard.prototype.scrollRight = 1;
                break;
            case "Escape":
                if (!gameController.isPaused) {
                    gui.displayUI("pause");
                }
                else {
                    if (screenManager.currentScreen === screens.game)
                    {
                        gui.stopDisplayingUI("pause");
                    }
                }
            default: break;
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
    // End of keyboard event listeners

    // Window event listeners
    // Game div element
    let gameElementRect = document.getElementsByClassName("game")[0].getBoundingClientRect();
    window.addEventListener("resize", () => {
        render.resizeGame();
        gameElementRect = document.getElementsByClassName("game")[0].getBoundingClientRect();
    });

    window.addEventListener("mousemove", (ev) => {
        cursor.style.left = ev.clientX - gameElementRect.left + "px";
        cursor.style.top = ev.clientY + gameElementRect.y + "px";
    });
    // End of window event listeners

    // Button event listeners
    // Main menu
    // When the play button is pressed
    document.getElementById("main-menu__play-btn").addEventListener("click", () => {
        document.getElementsByClassName("main-menu")[0].style["display"] = "none";
        document.getElementsByClassName("game__ui__wrapper")[0].style["display"] = "flex";
        document.querySelector("canvas").style["display"] = "block";
        screenManager.popAndGoTo(screens.game);
        game.init();
    });

    document.getElementById("main-menu__settings-btn").addEventListener("click", () => {
        document.getElementsByClassName("main-menu")[0].style["display"] = "none";
        document.getElementsByClassName("settings-menu")[0].style["display"] = "flex";
        screenManager.goTo(screens.settings);
    });

    // Settings menu
    // Back button
    document.getElementById("settings-menu__back-btn").addEventListener("click", () => {
        if (screenManager.pathContains(screens.game))
        {
            document.getElementsByClassName("game__ui__wrapper")[0].style["display"] = "flex";
            document.querySelector("canvas").style["display"] = "block";
        }

        if (screenManager.pathContains(screens.mainMenu))
        {
            document.getElementsByClassName("main-menu")[0].style["display"] = "flex";
        }

        document.getElementsByClassName("settings-menu")[0].style["display"] = "none";
        screenManager.pop();
    });

    // Pause menu
    document.getElementById("pause-menu__resume-btn").addEventListener("click", () => {
        gui.stopDisplayingUI("pause");
    });

    document.getElementById("pause-menu__settings-btn").addEventListener("click", () => {
        document.querySelector("canvas").style["display"] = "none";
        document.getElementsByClassName("game__ui__wrapper")[0].style["display"] = "none";
        document.getElementsByClassName("settings-menu")[0].style["display"] = "flex";
        screenManager.goTo(screens.settings);
    });

    // Wave stats
    // Wave stats done button
    document.getElementById("wave-stats__done-btn").addEventListener("click", () => gui.stopDisplayingUI("wave"));
    // End of button event listeners

});