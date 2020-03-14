function Player(keyboard)
{
    this.x = 200;
    this.y = 200;
    this.width = 50;
    this.height = 50;
    this.velocity = {
        x: 0,
        y: 0
    }
    this.maxHVelocity = 6;
    this.acceleration = 0.8;
    this.friction = 0.4;
    this.gravity = 1;
    this.jumpSpeed = 20;
    this.floorPosition = 400; // The height at which the "floor" is
    this.keyboard = keyboard;

    this.applyFriction = this.applyFriction.bind(this);
};

Player.prototype.applyFriction = function()
{
    if (this.velocity.x > 0)
    {
        this.velocity.x = Math.max(this.velocity.x - this.friction, 0);
    }
    
    if (this.velocity.x < 0)
    {
        this.velocity.x = Math.min(this.velocity.x + this.friction, 0);
    }
}

Player.prototype.update = function()
{
    const { left, right, up } = this.keyboard;

    this.applyFriction();

    if (this.velocity.x < this.maxHVelocity)
    {
        this.velocity.x += right * this.acceleration;
    }
    else
    {
        this.velocity.x = this.maxHVelocity;
    }

    if (this.velocity.x > -this.maxHVelocity)
    {
        this.velocity.x -= left * this.acceleration;
    }
    else
    {
        this.velocity.x = -this.maxHVelocity;
    }

    //  Apply gravity when the player is not grounded
    if (this.y < this.floorPosition)
    {
        this.velocity.y += this.gravity; // gravity
    }
    else
    {
        this.velocity.y = 0;
    }

    // Allow the player to jump when they're grounded
    if (this.y >= this.floorPosition)
    {
        this.velocity.y -= this.jumpSpeed * up;
    }

    // Update the player's position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

Player.prototype.draw = function(ctx)
{
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
};

module.exports = Player;