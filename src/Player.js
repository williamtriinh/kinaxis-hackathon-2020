const { config } = require("./Config");
const { keyboard } = require("./Keyboard");
const { gameController } = require("./GameController");
const playerSprite = "./src/assets/art/player.png";

const player = {
    x: config.baseWidth / 2,
    y: config.floorHeight,
    width: 48,
    height: 48,
    velocity: {
        x: 0,
        y: 0
    },
    maxHVelocity: 8,
    acceleration: 0.9,
    friction: 0.4,
    gravity: 1,
    jumpSpeed: 15,
    isGrounded: true,
    sprite: {
        image: new Image(),
        dir: 0, // 0 = right, 1 = left
        rowIndex: 0, // y
        columnIndex: 0, // x
        animationSpeed: 0.1,
        size: [4, 4, 6, 6] // The size of the row (starting from the top)
    },
    init: function() {
        this.sprite.image.src = playerSprite;
    },
    update: function() {
        const { left, right, up } = keyboard;

        const horDirection = right - left;

        this.applyFriction();

        // Apply horizontal acceleration to the player
        this.velocity.x += horDirection * this.acceleration;
        this.velocity.y += this.gravity;

        if (this.velocity.x >= this.maxHVelocity || this.velocity.x <= -this.maxHVelocity) {
            this.velocity.x = this.maxHVelocity * horDirection;
        }

        if (this.y + this.height / 2 + 2 >= config.floorHeight) {
            this.velocity.y -= up * this.jumpSpeed;
        }

        // Make sure the player doesn't pass the floor
        if (this.y + this.height / 2 + this.velocity.y >= config.floorHeight) {
            this.velocity.y = 0;
            this.y = config.floorHeight - this.height / 2;
        }

        // Prevent the player from moving to the right of the screen
        if (this.x + this.velocity.x >= config.baseWidth) {
            this.x = 1280;
            this.velocity.x = 0;
        }

        // Prevent the player from move all the way to the left dduring the main game
        if (this.x + this.velocity.x <= 0 && gameController.wave.isRunning) {
            this.x = 0;
            this.velocity.x = 0;
        }

        // Update the player's position
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Change the sprite according to the player's current state
        if (horDirection !== 0) {
            this.sprite.dir = (horDirection === 1 ? 0 : 1);
        }

        if (this.velocity.x) {
            this.sprite.rowIndex = 2 + this.sprite.dir;
            this.sprite.animationSpeed = 0.3;
        }
        else {
            this.sprite.rowIndex = 0 + this.sprite.dir;
            this.sprite.animationSpeed = 0.1;
        }

        // Animate the player
        this.animateSprite();
    },
    draw: function(ctx) {
        ctx.drawImage(
            this.sprite.image,
            Math.floor(this.sprite.columnIndex) * this.width,
            this.sprite.rowIndex * this.height,
            this.width,
            this.height,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    },
    applyFriction: function() {
        if (this.velocity.x > 0) {
            this.velocity.x = Math.max(this.velocity.x - this.friction, 0);
        }

        if (this.velocity.x < 0) {
            this.velocity.x = Math.min(this.velocity.x + this.friction, 0);
        }
    },
    animateSprite: function() {
        this.sprite.columnIndex = (this.sprite.columnIndex + this.sprite.animationSpeed) % this.sprite.size[this.sprite.rowIndex];
    }
}

player.init();

exports.player = player;