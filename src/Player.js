function Player(keyboard)
{
    this.x = 200;
    this.y = 200;
    this.width = 50;
    this.height = 50;
    this.hSpeed = 0;
    this.vSpeed = 0;
    this.gravity = 1;
    this.moveSpeed = 5;
    this.jumpSpeed = 20;
    this.floorPosition = 400; // The height at which the "floor" is
    this.keyboard = keyboard;
};

Player.prototype.update = function()
{
    const { left, right, up } = this.keyboard;
    this.hSpeed = (right - left) * this.moveSpeed;

    if (this.y < this.floorPosition)
    {
        this.vSpeed += this.gravity; // gravity
    }
    else
    {
        this.vSpeed = 0;
    }

    if (this.y >= this.floorPosition)
    {
        this.vSpeed -= this.jumpSpeed * up;
    }

    this.x += this.hSpeed;
    this.y += this.vSpeed;
}

Player.prototype.draw = function(ctx)
{
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
};

module.exports = Player;