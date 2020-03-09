(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function Game(render)
{
    this.render = render;
    this.loopId = undefined;
}

Game.prototype.init = function()
{
    loopId = setInterval(this.update, 1000 / 30);
};

Game.prototype.update = function()
{
    console.log("t");
};

module.exports = Game;
},{}],2:[function(require,module,exports){
function Render(canvas, ctx)
{
    this.canvas = canvas;
    this.ctx = ctx;
}

Render.prototype.draw = function()
{
    
}

module.exports = Render;
},{}],3:[function(require,module,exports){
const Game = require("./Game.js");
const Render = require("./Render.js");

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2D");

window.addEventListener("load", () => {

    // Initialize the canvas properties
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);

    let render = new Render(canvas, ctx);
    let game = new Game(render);
    game.init();
});
},{"./Game.js":1,"./Render.js":2}]},{},[3]);
