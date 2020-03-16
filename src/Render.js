const Camera = require("./Camera.js");

/**
 * Constructor function that handles rendering objects.
 
 * This code shouldn't be touched.
 * 
 * @param {Canvas} canvas
 * @param {Context} ctx
 */

function Render(canvas, ctx)
{
    Render.prototype.canvas = canvas;
    Render.prototype.ctx = ctx;
    Render.prototype.camera = new Camera(this);
    Render.prototype.baseWidth = 640;
    Render.prototype.baseHeight = 360;
    Render.prototype.viewWidth = 640;
    Render.prototype.viewHeight = 360;
    Render.prototype.renderable = [];
    Render.prototype.unrenderable = [];

    // Initialize the canvas properties
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = this.baseWidth;
    this.canvas.height = this.baseHeight;
    this.resizeCanvas();
}

Render.prototype.draw = function()
{
    this.ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);

    this.ctx.fillStyle = "black";
    
    for (let i = 0; i < this.renderable.length; i++)
    {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        this.renderable[i].draw(this.ctx);
        this.ctx.translate(this.camera.x, this.camera.y);
    }
}

Render.prototype.resizeCanvas = function()
{
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let aspectRatio = this.baseWidth / this.baseHeight;

    // Scale the canvas so that it's always the same aspect ratio
    if (winHeight * aspectRatio > winWidth) {
        this.canvas.style.width = winWidth + "px";
        this.canvas.style.height = winWidth / aspectRatio + "px";
        this.viewWidth = winWidth;
        this.viewHeight = winWidth / aspectRatio;
    }
    else {
        this.canvas.style.width = winHeight * aspectRatio + "px";
        this.canvas.style.height = winHeight + "px";
        this.viewWidth = winHeight * aspectRatio;
        this.viewHeight = winHeight;
    }
}

module.exports = Render;