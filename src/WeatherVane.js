const { config } = require("./Config");
const { gameController } = require("./GameController");
const weatherVaneSpriteSheet = "/src/assets/art/weather-vane.png";

const weatherVane = {
    x: 58,
    y: config.floorHeight - 48,
    width: 48,
    height: 96,
    sprite: {
        image: new Image(),
        rowIndex: 0, // y
        columnIndex: 0, // x
        animationSpeed: 1,
        dir: 1, // 1 = right, -1 = left
        size: [1, 1, 8, 8]
    },
    update: function() {
        if (gameController.wave.isRunning)
        {
            if (gameController.wind.speed > 0) {
                this.sprite.rowIndex = 2;
                this.sprite.dir = 1;
            }
            else if (gameController.wind.speed < 0) {
                this.sprite.rowIndex = 3;
                this.sprite.dir = -1;
            }
            else
            {
                if (this.sprite.dir === 1) {
                    this.sprite.rowIndex = 0;
                }
                else {
                    this.sprite.rowIndex = 1;
                }
            }
        }
        
        if (!gameController.wave.isRunning)
        {
            if (this.sprite.dir === 1)
            {
                this.sprite.rowIndex = 0;
            }
            else
            {
                this.sprite.rowIndex = 1;
            }
        }

        // Animation
        this.sprite.columnIndex = (this.sprite.columnIndex + this.sprite.animationSpeed * Math.abs(gameController.wind.speed)) % this.sprite.size[this.sprite.rowIndex];
    },
    draw: function(ctx) {
        ctx.drawImage(
            this.sprite.image,
            Math.floor(this.sprite.columnIndex) * this.width,
            Math.floor(this.sprite.rowIndex) * this.height,
            this.width,
            this.height,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }
};

weatherVane.sprite.image.src = weatherVaneSpriteSheet;

exports.weatherVane = weatherVane;