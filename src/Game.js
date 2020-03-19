/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */

function Game(render, player, keyboard, fallingObjectsManager, basket)
{
    this.render = render;
    this.player = player;
    this.keyboard = keyboard;
    this.fallingObjectsManager = fallingObjectsManager;
    this.basket = basket;
    this.loopId = undefined;
    this.camera = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);

    this.camera = this.render.camera;
    this.camera.attach(this.player);

    this.render.renderable.push(this.fallingObjectsManager);
    this.render.renderable.push(this.basket);
    this.render.renderable.push(this.player);

    // Begin the update loop
    loopId = setInterval(this.update, 1000 / 50);
};

Game.prototype.update = function()
{
    this.camera.update();
    this.fallingObjectsManager.update();
    this.basket.update();
    this.player.update();
    this.render.draw();
};

module.exports = Game;