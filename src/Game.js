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