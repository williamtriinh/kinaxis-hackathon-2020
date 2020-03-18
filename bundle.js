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
    if (this.player.x < 0 || this.player.x > this.render.baseWidth && this.state === STATE_GAME)
    {
        this.state = STATE_INTERLUDE;
    }
    else if (this.player.x > 0 && this.state === STATE_INTERLUDE)
    {
        this.state = STATE_GAME;
        this.x = 0;
        this.y = 0;
    }

    if (this.state === STATE_INTERLUDE)
    {
        this.x = this.player.x - this.render.baseWidth / 2;
        this.y = this.player.y - this.render.baseHeight / 1.5;

        if (this.x <= -this.render.baseWidth)
        {
            this.x = -this.render.baseWidth;
        }
    }
}

module.exports = Camera;

},{}],2:[function(require,module,exports){
function FallingObject(x, width, height)
{
    // parameter x will be random
    this.x = x;
    this.y = -height;
    this.width = width;
    this.height = height;

    // speed/gravity
    this.velocity = {
        x: 0,
        y: 0
    }

    //low gravity
    this.gravity = .03;
    this.floorPosition = 720 - 64;
};

FallingObject.prototype.update = function()
{
    // Constantly apply gravity
    this.velocity.y += this.gravity;

    // Make sure the objects don't fall through the ground
    if (this.y + this.height / 2 >= this.floorPosition)
    {
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

FallingObject.prototype.draw = function(ctx)
{    
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
};

module.exports = FallingObject;


},{}],3:[function(require,module,exports){
//require FallingObjects faile to draw objects
const FallingObject = require("./FallingObject.js");

// creating the array
// let FallingObjectArray = new Array;
// if true then it is a array 
//FallingObjectArray.constructor === Array;

function FallingObjectManager()
{

    //number of objects you want
    // let num = 10;
    this.fallingObjectsArray = [];

    // // looping number of objects
    // for(i = 0; i < num; i++){
    //     // adding elements to the array
    //     // random x position 
    //     FallingObjectArray[i] = new FallingObject(Math.floor(Math.random() * window.innerWidth - 50));
    // }

    this.createFallingObject = this.createFallingObject.bind(this);

    this.createFallingObject();

    this.timer = setInterval(this.createFallingObject, 3000);
};

FallingObjectManager.prototype.createFallingObject = function()
{
    let width = 50;
    let height = 50;
    let x = Math.random() * window.innerWidth - width;
    this.fallingObjectsArray.push(new FallingObject(x, width, height));
}
    
FallingObjectManager.prototype.update = function()
{
    // Update the falling objects
    for (let i = 0; i < this.fallingObjectsArray.length; i++)
    {
        this.fallingObjectsArray[i].update();
    }

    // Stop spawning
    if (this.fallingObjectsArray.length >= 10 && this.timer !== null)
    {
        clearInterval(this.timer);
        this.timer = null;
    }
    //funciton for updating the objects position
    // function up(i){
    //     FallingObjectArray[i].update()
    // }

    // loop for all the objects
    // for(i = 0; i < FallingObjectArray.length; i++){
    //     setTimeout(up, i * 2000 + 2000, i); // when i * 2 seconds plus 2 seconds then run gravity
    // }

};

FallingObjectManager.prototype.draw = function(ctx){

    // draw all the objects
    for(i = 0; i < this.fallingObjectsArray.length; i++){
        this.fallingObjectsArray[i].draw(ctx)        
    }
    
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
    this.y = 720 - 64;
    this.width = 48;        // Should match the sprite width
    this.height = 48;
    this.velocity = {
        x: 0,
        y: 0
    }
    this.index = 1;
    this.maxHVelocity = 8;
    this.acceleration = 0.9; // Applied to the horizontal only
    this.friction = 0.4;
    this.gravity = 1;
    this.jumpSpeed = 15;
    this.isGrounded = true;
    this.floorPosition = 720 - 64; // The height at which the "floor" is
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
    this.velocity.y += this.gravity;

    if (this.velocity.x >= this.maxHVelocity || this.velocity.x <= -this.maxHVelocity)
    {
        this.velocity.x = this.maxHVelocity * horDirection;
    }

    // Make sure the player doesn't pass the floor
    if (this.y + this.height / 2 + this.velocity.y >= this.floorPosition) {
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
    }

    if (this.y + this.height / 2 + 2 >= this.floorPosition)
    {
        this.velocity.y -= up * this.jumpSpeed;
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
        this.sprite.animationSpeed = 0.3;
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
const mainBackground = "./src/assets/art/main-background.png";
const interludeBackground = "./src/assets/art/interlude-background.png";

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
    Render.prototype.backgroundRenderable = {
        main: new Image(),
        interlude: new Image()
    };

    this.backgroundRenderable.main.src = mainBackground;
    this.backgroundRenderable.interlude.src = interludeBackground;

    // Initialize the canvas properties
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = this.baseWidth;
    this.canvas.height = this.baseHeight;
    this.resizeGame();
}

Render.prototype.draw = function()
{
    // this.ctx.fillStyle = "pink";
    // this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
    // this.ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);

    // this.ctx.fillStyle = "black";
    this.ctx.translate(-this.camera.x, 0);
    if (this.camera.x > -this.baseWidth)
    {
        this.ctx.drawImage(this.backgroundRenderable.main, 0, 0);
    }

    if (this.camera.player.x <= 0)
    {
        this.ctx.drawImage(this.backgroundRenderable.interlude, -this.baseWidth, 0);
    }
    
    this.ctx.translate(this.camera.x, 0);
    
    for (let i = 0; i < this.renderable.length; i++)
    {
        this.ctx.translate(-this.camera.x, 0);
        this.renderable[i].draw(this.ctx);
        this.ctx.translate(this.camera.x, 0);
    }
}

Render.prototype.resizeGame = function()
{
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let aspectRatio = this.baseWidth / this.baseHeight;

    let game = document.getElementsByClassName("game")[0];

    // Scale the canvas so that it's always the same aspect ratio
    if (winHeight * aspectRatio > winWidth) {
        game.style.width = winWidth + "px";
        game.style.height = winWidth / aspectRatio + "px";
        // this.canvas.style.width = winWidth + "px";
        // this.canvas.style.height = winWidth / aspectRatio + "px";
        // menu.style.width = this.canvas.style.width;
        // menu.style.height = this.canvas.style.height;
        // this.viewWidth = winWidth;
        // this.viewHeight = winWidth / aspectRatio;
    }
    else {
        game.style.width = winHeight * aspectRatio + "px";
        game.style.height = winHeight + "px";
        // this.canvas.style.width = winHeight * aspectRatio + "px";
        // this.canvas.style.height = winHeight + "px";
        // menu.style.width = this.canvas.style.width;
        // menu.style.height = this.canvas.style.height;
        // this.viewWidth = winHeight * aspectRatio;
        // this.viewHeight = winHeight;
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

    document.getElementsByClassName("game")[0].appendChild(canvas);

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

    window.addEventListener("resize", () => render.resizeGame());

    // When the play button is pressed
    document.getElementById("menu__play-btn").addEventListener("click", () => {
        document.getElementsByClassName("game__menu")[0].style["display"] = "none";
        document.querySelector("canvas").style["display"] = "block";
        game.init();
    });

});
},{"./FallingObjectManager.js":3,"./Game.js":4,"./Keyboard.js":5,"./Player.js":6,"./Render.js":7}]},{},[8]);
