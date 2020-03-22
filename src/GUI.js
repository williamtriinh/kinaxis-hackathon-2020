/**
 * Manages the GUI.
 */

const { gameController } = require("./GameController");
const healthBarFrameSprite = "/src/assets/art/health-bar0.png";
const healthBarSprite = "/src/assets/art/health-bar1.png";

const gameUI = document.getElementsByClassName("game__ui")[0];

const sprite = {
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

// Add the image sources
sprite.healthBarFrame.image.src = healthBarFrameSprite;
sprite.healthBar.image.src = healthBarSprite;

const gui = {
    drawText: function(ctx, text, x, y) {
        ctx.font = "32px MatchupPro";
        ctx.textAlign = "center";
        ctx.fillStyle = "#272736"
        ctx.fillText(text, x + 3, y + 3);
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
    },
    draw: function(ctx) {

        // Health bar frame
        ctx.drawImage(
            sprite.healthBarFrame.image,
            0,
            0,
            sprite.healthBarFrame.width,
            sprite.healthBarFrame.height,
            640 - sprite.healthBarFrame.width / 2,
            700 - sprite.healthBarFrame.height / 2,
            sprite.healthBarFrame.width,
            sprite.healthBarFrame.height
        );

        // Health bar
        ctx.drawImage(
            sprite.healthBar.image,
            0,
            0,
            sprite.healthBar.width,
            sprite.healthBar.height,
            640 - sprite.healthBar.width / 2,
            700 - sprite.healthBar.height / 2,
            sprite.healthBar.width * gameController.wave.cropQuality,
            sprite.healthBar.height
        )

        // Crop quality
        this.drawText(ctx, `CROP QUALITY: ${gameController.wave.cropQuality * 100}%`, 640, 680);
    },
    displayUI: function(type) {
        switch (type)
        {
            case "menu":
                break;
            case "wave":
                document.getElementsByClassName("wave-stats")[0].style.display = "flex";

                // Update the stats
                document.getElementById("wave-stats__collected").innerHTML = gameController.wave.collected;
                document.getElementById("wave-stats__missed").innerHTML = gameController.wave.missed;
                document.getElementById("wave-stats__sorted-correctly").innerHTML = Math.floor(gameController.wave.sortedCorrectly / gameController.wave.max * 10) / 10;
                document.getElementById("wave-stats__crop-quality").innerHTML = gameController.wave.cropQuality * 100 + "%";
                document.getElementById("wave-stats__money-earned").innerHTML = gameController.wave.moneyEarned < 0 ? `-$${Math.abs(gameController.wave.moneyEarned)}` : `$${gameController.wave.moneyEarned}`;
                document.getElementById("wave-stats__new-balance").innerHTML = gameController.money < 0 ? `-$${Math.abs(gameController.money)}` : `$${gameController.money}`;

                break;
            default: break;
        }
        gameController.isPaused = true;
        gameUI.style.display = "flex";
    },
    stopDisplayingUI: function(type) {
        switch (type)
        {
            case "menu":
                break;
            case "wave":
                document.getElementsByClassName("wave-stats")[0].style.display = "none";
                gameController.nextWave();
                break;
            default: break;
        }
        gameController.isPaused = false;
        gameUI.style.display = "none";
    }
};

exports.gui = gui;

// function GUI() {
//     GUI.prototype.sprite = {
//         healthBarFrame: {
//             image: new Image(),
//             width: 472,
//             height: 20
//         },
//         healthBar: {
//             image: new Image(),
//             width: 440,
//             height: 12
//         }
//     }

//     this.sprite.healthBarFrame.image.src = healthBarFrameSprite;
//     this.sprite.healthBar.image.src = healthBarSprite;

//     // Bind methods
//     this.drawText = this.drawText.bind(this);
// }

// GUI.prototype.canvas = document.getElementsByClassName("game__ui")[0];      // The <div> element for adding gui guiElements to.

// GUI.prototype.draw = function(ctx)
// {
//     // Health bar frame
//     ctx.drawImage(
//         this.sprite.healthBarFrame.image,
//         0,
//         0,
//         this.sprite.healthBarFrame.width,
//         this.sprite.healthBarFrame.height,
//         640 - this.sprite.healthBarFrame.width / 2,
//         700 - this.sprite.healthBarFrame.height / 2,
//         this.sprite.healthBarFrame.width,
//         this.sprite.healthBarFrame.height
//     );

//     // Health bar
//     ctx.drawImage(
//         this.sprite.healthBar.image,
//         0,
//         0,
//         this.sprite.healthBar.width,
//         this.sprite.healthBar.height,
//         640 - this.sprite.healthBar.width / 2,
//         700 - this.sprite.healthBar.height / 2,
//         this.sprite.healthBar.width * gameController.wave.cropQuality, // Modify this property to change health bar length
//         this.sprite.healthBar.height
//     )

//     // Crop quality
//     this.drawText(ctx, `CROP QUALITY: ${gameController.wave.cropQuality * 100}%`, 640, 680);
// }

// GUI.prototype.drawText = function(ctx, text, x, y)
// {
//     ctx.font = "32px MatchupPro";
//     ctx.textAlign = "center";
//     ctx.fillStyle = "#272736"
//     ctx.fillText(text, x + 3, y + 3);
//     ctx.fillStyle = "white";
//     ctx.fillText(text, x, y);
// }

// module.exports = GUI;