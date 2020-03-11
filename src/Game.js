/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */

function Game(render, player)
{
    this.player = player;
    this.render = render;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    this.render.renderable.push(player);
    loopId = setInterval(this.update, 1000 / 30);
};

Game.prototype.update = function()
{
    this.render.draw(ctx);
};

module.exports = Game;