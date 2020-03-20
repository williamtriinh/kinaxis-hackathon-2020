/**
 * Manages the GUI.
 */

const { gameController } = require("./GameController");
const healthBarFrameSprite = "/src/assets/art/health-bar0.png";
const healthBarSprite = "/src/assets/art/health-bar1.png";

function GUI() {
    GUI.prototype.sprite = {
        healthBarFrame: {
            image: new Image(),
            width: 472,
            height: 20
        },
        healthBar: {
            image: new Image(),
            width: 440,
            height: 12
        }
    }

    this.sprite.healthBarFrame.image.src = healthBarFrameSprite;
    this.sprite.healthBar.image.src = healthBarSprite;

    // Bind methods
    this.drawText = this.drawText.bind(this);
}

// GUI.prototype.cropQuality = 1;
GUI.prototype.canvas = document.getElementsByClassName("game__ui")[0];      // The <div> element for adding gui guiElements to.
// Old code
// GUI.prototype.wave = document.getElementById("wave-indicator");
// GUI.prototype.health = document.getElementById("health-bar__bar");

GUI.prototype.draw = function(ctx)
{
    // Health bar frame
    ctx.drawImage(
        this.sprite.healthBarFrame.image,
        0,
        0,
        this.sprite.healthBarFrame.width,
        this.sprite.healthBarFrame.height,
        640 - this.sprite.healthBarFrame.width / 2,
        700 - this.sprite.healthBarFrame.height / 2,
        this.sprite.healthBarFrame.width,
        this.sprite.healthBarFrame.height
    );

    // Health bar
    ctx.drawImage(
        this.sprite.healthBar.image,
        0,
        0,
        this.sprite.healthBar.width,
        this.sprite.healthBar.height,
        640 - this.sprite.healthBar.width / 2,
        700 - this.sprite.healthBar.height / 2,
        this.sprite.healthBar.width * gameController.cropQuality, // Modify this property to change health bar length
        this.sprite.healthBar.height
    )

    // Crop quality
    this.drawText(ctx, `CROP QUALITY: ${gameController.cropQuality * 100}%`, 640, 680);
}

/**
 * Changes the health of the crops
 * @param {x} int from 0.0 to 1.0 
 */
GUI.prototype.updateHealth = function(x)
{
    GUI.prototype.cropQuality -= 0.001;
}

GUI.prototype.drawText = function(ctx, text, x, y)
{
    ctx.font = "32px MatchupPro";
    ctx.textAlign = "center";
    ctx.fillStyle = "#272736"
    ctx.fillText(text, x + 3, y + 3);
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
}

module.exports = GUI;