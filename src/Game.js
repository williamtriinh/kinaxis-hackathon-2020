/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */

function Game(render, player, keyboard, fallingObjectsManger)
{
    this.render = render;
    this.player = player;
    this.keyboard = keyboard;
    this.fallingObjectsManger = fallingObjectsManger;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);
    this.render.renderable.push(this.player);
    this.render.renderable.push(this.fallingObjectsManger);
    loopId = setInterval(this.update, 1000 / 60);
};

Game.prototype.update = function()
{
    this.player.update();
    this.fallingObjectsManger.update();
    this.render.draw();
};

module.exports = Game;