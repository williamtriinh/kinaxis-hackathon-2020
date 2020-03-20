const Camera = require("./Camera.js");
const GUI = require("./GUI.js");
const mainBackground = "./src/assets/art/main-background.png";
const interludeBackground = "./src/assets/art/interlude-background.png";

/**
 * Constructor function that handles rendering objects.
 
 * This code shouldn't be touched.
 * 
 * @param {Canvas} canvas
 * @param {Context} ctx
 */
let gui = new GUI();

function Render(canvas, ctx)
{
    Render.prototype.canvas = canvas;
    Render.prototype.ctx = ctx;
    Render.prototype.camera = new Camera(this);
    Render.prototype.baseWidth = 1280;
    Render.prototype.baseHeight = 720;
    Render.prototype.viewWidth = 640;
    Render.prototype.viewHeight = 360;
    Render.prototype.renderable = [];
    Render.prototype.unrenderable = [];
    Render.prototype.backgroundRenderable = {
        main: new Image(),
        interlude: new Image()
    };

    this.backgroundRenderable.main.src = mainBackground;
    this.backgroundRenderable.interlude.src = interludeBackground;

    // Initialize the canvas properties
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = this.baseWidth;
    this.canvas.height = this.baseHeight;
    this.resizeGame();
}

Render.prototype.draw = function()
{
    // this.ctx.fillStyle = "pink";
    // this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
    // this.ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);

    // this.ctx.fillStyle = "black";
    this.ctx.translate(-this.camera.x, 0);
    if (this.camera.x > -this.baseWidth)
    {
        this.ctx.drawImage(this.backgroundRenderable.main, 0, 0);
    }

    if (this.camera.player.x <= 0)
    {
        this.ctx.drawImage(this.backgroundRenderable.interlude, -this.baseWidth, 0);
    }
    
    this.ctx.translate(this.camera.x, 0);
    
    for (let i = 0; i < this.renderable.length; i++)
    {
        this.ctx.translate(-this.camera.x, 0);
        this.renderable[i].draw(this.ctx);
        this.ctx.translate(this.camera.x, 0);
    }

    gui.draw(this.ctx);
}

Render.prototype.resizeGame = function()
{
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let aspectRatio = this.baseWidth / this.baseHeight;

    let game = document.getElementsByClassName("game")[0];

    // Scale the canvas so that it's always the same aspect ratio
    if (winHeight * aspectRatio > winWidth) {
        game.style.width = winWidth + "px";
        game.style.height = winWidth / aspectRatio + "px";
        // this.canvas.style.width = winWidth + "px";
        // this.canvas.style.height = winWidth / aspectRatio + "px";
        // menu.style.width = this.canvas.style.width;
        // menu.style.height = this.canvas.style.height;
        // this.viewWidth = winWidth;
        // this.viewHeight = winWidth / aspectRatio;
    }
    else {
        game.style.width = winHeight * aspectRatio + "px";
        game.style.height = winHeight + "px";
        // this.canvas.style.width = winHeight * aspectRatio + "px";
        // this.canvas.style.height = winHeight + "px";
        // menu.style.width = this.canvas.style.width;
        // menu.style.height = this.canvas.style.height;
        // this.viewWidth = winHeight * aspectRatio;
        // this.viewHeight = winHeight;
    }
}

module.exports = Render;