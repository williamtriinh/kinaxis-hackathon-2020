const keyboard = {
    left: 0,
    right: 0,
    down: 0,
    up: 0,
    use: 0,
    scrollLeft: 0,
    scrollRight: 0,
    reset: function() {
        this.use = 0;
        this.scrollLeft = 0;
        this.scrollRight = 0;
    }
}

exports.keyboard = keyboard;