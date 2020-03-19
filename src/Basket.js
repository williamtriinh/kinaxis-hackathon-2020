function Basket(player) {

    this.x = window.innerWidth - 200;
    this.y = 586;
    this.height = 70;
    this.width = 20;

    this.floor = 586;
    
    this.player = player
}

Basket.prototype.update = function () {

    window.addEventListener("keyup", (e) => {

        // checking position of this.x to see if in range and this.y to see if I can pick up the basket
        if (this.player.x > this.x - 200 && this.player.x < this.x + 200 
            && e.keyCode == 69 && this.y == this.floor) {
            this.y = this.player.y - this.player.height*2;

        }
        // if i can't pick it up can I place it down
        else if(this.y != this.floor && e.keyCode == 69){
            this.y = this.floor
        }
       
    }
    )
    
    // if player has picked up the object
    if(this.y != this.floor){

        // make sure it is always on top of him
        this.x = this.player.x;
        this.y = this.player.y - this.player.height*2;
    }
    
}


Basket.prototype.draw = function (ctx) {

            ctx.font = "20px Arial";

            // display font when player is in range of the basket
            if (this.player.x > this.x - 100 && this.player.x < this.x + 100 && this.y == this.floor) {
                ctx.fillText("Press e to Pick Up", this.x, 540);
            }

            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

module.exports = Basket;