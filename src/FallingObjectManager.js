const FallingObject = require("./FallingObject.js");
const smallFallingObjectSprites = "/src/assets/art/small-falling-objects.png";
const powerupsSprites = "/src/assets/art/powerups.png";

function FallingObjectManager()
{
    this.fallingObjectSprites = [
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
    this.fallingObjectsArray = [];      // Contains all the visible falling objects in the game

    // Binds
    this.createFallingObject = this.createFallingObject.bind(this);

    // Image sources
    this.fallingObjectSprites[0].image.src = smallFallingObjectSprites;
    this.fallingObjectSprites[1].image.src = powerupsSprites;

    // Create the initial falling object and begin the timer
};

FallingObjectManager.prototype.start = function()
{
    this.createFallingObject();
    this.timer = setInterval(this.createFallingObject, 3000);
}

FallingObjectManager.prototype.createFallingObject = function()
{
    let sprite = this.fallingObjectSprites[Math.floor(Math.random() * this.fallingObjectSprites.length)];
    let spriteIndex = Math.floor(Math.random() * sprite.length);
    let width = sprite.size[spriteIndex][0] * 3;
    let height = sprite.size[spriteIndex][1] * 3;
    let x = Math.random() * (window.innerWidth - width);
    let flip = (Math.floor((Math.random() * 2)) === 0) ? true : false;

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
    this.fallingObjectsArray.push(new FallingObject(x, width, height, image.canvas));
}
    
FallingObjectManager.prototype.update = function()
{
    // Update the falling objects
    for (let i = 0; i < this.fallingObjectsArray.length; i++)
    {
        this.fallingObjectsArray[i].update();
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
    for(i = 0; i < this.fallingObjectsArray.length; i++){
        this.fallingObjectsArray[i].draw(ctx)        
    }
    
}
module.exports = FallingObjectManager;  
