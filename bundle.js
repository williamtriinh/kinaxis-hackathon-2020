(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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
    if(this.y < 700 - 50){

        // exponential gravity
        this.velocity.y += this.gravity;

        // adding gracity plus speed of the object to drag it down
        this.y += this.velocity.y;

        // look at gravity and it changes through console
        // console.log(this.gravity);
    }
    else
    {
        this.y = 720 - 50;
    }
    this.x += this.velocity.x;
}

FallingObject.prototype.draw = function(ctx)
{    
    ctx.fillRect(this.x, this.y, 50, 50);

};

module.exports = FallingObject;


},{}],3:[function(require,module,exports){
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

},{"./FallingObject.js":2}],4:[function(require,module,exports){
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
    this.camera = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);

    this.camera = this.render.camera;
    this.camera.attach(this.player);

    this.render.renderable.push(this.player);
    this.render.renderable.push(this.fallingObjectsManager);

    // Begin the update loop
    loopId = setInterval(this.update, 1000 / 50);
};

Game.prototype.update = function()
{
    this.player.update();
    this.camera.update();
    this.fallingObjectsManager.update();
    this.render.draw();
};

module.exports = Game;
},{}],5:[function(require,module,exports){
function Keyboard()
{
    // These values will be either 0 or 1.
}

Keyboard.prototype.left = 0;
Keyboard.prototype.right = 0;
Keyboard.prototype.down = 0;
Keyboard.prototype.up = 0;

module.exports = Keyboard;
},{}],6:[function(require,module,exports){
const sprite = "./src/assets/art/player.png";

function Player(keyboard)
{
    this.x = 384;           // Start the player at half the game width
    this.y = 0;
    this.width = 48;        // Should match the sprite width
    this.height = 48;
    this.velocity = {
        x: 0,
        y: 0
    }
    this.maxHVelocity = 6;
    this.acceleration = 0.8; // Applied to the horizontal only
    this.friction = 0.4;
    this.gravity = 1;
    this.jumpSpeed = 15;
    this.isGrounded = true;
    this.floorPosition = 720; // The height at which the "floor" is
    this.keyboard = keyboard;

    this.sprite = {
        image: new Image(),
        dir: 0, // 0 = right, 1 = left
        rowIndex: 0, // y
        columnIndex: 0, // x
        animationSpeed: 0.1,
        size: [4, 4, 6, 6] // The size of the row (starting from the top)
    }

    this.sprite.image.src = sprite;

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

// Handles animating the sprite (by changing the index)
Player.prototype.animate = function()
{
    this.sprite.columnIndex = (this.sprite.columnIndex + this.sprite.animationSpeed) % this.sprite.size[this.sprite.rowIndex];
}

Player.prototype.update = function()
{
    const { left, right, up } = this.keyboard;

    const horDirection = right - left;

    this.applyFriction();

    // Apply horizontal acceleration to the player
    this.velocity.x += horDirection * this.acceleration;

    if (this.velocity.x >= this.maxHVelocity || this.velocity.x <= -this.maxHVelocity)
    {
        this.velocity.x = this.maxHVelocity * horDirection;
    }

    //  Apply gravity when the player is not grounded
    if (this.y + this.height / 2 < this.floorPosition)
    {
        this.velocity.y += this.gravity; // gravity
    }
    else
    {
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
    }

    // Allow the player to jump when they're grounded
    if (this.y + this.height / 2 + 1 >= this.floorPosition)
    {
        this.velocity.y -= this.jumpSpeed * up;
    }

    // Update the player's position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Change the sprite according to the player's current state
    if (horDirection !== 0)
    {
        this.sprite.dir = (horDirection === 1 ? 0 : 1);
    }

    if (this.velocity.x) {
        this.sprite.rowIndex = 2 + this.sprite.dir;
        this.sprite.animationSpeed = 0.25;
    }
    else {
        this.sprite.rowIndex = 0 + this.sprite.dir;
        this.sprite.animationSpeed = 0.1;
    }

    // Animate the player
    this.animate();
}

Player.prototype.draw = function(ctx)
{
    // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.drawImage(
        this.sprite.image,
        Math.floor(this.sprite.columnIndex) * this.width,
        this.sprite.rowIndex * this.height,
        this.width,
        this.height,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
    );
};

module.exports = Player;
},{}],7:[function(require,module,exports){
const Camera = require("./Camera.js");

/**
 * Constructor function that handles rendering objects.
 
 * This code shouldn't be touched.
 * 
 * @param {Canvas} canvas
 * @param {Context} ctx
 */

function Render(canvas, ctx)
{
    Render.prototype.canvas = canvas;
    Render.prototype.ctx = ctx;
    Render.prototype.camera = new Camera(this);
    Render.prototype.baseWidth = 1280;
    Render.prototype.baseHeight = 720;
    Render.prototype.viewWidth = 640;
    Render.prototype.viewHeight = 360;
    Render.prototype.renderable = [];
    Render.prototype.unrenderable = [];

    // Initialize the canvas properties
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = this.baseWidth;
    this.canvas.height = this.baseHeight;
    this.resizeCanvas();
}

Render.prototype.draw = function()
{
    this.ctx.fillStyle = "pink";
    this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
    // this.ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);

    this.ctx.fillStyle = "black";
    
    for (let i = 0; i < this.renderable.length; i++)
    {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        this.renderable[i].draw(this.ctx);
        this.ctx.translate(this.camera.x, this.camera.y);
    }
}

Render.prototype.resizeCanvas = function()
{
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let aspectRatio = this.baseWidth / this.baseHeight;

    // Scale the canvas so that it's always the same aspect ratio
    if (winHeight * aspectRatio > winWidth) {
        this.canvas.style.width = winWidth + "px";
        this.canvas.style.height = winWidth / aspectRatio + "px";
        this.viewWidth = winWidth;
        this.viewHeight = winWidth / aspectRatio;
    }
    else {
        this.canvas.style.width = winHeight * aspectRatio + "px";
        this.canvas.style.height = winHeight + "px";
        this.viewWidth = winHeight * aspectRatio;
        this.viewHeight = winHeight;
    }
}

module.exports = Render;
},{"./Camera.js":1}],8:[function(require,module,exports){
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

    document.body.appendChild(canvas);

    // Instantiate the game components
    const keyboard = new Keyboard();
    const player = new Player(keyboard);
    const render = new Render(canvas, ctx);
    const fallingObjectsManager = new FallingObjectManager();
    const game = new Game(render, player, keyboard, fallingObjectsManager);

    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                keyboard.up = 1;
                break;
            case "KeyS":
            case "ArrowDown":
                keyboard.down = 1;
                break;
            case "KeyA":
            case "ArrowLeft":
                keyboard.left = 1;
                break;
            case "KeyD":
            case "ArrowRight":
                keyboard.right = 1;
                break;
        }
    });

    window.addEventListener("keyup", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                keyboard.up = 0;
                break;
            case "KeyS":
            case "ArrowDown":
                keyboard.down = 0;
                break;
            case "KeyA":
            case "ArrowLeft":
                keyboard.left = 0;
                break;
            case "KeyD":
            case "ArrowRight":
                keyboard.right = 0;
                break;
        }
    });

    window.addEventListener("resize", () => render.resizeCanvas());
    
    game.init();

});
},{"./FallingObjectManager.js":3,"./Game.js":4,"./Keyboard.js":5,"./Player.js":6,"./Render.js":7}]},{},[8]);
