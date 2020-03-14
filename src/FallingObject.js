function FallingObject()
{
        
    this.posX = 100;
    this.posY = 100;

    // speed/gravity
    this.gravity = 0.005;
    this.gravitySpeed = 0.5;
    this.speed = 5;
};

FallingObject.prototype.update = function()
{
    // if the object is not touching the bottom use gravity to bring it down
    if(this.posY < window.innerHeight - 50){

        // exponential gravity
        this.gravity += this.posY * 0.0002

        // adding gracity plus speed of the object to drag it down
        this.posY += this.speed + this.gravity; 

        // look at gravity and it changes through console
        // console.log(this.gravity);
    }
}

FallingObject.prototype.draw = function(ctx)
{    
    ctx.fillRect(this.posX, this.posY, 50, 50);

};

module.exports = FallingObject;

