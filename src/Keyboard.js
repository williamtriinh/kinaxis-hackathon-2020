function Keyboard()
{
    // These values will be either 0 or 1.
}

Keyboard.prototype.left = 0;
Keyboard.prototype.right = 0;
Keyboard.prototype.down = 0;
Keyboard.prototype.up = 0;
Keyboard.prototype.use = 0;

Keyboard.prototype.reset = function() {
    this.use = 0;
}

module.exports = Keyboard;