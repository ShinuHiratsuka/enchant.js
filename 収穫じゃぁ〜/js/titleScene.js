var titleScene = enchant.Class.create(enchant.Scene, {
    initialize: function() {
        game = enchant.Game.instance;
        enchant.Scene.call(this);
        game.setCentering(this);
        var bg = new Sprite(320, 416);
        bg.image = game.assets['img/title.png'];
        var button = new Sprite(73, 43);
        button.image = game.assets['img/start.png'];
        button.x = 12;
        button.y = 310;
        var hbutton = new Sprite(73, 43);
        hbutton.image = game.assets['img/help.png'];
        hbutton.x = 12;
        hbutton.y = 360;
        button.addEventListener('touchstart', this.touchstartAction);
        hbutton.addEventListener('touchstart', this.touchhelpAction);
        this.addChild(bg);
        this.addChild(button);
        this.addChild(hbutton);
    },
    touchstartAction: function(e) {
        game.az.setStart();
    },
    touchhelpAction: function(e) {
        game = enchant.Game.instance;
        game.popScene();
        game.pushScene(new helpScene());
    }
});