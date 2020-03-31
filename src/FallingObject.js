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

