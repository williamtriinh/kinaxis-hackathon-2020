function FallingObject(x, width, height)
{
    // parameter x will be random
    this.x = x;
    this.y = -height;
    this.width = width;
    this.height = height;

    // speed/gravity
    this.velocity = {
        x: 0,
        y: 0
    }

    //low gravity
    this.gravity = .03;
    this.floorPosition = 720 - 64;
};

FallingObject.prototype.update = function()
{
    // Constantly apply gravity
    this.velocity.y += this.gravity;

    // Make sure the objects don't fall through the ground
    if (this.y + this.height / 2 >= this.floorPosition)
    {
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

FallingObject.prototype.draw = function(ctx)
{    
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
};

module.exports = FallingObject;

