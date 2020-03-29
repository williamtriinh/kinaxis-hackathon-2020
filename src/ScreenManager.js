const screens = {
    mainMenu: "mainMenu",
    game: "game",
    settings: "settings",
}

const screenManager = {
    currentScreen: "mainMenu",
    path: "mainMenu",
    goTo: function(screen) {
        if (this.path !== "")
        {
            this.path += `/${screen}`;
        }
        else
        {
            this.path = screen;
        }
        this.currentScreen = screen;
    },
    pop: function(shouldIgnoreLastScreen = false) {
        let paths = this.path.split("/");

        // Make sure we don't pop off the last screen
        if (shouldIgnoreLastScreen || paths.length > 1)
        {
            this.path = "";
            // Add all the screens except for the last one
            for (let i = 0; i < paths.length - 1; i++) {
                this.path += paths[i] + (i !== paths.length - 2 ? "/" : "");
            }
            this.currentScreen = paths[paths.length - 2];
        }
    },
    popAndGoTo: function(screen) {
        this.pop(true);
        this.goTo(screen);
    },
    pathContains: function(screen) {
        let paths = this.path.split("/");
        for (let i = 0; i < paths.length; i++)
        {
            if (paths[i] === screen)
            {
                return true;
            }
        }
        return false;
    }
};

exports.screens = screens;
exports.screenManager = screenManager;