/**
 * Manages the GUI.
 */
function GUI() {}

GUI.prototype.healthValue = 0;
GUI.prototype.canvas = document.getElementsByClassName("game__ui")[0];      // The <div> element for adding gui guiElements to.
GUI.prototype.wave = document.getElementById("wave-indicator");
GUI.prototype.health = document.getElementById("health-bar__bar");
GUI.prototype.guiElements = {};

/**
 * Changes the health of the crops
 * @param {x} int from 0.0 to 1.0 
 */
GUI.prototype.updateHealth = function(x)
{
    this.health.style.clipPath = `inset(0 ${100 * x}% 0 0)`;
    this.health.style.webkitClipPath = `inset(0 ${100 * x}% 0 0)`;
    GUI.prototype.healthValue += 0.001;
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