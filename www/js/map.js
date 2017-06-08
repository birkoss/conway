function Map(game, config) {
    Phaser.Group.call(this, game);

    this.config = config;
    this.gridWidth = config.mapWidth;
    this.gridHeight = config.mapHeight;

    this.tiles = [];

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);
    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

    this.padding = 2 * GAME.scale.sprite;

    this.createMap();
    this.createBackground();

    this.tilesContainer.x = this.tilesContainer.y = this.padding;
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createBackground = function() {
    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = this.tilesContainer.width + this.padding*2;
    background.height = this.tilesContainer.height + this.padding*2;
    background.tint = 0x2b2b2b;

    background.inputEnabled = true;
    background.events.onInputDown.add(this.selectTile, this);
    background.events.onInputUp.add(this.toggleTile, this);
};

Map.prototype.createMap = function() {
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        let rows = [];
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            let tile = new Tile(this.game);
            tile.x = gridX * (tile.width + this.padding);
            tile.y = gridY * (tile.height + this.padding);
            tile.gridX = gridX;
            tile.gridY = gridY;
            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }

    this.tiles[0][0].toggle();
};

/* Helpers */

Map.prototype.getNeighboors = function(neighboors, gridX, gridY, tileState) {
    if (tileState == undefined) {
        tileState = 0;
    }
    if (gridX > 0 && gridX < this.gridWidth + 1 && gridY > 0 && gridY < this.gridHeight + 1) {
        let tile = this.tiles[gridY][gridX];
        if (tile.isFilled == tileState && neighboors.indexOf(tile) == -1) {
            neighboors.push(tile);
            for (let y=-1; y<=1; y++) {
                for (let x=-1; x<=1; x++) {
                    if (Math.abs(x) != Math.abs(y)) {
                        this.getNeighboors(neighboors, gridX+x, gridY+y, tileState);
                    }
                }
            }
        }
    }
};

/* Events */

Map.prototype.selectTile = function(map, pointer) {
    let x = pointer.x;
    let y = pointer.y;
    if (this.parent != undefined) {
        x -= this.parent.x;
        y -= this.parent.y;
    }

    let gridX = Math.floor((x-this.padding) / (this.tiles[0][0].width+this.padding));
    let gridY = Math.floor((y-this.padding) / (this.tiles[0][0].height+this.padding));
    if (gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight) {
        this.tiles[gridY][gridX].toggle();
        console.log(gridX + "x" + gridY);
    }
};

Map.prototype.toggleTile = function(map, pointer) {

};
