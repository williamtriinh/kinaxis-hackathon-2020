(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */

function Game(render, player, keyboard, fallingObjects)
{
    this.render = render;
    this.player = player;
    this.keyboard = keyboard;
    this.fallingObjects = fallingObjects;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);

    this.render.renderable.push(this.player);
    this.render.renderable.push(this.fallingObjects);
    loopId = setInterval(this.update, 1000 / 60);
};

Game.prototype.update = function()
{
    this.player.update();
    this.fallingObjects.update();
    this.render.draw();
};

module.exports = Game;
},{}],2:[function(require,module,exports){
function Keyboard()
{
    // These values will be either 0 or 1.
}

Keyboard.prototype.left = 0;
Keyboard.prototype.right = 0;
Keyboard.prototype.down = 0;
Keyboard.prototype.up = 0;

module.exports = Keyboard;
},{}],3:[function(require,module,exports){
function Player(keyboard)
{
    this.x = 200;
    this.y = 200;
    this.width = 50;
    this.height = 50;
    this.hSpeed = 0;
    this.vSpeed = 0;
    this.gravity = 1;
    this.moveSpeed = 5;
    this.jumpSpeed = 20;
    this.floorPosition = 400; // The height at which the "floor" is
    this.keyboard = keyboard;
};

Player.prototype.update = function()
{
    const { left, right, up } = this.keyboard;
    this.hSpeed = (right - left) * this.moveSpeed;

    if (this.y < this.floorPosition)
    {
        this.vSpeed += this.gravity; // gravity
    }
    else
    {
        this.vSpeed = 0;
    }

    if (this.y >= this.floorPosition)
    {
        this.vSpeed -= this.jumpSpeed * up;
    }

    this.x += this.hSpeed;
    this.y += this.vSpeed;
}

Player.prototype.draw = function(ctx)
{
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
};

module.exports = Player;
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
function fallingObject()
{
    //creating random placements of object
    // random generation
    let randX = Math.floor(Math.random() * (window.innerWidth -1)) + 1;

    this.posX = randX;
    this.posY = 100;

    // speed/gravity
    this.gravity = 0.005;
    this.gravitySpeed = 0.5;
    this.speed = 5;
};

fallingObject.prototype.update = function()
{
    if(this.posY < window.innerHeight-50){
        this.gravity += this.posY * 0.0002
        this.posY += this.speed + this.gravity; 
        console.log(this.gravity);
    }
}

fallingObject.prototype.draw = function(ctx)
{
    ctx.fillRect(this.posX, this.posY, 50, 50);
};

module.exports = fallingObject;


},{}],6:[function(require,module,exports){
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
const FallingObjects = require("./fallingObjects.js");

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
    const fallingObjects = new FallingObjects();
    const render = new Render(canvas, ctx);
    const game = new Game(render, player, keyboard, fallingObjects);

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
},{"./Game.js":1,"./Keyboard.js":2,"./Player.js":3,"./Render.js":4,"./fallingObjects.js":5}]},{},[6]);
