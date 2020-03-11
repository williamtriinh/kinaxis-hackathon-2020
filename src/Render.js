/**
 * Constructor function that handles rendering objects.
 * This code shouldn't be touched.
 * 
 * @param {Canvas} canvas
 * @param {Context} ctx
 */

function Render(canvas, ctx)
{
    this.canvas = canvas;
    this.ctx = ctx;
    this.renderable = [];       // The objects that should be drawn to the screen.
    this.unrenderable = [];     // The objects that shouldn't be drawn to the screen.
}

Render.prototype.draw = function()
{
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.renderable.length; i++)
    {
        this.renderable[i].draw(this.ctx);
    }
}

module.exports = Render;