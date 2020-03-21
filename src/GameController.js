/**
 * Handles the game stats such as money, crop quality, wave, etc and manages the flow of the game.
 */

exports.gameController = {
    isPaused: false,                            // Whether the game is paused
    money: 0,
    wave: {
        isRunning: false,                       // Whether a wave is running
        cropQuality: 1,                         // Crop quality for the current wave
        number: 1,                              // Wave number
        spawned: 0,                             // The amount of objects spawned
        max: 10,                                // The maximum amount of objects allowed to spawn during the wave
        collected: 0,                           // The amount of objects the player collected succesfully
        missed: 0,                              // The objects the player missed,
        moneyEarned: 0,                         // The money earned during the round
    },
    start: undefined,
    stop: undefined,
    calculateMoneyEarned: function() {
        // This is an arbitrary formula
        this.wave.moneyEarned = Math.floor((this.wave.collected * this.wave.cropQuality - this.wave.missed * 1.2) * 100) / 100;
        this.money += this.wave.moneyEarned;
    }
}