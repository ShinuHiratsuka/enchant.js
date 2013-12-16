var endScene = enchant.Class.create(enchant.Scene, {
	initialize: function(scr,cmb) {
		enchant.Scene.call(this);
		game.setCentering(this);
		this.score = scr;
		this.combo = cmb;

		var cnt = 0;
		this.t_f = 0;
		this.addEventListener(enchant.Event.ENTER_FRAME, function() {
			cnt++;
			var game = enchant.Game.instance;
			if (cnt==1){
				var alpha = new Sprite(game.width, game.height);
				alpha.opacity = 0.75;
				alpha.backgroundColor = "#000000";
				this.addChild(alpha);
				var title = new Label("最終結果");
				title.y = 60;
				title.width = game.width;
				title.color = "#FFF";
				title._element.style.textAlign = 'center';
				title._element.style.fontSize = "22pt";
				this.addChild(title);

				var maxren_name = new Label("最大同時爆破数：");
				maxren_name.x = 32;
				maxren_name.y = 140;
				maxren_name._element.style.zIndex = 6;
				maxren_name._element.style.fontSize = "16pt";
				maxren_name.color = "#FFF";
				this.addChild(maxren_name);
				maxren = new Label(this.combo);
				maxren.x = 70;
				maxren.y = maxren_name.y;
				maxren.width = 200;
				maxren.color = "#FFF";
				maxren._element.style.textAlign = "right";
				maxren._element.style.fontSize = "16pt";
				this.addChild(maxren);
				
				var score_name = new Label("スコア：");
				score_name.x = 32;
				score_name.y = 180;
				score_name._element.style.fontSize = "22pt";
				score_name.color = "#FFF";
				this.addChild(score_name);
				score = new Label(this.score);
				score.x = 141;
				score.y = score_name.y;
				score.width = 120;
				score.color = "#FFF";
				score._element.style.textAlign = "right";
				score._element.style.fontSize = "22pt";
				this.addChild(score);
			} else if (cnt == 42) {
				if (game.az.playStyle == "normal") {
					game.az.setEnd(this.score);
				} else {
					var point = Math.max(score - 100, 0);

					game.az.setEnd(this.score, point);
				}
			}
			if (this.t_f) {
				this.removeEventListener(enchant.Event.ENTER_FRAME, arguments.callee);
				this.end();
			}
		});
		this.end = function() {
			for (var i = this.childNodes.length - 1; i >= 0; i--) {
				this.removeChild(this.childNodes[i]);
			}
			delete this;
			var game = enchant.Game.instance;
			var nex = this.t_f & 2 ? new playScene() : new titleScene();
			game.replaceScene(nex);
		};
	},
	titleAct: function(e) {
		this.removeEventListener("touchstart", this.parentNode.titleAct);
		this.parentNode.t_f = 1;
	},
	retryAct: function(e) {
		this.removeEventListener("touchstart", this.parentNode.retryAct);
		this.parentNode.t_f = 2;
	}
});