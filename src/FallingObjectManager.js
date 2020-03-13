//require FallingObjects faile to draw objects
const FallingObject = require("./FallingObject.js");

function FallingObjectManager()
{
    this.fallingObject = new FallingObject();
    this.floor = window.innerHeight;
};

FallingObjectManager.prototype.update = function()
{
    this.fallingObject.update();
};

FallingObjectManager.prototype.draw = function(ctx){
    this.fallingObject.draw(ctx);

}
module.exports = FallingObjectManager;
