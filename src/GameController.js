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
        sortedCorrectly: 0,                     // Garbage that has been sorted
        sortedIncorrectly: 0,                   // Garbage that has been incorrectly sorted.
        maxTime: 3,                             // The max spawn time for falling objects
        minTime: 1,                             // The min spawn time for falling objects
    },
    start: undefined,
    stop: undefined,
    calculateMoneyEarned: function() {
        // This is an arbitrary formula
        this.wave.moneyEarned = Math.floor((100 - this.wave.missed - this.wave.sortedIncorrectly + this.wave.collected) * this.wave.cropQuality * 100) / 100;
        this.money += this.wave.moneyEarned;
    },
    nextWave: function() {                      // Goes to the next wave
        // Reset the wave values
        this.wave.number++;
        this.wave.cropQuality = 1;
        this.wave.spawned = 0;
        this.wave.max = Math.floor(this.wave.max + this.wave.max / 2);
        this.wave.collected = 0;
        this.wave.missed = 0;
        this.wave.moneyEarned = 0;
        this.wave.sortedCorrectly = 0;
        this.wave.sortedIncorrectly = 0;
    }
}