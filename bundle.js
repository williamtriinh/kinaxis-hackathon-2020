(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Constructor function responsible for running the update method and
 * updating the various objects on screen.
 * 
 * The code here shouldn't be touched.
 */

function Game(render, player)
{
    this.player = player;
    this.render = render;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    this.update = this.update.bind(this);

    this.render.renderable.push(this.player);
    loopId = setInterval(this.update, 1000 / 30);
};

Game.prototype.update = function()
{
    this.render.draw();
};

module.exports = Game;
},{}],2:[function(require,module,exports){
// draw a square
// movement


function Player()
{
    
};

Player.prototype.draw = function(ctx)
{
    ctx.fillRect(0, 2, 50, 50);
};

module.exports = Player;
},{}],3:[function(require,module,exports){
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
    console.log(this.ctx);
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
},{}],4:[function(require,module,exports){
/**
 * The "entry" file where the canvas is created and the different components
 * that make up the game (such as the Game, Render) are instantiated.
 * 
 * This code shouldn't be touched
 */

const Game = require("./Game.js");
const Render = require("./Render.js");
const Player = require("./Player.js");

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", () => {

    // Initialize the canvas properties
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);

    let player = new Player();
    let render = new Render(canvas, ctx);
    let game = new Game(render, player);
    
    game.init();
});
},{"./Game.js":1,"./Player.js":2,"./Render.js":3}]},{},[4]);
