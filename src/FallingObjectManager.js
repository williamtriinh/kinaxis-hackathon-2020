//require FallingObjects faile to draw objects
const FallingObject = require("./FallingObject.js");
var myarray = [];

function FallingObjectManager()
{
    for(i = 0; i < 10; i++){
        // adding elements to the array
        myarray[i] = new FallingObject(Math.floor(Math.random() * window.innerWidth - 50) - 50);
        
    }
};

FallingObjectManager.prototype.update = function()
{
    setTimeout(function () { myarray[i].update(); i++}, 2000);
};

FallingObjectManager.prototype.draw = function(ctx){
    i = 0;
    setTimeout(function () { myarray[i].draw(ctx); i++}, 2000);
    
}
module.exports = FallingObjectManager;
