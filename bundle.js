(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function FallingObject()
{
        
    this.x = 100;
    this.y = 100;

    // speed/gravity
    this.velocity = {
        x: 0,
        y: 0
    }
    this.gravity = 1;
};

FallingObject.prototype.update = function()
{
    // if the object is not touching the bottom use gravity to bring it down
    if(this.y < window.innerHeight - 50){

        // exponential gravity
        this.velocity.y += this.gravity;

        // adding gracity plus speed of the object to drag it down
        this.y += this.velocity.y;

        // look at gravity and it changes through console
        // console.log(this.gravity);
    }
    this.x += this.velocity.x;
}

FallingObject.prototype.draw = function(ctx)
{    
    ctx.fillRect(this.x, this.y, 50, 50);

};

module.exports = FallingObject;


},{}],2:[function(require,module,exports){
//require FallingObjects faile to draw objects
const FallingObject = require("./FallingObject.js");

function FallingObjectManager()
{
    this.fallingObject = new FallingObject();
    this.floor = window.innerHeight;
};

FallingObjectManager.prototype.update = function()
{
    this.fallingObject.update();
};

FallingObjectManager.prototype.draw = function(ctx){
    this.fallingObject.draw(ctx);

}
module.exports = FallingObjectManager;

},{"./FallingObject.js":1}],3:[function(require,module,exports){
/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */

function Game(render, player, keyboard, fallingObjectsManager)
{
    this.render = render;
    this.player = player;
    this.keyboard = keyboard;
    this.fallingObjectsManager = fallingObjectsManager;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);
    this.render.renderable.push(this.player);
    this.render.renderable.push(this.fallingObjectsManager);
    loopId = setInterval(this.update, 1000 / 60);
};

Game.prototype.update = function()
{
    this.player.update();
    this.fallingObjectsManager.update();
    this.render.draw();
};

module.exports = Game;
},{}],4:[function(require,module,exports){
function Keyboard()
{
    // These values will be either 0 or 1.
}

Keyboard.prototype.left = 0;
Keyboard.prototype.right = 0;
Keyboard.prototype.down = 0;
Keyboard.prototype.up = 0;

module.exports = Keyboard;
},{}],5:[function(require,module,exports){
function Player(keyboard)
{
    this.x = 200;
    this.y = 200;
    this.width = 50;
    this.height = 50;
    this.velocity = {
        x: 0,
        y: 0
    }
    this.maxHVelocity = 6;
    this.acceleration = 0.8; // Applied to the horizontal only
    this.friction = 0.4;
    this.gravity = 1;
    this.jumpSpeed = 20;
    this.floorPosition = 400; // The height at which the "floor" is
    this.keyboard = keyboard;

    this.applyFriction = this.applyFriction.bind(this);
};

Player.prototype.applyFriction = function()
{
    if (this.velocity.x > 0)
    {
        this.velocity.x = Math.max(this.velocity.x - this.friction, 0);
    }
    
    if (this.velocity.x < 0)
    {
        this.velocity.x = Math.min(this.velocity.x + this.friction, 0);
    }
}

Player.prototype.update = function()
{
    const { left, right, up } = this.keyboard;

    this.applyFriction();

    if (this.velocity.x < this.maxHVelocity)
    {
        this.velocity.x += right * this.acceleration;
    }
    else
    {
        this.velocity.x = this.maxHVelocity;
    }

    if (this.velocity.x > -this.maxHVelocity)
    {
        this.velocity.x -= left * this.acceleration;
    }
    else
    {
        this.velocity.x = -this.maxHVelocity;
    }

    //  Apply gravity when the player is not grounded
    if (this.y < this.floorPosition)
    {
        this.velocity.y += this.gravity; // gravity
    }
    else
    {
        this.velocity.y = 0;
    }

    // Allow the player to jump when they're grounded
    if (this.y >= this.floorPosition)
    {
        this.velocity.y -= this.jumpSpeed * up;
    }

    // Update the player's position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

Player.prototype.draw = function(ctx)
{
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
};

module.exports = Player;
},{}],6:[function(require,module,exports){
/**
 * Constructor function that handles rendering objects.
 * This code shouldn't be touched.
 * 
 * @param {Canvas} canvas
 * @param {Context} ctx
 */

function Render(canvas, ctx)
{
    this.canvas = canvas;
    this.ctx = ctx;
    this.renderable = [];       // The objects that should be drawn to the screen.
    this.unrenderable = [];     // The objects that shouldn't be drawn to the screen.
}

Render.prototype.draw = function()
{
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.renderable.length; i++)
    {
        this.renderable[i].draw(this.ctx);
    }
}

module.exports = Render;
},{}],7:[function(require,module,exports){
/**
 * The "entry" file where the canvas is created and the different components
 * that make up the game (such as the Game, Render) are instantiated.
 * 
 * This code shouldn't be touched
 */

const Game = require("./Game.js");
const Render = require("./Render.js");
const Player = require("./Player.js");
const Keyboard = require("./Keyboard.js");
const FallingObjectManager = require("./FallingObjectManager.js")

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", () => {

    // Initialize the canvas properties
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);
    const keyboard = new Keyboard();
    const player = new Player(keyboard);
    const render = new Render(canvas, ctx);
    const fallingObjectsManager = new FallingObjectManager();
    const game = new Game(render, player, keyboard, fallingObjectsManager);

    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "KeyW":
                keyboard.up = 1;
                break;
            case "KeyS":
                keyboard.down = 1;
                break;
            case "KeyA":
                keyboard.left = 1;
                break;
            case "KeyD":
                keyboard.right = 1;
                break;
        }
    });

    window.addEventListener("keyup", (ev) => {
        switch (ev.code) {
            case "KeyW":
                keyboard.up = 0;
                break;
            case "KeyS":
                keyboard.down = 0;
                break;
            case "KeyA":
                keyboard.left = 0;
                break;
            case "KeyD":
                keyboard.right = 0;
                break;
        }
    });
    
    game.init();

});
},{"./FallingObjectManager.js":2,"./Game.js":3,"./Keyboard.js":4,"./Player.js":5,"./Render.js":6}]},{},[7]);
