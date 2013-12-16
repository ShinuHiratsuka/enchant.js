enchant();

function doScroll() {
    if (window.navigator.userAgent.match(/iphone/i) || window.navigator.userAgent.match(/ipad/i)) {
        window.scrollTo(0, 0);
    } else {
        var outer = window.outerHeight;
        var inner = window.innerHeight;
        var move = Math.abs(outer - inner);
        window.scrollTo(0, move);
    }
}
window.onload = function() {
    game = new Game(320, 416);
    game.fps = 12;
    game.az = new azLib();
//    game._element.style.backgroundImage = "url(img/noutore01.jpg)";
//    game._element.style.backroundRepeat = "repeat";
    game.setCentering = function(scene) {
        if (!scene) {
            scene = this.currentScene;
        }
        if (!scene) {
            return;
        }
        var VENDER_PREFIX = (function() {
            var ua = navigator.userAgent;
            if (ua.indexOf('Opera') != -1) {
                return 'O';
            } else if (ua.indexOf('MSIE') != -1) {
                return 'ms';
            } else if (ua.indexOf('WebKit') != -1) {
                return 'webkit';
            } else if (navigator.product == 'Gecko') {
                return 'Moz';
            } else {
                return '';
            }
        })();
        this._element.style.width = window.innerWidth + "px";
        this._element.style.height = (window.innerHeight) + "px";
        this.scale = Math.min(window.innerWidth / this.width, window.innerHeight / this.height);
        scene._element.style.left = Math.floor((window.innerWidth - (this.width * this.scale)) / 2) + "px";
        scene._element.style.top = (Math.floor((window.innerHeight - (this.height * this.scale)) / 2)) + "px";
        scene._element.style[VENDER_PREFIX + 'Transform'] = 'scale(' + this.scale + ')';
        if (scene != this.rootScene) {
            this.rootScene._element.style.left = Math.floor((window.innerWidth - (this.width * this.scale)) / 2) + "px";
            this.rootScene._element.style.top = (Math.floor((window.innerHeight - (this.height * this.scale)) / 2)) + "px";
            this.rootScene._element.style[VENDER_PREFIX + 'Transform'] = 'scale(' + this.scale + ')';
        }
        setTimeout(doScroll, 100);
    };
    game.setCentering(game.loadingScene);
    game.preload(img);
    game.onload = function() {
        setTimeout(doScroll, 100);
        this.onenterframe = function(e) {
            var rect = game._element.getBoundingClientRect();
            if ((rect.width != window.innerWidth || rect.height != window.Height)) {
                this.setCentering();
            }
        };
        this.onenter = function(e) {
            this.setCentering();
        };
        this.pushScene(new titleScene());
    };
    (function() {
        game.loadingScene.removeChild(game.loadingScene.childNodes[0]);
        var loadGroup = new Group();
        var square = [];
        var prop = {
            p0: 1,
            x0: 0,
            y0: 0,
            p1: 0.9,
            x1: 20,
            y1: 0,
            p2: 0.8,
            x2: 40,
            y2: 0,
            p3: 0.7,
            x3: 40,
            y3: 20,
            p4: 0.6,
            x4: 40,
            y4: 40,
            p5: 0.5,
            x5: 20,
            y5: 40,
            p6: 0.4,
            x6: 00,
            y6: 40,
            p7: 0.3,
            x7: 0,
            y7: 20
        };
        var pos = [7, 6, 5, 4, 3, 2, 1, 0];
        for (var i = 0; i < 8; i++) {
            square[i] = new Sprite(18, 18);
            square[i].backgroundColor = "#FFF";
            square[i].scale(prop["p" + i]);
            square[i].opacity = prop["p" + i];
            square[i].x = prop["x" + i];
            square[i].y = prop["y" + i];
            loadGroup.addChild(square[i]);
        }
        loadGroup.x = (game.width / 2 | 0) - 30;
        loadGroup.y = (game.height / 2 | 0) - 30;
        var cnt = 0;
        loadGroup.addEventListener('enterframe', function() {
            if (!(cnt++ % 2)) {
                for (var i = 0; i < 8; i++) {
                    square[i].x = prop["x" + pos[i]];
                    square[i].y = prop["y" + pos[i]];
                }
                pos.push(pos.shift());
            }
        });
        game.loadingScene.addChild(loadGroup);
    })();
    game.start();
};