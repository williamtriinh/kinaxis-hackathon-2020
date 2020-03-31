const { camera } = require("./Camera.js");
const { config } = require("./Config");
const { gui } = require("./GUI.js");

const mainBackground = "./src/assets/art/main-background.png";
const interludeBackground = "./src/assets/art/interlude-background.png";

// Holds reference to the canvas element and handles rendering the game objects to the canvas

const render = {
    canvas: undefined,
    ctx: undefined,
    renderable: [],
    unrenderable: [],
    backgroundRenderable: {
        main: new Image(),
        interlude: new Image()
    },
    init: function() {
        // Get the canvas element
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

        // Canvas properties
        this.ctx.imageSmoothingEnabled = false;
        this.canvas.width = config.baseWidth;
        this.canvas.height = config.baseHeight;

        this.resizeGame();

        this.backgroundRenderable.main.src = mainBackground;
        this.backgroundRenderable.interlude.src = interludeBackground;

    },
    draw: function() {
        this.ctx.translate(-camera.x, 0);
        if (camera.x > -config.baseWidth) {
            this.ctx.drawImage(this.backgroundRenderable.main, 0, 0);
        }

        if (camera.player.x <= 0) {
            this.ctx.drawImage(this.backgroundRenderable.interlude, -config.baseWidth, 0);
        }

        this.ctx.translate(camera.x, 0);

        for (let i = 0; i < this.renderable.length; i++) {
            this.ctx.translate(-camera.x, 0);
            this.renderable[i].draw(this.ctx);
            this.ctx.translate(camera.x, 0);
        }

        gui.draw(this.ctx);
    },
    resizeGame: function() {
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;
        let aspectRatio = config.baseWidth / config.baseHeight;

        let game = document.getElementsByClassName("game")[0];

        // Scale the canvas so that it's always the same aspect ratio
        if (winHeight * aspectRatio > winWidth) {
            game.style.width = winWidth + "px";
            game.style.height = winWidth / aspectRatio + "px";
        }
        else {
            game.style.width = winHeight * aspectRatio + "px";
            game.style.height = winHeight + "px";
        }
    }
}

render.init();

exports.render = render;