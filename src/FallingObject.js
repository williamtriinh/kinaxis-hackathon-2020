const Basket = require("./Basket");
const { gameController } = require("./GameController");

const basket = new Basket();

/**
 * 
 * @param {int} id 
 * @param {float} x 
 * @param {float} width 
 * @param {float} height 
 * @param {Canvas} image 
 * @param {int} imageIndex
 * @param {String} type     The falling object type: "garbage" or "powerup"
 */
function FallingObject(id, x, width, height, image, imageIndex, type)
{
    // parameter x will be random
    this.id = id;
    this.x = x;
    this.y = -height;
    this.width = width;
    this.height = height;
    this.image = image;
    this.imageIndex = imageIndex;
    this.type = type;

    // speed/gravity
    this.velocity = {
        x: 0,
        y: 0
    }

    //low gravity
    FallingObject.prototype.gravity = .03;
    FallingObject.prototype.floorPosition = 720 - 64;

    FallingObject.prototype.missedFallingObject = undefined;
    FallingObject.prototype.caughtFallingObject = undefined;

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
    // Constantly apply gravity
    this.velocity.y += this.gravity;

    // Make sure the objects don't fall through the ground
    if (this.y + this.velocity.y + this.height / 2 >= this.floorPosition)
    {
        this.missedFallingObject(this.id);
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
    }

    // When the objects are caught by the basket
    // Only allow objects to be caught when colliding with the top of the basket.
    if (this.y + this.velocity.y + this.height / 2 >= basket.y &&
        this.y + this.velocity.y + this.height / 2 <= basket.y + 20 &&
        this.x >= basket.x - basket.width / 2 &&
        this.x <= basket.x + basket.width / 2)
    {
        if (this.type === "garbage")
        {
            switch (this.imageIndex)
            {
                // Recycling
                case 0:
                case 1:
                    if (basket.sprite.index === 0)
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
                    if (basket.sprite.index === 1)
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
                    if (basket.sprite.index === 2)
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
}

FallingObject.prototype.draw = function(ctx)
{    
    // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2);
};

module.exports = FallingObject;

