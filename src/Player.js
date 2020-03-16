function Player(keyboard)
{
    this.x = 320;           // Start the player at half the game width
    this.y = 0;
    this.width = 16;
    this.height = 16;
    this.velocity = {
        x: 0,
        y: 0
    }
    this.maxHVelocity = 6;
    this.acceleration = 0.8; // Applied to the horizontal only
    this.friction = 0.4;
    this.gravity = 1;
    this.jumpSpeed = 15;
    this.floorPosition = 360; // The height at which the "floor" is
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
    if (this.y + this.height / 2 < this.floorPosition)
    {
        this.velocity.y += this.gravity; // gravity
    }
    else
    {
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
    }

    // Allow the player to jump when they're grounded
    if (this.y + this.height / 2 + 1 >= this.floorPosition)
    {
        this.velocity.y -= this.jumpSpeed * up;
    }

    // Update the player's position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

Player.prototype.draw = function(ctx)
{
    if (this.x >= 0)
    {
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    else
    {
        ctx.fillRect(320, this.y - this.height / 2, this.width, this.height);   
    }
};

module.exports = Player;