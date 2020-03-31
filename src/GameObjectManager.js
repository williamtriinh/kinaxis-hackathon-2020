const { basket } = require("./Basket");
const { camera } = require("./Camera");
const { fallingObjectManager } = require("./FallingObjectManager");
const { player } = require("./Player");
const { render } = require("./Render");
const { weatherVane } = require("./WeatherVane");

const gameObjectManager = {
    objects: [],
    init: function() {
        camera.attach(player);
        fallingObjectManager.attachBasket(basket);
        this.addGameObjects(true, basket, fallingObjectManager, player, weatherVane);
        this.addGameObjects(false, camera);
    },
    addGameObjects: function(addToRenderable, ...objs) {
        for (let i = 0; i < objs.length; i++)
        {
            this.objects.push(objs[i]);
            if (addToRenderable)
            {
                render.renderable.push(objs[i]);
            }
        }
    }
}

exports.gameObjectManager = gameObjectManager;