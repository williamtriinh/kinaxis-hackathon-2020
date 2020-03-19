/**
 * Manages the GUI.
 */
function GUI() {}

GUI.prototype.healthValue = 0;
GUI.prototype.wave = document.getElementById("wave-indicator");
GUI.prototype.health = document.getElementById("health-bar__bar");

/**
 * Changes the health of the crops
 * @param {x} int from 0.0 to 1.0 
 */
GUI.prototype.updateHealth = function(x)
{
    this.health.style.webkitClipPath = `inset(0 ${100 * x}% 0 0)`;
    GUI.prototype.healthValue += 0.001;
}

module.exports = GUI;