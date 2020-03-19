/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */
const Basket = require("./Basket.js");
const Keyboard = require("./Keyboard.js");

let key = new Keyboard();

function Game(render, player, keyboard, fallingObjectsManager)
{
    this.render = render;
    this.player = player;
    this.keyboard = keyboard;
    this.fallingObjectsManager = fallingObjectsManager;
    this.basket = new Basket(player, keyboard);
    this.camera = this.render.camera;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);

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

    Keyboard.prototype.use = 0;

    this.render.draw();
};

module.exports = Game;