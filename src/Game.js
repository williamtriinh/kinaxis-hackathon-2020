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
    
};

module.exports = Game;