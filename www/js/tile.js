function Tile(game) {
    Phaser.Group.call(this, game);

    this.isEditable = true;
    this.init();
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

Tile.prototype.init = function() {
    this.floor = this.createTile("tile:floor", 0);
    this.addChild(this.floor);
};

Tile.prototype.toggle = function() {
    if (!this.isAlive()) {
        this.setItem("tile:detail", 0, true);
    } else {
        this.item.destroy();
        this.item = null;
    }
};

Tile.prototype.isAlive = function() {
    return (this.item != undefined);
};

Tile.prototype.setItem = function(spriteName, frame, isEditable) {
    this.isEditable = (isEditable ? true : false);

    this.item = this.createTile("tile:detail", 0);
    this.addChild(this.item);
};
