/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */

function Game(render, player, keyboard, manger)
{
    this.render = render;
    this.player = player;
    this.keyboard = keyboard;
    this.manger = manger;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);
    this.render.renderable.push(this.player);
    this.render.renderable.push(this.manger);
    loopId = setInterval(this.update, 1000 / 60);
};

Game.prototype.update = function()
{
    this.player.update();
    this.manger.update();
    this.render.draw();
};

module.exports = Game;