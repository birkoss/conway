function PanelButton(game, label) {
    Phaser.Group.call(this, game);

    this.onClicked = new Phaser.Signal();

    this.init();

    this.setLabel(label);
};

PanelButton.prototype = Object.create(Phaser.Group.prototype);
PanelButton.prototype.constructor = PanelButton;

PanelButton.prototype.init = function() {
    let click = this.create(0, 0, "tile:blank");
    click.tint = 0xff00ff;
    click.alpha = 0;
    click.inputEnabled = true;
    click.events.onInputDown.add(this.showOver, this);
    click.events.onInputUp.add(this.showNormal, this);

    this.background = new Ninepatch(this.game, "gui:btnNormal");
    this.background.inputEnabled = true;
    this.addChild(this.background);
};

PanelButton.prototype.setLabel = function(label) {
    let buttonLabel = this.game.add.bitmapText(0, 0, "font:gui", label, 20);
    buttonLabel.anchor.set(0.5, 0.5);
    buttonLabel.x += buttonLabel.width/2;
    buttonLabel.y += buttonLabel.height/2;
    this.addChild(buttonLabel);

    this.background.resize(120, 40);
    this.getChildAt(0).width = 120;
    this.getChildAt(0).height = 40;

    buttonLabel.x += (this.background.width - buttonLabel.width) / 2;
    buttonLabel.y += (this.background.height - buttonLabel.height) / 2;
};

PanelButton.prototype.showOver = function(sprite, pointer) {
    this.background.changeTexture("gui:btnOver");
};
PanelButton.prototype.showNormal = function(sprite, pointer) {
    this.background.changeTexture("gui:btnNormal");
    this.onClicked.dispatch(this);
};
