function Map(game, config) {
    Phaser.Group.call(this, game);

    this.config = config;
    this.gridWidth = config.mapWidth;
    this.gridHeight = config.mapHeight;

    this.tiles = [];

    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

    this.padding = 2 * GAME.scale.sprite;

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

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
