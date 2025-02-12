const { config } = require("./Config");
const { gameController } = require("./GameController");
const { gui } = require("./GUI");
const FallingObject = require("./FallingObject.js");

const smallFallingObjectSprites = "/src/assets/art/small-falling-objects.png";
const powerupsSprites = "/src/assets/art/powerups.png";

const fallingObjectManager = {
    basket: undefined,
    fallingObjectSprites: [
        {
            // Small falling objects
            image: new Image(),
            length: 5, // How many different sprites there are in the spritesheet
            size: [[8, 10], [8, 16], [14, 12], [10, 10], [8, 6]]    // The width/height of the sprites, by a factor of 1/3
            // (not including white-space).
        },
        {
            // Powerups
            image: new Image(),
            length: 2,
            size: [[16, 16], [16, 16]]
        },
        // {
        //     image: new Image(),
        //     length: 2
        // },
        // {
        //     image: new Image(),
        //     length: 2
        // }
    ],
    fallingObjectsArray: {},
    spawnTimer: 0,
    attachBasket: function(basket) {
        this.basket = basket;
    },
    init: function() {
        this.fallingObjectSprites[0].image.src = smallFallingObjectSprites;
        this.fallingObjectSprites[1].image.src = powerupsSprites;

        this.start = this.start.bind(this);
        this.missedFallingObject = this.missedFallingObject.bind(this);
        this.caughtFallingObject = this.caughtFallingObject.bind(this);
    },
    // Starts the wave
    start: function() {
        if (!gameController.wave.isRunning) {
            gameController.wave.isRunning = true;
            this.resetSpawnTimer();
        }
    },
    // Stops the wave
    stop: function() {
        // Stop spawning items and display the wave stats
        gameController.wave.isRunning = false;
        gameController.calculateMoneyEarned();
        gui.displayUI("wave");
    },
    // Resets the spawn timer
    resetSpawnTimer: function() {
        const { maxTime, minTime } = gameController.wave;
        this.spawnTimer = Math.random() * (maxTime - minTime) + minTime;
    },
    missedFallingObject: function(id) {
        delete this.fallingObjectsArray[id];
        gameController.wave.cropQuality = Math.floor(gameController.wave.cropQuality * 100 - 1) / 100;
        if (gameController.wave.cropQuality <= 0) {
            gameController.wave.cropQuality = 0;
        }
        gameController.wave.missed++;
    },
    caughtFallingObject: function(id) {
        delete this.fallingObjectsArray[id];
    },
    createFallingObject: function() {
        let type = (Math.floor(Math.random() * 15) === 0 ? "powerup" : "garbage"); // 1/15 chance of being a powerup
        let sprite = this.fallingObjectSprites[type === "powerup" ? 1 : 0];
        let spriteIndex = Math.floor(Math.random() * sprite.length);
        let width = sprite.size[spriteIndex][0] * 3;
        let height = sprite.size[spriteIndex][1] * 3;
        let x;
        if (type === "garbage" && spriteIndex === 2) {
            // To keep the plastic bag from going off screen
            x = Math.random() * (980 - 300) + 300;
        }
        else {
            // For everyting else
            x = Math.random() * (config.baseWidth - 128) + 128;
        }

        let flip = (Math.floor((Math.random() * 2)) === 0) ? true : false;

        let id = Date.now();

        let image = document.createElement("canvas").getContext("2d");
        image.canvas.width = width;
        image.canvas.height = height;

        if (flip) {
            image.scale(-1, 1);             // Flip the image
            image.translate(-width, 0);     // Offset because of the flip
        }
        image.drawImage(
            sprite.image,
            spriteIndex * 48 + (48 - width) / 2,
            (48 - height) / 2,
            width,
            height,
            0,
            0,
            width,
            height
        );

        let obj = new FallingObject(`${id}`, x, width, height, flip, image.canvas, spriteIndex, type, this.basket)
        // Add the destroy/caught method to the prototype
        if (obj.destroy === undefined || obj.caughtFallingObject) {
            obj.addCallbacks(this.missedFallingObject, this.caughtFallingObject);
        }

        // Add the object to the array
        this.fallingObjectsArray[`${id}`] = obj;

        // Increament the amount spawned during the wave
        gameController.wave.spawned++;
    },
    update: function() {
        for (let i in this.fallingObjectsArray) {
            this.fallingObjectsArray[i].update(this.removeFallingObject);
        }

        // Stop spawning
        if (this.fallingObjectsArray.length >= 10 && this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Update the timer
        if (gameController.wave.isRunning && !gameController.isPaused) {
            this.spawnTimer -= 0.02; // 1s / 50frames
            if (this.spawnTimer <= 0) {
                // Create the fallling object
                if (gameController.wave.spawned < gameController.wave.max) {
                    this.createFallingObject();
                    this.resetSpawnTimer();
                }
                else {
                    // Wait until all the falling objects are gone before displaying
                    // the wave stats
                    if (Object.keys(this.fallingObjectsArray).length <= 0) {
                        this.stop();
                    }
                }
            }
        }
    },
    draw: function(ctx) {
        for (let i in this.fallingObjectsArray) {
            this.fallingObjectsArray[i].draw(ctx);
        }
    }
};

fallingObjectManager.init();

exports.fallingObjectManagerStart = fallingObjectManager.start;

exports.fallingObjectManager = fallingObjectManager;