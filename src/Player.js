const sprite = "./src/assets/art/player.png";

function Player(keyboard)
{
    this.x = 384;           // Start the player at half the game width
    this.y = 0;
    this.width = 48;        // Should match the sprite width
    this.height = 48;
    this.velocity = {
        x: 0,
        y: 0
    }
    this.maxHVelocity = 6;
    this.acceleration = 0.8; // Applied to the horizontal only
    this.friction = 0.4;
    this.gravity = 1;
    this.jumpSpeed = 15;
    this.isGrounded = true;
    this.floorPosition = 720; // The height at which the "floor" is
    this.keyboard = keyboard;

    this.sprite = {
        image: new Image(),
        dir: 0, // 0 = right, 1 = left
        rowIndex: 0, // y
        columnIndex: 0, // x
        animationSpeed: 0.1,
        size: [4, 4, 6, 6] // The size of the row (starting from the top)
    }

    this.sprite.image.src = sprite;

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

// Handles animating the sprite (by changing the index)
Player.prototype.animate = function()
{
    this.sprite.columnIndex = (this.sprite.columnIndex + this.sprite.animationSpeed) % this.sprite.size[this.sprite.rowIndex];
}

Player.prototype.update = function()
{
    const { left, right, up } = this.keyboard;

    const horDirection = right - left;

    this.applyFriction();

    // Apply horizontal acceleration to the player
    this.velocity.x += horDirection * this.acceleration;

    if (this.velocity.x >= this.maxHVelocity || this.velocity.x <= -this.maxHVelocity)
    {
        this.velocity.x = this.maxHVelocity * horDirection;
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

    // Change the sprite according to the player's current state
    if (horDirection !== 0)
    {
        this.sprite.dir = (horDirection === 1 ? 0 : 1);
    }

    if (this.velocity.x) {
        this.sprite.rowIndex = 2 + this.sprite.dir;
        this.sprite.animationSpeed = 0.25;
    }
    else {
        this.sprite.rowIndex = 0 + this.sprite.dir;
        this.sprite.animationSpeed = 0.1;
    }

    // Animate the player
    this.animate();
}

Player.prototype.draw = function(ctx)
{
    // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
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
};

module.exports = Player;