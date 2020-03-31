const { config } = require("./Config");
const { fallingObjectManagerStart } = require("./FallingObjectManager");
const { gameController } = require("./GameController");
const { gui } = require("./GUI.js");
const { keyboard } = require("./Keyboard");
const { player } = require("./Player");

const basketSprites = "/src/assets/art/baskets.png";

const basket = {
    x: config.baseWidth / 2,
    y: config.baseHeight - 24,
    width: 48,
    height: 48,
    isCarried: false,
    isNearby: false,
    sprite: {
        image: new Image(),
        index: 0,   // Which basket we're using: 0 = blue, 1 = black, 2 = garbage
        length: 3   // How many sprites there are in this sprite sheet
    },
    init: function() {
        this.sprite.image.src = basketSprites;
    },
    update: function() {
        if (keyboard.use === 1 && !this.isCarried && !gameController.isPaused) {
            // checking position of this.x to see if in range and this.y to see if I can pick up the basket
            if (player.x > this.x - this.width && player.x < this.x + this.width) {
                // Begin the wave
                this.isCarried = true;
                fallingObjectManagerStart();
            }
        }

        if (!gameController.wave.isRunning && this.isCarried) {
            this.isCarried = false;
        }

        if (this.isCarried) {
            // Follow the player
            this.x = player.x;
            this.y = player.y - player.height;

            if (keyboard.scrollLeft === 1) {
                this.sprite.index--;
                if (this.sprite.index < 0) {
                    this.sprite.index = this.sprite.length - 1;
                }
            }

            if (keyboard.scrollRight === 1) {
                this.sprite.index = (this.sprite.index + 1) % 3;
            }
        }
        else {
            // Stay on the ground
            this.y = config.floorHeight - this.height / 2;
            this.x = config.baseWidth / 2;
        }
    },
    draw: function(ctx) {
        // Display the ui indicator
        if (player.x > this.x - this.width && player.x < this.x + this.width && !this.isCarried && !gameController.isPaused) {
            gui.drawText(ctx, `PRESS 'E' TO BEGIN WAVE ${gameController.wave.number}!`, this.x, this.y - this.height);
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
};

basket.init();

exports.basket = basket;