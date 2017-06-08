function Panel(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.buttonToggleClicked = new Phaser.Signal();

    this.init();
};

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.init = function() {
    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = this.game.width;
    background.height = 60;
    background.tint = 0x000000;

    this.button = new PanelButton(this.game, "Start");
    this.button.onClicked.add(this.onButtonClicked, this);
    this.backgroundContainer.addChild(this.button);
};

Panel.prototype.onButtonClicked = function() {
    this.buttonToggleClicked.dispatch(this.button.label.text);

    this.button.label.text = (this.button.label.text == "Start" ? "Stop" : "Start");
};
