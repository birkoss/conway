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
    this.padding = 3;

    this.currentBiome = Map.Biomes.Water;

    this.createMap();
    this.createBackground();

    this.tilesContainer.x = this.tilesContainer.y = this.padding;

    //this.clearTilesAround(2, 2);
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.Biomes = {
    Grass: 'grass',
    Water: 'water',
    Sand: 'sand'
};

Map.Decors = {
    None: '',
    TreeAlive: 'tree-alive',
    TreeDead: 'tree-dead',
    TreeFruits: 'tree-fruits'
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
            tile.onFullATB.add(this.onTileReady, this);

            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }
};

Map.prototype.changeBiome = function(newBiome) {
    this.currentBiome = newBiome;
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

                    if (!onlyAdjacent || (gridX == newX || gridY == newY)) {
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
        this.tiles[gridY][gridX].changeBiome(this.currentBiome);

        /* Clear the ATB of the selected tile, and its neighboors */
        this.clearTilesAround(gridX, gridY);
    }
};

Map.prototype.clearTilesAround = function(gridX, gridY) {
    this.tiles[gridY][gridX].clearATB();
    this.getNeighboors(gridX, gridY, 2, 1).forEach(function(single_neighboor) {
        single_neighboor.clearATB();
    }, this);
};

Map.prototype.onTileReady = function(tile) {
    /* Update the biome */
    let biome = tile.currentBiome;
    let decor = tile.currentDecor;

    let surrounding = {};
    /* Check directly around */
    for (let depth=1; depth<=2; depth++) {
        if (surrounding[depth] == null) {
            surrounding[depth] = {};
        }

        this.getNeighboors(tile.gridX, tile.gridY, depth, depth).forEach(function(single_neighboor) {
            if (surrounding[depth][single_neighboor.currentBiome] == null) {
                surrounding[depth][single_neighboor.currentBiome] = 0;
            }
            surrounding[depth][single_neighboor.currentBiome]++;
        }, this);
    }

    /* Check biome changes */
    switch (biome) {
        case Map.Biomes.Grass:
            if (surrounding[1][Map.Biomes.Water] != null) {
                biome = Map.Biomes.Sand;
            }
            break;
        case Map.Biomes.Sand:
            if (surrounding[1][Map.Biomes.Water] == null && tile.totals.decor > 1) {
                biome = Map.Biomes.Grass;
            }
    }
    if (biome != tile.currentBiome) {
        tile.changeBiome(biome);
        //this.clearTilesAround(tile.gridX, tile.gridY);
    }

    /* Check biome decors */
    switch (biome) {
        case Map.Biomes.Grass:
            /* If we have a Water 2 tiles away */
            if (surrounding[2][Map.Biomes.Water] != null) {
                if ((decor == Map.Decors.TreeAlive || decor == Map.Decors.TreeFruits) && tile.totals.decor > 2) {
                    decor = Map.Decors.TreeFruits;
                } else {
                    decor = Map.Decors.TreeAlive;
                }
            }
            break;
        case Map.Biomes.Sand:
            /* Kill all trees on Sand after 1 turn */
            if ((decor == Map.Decors.TreeAlive || decor == Map.Decors.TreeFruits) && tile.totals.decor > 1 && tile.totals.biome > 0) {
                decor = Map.Decors.TreeDead; 
            } else if (decor == Map.Decors.TreeDead && tile.totals.decor > 1) {
                /* Remove all dead trees after X turns */
                decor = Map.Decors.None;
            }
            break;
    }
    if (decor != tile.currentDecor) {
        tile.changeDecor(decor);
    }

    tile.clearATB();
};
