//require FallingObjects faile to draw objects
const FallingObject = require("./FallingObject.js");

// creating the array
// let FallingObjectArray = new Array;
// if true then it is a array 
//FallingObjectArray.constructor === Array;

function FallingObjectManager()
{

    //number of objects you want
    // let num = 10;
    this.fallingObjectsArray = [];

    // // looping number of objects
    // for(i = 0; i < num; i++){
    //     // adding elements to the array
    //     // random x position 
    //     FallingObjectArray[i] = new FallingObject(Math.floor(Math.random() * window.innerWidth - 50));
    // }

    this.createFallingObject = this.createFallingObject.bind(this);

    this.createFallingObject();

    this.timer = setInterval(this.createFallingObject, 3000);
};

FallingObjectManager.prototype.createFallingObject = function()
{
    let width = 50;
    let height = 50;
    let x = Math.random() * window.innerWidth - width;
    this.fallingObjectsArray.push(new FallingObject(x, width, height));
}
    
FallingObjectManager.prototype.update = function()
{
    // Update the falling objects
    for (let i = 0; i < this.fallingObjectsArray.length; i++)
    {
        this.fallingObjectsArray[i].update();
    }

    // Stop spawning
    if (this.fallingObjectsArray.length >= 10 && this.timer !== null)
    {
        clearInterval(this.timer);
        this.timer = null;
    }
    //funciton for updating the objects position
    // function up(i){
    //     FallingObjectArray[i].update()
    // }

    // loop for all the objects
    // for(i = 0; i < FallingObjectArray.length; i++){
    //     setTimeout(up, i * 2000 + 2000, i); // when i * 2 seconds plus 2 seconds then run gravity
    // }

};

FallingObjectManager.prototype.draw = function(ctx){

    // draw all the objects
    for(i = 0; i < this.fallingObjectsArray.length; i++){
        this.fallingObjectsArray[i].draw(ctx)        
    }
    
}
module.exports = FallingObjectManager;  
