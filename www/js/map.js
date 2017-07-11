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
    this.padding = 5;

    this.createMap();
    this.createBackground();

    this.tilesContainer.x = this.tilesContainer.y = this.padding;
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.Biomes = {
    Grass: 1,
    Water: 2,
    Sand: 3
};

Map.Decors = {
    None: 0,
    TreeAlive: 1,
    TreeDead: 2
};

Map.prototype.createBackground = function() {
    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = this.tilesContainer.width + this.padding*2;
    background.height = this.tilesContainer.height + this.padding*2;
    background.tint = 0x2b2b2b;

    background.inputEnabled = true;
    background.events.onInputDown.add(this.selectTile, this);
    //background.events.onInputUp.add(this.toggleTile, this);
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
            tile.onFullATB.add(this.checkTileStatus, this);

            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }

    //this.tiles[0][0].toggle();
};

Map.prototype.apply = function(mapData) {
    console.log(JSON.stringify(mapData));
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            if (mapData.floor[gridY][gridX] == 0) {
                this.tiles[gridY][gridX].isBurnable = false;
                this.tiles[gridY][gridX].isEditable = false;
                this.tiles[gridY][gridX].floor.frame = 3;
                this.tiles[gridY][gridX].floor.animations.add("idle", [3, 9], 2, true);
                this.tiles[gridY][gridX].floor.animations.play("idle");
            } else {
                if (mapData.trees[gridY][gridX] == 1) {
                    this.tiles[gridY][gridX].addDecor();
                }
            }
        }
    }
};

Map.prototype.simulate = function() {
    let newGeneration = [];

    /* Simulate the next generation simultaneously */
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        let rows = [];
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            if (this.tiles[gridY][gridX].isBurnable) {
                let total = this.getNeighboors(gridX, gridY, true);
                if (this.tiles[gridY][gridX].isAlive()) {
                    rows.push(total >= 2 && total <= 3 ? true : false);
                } else {
                    rows.push(total == 3 ? true : false);
                }
            } else {
                rows.push(false);
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

Map.prototype.updateTiles = function() {
    this.tilesContainer.forEach(function(single_tile) {
        single_tile.updateATB();
    }, this);
};

/* Helpers */

Map.prototype.getNeighboors = function(gridX, gridY, depth, increment, onlyAdjacent) {
    depth = depth || 1;
    increment = increment || 1;
    onlyAdjacent = onlyAdjacent || true;

    let neighboors = [];
    for (let y=-depth; y<=depth; y+=increment) {
        for (let x=-depth; x<=depth; x+=increment) {
            if (x != 0 || y != 0) {
                let newX = gridX + x;
                let newY = gridY + y;
                if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {

                    if (!onlyAdjacent || (Math.abs(x) != Math.abs(y))) {
                        neighboors.push(this.tiles[newY][newX]);
                    }
                }
            }
        }
    }
    return neighboors;
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
        //this.tiles[gridY][gridX].toggle();
        this.tiles[gridY][gridX].changeBiome(Map.Biomes.Water);
        this.tiles[gridY][gridX].changeDecor(Map.Decors.None);

        /* Clear the ATB of the selected tile, and its neighboors */
        this.tiles[gridY][gridX].clearATB();
        this.getNeighboors(gridX, gridY).forEach(function(single_neighboor) {
            single_neighboor.clearATB();
        }, this);

        console.log(gridX + "x" + gridY);
    }
};

Map.prototype.checkTileStatus = function(tile) {
    /* Update the biome */
    let biome = tile.currentBiome;
    let decor = tile.currentDecor;

    let surrounding = [{}, {}];

    /* Check directly around */
    for (let depth=1; depth<=2; depth++) {
        this.getNeighboors(tile.gridX, tile.gridY, depth, depth).forEach(function(single_neighboor) {
            if (surrounding[depth-1][single_neighboor.currentBiome] == null) {
                surrounding[depth-1][single_neighboor.currentBiome] = 0;
            }
            surrounding[depth-1][single_neighboor.currentBiome]++;
        }, this);
    }

    /* Check biome changes */
    switch (biome) {
        case Map.Biomes.Grass:
            if (surrounding[0][Map.Biomes.Water] != null) {
                biome = Map.Biomes.Sand;
                if (decor == Map.Decors.TreeAlive) {
                    decor = Map.Decors.TreeDead;
                }
            }
            break;
    }
    if (biome != tile.currentBiome) {
        tile.changeBiome(biome);
    }

    /* Check biome decors */
    switch (biome) {
        case Map.Biomes.Grass:
            if (surrounding[0][Map.Biomes.Water] == null && surrounding[1][Map.Biomes.Water] != null) {
                decor = Map.Decors.TreeAlive;
            }
            break;
    }
    if (decor != tile.currentDecor) {
        tile.changeDecor(decor);
    }

    tile.clearATB();
};
