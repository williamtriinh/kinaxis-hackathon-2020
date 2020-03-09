/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */

function Game(render)
{
    this.render = render;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    loopId = setInterval(this.update, 1000 / 30);
};

Game.prototype.update = function()
{
    this.render.draw();
};

module.exports = Game;