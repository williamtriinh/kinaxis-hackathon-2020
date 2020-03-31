const { config } = require("./Config");
const { gameController } = require("./GameController");

/**
 * Handles the "camera"
 */

const cameraStates = {
    GAME: 0,            // The falling object part of the game
    INTERLUDE: 1        // The "pause" between the waves for preparing for waves
}

const camera = {
    player: undefined,     // The player object
    x: 0,
    y: 0,
    state: cameraStates.GAME,
    attach: function(obj) {
        this.player = obj;
    },
    update: function() {
        if (this.player.x >= 0) {
            this.state = cameraStates.GAME;
            this.x = 0;
            this.y = 0;
        }

        if (!gameController.wave.isRunning && this.player.x < 0) {
            this.x = this.player.x - config.baseWidth / 2;
            this.y = this.player.y - config.baseHeight / 1.5;

            if (this.x <= -config.baseWidth) {
                this.x = -config.baseWidth;
            }
        }
    }
}

exports.camera = camera;
