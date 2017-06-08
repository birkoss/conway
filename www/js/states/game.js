var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.game.stage.backgroundColor = 0x333333;
        this.mapContainer = this.game.add.group();

        this.panelContainer = this.game.add.group();

        this.createPanel();

        this.createMap();
    },
    createMap: function() {
        let mapConfig = {
            mapWidth: 15,
            mapHeight: 24
        };

        this.map = new Map(this.game, mapConfig);
        this.mapContainer.addChild(this.map);

        this.mapContainer.x = (this.game.width - this.mapContainer.width) / 2;
        this.mapContainer.y = (this.game.height - this.mapContainer.height - this.mapContainer.x);
    },
    createPanel: function() {
        this.panel = new Panel(this.game);
        this.panel.buttonToggleClicked.add(this.onPanelToggleButtonClicked, this);
        this.panelContainer.addChild(this.panel);
    },
    /* Events */
    onPanelToggleButtonClicked: function(state) {
        this.map.simulate();
    }
};
