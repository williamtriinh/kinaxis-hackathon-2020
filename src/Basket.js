const GUI = require("./GUI.js");
const Keyboard = require("./Keyboard");
const basketsSprite = "/src/assets/art/baskets.png";

const gui = new GUI();
const keyboard = new Keyboard();

function Basket() {

    Basket.prototype.x = 640;
    Basket.prototype.y = 720 - 24;
    Basket.prototype.height = 48;
    Basket.prototype.width = 48;
    Basket.prototype.floor = 720 - 64 - this.height / 2;

    Basket.prototype.isCarried = false;
    Basket.prototype.isNearby = false;          // Whether the player is near the container.
    Basket.prototype.sprite = {
        image: new Image(),
        index: 0,   // Which basket we're using
        length: 3   // How many sprites there are
    }
    
    this.sprite.image.src = basketsSprite;

    Basket.prototype.player = undefined;
}

// Add player to this basket instance
Basket.prototype.attach = function(player)
{
    Basket.prototype.player = player;
}

Basket.prototype.update = function () {

    if (keyboard.use === 1)
    {
        // checking position of this.x to see if in range and this.y to see if I can pick up the basket
        if (this.player.x > this.x - this.width && this.player.x < this.x + this.width)
        {
            Basket.prototype.isCarried = !this.isCarried;
        }
    }

    if (keyboard.scrollLeft === 1)
    {
        this.sprite.index--;
        if (this.sprite.index < 0)
        {
            this.sprite.index = this.sprite.length - 1;
        }
    }

    if (keyboard.scrollRight === 1)
    {
        this.sprite.index = (this.sprite.index + 1) % 3;
    }

    if (this.isCarried)
    {
        // Follow the player
        Basket.prototype.x = this.player.x;
        Basket.prototype.y = this.player.y - this.player.height;
    }
    else
    {
        // Stay on the ground
        Basket.prototype.y = this.floor;
    }
    
}


Basket.prototype.draw = function (ctx) {

    // Display the ui indicator
    if (this.player.x > this.x - this.width && this.player.x < this.x + this.width && !this.isCarried)
    {
        gui.drawText(ctx, "PRESS 'E' TO BEGIN WAVE!", this.x, this.y - this.height);
    }

    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
        this.sprite.image,
        this.sprite.index * this.width,
        0,
        this.width,
        this.height,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
    );
}

module.exports = Basket;