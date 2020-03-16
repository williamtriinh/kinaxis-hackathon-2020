/** 
 * Handles all camera related actions
 * 
 * @param {player} Player object
 */

const STATE_GAME = 0;               // The falling object part of the game
const STATE_INTERLUDE = 1;          // The "pause" between the waves for preparing for waves

function Camera(render)
{
    this.render = render;
    // this.x = 0;
    // this.y = 0;
    // this.zoom = 1;
    this.state = STATE_GAME;
}

Camera.prototype.player = undefined;
Camera.prototype.x = 0;
Camera.prototype.y = 0;

Camera.prototype.attach = function(player)
{
    this.player = player;
}

Camera.prototype.update = function()
{
    if (this.player.x < 0 && this.state === STATE_GAME)
    {
        this.state = STATE_INTERLUDE;
    }
    else if (this.player.x > 0 && this.state === STATE_INTERLUDE)
    {
        this.x = 0;
        this.state = STATE_GAME;
    }

    if (this.state === STATE_INTERLUDE)
    {
        this.x = this.player.x - this.render.baseWidth / 2;
    }
}

module.exports = Camera;
