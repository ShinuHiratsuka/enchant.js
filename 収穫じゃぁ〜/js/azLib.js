console.log("azLib");
var SITE_URL = "http://www.azing.jp";

var PLAY_COUNT_CGI = "http://azing.jp/challenge_check.cgi";

var LEFT_POINT_CGI = "http://azing.jp/point_minus2.cgi";

var SUBMIT_CGI = "http://www.azing.jp/score_input.cgi";

var ADD_POINT_CGI = "http://www.azing.jp/point_plus2.cgi";

var GAME_ID = "35";

var MINUS_VALUE = 300;

var AJAX_PHP = "php/ajax.php?url=";

var TextLabel = enchant.Class.create(enchant.Label, {
    initialize: function(text, size, color, align) {
        enchant.Label.call(this, text);
        this._lineHeight = "100%";
        this._wordWrap = "break-word";
        this.width = game.width;
        this.size = size || "12";
        this.color = color || "#000000";
        this.align = align || "left";
    },
    _lineHeight: {
        get: function() {
            return this._element.style.lineHeight;
        },
        set: function(height) {
            this._element.style.lineHeight = height;
        }
    },
    _wordWrap: {
        get: function() {
            return this._element.style.wordWrap;
        },
        set: function(wordwrap) {
            this._element.style.wordWrap = wordwrap;
        }
    },
    size: {
        get: function() {
            return this._element.style.fontSize;
        },
        set: function(size) {
            this._element.style.fontSize = size.toString() + "pt";
        }
    },
    align: {
        get: function() {
            return this.textAlign;
        },
        set: function(align) {
            this.textAlign = align;
        }
    }
});

var ConnectLabel = enchant.Class.create(TextLabel, {
    initialize: function(color) {
        var c = color || "#FF0000";
        TextLabel.call(this, "通信中", "15", c);
        this.x = ~~(game.width * .5) - ~~((this.size.substr(0, this.size.length - 2) - 0) * 2.25);
        this.y = ~~((game.height - 60) * .5);
        this.time = game.fps;
        this.onenterframe = function() {
            if (!(++this.age % this.time)) {
                this.text = this.text + ".";
                if (!(this.age % (this.time * 4))) {
                    this.text = "通信中";
                }
            }
        };
    }
});

var ButtonLib = enchant.Class.create(enchant.Group, {
    initialize: function(text, width, height, imgPath) {
        enchant.Group.call(this);
        this._visible = true;
        this._radiusSize = "10px";
        this._setBackGroundImage(width, height, imgPath);
        if (typeof text !== "undefined") {
            this.bText = new TextLabel(text, "", "#FFFFFF", "center");
            this.bText.width = this.width;
            this.bText.height = this.height;
            this.bText._lineHeight = this.bText.height + "px";
            this.addChild(this.bText);
        }
        this.addEventListener("touchstart", this._startFunction);
        this.addEventListener("touchend", this._endFunction);
    },
    _startFunction: function() {
        this.y++;
        this.bBack.opacity += .1;
    },
    _endFunction: function() {
        this.y--;
        this.bBack.opacity -= .1;
    },
    _inverseColor: function(baseColor) {
        baseColor = baseColor.replace("#", "");
        if (baseColor.length != 6) {
            return "#000000";
        }
        newColor = "";
        for (x = 0; x < 3; x++) {
            colorWK = 255 - parseInt(baseColor.substr(x * 2, 2), 16);
            if (colorWK < 0) {
                colorWK = 0;
            } else {
                colorWK = colorWK.toString(16);
            }
            if (colorWK.length < 2) {
                colorWK = "0" + colorWK;
            }
            newColor += colorWK;
        }
        return "#" + newColor;
    },
    _setBackGroundImage: function(width, height, path) {
        this.bBack = new Sprite(width || 110, height || 30);
        if (typeof path === "undefined") {
            this.radius = true;
            this.bBack.backgroundColor = "#000000";
            this.bBack.opacity = .7;
        } else {
            this.bBack.image = game.assets[path];
        }
        this.addChild(this.bBack);
    },
    textSize: {
        get: function() {
            return this.bText.size;
        },
        set: function(size) {
            this.bText.size = size;
        }
    },
    text: {
        get: function() {
            return this.bText.text;
        },
        set: function(text) {
            this.bText.text = text;
        }
    },
    width: {
        get: function() {
            return this.bBack.width;
        },
        set: function(width) {
            this.bText.width = this.bBack.width = width;
        }
    },
    height: {
        get: function() {
            return this.bBack.height;
        },
        set: function(height) {
            this.bText.height = this.bBack.height = height;
            this.bText._lineHeight = this.bText.height + "px";
        }
    },
    buttonColor: {
        get: function() {
            return this.bBack.backgroundColor;
        },
        set: function(color) {
            this.bBack.backgroundColor = color;
        }
    },
    textColor: {
        get: function() {
            return this.bText.color;
        },
        set: function(color) {
            this.bText.color = color;
        }
    },
    radius: {
        get: function() {
            return this._radius;
        },
        set: function(bool) {
            this._radius = bool;
            this.bBack._style[enchant.ENV.VENDOR_PREFIX + "BorderRadius"] = bool ? this._radiusSize : "0px";
        }
    },
    visible: {
        get: function() {
            this._visible;
        },
        set: function(bool) {
            this._visible = bool;
            this.bBack.visible = this.bText.visible = bool;
        }
    },
    opacity: {
        get: function() {
            this.bBack.opacity;
        },
        set: function(opa) {
            this.bBack.opacity = opa;
        }
    },
    setInverse: function(color) {
        if (typeof color !== "undefined") {
            this.buttonColor = color;
        }
        this.textColor = this._inverseColor(this.buttonColor);
    }
});

var RankingLib = enchant.Class.create({
    initialize: function(url) {
        this.url = "";
        this.params = [];
        this.setURL(url);
    },
    setURL: function(url) {
        this.url = url;
    },
    setParam: function(key, val) {
        this.params[key] = val;
    },
    getURL: function() {
        var params = [];
        for (var k in this.params) {
            params.push(k + "=" + this.params[k]);
        }
        params = params.join("&");
        if (this.url.indexOf("?") >= 0) {
            return this.url + "&" + params;
        } else {
            return this.url + "?" + params;
        }
    },
    getEncodeURL: function() {
        return encodeURIComponent(this.getURL());
    },
    clearParams: function() {
        this.params = [];
    },
    gotoSite: function() {
        window.location.href = this.getURL();
    }
});

var azLib = enchant.Class.create(enchant.Group, {
    initialize: function() {
        enchant.Group.call(this);
        this._objects = new Array();
        this._objectsID = 0;
        this._ticks = 0;
        this._variables = this._splitVariables(location.href);
        this.user_id = this._getValue(this._variables, "user_id");
        this.playStyle = "";
        this.score = -1;
    },
    _addedTick: function() {
        game.az._ticks++;
    },
    _touchReturn: function() {
        if (game.az._ticks > 5) {
            var crnt = game.currentScene;
            crnt.azReturnBtn3.ontouchstart = null;
            game.az._remove();
        }
    },
    _add: function(obj) {
        var crnt = game.currentScene;
        crnt.addChild(obj);
        this._objects[this._objectsID] = obj;
        this._objectsID++;
    },
    _remove: function() {
        var crnt = game.currentScene;
        for (var i = 0; game.az._objectsID > i; i++) {
            crnt.removeChild(game.az._objects[i]);
        }
    },
    _setBackground: function(height) {
        var crnt = game.currentScene;
        crnt.azAllBack = new Sprite(game.width, game.height);
        this._add(crnt.azAllBack);
        var _height = height || 150;
        crnt.azBackground = new Sprite(280, _height);
        crnt.azBackground.backgroundColor = "#000000";
        crnt.azBackground.moveTo(20, ~~((game.height - crnt.azBackground.height) / 2));
        crnt.azBackground.opacity = .9;
        this._add(crnt.azBackground);
    },
    _setReturn: function() {
        var crnt = game.currentScene;
        crnt.azReturnBtn0 = new Sprite(20, 20);
        crnt.azReturnBtn0.backgroundColor = "#AA0000";
        crnt.azReturnBtn0.x = crnt.azBackground.x + crnt.azBackground.width - crnt.azReturnBtn0.width;
        crnt.azReturnBtn0.y = crnt.azBackground.y;
        this._add(crnt.azReturnBtn0);
        crnt.azReturnBtn1 = new Sprite(20, 3);
        crnt.azReturnBtn1.backgroundColor = "#FFFFFF";
        crnt.azReturnBtn1.rotate(45);
        crnt.azReturnBtn1.x = crnt.azReturnBtn0.x;
        crnt.azReturnBtn1.y = crnt.azReturnBtn0.y + 8;
        this._add(crnt.azReturnBtn1);
        crnt.azReturnBtn2 = new Sprite(20, 3);
        crnt.azReturnBtn2.backgroundColor = "#FFFFFF";
        crnt.azReturnBtn2.rotate(-45);
        crnt.azReturnBtn2.x = crnt.azReturnBtn0.x;
        crnt.azReturnBtn2.y = crnt.azReturnBtn0.y + 8;
        this._add(crnt.azReturnBtn2);
        crnt.azReturnBtn3 = new Sprite(50, 50);
        crnt.azReturnBtn3.x = crnt.azBackground.x + crnt.azBackground.width - crnt.azReturnBtn3.width + 6;
        crnt.azReturnBtn3.y = crnt.azBackground.y - 6;
        this._add(crnt.azReturnBtn3);
        this._ticks = 0;
        crnt.azReturnBtn3.onenterframe = this._addedTick;
        crnt.azReturnBtn3.ontouchstart = this._touchReturn;
    },
    _setLoad: function() {
        var crnt = game.currentScene;
        crnt.azLoadingAllBack = new Sprite(game.width, game.height);
        this._add(crnt.azLoadingAllBack);
        crnt.azLoadingBackSprite = new Sprite(100, 40);
        crnt.azLoadingBackSprite.x = ~~((game.width - crnt.azLoadingBackSprite.width) / 2);
        crnt.azLoadingBackSprite.y = ~~((game.height - crnt.azLoadingBackSprite.height) / 2) - 20;
        crnt.azLoadingBackSprite.backgroundColor = "#FFFFFF";
        crnt.azLoadingBackSprite.opacity = .9;
        this._add(crnt.azLoadingBackSprite);
        crnt.azLoadingSprite = new ConnectLabel("#000000");
        this._add(crnt.azLoadingSprite);
    },
    _clearLoad: function() {
        var crnt = game.currentScene;
        crnt.removeChild(crnt.azLoadingAllBack);
        crnt.removeChild(crnt.azLoadingBackSprite);
        crnt.removeChild(crnt.azLoadingSprite);
    },
    _setError: function(types) {
        var type = types;
        var crnt = game.currentScene;
        this._clearLoad();
        crnt.azErrorAllBack = new Sprite(game.width, game.height);
        this._add(crnt.azErrorAllBack);
        crnt.azErrorBackSprite = new Sprite(200, 100);
        crnt.azErrorBackSprite.x = ~~((game.width - crnt.azErrorBackSprite.width) / 2);
        crnt.azErrorBackSprite.y = ~~((game.height - crnt.azErrorBackSprite.height) / 2) - 20;
        crnt.azErrorBackSprite.backgroundColor = "#FFFFFF";
        crnt.azErrorBackSprite.opacity = .9;
        this._add(crnt.azErrorBackSprite);
        crnt.azErrorTitle = new Label("通信エラー(" + type + ")");
        crnt.azErrorTitle.width = game.width;
        crnt.azErrorTitle.textAlign = "center";
        crnt.azErrorTitle.color = "#000000";
        crnt.azErrorTitle.y = crnt.azErrorBackSprite.y + 16;
        this._add(crnt.azErrorTitle);
        crnt.azErrorBtn = new ButtonLib("もう一度", 160, 40);
        crnt.azErrorBtn.radius = false;
        crnt.azErrorBtn.moveTo(80, 180);
        crnt.azErrorBtn.type = type;
        crnt.azErrorBtn.ontouchstart = function() {
            game.az._setLoad();
            game.az._getCGI(this.type);
            game.az._clearError();
        };
        this._add(crnt.azErrorBtn);
    },
    _clearError: function() {
        var crnt = game.currentScene;
        crnt.removeChild(crnt.azErrorAllBack);
        crnt.removeChild(crnt.azErrorBackSprite);
        crnt.removeChild(crnt.azErrorTitle);
        crnt.removeChild(crnt.azErrorBtn);
    },
    _setExpLabel: function() {
        var crnt = game.currentScene;
        crnt.azExpTitle = new Label("ポイントチャレンジについて");
        crnt.azExpTitle.width = game.width;
        crnt.azExpTitle.textAlign = "center";
        crnt.azExpTitle.color = "#FF0000";
        crnt.azExpTitle.y = crnt.azBackground.y + 10;
        this._add(crnt.azExpTitle);
        crnt.azExpBody = new Label("「ポイントチャレンジ」を選択するとゲームの結果に応じてAZポイントがもらえます！<br/><br/><br/>チャレンジは『1日に1度』のみで1回のチャレンジに『100ポイント』が必要となります。<br/><br/>また、一度チャレンジに利用したAZポイントは戻すことはできませんのでご注意ください。<br/><br/>お手持ちのAZポイントがない場合はポイントチャレンジはできません。<br/><br/>AZポイントを受け取らなければ再チャレンジが可能ですが、再チャレンジには新たに『100ポイント』が必要となります。");
        crnt.azExpBody.width = game.width - 60;
        crnt.azExpBody.color = "#FFFFFF";
        crnt.azExpBody._style.lineHeight = "100%";
        crnt.azExpBody.x = 30;
        crnt.azExpBody.y = crnt.azExpTitle.y + 30;
        this._add(crnt.azExpBody);
        crnt.azStartChallengeBtn = new ButtonLib("同意してプレイ", 120, 30);
        crnt.azStartChallengeBtn.radius = false;
        crnt.azStartChallengeBtn.setInverse("#FFFFFF");
        crnt.azStartChallengeBtn.moveTo(30, crnt.azBackground.y + crnt.azBackground.height - 52);
        crnt.azStartChallengeBtn.ontouchstart = function() {
            game.az._startChallenge();
        };
        this._add(crnt.azStartChallengeBtn);
        crnt.azCancelChallengeBtn = new ButtonLib("キャンセル", 120, 30);
        crnt.azCancelChallengeBtn.radius = false;
        crnt.azCancelChallengeBtn.setInverse("#FFFFFF");
        crnt.azCancelChallengeBtn.moveTo(170, crnt.azStartChallengeBtn.y);
        crnt.azCancelChallengeBtn.ontouchstart = function() {
            game.az._remove();
            game.az.setStart();
        };
        this._add(crnt.azCancelChallengeBtn);
    },
    _gotoChallengeExp: function() {
        this._remove();
        this._setBackground(310);
        this._setExpLabel();
    },
    _startChallenge: function() {
        this._setLoad();
        this._getCGI(0);
    },
    _splitVariables: function(url) {
        var tmp = url.split("?");
        if (tmp[1]) {
            tmp = tmp[1].split("&");
            return tmp;
        } else {
            return "";
        }
    },
    _getValue: function(ary, name) {
        var rtn = "";
        for (var i = 0; i < ary.length; i++) {
            var tmp = ary[i].split("=");
            if (tmp[0] == name) {
                rtn = tmp[1];
                break;
            }
        }
        return rtn;
    },
    _getCGI: function(types) {
        var errorAction = function() {
            xhr.abort();
            game.az._setError(type);
        };
        var xhr = new XMLHttpRequest();
        var type = types;
        if (type == 0) {
            var enc = PLAY_COUNT_CGI + "?user_id=" + this.user_id + "&game_id=" + GAME_ID;
            enc = encodeURIComponent(enc);
            var ul = AJAX_PHP + enc;
        } else if (type == 1) {
            var enc = LEFT_POINT_CGI + "?user_id=" + this.user_id + "&point=" + MINUS_VALUE + "&game_id=" + GAME_ID;
            enc = encodeURIComponent(enc);
            var ul = AJAX_PHP + enc;
        } else if (type == 2) {
            var enc = SUBMIT_CGI + "?user_id=" + this.user_id + "&game_id=" + GAME_ID + "&score=" + this.score;
            enc = encodeURIComponent(enc);
            var ul = AJAX_PHP + enc;
        } else if (type == 3) {
            var enc = ADD_POINT_CGI + "?user_id=" + this.user_id + "&point=" + this.add_points + "&game_id=" + GAME_ID;
            enc = encodeURIComponent(enc);
            var ul = AJAX_PHP + enc;
        }
        xhr.open("GET", ul);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 0) {
                    errorAction();
                } else if (200 <= xhr.status && xhr.status < 300 || xhr.status == 304) {
                    var dom = document.createElement("dom");
                    dom.innerHTML = xhr.responseText;
                    if (dom.innerHTML.match(/OK/)) {
                        if (type == 0) {
                            game.az._getCGI(1);
                        } else if (type == 1) {
                            game.az.playStyle = "challenge";
                            game.replaceScene(new playScene());
                        } else if (type == 2 || type == 3) {
                            game.az.rank = new RankingLib();
                            game.az.rank.setURL(SITE_URL);
                            game.az.rank.gotoSite();
                        }
                    } else if (dom.innerHTML.match(/NG/)) {
                        if (type == 0) {
                            game.az.playStyle = "challenge";
                            game.replaceScene(new playScene());
                        } else if (type == 1) {
                            game.az._NGMoney();
                        } else if (type == 2 || type == 3) {}
                    } else {
                        errorAction();
                    }
                } else {
                    errorAction();
                }
            }
        };
        xhr.send();
    },
    _NGMoney: function() {
        var crnt = game.currentScene;
        this._remove();
        this._setBackground();
        crnt.azNGExp = new Label("ポイント不足のためプレイできません。");
        crnt.azNGExp.width = game.width;
        crnt.azNGExp.textAlign = "center";
        crnt.azNGExp.color = "#FF0000";
        crnt.azNGExp.y = crnt.azBackground.y + 20;
        this._add(crnt.azNGExp);
        crnt.azToSiteBtn = new ButtonLib("サイトトップへ", 140, 30);
        crnt.azToSiteBtn.radius = false;
        crnt.azToSiteBtn.setInverse("#FFFFFF");
        crnt.azToSiteBtn.x = ~~((game.width - crnt.azToSiteBtn.width) / 2);
        crnt.azToSiteBtn.y = crnt.azBackground.y + crnt.azBackground.height - 100;
        crnt.azToSiteBtn.ontouchstart = function() {
            game.az._setLoad();
            game.az.rank = new RankingLib();
            game.az.rank.setURL(SITE_URL);
            game.az.rank.gotoSite();
        };
        this._add(crnt.azToSiteBtn);
        crnt.azStartBtn = new ButtonLib("通常ゲーム", 140, 30);
        crnt.azStartBtn.radius = false;
        crnt.azStartBtn.setInverse("#FFFFFF");
        crnt.azStartBtn.x = crnt.azToSiteBtn.x;
        crnt.azStartBtn.y = crnt.azToSiteBtn.y + crnt.azToSiteBtn.height + 20;
        crnt.azStartBtn.ontouchstart = function() {
            game.az.playStyle = "normal";
            game.replaceScene(new playScene());
        };
        this._add(crnt.azStartBtn);
    },
    setStart: function() {
        var crnt = game.currentScene;
        this._setBackground();
        this._setReturn();
        crnt.azStartBtn = new ButtonLib("通常ゲーム", 160, 40);
        crnt.azStartBtn.radius = false;
        crnt.azStartBtn.setInverse("#FFFFFF");
        crnt.azStartBtn.moveTo(80, 160);
        crnt.azStartBtn.ontouchstart = function() {
            game.az.playStyle = "normal";
            game.replaceScene(new playScene());
        };
        this._add(crnt.azStartBtn);
        crnt.azChallengeBtn = new ButtonLib("ポイントチャレンジ", 160, 40);
        crnt.azChallengeBtn.radius = false;
        crnt.azChallengeBtn.setInverse("#FFFFFF");
        crnt.azChallengeBtn.moveTo(80, 220);
        crnt.azChallengeBtn.ontouchstart = function() {
            game.az._gotoChallengeExp();
        };
        this._add(crnt.azChallengeBtn);
    },
    setEnd: function(scores, point) {
        var crnt = game.currentScene;
        var btnWidth = 160;
        var btnHeight = 40;
        this.score = scores;
        if (this.playStyle == "normal") {
            crnt.azBtn0 = new ButtonLib("サイトトップへ", btnWidth, btnHeight);
            crnt.azBtn0.ontouchstart = function() {
                game.az._setLoad();
                game.az.rank = new RankingLib();
                game.az.rank.setURL(SITE_URL);
                game.az.rank.gotoSite();
            };
        } else {
            this.add_points = point;

            crnt.azExpBody = new Label("お疲れ様でした！<br/><br/>今回の獲得ポイントは『" + point + "ポイント』です！<br/><br/><br/>チャレンジは『1日に1度』になります。<br/><br/>「ポイントを受け取ってゲーム終了」を選ぶと、上記のAZポイントがプレゼントされ、本日のチャレンジは終了となります。<br/><br/>「再チャレンジ」を選ぶと、100ポイントを使用し、再度ポイントチャレンジを行うことが出来ます。");
            crnt.azExpBody.width = game.width - 60;
            crnt.azExpBody.color = "#FFFFFF";
            crnt.azExpBody._style.lineHeight = "100%";
            crnt.azExpBody.x = 30;
            crnt.azExpBody.y = 90;
            this._add(crnt.azExpBody);

            //crnt.azBtn0 = new ButtonLib("スコア送信", btnWidth, btnHeight);
            crnt.azBtn0 = new ButtonLib("ポイントを受け取ってゲーム終了", btnWidth + 80, btnHeight);
            crnt.azBtn0.ontouchstart = function() {
                game.az._setLoad();
                game.az._getCGI(3);
            };
        }
        var buttonTop = this.playStyle == "normal" ? 260 : 280;

        crnt.azBtn0.radius = false;
        crnt.azBtn0.setInverse("#FFFFFF");
        crnt.azBtn0.moveTo(this.playStyle == "normal" ? 80 : 40, buttonTop);
        this._add(crnt.azBtn0);
        crnt.azBtn1 = new ButtonLib("再チャレンジ", btnWidth, btnHeight);
        if (this.playStyle == "normal") {
            crnt.azBtn1.ontouchstart = function() {
                game.replaceScene(new playScene());
            };
        } else {
            crnt.azBtn1.ontouchstart = function() {
                game.az._startChallenge();
            };
        }
        crnt.azBtn1.radius = false;
        crnt.azBtn1.setInverse("#FFFFFF");
        crnt.azBtn1.moveTo(80, buttonTop + 60);
        this._add(crnt.azBtn1);
    }
});