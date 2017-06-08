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

    //this.tiles[0][0].toggle();
};

Map.prototype.simulate = function() {
    let newGeneration = [];

    /* Simulate the next generation simultaneously */
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        let rows = [];
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            let total = this.getNeighboors(gridX, gridY, true);
            if (this.tiles[gridY][gridX].isAlive()) {
                rows.push(total >= 2 && total <= 3 ? true : false);
            } else {
                rows.push(total == 3 ? true : false);
            }
        }
        newGeneration.push(rows);
    }

    /* Apply the next generation */
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            if (newGeneration[gridY][gridX] != this.tiles[gridY][gridX].isAlive()) {
                this.tiles[gridY][gridX].toggle();
            }
        }
    }
};

/* Helpers */

Map.prototype.getNeighboors = function(gridX, gridY, isAlive) {
    let total = 0;
    for (let y=-1; y<=1; y++) {
        for (let x=-1; x<=1; x++) {
            if (x != 0 || y != 0) {
                let newX = gridX + x;
                let newY = gridY + y;
                if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                    if (this.tiles[newY][newX].isAlive() == isAlive) {
                        total++;
                    }
                }
            }
        }
    }
    return total;
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
