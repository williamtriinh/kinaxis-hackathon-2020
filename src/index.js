const Game = require("./Game.js");
const Render = require("./Render.js");

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2D");

window.addEventListener("load", () => {

    // Initialize the canvas properties
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);

    let render = new Render(canvas, ctx);
    let game = new Game(render);
    
    game.init();
});