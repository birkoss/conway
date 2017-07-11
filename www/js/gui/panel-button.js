function PanelButton(game) {
    Phaser.Group.call(this, game);

    this.onClicked = new Phaser.Signal();

    this.init();
};

PanelButton.prototype = Object.create(Phaser.Group.prototype);
PanelButton.prototype.constructor = PanelButton;

PanelButton.prototype.init = function() {
    this.background = this.create(0, 0, "tile:blank");
    this.background.tint = 0x333333;
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.showOver, this);
    this.background.events.onInputUp.add(this.showNormal, this);

    this.addChild(this.background);
};

PanelButton.prototype.setSprite = function(spriteName) {
    let sprite = this.create(3, 3, spriteName);
    sprite.scale.set(2);
    this.background.width = sprite.width + 6;
    this.background.height = sprite.height + 6;
};

PanelButton.prototype.showOver = function(sprite, pointer) {
};
PanelButton.prototype.showNormal = function(sprite, pointer) {
    this.onClicked.dispatch(this);
};
