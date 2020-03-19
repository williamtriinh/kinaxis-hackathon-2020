(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const basketsSprite = "/src/assets/art/baskets.png";

function Basket(player, keyboard) {

    this.x = 640;
    this.y = 720 - 24;
    this.height = 48;
    this.width = 48;
    this.floor = 720 - 64 - this.height / 2;

    Basket.prototype.isCarried = false;
    Basket.prototype.sprite = {
        image: new Image(),
        index: 0                    // Which basket we're using
    }
    
    this.sprite.image.src = basketsSprite;

    this.player = player;
    this.keyboard = keyboard;
}

Basket.prototype.update = function () {

    // window.addEventListener("keyup", (e) => {

    //     // checking position of this.x to see if in range and this.y to see if I can pick up the basket
    //     if (this.player.x > this.x - 200 && this.player.x < this.x + 200 
    //         && e.keyCode == 69 && this.y == this.floor) {
    //         this.y = this.player.y - this.player.height*2;

    //     }
    //     // if i can't pick it up can I place it down
    //     else if(this.y != this.floor && e.keyCode == 69){
    //         this.y = this.floor
    //     }
       
    // }
    // )

    if (this.keyboard.use === 1)
    {
        // checking position of this.x to see if in range and this.y to see if I can pick up the basket
        if (this.player.x > this.x - this.width && this.player.x < this.x + this.width) {
            Basket.prototype.isCarried = !this.isCarried;
        }
    }

    if (this.isCarried)
    {
        // Follow the player
        this.x = this.player.x;
        this.y = this.player.y - this.player.height;
    }
    else
    {
        // Stay on the ground
        this.y = this.floor;
    }
    
}


Basket.prototype.draw = function (ctx) {

    ctx.font = "20px Arial";

    // display font when player is in range of the basket
    if (this.player.x > this.x - this.width && this.player.x < this.x + this.width && this.y == this.floor) {
        ctx.fillText("Press e to Pick Up", this.x, 540);
    }

    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
        this.sprite.image,
        this.sprite.index * this.width,
        0,
        this.width,
        this.height,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
    );
}

module.exports = Basket;
},{}],2:[function(require,module,exports){
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

{
    // parameter x will be random
    this.x = x;
    this.y = -height;
    this.width = width;
    this.height = height;
    this.image = image;

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
    if (this.y + this.velocity.y + this.height / 2 >= this.floorPosition)
    {
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

FallingObject.prototype.draw = function(ctx)
{    
    // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2);
};

module.exports = FallingObject;

},{}],3:[function(require,module,exports){
const FallingObject = require("./FallingObject.js");
const smallFallingObjectSprites = "/src/assets/art/small-falling-objects.png";
const powerupsSprites = "/src/assets/art/powerups.png";

function FallingObjectManager()
{
    this.fallingObjectSprites = [
        {
            // Small falling objects
            image: new Image(),
            length: 5, // How many different sprites there are in the spritesheet
            size: [[8, 10], [8, 16], [14, 12], [10, 10], [8, 6]]    // The width/height of the sprites, by a factor of 1/3
                                                                    // (not including white-space).
        },
        {
            // Powerups
            image: new Image(),
            length: 2,
            size: [[16, 16], [16, 16]]
        },
        // {
        //     image: new Image(),
        //     length: 2
        // },
        // {
        //     image: new Image(),
        //     length: 2
        // }
    ];
    //     small: {
    //         image: new Image(),
    //         length: 5, // How many different sprites there are in the spritesheet
    //         size: [[8, 10], [8, 16], [14, 12], [10, 10], [8, 6]]    // The width/height of the sprites
    //                                                                 // (not including white-space)
    //     },
    //     large: {
    //         image: new Image(),
    //         length: 2
    //     },
    //     powerups: {
    //         image: new Image(),
    //         length: 2
    //     },
    //     powerdowns: {
    //         image: new Image(),
    //         length: 2
    //     }
    // }
    this.fallingObjectsArray = [];      // Contains all the visible falling objects in the game

    // Binds
    this.createFallingObject = this.createFallingObject.bind(this);

    // Image sources
    this.fallingObjectSprites[0].image.src = smallFallingObjectSprites;
    this.fallingObjectSprites[1].image.src = powerupsSprites;

    // Create the initial falling object and begin the timer
};

FallingObjectManager.prototype.start = function()
{
    this.createFallingObject();
    this.timer = setInterval(this.createFallingObject, 3000);
}

FallingObjectManager.prototype.createFallingObject = function()
{
    let sprite = this.fallingObjectSprites[Math.floor(Math.random() * this.fallingObjectSprites.length)];
    let spriteIndex = Math.floor(Math.random() * sprite.length);
    let width = sprite.size[spriteIndex][0] * 3;
    let height = sprite.size[spriteIndex][1] * 3;
    let x = Math.random() * (window.innerWidth - width);
    let flip = (Math.floor((Math.random() * 2)) === 0) ? true : false;

    let image = document.createElement("canvas").getContext("2d");
    image.canvas.width = width;
    image.canvas.height = height;
    
    if (flip)
    {
        image.scale(-1, 1);             // Flip the image
        image.translate(-width, 0);     // Offset because of the flip
    }
    image.drawImage(
        sprite.image,
        spriteIndex * 48 + (48 - width) / 2,
        (48 - height) / 2,
        width,
        height,
        0,
        0,
        width,
        height
    );
    this.fallingObjectsArray.push(new FallingObject(x, width, height, image.canvas));
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

};

FallingObjectManager.prototype.draw = function(ctx){

    // draw all the objects
    for(i = 0; i < this.fallingObjectsArray.length; i++){
        this.fallingObjectsArray[i].draw(ctx)        
    }
    
}
module.exports = FallingObjectManager;  

},{"./FallingObject.js":3}],5:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */
const Basket = require("./Basket.js");
const Keyboard = require("./Keyboard.js");

let key = new Keyboard();

 const GUI = require("./GUI.js");

function Game(render, player, keyboard, fallingObjectsManager)
{
    this.render = render;
    this.player = player;
    this.keyboard = keyboard;
    this.fallingObjectsManager = fallingObjectsManager;
    this.basket = new Basket(player, keyboard);
    this.camera = this.render.camera;
    this.gui = new GUI;

    this.loopId = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);

    this.camera.attach(this.player);

    this.render.renderable.push(this.fallingObjectsManager);
    this.render.renderable.push(this.basket);
    this.render.renderable.push(this.player);

    // Begin falling objects
    this.fallingObjectsManager.start();

    // Begin the update loop
    loopId = setInterval(this.update, 1000 / 50);
};

Game.prototype.update = function()
{
    this.camera.update();
    this.fallingObjectsManager.update();
    this.basket.update();
    this.player.update();

    Keyboard.prototype.use = 0;

    this.render.draw();
};

module.exports = Game;

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
},{}],7:[function(require,module,exports){
const sprite = "./src/assets/art/player.png";

function Player(keyboard)
{
    this.x = 640;           // Start the player at half the game width
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

    if (this.y + this.height / 2 + 2 >= this.floorPosition) {
        this.velocity.y -= up * this.jumpSpeed;
    }

    // Make sure the player doesn't pass the floor
    if (this.y + this.height / 2 + this.velocity.y >= this.floorPosition) {
        this.velocity.y = 0;
        this.y = this.floorPosition - this.height / 2;
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
},{}],8:[function(require,module,exports){
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

window.addEventListener("load", () => {

    // Retrieve the canvas
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // Instantiate the game components
    const keyboard = new Keyboard();
    const player = new Player(keyboard);
    const render = new Render(canvas, ctx);
    const fallingObjectsManager = new FallingObjectManager();
    const game = new Game(render, player, keyboard, fallingObjectsManager);

    window.addEventListener("keypress", (ev) => {
        switch (ev.code)
        {
            case "KeyE":
                Keyboard.prototype.use = 1;
                break;
        }
    });

    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                Keyboard.prototype.up = 1;
                break;
            case "KeyS":
            case "ArrowDown":
                Keyboard.prototype.down = 1;
                break;
            case "KeyA":
            case "ArrowLeft":
                Keyboard.prototype.left = 1;
                break;
            case "KeyD":
            case "ArrowRight":
                Keyboard.prototype.right = 1;
                break;
        }
    });

    window.addEventListener("keyup", (ev) => {
        switch (ev.code) {
            case "KeyW":
            case "ArrowUp":
            case "Space":
                Keyboard.prototype.up = 0;
                break;
            case "KeyS":
            case "ArrowDown":
                Keyboard.prototype.down = 0;
                break;
            case "KeyA":
            case "ArrowLeft":
                Keyboard.prototype.left = 0;
                break;
            case "KeyD":
            case "ArrowRight":
                Keyboard.prototype.right = 0;
                break;
        }
    });

    window.addEventListener("resize", () => render.resizeGame());

    // When the play button is pressed
    document.getElementById("menu__play-btn").addEventListener("click", () => {
        document.getElementsByClassName("game__menu")[0].style["display"] = "none";
        document.getElementsByClassName("game__ui")[0].style["display"] = "flex";
        document.querySelector("canvas").style["display"] = "block";
        game.init();
    });

});

