const GUI = require("./GUI.js");
const basketsSprite = "/src/assets/art/baskets.png";

const gui = new GUI();

function Basket(player, keyboard) {

    this.x = 640;
    this.y = 720 - 24;
    this.height = 48;
    this.width = 48;
    this.floor = 720 - 64 - this.height / 2;

    Basket.prototype.isCarried = false;
    Basket.prototype.isNearby = false;          // Whether the player is near the container.
    Basket.prototype.sprite = {
        image: new Image(),
        index: 0,   // Which basket we're using
        length: 3   // How many sprites there are
    }
    
    this.sprite.image.src = basketsSprite;

    this.player = player;
    this.keyboard = keyboard;
}

Basket.prototype.update = function () {

    if (this.keyboard.use === 1)
    {
        // checking position of this.x to see if in range and this.y to see if I can pick up the basket
        if (this.player.x > this.x - this.width && this.player.x < this.x + this.width)
        {
            Basket.prototype.isCarried = !this.isCarried;
        }
    }

    if (this.keyboard.scrollLeft === 1)
    {
        this.sprite.index--;
        if (this.sprite.index < 0)
        {
            this.sprite.index = this.sprite.length - 1;
        }
    }

    if (this.keyboard.scrollRight === 1)
    {
        this.sprite.index = (this.sprite.index + 1) % 3;
    }

    if (this.isCarried)
    {
        // Follow the player
        this.x = this.player.x;
        this.y = this.player.y - this.player.height;
    }
    else
    {
        // Stay on the ground
        this.y = this.floor;
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