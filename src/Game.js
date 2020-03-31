/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */
const { gameController } = require("./GameController");
const { gameObjectManager } = require("./GameObjectManager");
const { keyboard } = require("./Keyboard");
const { render } = require("./Render");

const game = {
    gameLoopId: undefined,
    gameObjects: [],
    start: function() {

        gameObjectManager.init()

        this.gameLoopId = setInterval(this.update, 1000 / 50);
    },
    update: function() {
        if (!gameController.isPaused)
        {
            for (let i = 0; i < gameObjectManager.objects.length; i++)
            {
                gameObjectManager.objects[i].update();
            }
        }
        gameController.update();
        keyboard.reset();
        render.draw();
    }
}

exports.game = game;

// function Game(render, player, keyboard, fallingObjectsManager)
// {
//     Game.prototype.render = render;
//     Game.prototype.player = player;
//     Game.prototype.keyboard = keyboard;
//     Game.prototype.fallingObjectsManager = fallingObjectsManager;
//     Game.prototype.basket = new Basket();
//     Game.prototype.camera = this.render.camera;
//     // this.gui = new GUI();
//     Game.prototype.loopId = undefined;
// }

// Game.prototype.init = function()
// {
//     this.update = this.update.bind(this);

//     this.camera.attach(this.player);
//     this.basket.attach(this.player);

//     this.render.renderable.push(this.fallingObjectsManager);
//     this.render.renderable.push(weatherVane);
//     this.render.renderable.push(this.basket);
//     this.render.renderable.push(this.player);

//     // Begin the update loop
//     loopId = setInterval(this.update, 1000 / 50);
// };


// module.exports = Game;