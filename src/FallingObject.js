function FallingObject(x)
{
        
    this.x = x;
    this.y = 100;

    // speed/gravity
    this.velocity = {
        x: 0,
        y: 0
    }
    this.gravity = 1;
};

FallingObject.prototype.update = function()
{
    // if the object is not touching the bottom use gravity to bring it down
    if(this.y < 720 - 64 - 50){

        // exponential gravity
        this.velocity.y += this.gravity;

        // adding gracity plus speed of the object to drag it down
        this.y += this.velocity.y;

        // look at gravity and it changes through console
        // console.log(this.gravity);
    }
    else
    {
        this.y = 720 - 64 - 50;
    }
    this.x += this.velocity.x;
}

FallingObject.prototype.draw = function(ctx)
{    
    ctx.fillRect(this.x, this.y, 50, 50);

};

module.exports = FallingObject;

