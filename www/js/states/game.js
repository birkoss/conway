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
    update: function() {
        this.map.updateTiles();
    },
    createMap: function() {
        let mapConfig = {
            mapWidth: 6,
            mapHeight: 8
        };

        //this.generator = new Generator(this.game, mapConfig.mapWidth, mapConfig.mapHeight);
        this.map = new Map(this.game, mapConfig);
        //this.map.apply(GAME.json.maps['map1']);
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
