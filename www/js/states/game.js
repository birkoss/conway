var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.game.stage.backgroundColor = 0x333333;
        this.mapContainer = this.game.add.group();
        this.createMap();

        this.panelContainer = this.game.add.group();
        this.createPanel();
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
        //this.panel.onTileChanged.add(this.onPanelTileChanged, this);
        //this.panel.buttonToggleClicked.add(this.onPanelToggleButtonClicked, this);
        this.panelContainer.addChild(this.panel);

        let tiles = ['water','grass'];
        tiles.forEach(function(single_tile) {
            let button = new PanelButton(this.game);
            button.setSprite("tile:biome-" + single_tile);
            button.biome = single_tile;
            button.onClicked.add(this.onPanelTileClicked, this);
            this.panel.addButton(button);
        }, this);

        this.panelSelectButton(this.panel.buttonsContainer.getChildAt(0));
    },

    panelSelectButton: function(button) {
        this.map.changeBiome(button.biome);
        button.background.tint = 0xcccccc;
    },
    /* Events */
    onPanelToggleButtonClicked: function(state) {
        this.map.simulate();
    },
    onPanelTileClicked: function(button) {
        this.panel.buttonsContainer.forEach(function(single_button) {
            single_button.background.tint = 0x333333;
        }, this);

        this.panelSelectButton(button);
    }

};
