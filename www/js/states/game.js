var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.backgroundContainer = this.game.add.group();
        this.mapContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();
        this.panelContainer = this.game.add.group();

        this.createMap();
    },

    /* Misc methods */

    createMap: function() {
        let mapConfig = {
            mapWidth: 15,
            mapHeight: 24
        };

        this.map = new Map(this.game, mapConfig);

        /* Create an animated background under the map */
        let background = this.mapContainer.create(0, 0, "tile:blank");
        background.width = this.map.width + this.map.padding*2;
        background.height = this.map.height + this.map.padding*2;
        background.tint = 0x333333;

        this.map.x = this.map.y = this.map.padding;
        this.mapContainer.addChild(this.map);

        this.mapContainer.y = (this.game.height - this.mapContainer.height) / 2;
        this.mapContainer.x = (this.game.width - this.mapContainer.width) / 2;
    }
};
