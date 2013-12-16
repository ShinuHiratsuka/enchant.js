var helpScene = enchant.Class.create(enchant.Scene, {
    initialize: function(score) {
        var game = enchant.Game.instance;
        enchant.Scene.call(this);
        game.setCentering(this);
        var bg = new Sprite(320, 416);
        bg.image = game.assets['img/title.png'];
        var help = new Label('ゲーム説明<br/><br/>農民が植えて育てた稲穂を、</br>飛んでくる鳥に取られる前に<br/>収穫しろ！<br/>隣り合うマスを収穫すると<br/>高特典になるぞ！');
        help.color = '#FFFFFF';
        help.y = 20;
        help.width = 320;
        help.height = 416;
        help._element.style.textAlign = "center";
        help._element.style.fontSize = "11pt";
        var alpha = new Sprite(320, 416);
        alpha.backgroundColor = "#000000";
        alpha.opacity = 0.7;
        var button = new Sprite(73, 43);
        button.image = game.assets['img/start.png'];
        button.x = 70;
        button.y = 340;
        var hbutton = new Sprite(73, 43);
        hbutton.image = game.assets['img/back.png'];
        hbutton.x = 160;
        hbutton.y = 340;
        button.addEventListener('touchstart', this.touchstartAction);
        hbutton.addEventListener('touchstart', this.touchhelpAction);
        this.addChild(bg);
        this.addChild(alpha);
        this.addChild(help);
        this.addChild(button);
        this.addChild(hbutton);
    },
    touchstartAction: function(e) {
        game.az.setStart();
    },
    touchhelpAction: function(e) {
        var game = enchant.Game.instance;
        game.replaceScene(new titleScene());
    }
});