(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { config } = require("./Config");
const { fallingObjectManagerStart } = require("./FallingObjectManager");
const { gameController } = require("./GameController");
const { gui } = require("./GUI.js");
const { keyboard } = require("./Keyboard");
const { player } = require("./Player");

const basketSprites = "/src/assets/art/baskets.png";

const basket = {
    x: config.baseWidth / 2,
    y: config.baseHeight - 24,
    width: 48,
    height: 48,
    isCarried: false,
    isNearby: false,
    sprite: {
        image: new Image(),
        index: 0,   // Which basket we're using: 0 = blue, 1 = black, 2 = garbage
        length: 3   // How many sprites there are in this sprite sheet
    },
    init: function() {
        this.sprite.image.src = basketSprites;
    },
    update: function() {
        if (keyboard.use === 1 && !this.isCarried && !gameController.isPaused) {
            // checking position of this.x to see if in range and this.y to see if I can pick up the basket
            if (player.x > this.x - this.width && player.x < this.x + this.width) {
                // Begin the wave
                this.isCarried = true;
                fallingObjectManagerStart();
            }
        }

        if (!gameController.wave.isRunning && this.isCarried) {
            this.isCarried = false;
        }

        if (this.isCarried) {
            // Follow the player
            this.x = player.x;
            this.y = player.y - player.height;

            if (keyboard.scrollLeft === 1) {
                this.sprite.index--;
                if (this.sprite.index < 0) {
                    this.sprite.index = this.sprite.length - 1;
                }
            }

            if (keyboard.scrollRight === 1) {
                this.sprite.index = (this.sprite.index + 1) % 3;
            }
        }
        else {
            // Stay on the ground
            this.y = config.floorHeight - this.height / 2;
            this.x = config.baseWidth / 2;
        }
    },
    draw: function(ctx) {
        // Display the ui indicator
        if (player.x > this.x - this.width && player.x < this.x + this.width && !this.isCarried && !gameController.isPaused) {
            gui.drawText(ctx, `PRESS 'E' TO BEGIN WAVE ${gameController.wave.number}!`, this.x, this.y - this.height);
        }

        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(
            this.sprite.image,
            this.sprite.index * this.width,
            0,
            this.width,
            this.height,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }
};

basket.init();

exports.basket = basket;
},{"./Config":3,"./FallingObjectManager":5,"./GUI.js":6,"./GameController":8,"./Keyboard":10,"./Player":11}],2:[function(require,module,exports){
const { config } = require("./Config");
const { gameController } = require("./GameController");

/**
 * Handles the "camera"
 */

const cameraStates = {
    GAME: 0,            // The falling object part of the game
    INTERLUDE: 1        // The "pause" between the waves for preparing for waves
}

const camera = {
    player: undefined,     // The player object
    x: 0,
    y: 0,
    state: cameraStates.GAME,
    attach: function(obj) {
        this.player = obj;
    },
    update: function() {
        if (this.player.x >= 0) {
            this.state = cameraStates.GAME;
            this.x = 0;
            this.y = 0;
        }

        if (!gameController.wave.isRunning && this.player.x < 0) {
            this.x = this.player.x - config.baseWidth / 2;
            this.y = this.player.y - config.baseHeight / 1.5;

            if (this.x <= -config.baseWidth) {
                this.x = -config.baseWidth;
            }
        }
    }
}

exports.camera = camera;

},{"./Config":3,"./GameController":8}],3:[function(require,module,exports){
exports.config = {
    baseWidth: 1280,                            // The game render width
    baseHeight: 720,                            // The game render height
    floorHeight: 656
}
},{}],4:[function(require,module,exports){
const { gameController } = require("./GameController");

const fallPathAnchors = [
    [0, 150],
    [-100, 250],
    [-200, 200],
    [0, 300],
    [100, 400],
    [100, 550]
];

const fallPathTimes = [
    2,
    2,
    1,
    0,
    1,
    1.5,
];

const fallPath = function(obj)
{
    let speed = 0.2;
    let x = ((obj.flip ? -1 : 1) * fallPathAnchors[obj.fallPath.anchor][0] + obj.fallPath.initialX) - obj.x;
    let y = fallPathAnchors[obj.fallPath.anchor][1] - obj.y;
    let r = Math.sqrt(x * x + y * y);
    obj.velocity.x += x / r * speed;
    obj.velocity.y += y / r * speed;
}

/**
 * 
 * @param {int} id 
 * @param {float} x 
 * @param {float} width 
 * @param {float} height
 * @param {bool} flip       Whether the sprite is flipped
 * @param {Canvas} image 
 * @param {int} imageIndex
 * @param {String} type     The falling object type: "garbage" or "powerup"
 */
function FallingObject(id, x, width, height, flip, image, imageIndex, type, basket)
{
    // parameter x will be random
    this.id = id;
    this.x = x;
    this.y = -height;
    this.width = width;
    this.height = height;
    this.flip = flip;
    this.image = image;
    this.imageIndex = imageIndex;
    this.type = type;
    
    // Only for gabage bag
    this.fallPath = {
        isFollowing: true,
        direction: 1,       // Whether to flip the direction of the path
        anchor: 0,
        time: fallPathTimes[0],
        initialX: x,
    }

    // speed/gravity
    this.velocity = {
        x: 0,
        y: 0
    }

    //low gravity
    FallingObject.prototype.gravity = .03;
    FallingObject.prototype.friction = 0.4;
    FallingObject.prototype.floorPosition = 720 - 64;
    FallingObject.prototype.maxHorVelocity = 2;

    FallingObject.prototype.missedFallingObject = undefined;
    FallingObject.prototype.caughtFallingObject = undefined;

    FallingObject.prototype.basket = basket;

    this.addCallbacks = this.addCallbacks.bind(this);
};

/**
 * Adds the callback methods for missed/caught objects to the prototype. This method is only called once.
 * The FallingObjectManager supplies the methods
 */
FallingObject.prototype.addCallbacks = function(_missedFallingObject, _caughtFallingObject)
{
    FallingObject.prototype.missedFallingObject = _missedFallingObject;
    FallingObject.prototype.caughtFallingObject = _caughtFallingObject;
    this.missedFallingObject = this.missedFallingObject.bind(this);
    this.caughtFallingObject = this.caughtFallingObject.bind(this);
}

FallingObject.prototype.update = function()
{
    // Code for garbage bag only
    if (this.imageIndex === 2)
    {
        if (this.fallPath.isFollowing) {
            fallPath(this);
            this.fallPath.time -= 0.02;
            if (this.fallPath.time <= 0) {
                if (this.fallPath.anchor < fallPathAnchors.length - 1) {
                    this.fallPath.anchor++;
                    this.fallPath.time = fallPathTimes[this.fallPath.anchor];
                }
                else {
                    this.fallPath.isFollowing = false;
                }
            }
        }
        else
        {
            // Apply friction
            if (this.velocity.x > 0) {
                this.velocity.x = Math.max(this.velocity.x - this.friction, 0);
            }

            if (this.velocity.x < 0) {
                this.velocity.x = Math.min(this.velocity.x + this.friction, 0);
            }

            // Apply gravity
            this.velocity.y += this.gravity;
        }
    }
    else
    {
        this.velocity.x += gameController.wind.speed;

        if (this.velocity.x >= this.maxHorVelocity)
        {
            this.velocity.x = this.maxHorVelocity;
        }

        if (this.velocity.x <= -this.maxHorVelocity)
        {
            this.velocity.x = -this.maxHorVelocity;
        }

        // Apply friction
        if (this.velocity.x > 0) {
            this.velocity.x = Math.max(this.velocity.x - this.friction, 0);
        }

        if (this.velocity.x < 0) {
            this.velocity.x = Math.min(this.velocity.x + this.friction, 0);
        }

        this.velocity.y += this.gravity;
    }

    // Make sure the objects don't fall through the ground
    if (this.y + this.velocity.y + this.height / 2 >= this.floorPosition)
    {
        this.missedFallingObject(this.id);
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
    }

    // When the objects are caught by the basket
    // Only allow objects to be caught when colliding with the top of the basket.
    if (this.y + this.velocity.y + this.height / 2 >= this.basket.y &&
        this.y + this.velocity.y + this.height / 2 <= this.basket.y + 20 &&
        this.x >= this.basket.x - this.basket.width / 2 &&
        this.x <= this.basket.x + this.basket.width / 2)
    {
        if (this.type === "garbage")
        {
            switch (this.imageIndex)
            {
                // Recycling
                case 0:
                case 1:
                    if (this.basket.sprite.index === 0)
                    {
                        gameController.wave.sortedCorrectly++;
                    }
                    else
                    {
                        gameController.wave.sortedIncorrectly++;
                    }
                    break;
                // Paper
                case 3:
                    if (this.basket.sprite.index === 1)
                    {
                        gameController.wave.sortedCorrectly++;
                    }
                    else
                    {
                        gameController.wave.sortedIncorrectly++;
                    }
                    break;
                // Waste
                case 2:
                case 4:
                    if (this.basket.sprite.index === 2)
                    {
                        gameController.wave.sortedCorrectly++;
                    }
                    else
                    {
                        gameController.wave.sortedIncorrectly++;
                    }
                    break;
                default: break;
            }
            gameController.wave.collected++;
        }
        else
        {
            // Powerups
        }
        this.caughtFallingObject(this.id);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x >= 1280)
    {
        this.x = 1280;
    }

    if (this.x <= 0)
    {
        this.x = 0;
    }
}

FallingObject.prototype.draw = function(ctx)
{    
    
    ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2);
};

module.exports = FallingObject;


},{"./GameController":8}],5:[function(require,module,exports){
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

// function FallingObjectManager()
// {
//     FallingObjectManager.prototype.fallingObjectSprites = [
//         {
//             // Small falling objects
//             image: new Image(),
//             length: 5, // How many different sprites there are in the spritesheet
//             size: [[8, 10], [8, 16], [14, 12], [10, 10], [8, 6]]    // The width/height of the sprites, by a factor of 1/3
//                                                                     // (not including white-space).
//         },
//         {
//             // Powerups
//             image: new Image(),
//             length: 2,
//             size: [[16, 16], [16, 16]]
//         },
//         // {
//         //     image: new Image(),
//         //     length: 2
//         // },
//         // {
//         //     image: new Image(),
//         //     length: 2
//         // }
//     ];
//     FallingObjectManager.prototype.fallingObjectsArray = {};      // Contains all the visible falling objects in the game
//     FallingObjectManager.prototype.spawnTimer = 0;

//     // Binds
//     this.start = this.start.bind(this);
//     this.stop = this.stop.bind(this);
//     this.resetSpawnTimer = this.resetSpawnTimer.bind(this);
//     this.missedFallingObject = this.missedFallingObject.bind(this);
//     this.caughtFallingObject = this.caughtFallingObject.bind(this);
//     this.createFallingObject = this.createFallingObject.bind(this);

//     // Image sources
//     this.fallingObjectSprites[0].image.src = smallFallingObjectSprites;
//     this.fallingObjectSprites[1].image.src = powerupsSprites;

//     // Add the start/stop methods to the gameController
//     gameController.start = this.start;
//     gameController.stop = this.stop;
// };

// /**
//  * Starts the wave
//  */
// FallingObjectManager.prototype.start = function()
// {
//     if (!gameController.wave.isRunning)
//     {
//         gameController.wave.isRunning = true;
//         this.resetSpawnTimer();
//     }
// }

// /**
//  * Stops the wave
//  */
// FallingObjectManager.prototype.stop = function()
// {
    
// }

// /**
//  * Resets the timer with a random time
//  */
// FallingObjectManager.prototype.resetSpawnTimer = function()
// {
//     const { maxTime, minTime } = gameController.wave;
//     FallingObjectManager.prototype.spawnTimer = Math.random() * (maxTime - minTime) + minTime;
// }

// /**
//  * Removes a falling object by its id
//  * @param {id} String The id of the falling object
//  */
// FallingObjectManager.prototype.missedFallingObject = function(id)
// {
    
// }

// /**
//  * When the object was successfully caught
//  */
// FallingObjectManager.prototype.caughtFallingObject = function(id)
// {
    
// }

// // Method for creating the falling objects
// FallingObjectManager.prototype.createFallingObject = function()
// {
//     let type = (Math.floor(Math.random() * 15) === 0 ? "powerup" : "garbage"); // 1/15 chance of being a powerup
//     let sprite = this.fallingObjectSprites[type === "powerup" ? 1 : 0];
//     let spriteIndex = Math.floor(Math.random() * sprite.length);
//     let width = sprite.size[spriteIndex][0] * 3;
//     let height = sprite.size[spriteIndex][1] * 3;
//     let x;
//     if (type === "garbage" && spriteIndex === 2)
//     {
//         // To keep the plastic bag from going off screen
//         x = Math.random() * (980 - 300) + 300;
//     }
//     else
//     {
//         // For everyting else
//         x = Math.random() * (1280 - 128) + 128;
//     }
   
//     let flip = (Math.floor((Math.random() * 2)) === 0) ? true : false;

//     let id = Date.now();

//     let image = document.createElement("canvas").getContext("2d");
//     image.canvas.width = width;
//     image.canvas.height = height;
    
//     if (flip)
//     {
//         image.scale(-1, 1);             // Flip the image
//         image.translate(-width, 0);     // Offset because of the flip
//     }
//     image.drawImage(
//         sprite.image,
//         spriteIndex * 48 + (48 - width) / 2,
//         (48 - height) / 2,
//         width,
//         height,
//         0,
//         0,
//         width,
//         height
//     );

//     let obj = new FallingObject(`${id}`, x, width, height, flip, image.canvas, spriteIndex, type)
//     // Add the destroy/caught method to the prototype
//     if (obj.destroy === undefined || obj.caughtFallingObject)
//     {
//         obj.addCallbacks(this.missedFallingObject, this.caughtFallingObject);
//     }

//     // Add the object to the array
//     this.fallingObjectsArray[`${id}`] = obj;
    
//     // Increament the amount spawned during the wave
//     gameController.wave.spawned++;
// }
    
// FallingObjectManager.prototype.update = function()
// {
//     for (let i in this.fallingObjectsArray)
//     {
//         this.fallingObjectsArray[i].update(this.removeFallingObject);
//     }

//     // Stop spawning
//     if (this.fallingObjectsArray.length >= 10 && this.timer !== null)
//     {
//         clearInterval(this.timer);
//         this.timer = null;
//     }

//     // Update the timer
//     if (gameController.wave.isRunning  && !gameController.isPaused)
//     {
//         FallingObjectManager.prototype.spawnTimer -= 0.02; // 1s / 50frames
//         if (this.spawnTimer <= 0) {
//             // Create the fallling object
//             if (gameController.wave.spawned < gameController.wave.max)
//             {
//                 this.createFallingObject();
//                 this.resetSpawnTimer();
//             }
//             else
//             {
//                 // Wait until all the falling objects are gone before displaying
//                 // the wave stats
//                 if (Object.keys(this.fallingObjectsArray).length <= 0)
//                 {
//                     this.stop();
//                 }
//             }
//         }
//     }

// };

// FallingObjectManager.prototype.draw = function(ctx){

//     for (let i in this.fallingObjectsArray)
//     {
//         this.fallingObjectsArray[i].draw(ctx);
//     }
    
// }

// module.exports = FallingObjectManager;
},{"./Config":3,"./FallingObject.js":4,"./GUI":6,"./GameController":8}],6:[function(require,module,exports){
/**
 * Manages the GUI.
 */

const { gameController } = require("./GameController");
const healthBarFrameSprite = "/src/assets/art/health-bar0.png";
const healthBarSprite = "/src/assets/art/health-bar1.png";

const gameUI = document.getElementsByClassName("game__ui")[0];

const sprite = {
    healthBarFrame: {
        image: new Image(),
        width: 472,
        height: 20
    },
    healthBar: {
        image: new Image(),
        width: 440,
        height: 12
    }
}

// Add the image sources
sprite.healthBarFrame.image.src = healthBarFrameSprite;
sprite.healthBar.image.src = healthBarSprite;

const gui = {
    drawText: function(ctx, text, x, y) {
        ctx.font = "32px MatchupPro";
        ctx.textAlign = "center";
        ctx.fillStyle = "#272736"
        ctx.fillText(text, x + 3, y + 3);
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
    },
    draw: function(ctx) {

        // Health bar frame
        ctx.drawImage(
            sprite.healthBarFrame.image,
            0,
            0,
            sprite.healthBarFrame.width,
            sprite.healthBarFrame.height,
            640 - sprite.healthBarFrame.width / 2,
            700 - sprite.healthBarFrame.height / 2,
            sprite.healthBarFrame.width,
            sprite.healthBarFrame.height
        );

        // Health bar
        ctx.drawImage(
            sprite.healthBar.image,
            0,
            0,
            sprite.healthBar.width,
            sprite.healthBar.height,
            640 - sprite.healthBar.width / 2,
            700 - sprite.healthBar.height / 2,
            sprite.healthBar.width * gameController.wave.cropQuality,
            sprite.healthBar.height
        )

        // Crop quality
        this.drawText(ctx, `CROP QUALITY: ${gameController.wave.cropQuality * 100}%`, 640, 680);
    },
    displayUI: function(type) {
        switch (type)
        {
            case "pause":
                document.getElementsByClassName("pause-menu")[0].style.display = "flex";
                break;
            case "wave":
                document.getElementsByClassName("wave-stats")[0].style.display = "flex";

                // Update the stats
                document.getElementById("wave-stats__collected").innerHTML = gameController.wave.collected;
                document.getElementById("wave-stats__missed").innerHTML = gameController.wave.missed;
                document.getElementById("wave-stats__sorted-correctly").innerHTML = `${Math.floor(gameController.wave.sortedCorrectly / gameController.wave.collected * 100)}%`;
                document.getElementById("wave-stats__crop-quality").innerHTML = `${gameController.wave.cropQuality * 100}%`;
                document.getElementById("wave-stats__money-earned").innerHTML = gameController.wave.moneyEarned < 0 ? `-$${Math.abs(gameController.wave.moneyEarned)}` : `$${gameController.wave.moneyEarned}`;
                document.getElementById("wave-stats__new-balance").innerHTML = gameController.money < 0 ? `-$${Math.abs(gameController.money)}` : `$${gameController.money}`;

                break;
            default: break;
        }
        gameController.isPaused = true;
        gameUI.style.display = "flex";
    },
    stopDisplayingUI: function(type) {
        switch (type)
        {
            case "pause":
                document.getElementsByClassName("pause-menu")[0].style.display = "none";
                break;
            case "wave":
                document.getElementsByClassName("wave-stats")[0].style.display = "none";
                gameController.nextWave();
                break;
            default: break;
        }
        gameController.isPaused = false;
        gameUI.style.display = "none";
    }
};

exports.gui = gui;

// function GUI() {
//     GUI.prototype.sprite = {
//         healthBarFrame: {
//             image: new Image(),
//             width: 472,
//             height: 20
//         },
//         healthBar: {
//             image: new Image(),
//             width: 440,
//             height: 12
//         }
//     }

//     this.sprite.healthBarFrame.image.src = healthBarFrameSprite;
//     this.sprite.healthBar.image.src = healthBarSprite;

//     // Bind methods
//     this.drawText = this.drawText.bind(this);
// }

// GUI.prototype.canvas = document.getElementsByClassName("game__ui")[0];      // The <div> element for adding gui guiElements to.

// GUI.prototype.draw = function(ctx)
// {
//     // Health bar frame
//     ctx.drawImage(
//         this.sprite.healthBarFrame.image,
//         0,
//         0,
//         this.sprite.healthBarFrame.width,
//         this.sprite.healthBarFrame.height,
//         640 - this.sprite.healthBarFrame.width / 2,
//         700 - this.sprite.healthBarFrame.height / 2,
//         this.sprite.healthBarFrame.width,
//         this.sprite.healthBarFrame.height
//     );

//     // Health bar
//     ctx.drawImage(
//         this.sprite.healthBar.image,
//         0,
//         0,
//         this.sprite.healthBar.width,
//         this.sprite.healthBar.height,
//         640 - this.sprite.healthBar.width / 2,
//         700 - this.sprite.healthBar.height / 2,
//         this.sprite.healthBar.width * gameController.wave.cropQuality, // Modify this property to change health bar length
//         this.sprite.healthBar.height
//     )

//     // Crop quality
//     this.drawText(ctx, `CROP QUALITY: ${gameController.wave.cropQuality * 100}%`, 640, 680);
// }

// GUI.prototype.drawText = function(ctx, text, x, y)
// {
//     ctx.font = "32px MatchupPro";
//     ctx.textAlign = "center";
//     ctx.fillStyle = "#272736"
//     ctx.fillText(text, x + 3, y + 3);
//     ctx.fillStyle = "white";
//     ctx.fillText(text, x, y);
// }

// module.exports = GUI;
},{"./GameController":8}],7:[function(require,module,exports){
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
},{"./GameController":8,"./GameObjectManager":9,"./Keyboard":10,"./Render":12}],8:[function(require,module,exports){
/**
 * Handles the game stats such as money, crop quality, wave, etc and manages the flow of the game.
 */

exports.gameController = {
    isPaused: false,                            // Whether the game is paused
    money: 0,
    wave: {
        isRunning: false,                       // Whether a wave is running
        cropQuality: 1,                         // Crop quality for the current wave
        number: 1,                              // Wave number
        spawned: 0,                             // The amount of objects spawned
        max: 10,                                // The maximum amount of objects allowed to spawn during the wave
        collected: 0,                           // The amount of objects the player collected succesfully
        missed: 0,                              // The objects the player missed,
        moneyEarned: 0,                         // The money earned during the round
        sortedCorrectly: 0,                     // Garbage that has been sorted
        sortedIncorrectly: 0,                   // Garbage that has been incorrectly sorted.
        maxTime: 3,                             // The max spawn time for falling objects
        minTime: 1,                             // The min spawn time for falling objects
    },
    wind: {
        speed: 0,                             // The wind speed in the game
        timer: 0
    },
    calculateMoneyEarned: function() {
        // This is an arbitrary formula
        this.wave.moneyEarned = Math.floor((100 - this.wave.missed - this.wave.sortedIncorrectly + this.wave.collected) * this.wave.cropQuality * 100) / 100;
        this.money += this.wave.moneyEarned;
    },
    nextWave: function() {                      // Goes to the next wave
        // Reset the wave values
        this.wave.number++;
        this.wave.cropQuality = 1;
        this.wave.spawned = 0;
        this.wave.max = Math.floor(this.wave.max + this.wave.max / 2);
        this.wave.collected = 0;
        this.wave.missed = 0;
        this.wave.moneyEarned = 0;
        this.wave.sortedCorrectly = 0;
        this.wave.sortedIncorrectly = 0;
    },
    update: function() {
        // Wind speed
        if (this.wave.isRunning)
        {
            this.wind.timer -= 0.02;
            if (this.wind.timer <= 0) {
                this.wind.timer = Math.random() * (10 - 4) + 4;
                let noWind = Math.floor(Math.random() * 5) <= 2 ? true : false;
                if (noWind) {
                    this.wind.speed = 0;
                }
                else {
                    this.wind.speed = (Math.random() * (0.6 - 0.4) + 0.4) * (Math.floor(Math.random() * 2) === 0 ? -1 : 1);
                }
            }
        }
    }
}
},{}],9:[function(require,module,exports){
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
},{"./Basket":1,"./Camera":2,"./FallingObjectManager":5,"./Player":11,"./Render":12,"./WeatherVane":14}],10:[function(require,module,exports){
const keyboard = {
    left: 0,
    right: 0,
    down: 0,
    up: 0,
    use: 0,
    scrollLeft: 0,
    scrollRight: 0,
    reset: function() {
        this.use = 0;
        this.scrollLeft = 0;
        this.scrollRight = 0;
    }
}

exports.keyboard = keyboard;
},{}],11:[function(require,module,exports){
const { config } = require("./Config");
const { keyboard } = require("./Keyboard");
const { gameController } = require("./GameController");
const playerSprite = "./src/assets/art/player.png";

const player = {
    x: config.baseWidth / 2,
    y: config.floorHeight,
    width: 48,
    height: 48,
    velocity: {
        x: 0,
        y: 0
    },
    maxHVelocity: 8,
    acceleration: 0.9,
    friction: 0.4,
    gravity: 1,
    jumpSpeed: 15,
    isGrounded: true,
    sprite: {
        image: new Image(),
        dir: 0, // 0 = right, 1 = left
        rowIndex: 0, // y
        columnIndex: 0, // x
        animationSpeed: 0.1,
        size: [4, 4, 6, 6] // The size of the row (starting from the top)
    },
    init: function() {
        this.sprite.image.src = playerSprite;
    },
    update: function() {
        const { left, right, up } = keyboard;

        const horDirection = right - left;

        this.applyFriction();

        // Apply horizontal acceleration to the player
        this.velocity.x += horDirection * this.acceleration;
        this.velocity.y += this.gravity;

        if (this.velocity.x >= this.maxHVelocity || this.velocity.x <= -this.maxHVelocity) {
            this.velocity.x = this.maxHVelocity * horDirection;
        }

        if (this.y + this.height / 2 + 2 >= config.floorHeight) {
            this.velocity.y -= up * this.jumpSpeed;
        }

        // Make sure the player doesn't pass the floor
        if (this.y + this.height / 2 + this.velocity.y >= config.floorHeight) {
            this.velocity.y = 0;
            this.y = config.floorHeight - this.height / 2;
        }

        // Prevent the player from moving to the right of the screen
        if (this.x + this.velocity.x >= config.baseWidth) {
            this.x = 1280;
            this.velocity.x = 0;
        }

        // Prevent the player from move all the way to the left dduring the main game
        if (this.x + this.velocity.x <= 0 && gameController.wave.isRunning) {
            this.x = 0;
            this.velocity.x = 0;
        }

        // Update the player's position
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Change the sprite according to the player's current state
        if (horDirection !== 0) {
            this.sprite.dir = (horDirection === 1 ? 0 : 1);
        }

        if (this.velocity.x) {
            this.sprite.rowIndex = 2 + this.sprite.dir;
            this.sprite.animationSpeed = 0.3;
        }
        else {
            this.sprite.rowIndex = 0 + this.sprite.dir;
            this.sprite.animationSpeed = 0.1;
        }

        // Animate the player
        this.animateSprite();
    },
    draw: function(ctx) {
        ctx.drawImage(
            this.sprite.image,
            Math.floor(this.sprite.columnIndex) * this.width,
            this.sprite.rowIndex * this.height,
            this.width,
            this.height,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    },
    applyFriction: function() {
        if (this.velocity.x > 0) {
            this.velocity.x = Math.max(this.velocity.x - this.friction, 0);
        }

        if (this.velocity.x < 0) {
            this.velocity.x = Math.min(this.velocity.x + this.friction, 0);
        }
    },
    animateSprite: function() {
        this.sprite.columnIndex = (this.sprite.columnIndex + this.sprite.animationSpeed) % this.sprite.size[this.sprite.rowIndex];
    }
}

player.init();

exports.player = player;
},{"./Config":3,"./GameController":8,"./Keyboard":10}],12:[function(require,module,exports){
const { camera } = require("./Camera.js");
const { config } = require("./Config");
const { gui } = require("./GUI.js");

const mainBackground = "./src/assets/art/main-background.png";
const interludeBackground = "./src/assets/art/interlude-background.png";

// Holds reference to the canvas element and handles rendering the game objects to the canvas

const render = {
    canvas: undefined,
    ctx: undefined,
    renderable: [],
    unrenderable: [],
    backgroundRenderable: {
        main: new Image(),
        interlude: new Image()
    },
    init: function() {
        // Get the canvas element
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

        // Canvas properties
        this.ctx.imageSmoothingEnabled = false;
        this.canvas.width = config.baseWidth;
        this.canvas.height = config.baseHeight;

        this.resizeGame();

        this.backgroundRenderable.main.src = mainBackground;
        this.backgroundRenderable.interlude.src = interludeBackground;

    },
    draw: function() {
        this.ctx.translate(-camera.x, 0);
        if (camera.x > -config.baseWidth) {
            this.ctx.drawImage(this.backgroundRenderable.main, 0, 0);
        }

        if (camera.player.x <= 0) {
            this.ctx.drawImage(this.backgroundRenderable.interlude, -config.baseWidth, 0);
        }

        this.ctx.translate(camera.x, 0);

        for (let i = 0; i < this.renderable.length; i++) {
            this.ctx.translate(-camera.x, 0);
            this.renderable[i].draw(this.ctx);
            this.ctx.translate(camera.x, 0);
        }

        gui.draw(this.ctx);
    },
    resizeGame: function() {
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;
        let aspectRatio = config.baseWidth / config.baseHeight;

        let game = document.getElementsByClassName("game")[0];

        // Scale the canvas so that it's always the same aspect ratio
        if (winHeight * aspectRatio > winWidth) {
            game.style.width = winWidth + "px";
            game.style.height = winWidth / aspectRatio + "px";
        }
        else {
            game.style.width = winHeight * aspectRatio + "px";
            game.style.height = winHeight + "px";
        }
    }
}

render.init();

exports.render = render;
},{"./Camera.js":2,"./Config":3,"./GUI.js":6}],13:[function(require,module,exports){
const screens = {
    mainMenu: "mainMenu",
    game: "game",
    settings: "settings",
}

const screenManager = {
    currentScreen: "mainMenu",
    path: "mainMenu",
    goTo: function(screen) {
        if (this.path !== "")
        {
            this.path += `/${screen}`;
        }
        else
        {
            this.path = screen;
        }
        this.currentScreen = screen;
    },
    pop: function(shouldIgnoreLastScreen = false) {
        let paths = this.path.split("/");

        // Make sure we don't pop off the last screen
        if (shouldIgnoreLastScreen || paths.length > 1)
        {
            this.path = "";
            // Add all the screens except for the last one
            for (let i = 0; i < paths.length - 1; i++) {
                this.path += paths[i] + (i !== paths.length - 2 ? "/" : "");
            }
            this.currentScreen = paths[paths.length - 2];
        }
    },
    popAndGoTo: function(screen) {
        this.pop(true);
        this.goTo(screen);
    },
    pathContains: function(screen) {
        let paths = this.path.split("/");
        for (let i = 0; i < paths.length; i++)
        {
            if (paths[i] === screen)
            {
                return true;
            }
        }
        return false;
    }
};

exports.screens = screens;
exports.screenManager = screenManager;
},{}],14:[function(require,module,exports){
const { config } = require("./Config");
const { gameController } = require("./GameController");
const weatherVaneSpriteSheet = "/src/assets/art/weather-vane.png";

const weatherVane = {
    x: 58,
    y: config.floorHeight - 48,
    width: 48,
    height: 96,
    sprite: {
        image: new Image(),
        rowIndex: 0, // y
        columnIndex: 0, // x
        animationSpeed: 1,
        dir: 1, // 1 = right, -1 = left
        size: [1, 1, 8, 8]
    },
    update: function() {
        if (gameController.wave.isRunning)
        {
            if (gameController.wind.speed > 0) {
                this.sprite.rowIndex = 2;
                this.sprite.dir = 1;
            }
            else if (gameController.wind.speed < 0) {
                this.sprite.rowIndex = 3;
                this.sprite.dir = -1;
            }
            else
            {
                if (this.sprite.dir === 1) {
                    this.sprite.rowIndex = 0;
                }
                else {
                    this.sprite.rowIndex = 1;
                }
            }
        }
        
        if (!gameController.wave.isRunning)
        {
            if (this.sprite.dir === 1)
            {
                this.sprite.rowIndex = 0;
            }
            else
            {
                this.sprite.rowIndex = 1;
            }
        }

        // Animation
        this.sprite.columnIndex = (this.sprite.columnIndex + this.sprite.animationSpeed * Math.abs(gameController.wind.speed)) % this.sprite.size[this.sprite.rowIndex];
    },
    draw: function(ctx) {
        ctx.drawImage(
            this.sprite.image,
            Math.floor(this.sprite.columnIndex) * this.width,
            Math.floor(this.sprite.rowIndex) * this.height,
            this.width,
            this.height,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }
};

weatherVane.sprite.image.src = weatherVaneSpriteSheet;

exports.weatherVane = weatherVane;
},{"./Config":3,"./GameController":8}],15:[function(require,module,exports){
/**
 * The "entry" file where the canvas is created and the different components
 * that make up the game (such as the Game, Render) are instantiated.
 * 
 * This code shouldn't be touched
 */

const { game } = require("./Game");
const { gameController } = require("./GameController");
const { gui } = require("./GUI");
const { keyboard } = require("./Keyboard");
const { render } = require("./Render");
const { screenManager, screens } = require("./ScreenManager");

window.addEventListener("load", () => {

    const cursor = document.getElementById("cursor");

    // Keyboard event listeners
    window.addEventListener("keypress", (ev) => {
        switch (ev.code) {
            case "KeyE":
                keyboard.use = 1;
                break;
            case "KeyJ":
                keyboard.scrollLeft = 1;
                break;
            case "KeyL":
                keyboard.scrollRight = 1;
                break;
            case "Escape":
                if (!gameController.isPaused) {
                    gui.displayUI("pause");
                }
                else {
                    if (screenManager.currentScreen === screens.game)
                    {
                        gui.stopDisplayingUI("pause");
                    }
                }
            default: break;
        }
    });

    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                keyboard.up = 1;
                break;
            case "KeyS":
            case "ArrowDown":
                keyboard.down = 1;
                break;
            case "KeyA":
            case "ArrowLeft":
                keyboard.left = 1;
                break;
            case "KeyD":
            case "ArrowRight":
                keyboard.right = 1;
                break;
        }
    });

    window.addEventListener("keyup", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                keyboard.up = 0;
                break;
            case "KeyS":
            case "ArrowDown":
                keyboard.down = 0;
                break;
            case "KeyA":
            case "ArrowLeft":
                keyboard.left = 0;
                break;
            case "KeyD":
            case "ArrowRight":
                keyboard.right = 0;
                break;
        }
    });
    // End of keyboard event listeners

    // Window event listeners
    // Game div element
    let gameElementRect = document.getElementsByClassName("game")[0].getBoundingClientRect();
    window.addEventListener("resize", () => {
        render.resizeGame();
        gameElementRect = document.getElementsByClassName("game")[0].getBoundingClientRect();
    });

    window.addEventListener("mousemove", (ev) => {
        cursor.style.left = ev.clientX - gameElementRect.left + "px";
        cursor.style.top = ev.clientY + gameElementRect.y + "px";
    });
    // End of window event listeners

    // Button event listeners
    // Main menu
    // When the play button is pressed
    document.getElementById("main-menu__play-btn").addEventListener("click", () => {
        document.getElementsByClassName("main-menu")[0].style["display"] = "none";
        document.getElementsByClassName("game__ui__wrapper")[0].style["display"] = "flex";
        document.querySelector("canvas").style["display"] = "block";
        screenManager.popAndGoTo(screens.game);
        game.start();
    });

    document.getElementById("main-menu__settings-btn").addEventListener("click", () => {
        document.getElementsByClassName("main-menu")[0].style["display"] = "none";
        document.getElementsByClassName("settings-menu")[0].style["display"] = "flex";
        screenManager.goTo(screens.settings);
    });

    // Settings menu
    // Back button
    document.getElementById("settings-menu__back-btn").addEventListener("click", () => {
        if (screenManager.pathContains(screens.game))
        {
            document.getElementsByClassName("game__ui__wrapper")[0].style["display"] = "flex";
            document.querySelector("canvas").style["display"] = "block";
        }

        if (screenManager.pathContains(screens.mainMenu))
        {
            document.getElementsByClassName("main-menu")[0].style["display"] = "flex";
        }

        document.getElementsByClassName("settings-menu")[0].style["display"] = "none";
        screenManager.pop();
    });

    // Pause menu
    document.getElementById("pause-menu__resume-btn").addEventListener("click", () => {
        gui.stopDisplayingUI("pause");
    });

    document.getElementById("pause-menu__settings-btn").addEventListener("click", () => {
        document.querySelector("canvas").style["display"] = "none";
        document.getElementsByClassName("game__ui__wrapper")[0].style["display"] = "none";
        document.getElementsByClassName("settings-menu")[0].style["display"] = "flex";
        screenManager.goTo(screens.settings);
    });

    document.getElementById("pause-menu__quit-btn").addEventListener("click", () => {
        document.querySelector("canvas").style["display"] = "none";
        document.getElementsByClassName("game__ui__wrapper")[0].style["display"] = "none";
        document.getElementsByClassName("main-menu")[0].style["display"] = "flex";
        screenManager.popAndGoTo(screens.mainMenu);
    });

    // Wave stats
    // Wave stats done button
    document.getElementById("wave-stats__done-btn").addEventListener("click", () => gui.stopDisplayingUI("wave"));
    // End of button event listeners

});
},{"./GUI":6,"./Game":7,"./GameController":8,"./Keyboard":10,"./Render":12,"./ScreenManager":13}]},{},[15]);
