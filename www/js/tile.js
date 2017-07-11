function Tile(game) {
    Phaser.Group.call(this, game);

    this.totals = {
        biome:0,
        decor:0
    };

    this.biome = this.createTile("tile:floor");
    this.addChild(this.biome);
    this.changeBiome(Map.Biomes.Grass);

    this.decor = this.createTile("tile:detail");
    this.addChild(this.decor);
    this.changeDecor(Map.Decors.None);

    this.onFullATB = new Phaser.Signal();

    this.clearATB();
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.createTile = function(spriteName, frame) {
    let tile = this.game.add.sprite(0, 0, spriteName);
    tile.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);
    tile.anchor.set(0.5, 0.5);

    if (frame != null) {
        tile.frame = frame;
    }

    tile.x += tile.width/2;
    tile.y += tile.height/2;

    return tile;
};

Tile.prototype.changeBiome = function(newBiome) {
    this.totals.biome = 0;

    this.currentBiome = newBiome;

    switch (this.currentBiome) {
        case Map.Biomes.Grass:
            this.biome.frame = 0;
            break;
        case Map.Biomes.Water:
            this.biome.frame = 3;
            break;
        case Map.Biomes.Sand:
            this.biome.frame = 1;
            break;
    }
};

Tile.prototype.changeDecor = function(newDecor) {
    let oldDecor = this.total.decor;
    this.totals.decor = 0;

    this.currentDecor = newDecor;

    this.decor.alpha = (this.currentDecor == Map.Decors.None ? 0 : 1);

    switch (this.currentDecor) {
        case Map.Decors.TreeAlive:
            this.decor.frame = 0;
            break;
        case Map.Decors.TreeDead:
            this.decor.frame = 2;
            break;
        case Map.Decors.TreeFruits:
            this.decor.frame = 1;
            /* Keep the total of the decor */
            this.totals.decor = oldDecor;
            break;
    }
};

Tile.prototype.toggle = function() {
    if (this.isBurnable) {
        if (!this.isAlive()) {
            this.isBurning = true;
            this.setItem("tile:fire", 0, true);
            this.item.animations.add("idle", [0, 1], 2, true);
            this.item.animations.play("idle");
        } else {
            if (this.decor != null) {
                this.decor.frame = 2;
            }
            this.item.destroy();
            this.item = null;
            this.isBurning = false;
        }
    }
};

Tile.prototype.isAlive = function() {
    return this.isBurning;
};

Tile.prototype.addDecor = function() {
    this.decor = this.createTile("tile:detail", 0);
    this.addChild(this.decor);
};

Tile.prototype.setItem = function(spriteName, frame, isEditable) {
    this.isEditable = (isEditable ? true : false);

    this.item = this.createTile(spriteName, 0);
    this.addChild(this.item);
};

/* ATB */

Tile.prototype.clearATB = function() {
    this.ATB = 0;
};

Tile.prototype.getMaxATB = function() {
    return 100;
};

Tile.prototype.getFillRateATB = function() {
    return 1;
};

Tile.prototype.isReady = function() {
    return (this.ATB >= this.getMaxATB());
};

Tile.prototype.updateATB = function() {
    this.ATB = Math.min(this.ATB + this.getFillRateATB(), this.getMaxATB());
    if (this.isReady()) {
        this.totals.biome++;
        this.totals.decor++;
        this.onFullATB.dispatch(this);
    }
};
