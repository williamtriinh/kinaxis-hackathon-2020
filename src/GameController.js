/**
 * Handles the game stats such as money, crop quality, wave, etc and manages the flow of the game.
 */

exports.gameController = {
    cropQuality: 1,
    money: 0,
    wave: {
        number: 1,                  // Wave number
        collected: {
            total: 0,               // Total objects collected
            missed: 0,              // Objects that were not caught
        },
    }
}