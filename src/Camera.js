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
    this.zoomTimer = undefined;
    this.isZooming = false;
}

Camera.prototype.player = undefined;
Camera.prototype.x = 0;
Camera.prototype.y = 0;
Camera.prototype.zoom = 1;
Camera.prototype.state = STATE_GAME;

Camera.prototype.attach = function(player)
{
    this.player = player;
}

Camera.prototype.update = function()
{
    if (this.player.x < 0 && this.state === STATE_GAME)
    {
        this.state = STATE_INTERLUDE;
        this.zoom = 1.5;
    }
    else if (this.player.x > 0 && this.state === STATE_INTERLUDE)
    {
        this.state = STATE_GAME;
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
    }

    if (this.state === STATE_INTERLUDE)
    {
        this.x = this.player.x * this.zoom - this.render.baseWidth / 2;
        this.y = this.player.y * this.zoom - this.render.baseHeight / 1.5;
    }
}

module.exports = Camera;
