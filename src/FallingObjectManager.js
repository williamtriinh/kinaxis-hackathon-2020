//require FallingObjects faile to draw objects
const FallingObject = require("./FallingObject.js");
var myarray = [];

function FallingObjectManager()
{
    //for(i = 0; i < 10; i++){
        // adding elements to the array
        myarray[0] = new FallingObject(300);
        myarray[1] = new FallingObject(200);
        myarray[2] = new FallingObject(100);

};

FallingObjectManager.prototype.update = function()
{   
    i = 0
    setTimeout(() => { myarray[0].update(ctx)}, 2000);      

        //setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);

};

FallingObjectManager.prototype.draw = function(ctx){

    setTimeout(() => { myarray[0].draw(ctx)}, 2000);      
    // i = 0;
    // while(i < 3){
    //     setInterval(myarray[i].draw(ctx), 2000);   
    //     console.log(i);
    //     i++;
    // }
    
}
module.exports = FallingObjectManager;  
