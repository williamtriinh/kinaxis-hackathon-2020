//require FallingObjects faile to draw objects
const FallingObject = require("./FallingObject.js");

function FallingObjectManager()
{

    this.floor = window.innerHeight;
};

FallingObjectManger.prototype.update = function()
{
    
    FallingObject.update();
};

module.exports = FallingObjectManager;
