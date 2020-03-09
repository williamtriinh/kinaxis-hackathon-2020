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
    for (let i = 0; i < this.renderable.length; i++)
    {
        // draw the objects
    }
}

module.exports = Render;