const { gameController } = require("./GameController");
const FallingObject = require("./FallingObject.js");
const smallFallingObjectSprites = "/src/assets/art/small-falling-objects.png";
const powerupsSprites = "/src/assets/art/powerups.png";

function FallingObjectManager()
{
    FallingObjectManager.prototype.fallingObjectSprites = [
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
    ];
    //     small: {
    //         image: new Image(),
    //         length: 5, // How many different sprites there are in the spritesheet
    //         size: [[8, 10], [8, 16], [14, 12], [10, 10], [8, 6]]    // The width/height of the sprites
    //                                                                 // (not including white-space)
    //     },
    //     large: {
    //         image: new Image(),
    //         length: 2
    //     },
    //     powerups: {
    //         image: new Image(),
    //         length: 2
    //     },
    //     powerdowns: {
    //         image: new Image(),
    //         length: 2
    //     }
    // }
    FallingObjectManager.prototype.fallingObjectsArray = {};      // Contains all the visible falling objects in the game

    // Binds
    this.missedFallingObject = this.missedFallingObject.bind(this);
    this.caughtFallingObject = this.caughtFallingObject.bind(this);
    this.createFallingObject = this.createFallingObject.bind(this);

    // Image sources
    this.fallingObjectSprites[0].image.src = smallFallingObjectSprites;
    this.fallingObjectSprites[1].image.src = powerupsSprites;

    // Create the initial falling object and begin the timer
};

FallingObjectManager.prototype.start = function()
{
    this.createFallingObject();
    setTimeout(this.createFallingObject, Math.random() * (5000 - 4000) + 4000);
}

/**
 * Removes a falling object by its id
 * @param {id} String The id of the falling object
 */
FallingObjectManager.prototype.missedFallingObject = function(id)
{
    delete this.fallingObjectsArray[id];
    gameController.cropQuality = Math.floor(gameController.cropQuality * 100 - 1) / 100;
    if (gameController.cropQuality <= 0)
    {
        gameController.cropQuality = 0;
    }
    gameController.wave.collected.missed++;
}

/**
 * When the object was successfully caught
 */
FallingObjectManager.prototype.caughtFallingObject = function(id)
{
    delete this.fallingObjectsArray[id];
    gameController.wave.collected.total++;
}

// Method for creating the falling objects
FallingObjectManager.prototype.createFallingObject = function()
{
    let bePowerup = (Math.floor(Math.random() * 15) === 0 ? true : false); // 1/15 chance of being a powerup
    let sprite = this.fallingObjectSprites[bePowerup ? 1 : 0];
    let spriteIndex = Math.floor(Math.random() * sprite.length);
    let width = sprite.size[spriteIndex][0] * 3;
    let height = sprite.size[spriteIndex][1] * 3;
    let x = Math.random() * (1280 - width);
    let flip = (Math.floor((Math.random() * 2)) === 0) ? true : false;

    let id = Date.now();

    let image = document.createElement("canvas").getContext("2d");
    image.canvas.width = width;
    image.canvas.height = height;
    
    if (flip)
    {
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

    let obj = new FallingObject(`${id}`, x, width, height, image.canvas)
    // Add the destroy/caught method to the prototype
    if (obj.destroy === undefined || obj.caughtFallingObject)
    {
        obj.addCallbacks(this.missedFallingObject, this.caughtFallingObject);
    }

    this.fallingObjectsArray[`${id}`] = obj;

    if (Object.keys(this.fallingObjectsArray).length <= 10)
        setTimeout(this.createFallingObject, Math.random() * (5000 - 4000) + 4000);
}
    
FallingObjectManager.prototype.update = function()
{
    // Update the falling objects
    // for (let i = 0; i < this.fallingObjectsArray.length; i++)
    // {
    //     this.fallingObjectsArray[i].update();
    // }
    for (let i in this.fallingObjectsArray)
    {
        this.fallingObjectsArray[i].update(this.removeFallingObject);
    }

    // Stop spawning
    if (this.fallingObjectsArray.length >= 10 && this.timer !== null)
    {
        clearInterval(this.timer);
        this.timer = null;
    }

};

FallingObjectManager.prototype.draw = function(ctx){

    // draw all the objects
    // for(i = 0; i < this.fallingObjectsArray.length; i++){
    //     this.fallingObjectsArray[i].draw(ctx)        
    // }
    for (let i in this.fallingObjectsArray)
    {
        this.fallingObjectsArray[i].draw(ctx);
    }
    
}

module.exports = FallingObjectManager;