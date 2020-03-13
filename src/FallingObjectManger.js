
const FallingObjects = require("./FallingObjects.js");
function FallingObjectManger(){

    this.floor = window.innerHeight;
};

FallingObjectManger.prototype.update = function(){
    FallingObjects.update();
};

module.exports = FallingObjectManger;
