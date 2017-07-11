var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('tile:floor', 'images/tiles/floor.png', 8, 8);
        this.load.spritesheet('tile:detail', 'images/tiles/detail.png', 8, 8);
        this.load.spritesheet('tile:enemies', 'images/tiles/enemies.png', 8, 8);
        this.load.spritesheet('tile:fire', 'images/tiles/fire.png', 8, 8);
        this.load.image('tile:blank', 'images/tiles/blank.png');

        this.load.spritesheet('tile:biome-grass', 'images/tiles/biomes/grass.png', 24, 24);
        this.load.spritesheet('tile:biome-sand', 'images/tiles/biomes/sand.png', 24, 24);
        this.load.spritesheet('tile:biome-water', 'images/tiles/biomes/water.png', 24, 24);

        this.load.spritesheet('tile:decor-tree-alive', 'images/tiles/decors/tree-alive.png', 24, 24);
        this.load.spritesheet('tile:decor-tree-fruits', 'images/tiles/decors/tree-fruits.png', 24, 24);
        this.load.spritesheet('tile:decor-tree-dead', 'images/tiles/decors/tree-dead.png', 24, 24);

        this.load.spritesheet('gui:btnNormal', 'images/gui/buttons/normal.png', 2, 2);
        this.load.spritesheet('gui:btnOver', 'images/gui/buttons/over.png', 2, 2);

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');

        this.load.json('data:map1', 'data/map1.json');
    },
    create: function() {
        GAME.json = {maps: {}};
        GAME.json.maps['map1'] = this.cache.getJSON('data:map1');

        this.state.start("Game");
    }
};
