var playScene = enchant.Class.create(enchant.Scene, {
	initialize: function(stage, score) {
		var game = enchant.Game.instance;
		enchant.Scene.call(this);
		game.setCentering(this);
		this.time = 0;

		this.exp = new Array();
		this.enemy = new Array();
		
		bg = new Sprite(320,416);
		bg.image = game.assets['img/bg.jpg'];
		this.addChild(bg);
		
		this.map = new ExMap(32,32);
		this.map.image = game.assets['img/harvest.png'];
		this.addChild(this.map);
		
		this.farmer=[];
		for (i=0;i<FARMER_INIT_NUM;i++){
			x = parseInt(Math.random()*(MAP_WIDTH-6)+3)*32;
			y = parseInt(Math.random()*(MAP_HEIGHT-8)+4)*32;
			f = new Farmer(x,y);
			this.farmer.push(f);
			this.addChild(f);
		}
		
		this.go_f = 0;
		this.gs_f = 0;
		this.max_combo = 0;
		this.combo = 0;
		
		this.statusframe = new StatusFrame(this.stage);
		this.addChild(this.statusframe);
		this.wait_massage = new WaitMessage();
		this.is_finish = false;
		
		this.score=new ScoreLabel(10,10);
		this.score.score=0;
		this.addChild(this.score);

		this.clock = new Clock();
		this.clock.x = 320-32;
		this.clock.y = 55;
		this.addChild(this.clock);
		this.ready = new Ready();
		this.addChild(this.ready);
		
	},
	onenterframe:function(){
		if (this.go_f != 1 ||  this.is_finish == true) return;
		
		if (this.age % 15==0){
			n = Math.random()*2;
			
			for (i=0;i<n;i++){
				x = parseInt(Math.random()*(MAP_WIDTH-2)+1)*32;
				y = parseInt(Math.random()*(MAP_HEIGHT-2)+1)*32;
				style = parseInt(Math.random()*2);
				enemy = new Enemy(x,y,style);
				this.enemy.push(enemy);
				this.addChild(enemy);
			}
			
		}
		
		for (i=0;i<this.enemy.length;i++){
			if (this.enemy[i].del == 1){
				this.removeChild(this.enemy[i]);
				this.enemy.splice(i,1);
			}
		}
		for (i=0;i<this.exp.length;i++){
			if (this.exp[i].del == 1){
				this.removeChild(this.exp[i]);
				this.exp.splice(i,1);
			}
		}
	},
	ontouchstart:function(e){
		if (this.go_f != 1 ||  this.is_finish == true) return;
		
		var pos = this._element.getBoundingClientRect();
		x=Math.floor(e.x - ((pos.left) / game.scale));
		y=Math.floor(e.y - ((pos.top) / game.scale));
		
		if (this.map.checkTile(x,y) === BLOCK_STAGE3){
			comboflag=false;
			
			if (0 <= x && x <= 320-32){
				if (this.map.checkTile(x-32,y) === BLOCK_FINAL_STAGE
				|| this.map.checkTile(x+32,y) === BLOCK_FINAL_STAGE){
					this.combo++;
					l = new enchant.Label("combo: "+this.combo);
					l.x = x;
					l.y = y;
					this.addChild(l);
					l.onenterframe=function(){
						l.y--;
						if (this.age > 10){
							this.parentNode.removeChild(this);
						}
					};
					if (this.max_combo < this.combo) this.max_combo = this.combo;
					comboflag=true;
				}
			}
			if (0 <= y && y <= 416-32){
				if (this.map.checkTile(x,y-32) === BLOCK_FINAL_STAGE
				|| this.map.checkTile(x,y+32) === BLOCK_FINAL_STAGE){
					this.combo++;
					l = new enchant.Label("combo: "+this.combo);
					l.x = this.x;
					l.y = this.y;
					this.addChild(l);
					l.onenterframe=function(){
						l.y--;
						if (this.age > 10){
							this.parentNode.removeChild(this);
						}
					};
					if (this.max_combo < this.combo) this.max_combo = this.combo;
					comboflag=true;
				}
			}
			exp= new Explode(x,y);
			this.exp.push(exp);
			this.addChild(exp);

			this.score.score+=UNIT_SCORE*this.combo;
			this.map.setTile(x,y,BLOCK_FINAL_STAGE);
			
			if (comboflag == false) this.combo=0;
			
		}

	},
	enterframeAction: function(e) {
		if (this.time < 36) {
			this.time++;
		} else {
			this.removeChild(this.wait_message);
			this.removeEventListener(enchant.Event.ENTER_FRAME, this.enterframeAction);
			game.replaceScene(new endScene(this.score.score, this.max_combo));
		}
	},
	startTimer: function(idx) {
		this.takebuttons[idx].setTakeEnable();
	},
	stopTimer: function(idx) {
		score = this.visitors[idx][0].checkOrder(this.table.getToppingFlags());
		this.statusframe.addScore(score);
		this.takebuttons[idx].unsetTakeEnable();
	},
	setClose: function() {
		this.time = 0;
		this.is_finish = true;
		this.addChild(this.wait_massage);
		this.addEventListener(enchant.Event.ENTER_FRAME, this.enterframeAction);
	}
});
var StatusFrame = enchant.Class.create(enchant.Group, {
	initialize: function(stage) {
		enchant.Group.call(this);
		var game = enchant.Game.instance;
		this.stage = stage;
	}
});

var ExMap = enchant.Class.create(enchant.Map, {
	initialize:function(tileWidth,tileHeight){
		Map.call(this,tileWidth,tileHeight);
		this.scrolltimes=0;
		var data=[[]];
		this.preblock = -1;
		this.prepos=-1;
		for (i=0;i<MAP_HEIGHT;i++){
			data[i]=[];
			for (j=0;j<MAP_WIDTH;j++){
				data[i][j]=BLOCK_NORMAL;
			}
		}
		this.loadData(data);
	},
	setTile:function (x,y,tile){
		if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
			return false;
	    }
		var width = this._image.width;
		var height = this._image.height;
		var tileWidth = this._tileWidth || width;
		var tileHeight = this._tileHeight || height;
		x = x / tileWidth | 0;
		y = y / tileHeight | 0;
		var data = this._data[0];
		data[y][x]=tile;
		this._data[0]=data;
		this._dirty = true;

		return true;
	}
});

var Enemy = enchant.Class.create(enchant.Sprite, {
	initialize:function(x,y,style){
		Sprite.call(this,32,32);
		this.posx = x;
		this.posy = y;
		this.get=0;
		
		vector = parseInt(Math.random()*4);
		this.vector=vector;
		if (vector==0){
			this.x = parseInt(Math.random()*MAP_WIDTH)*32;
			this.y = 0;
		}else if (vector==1){
			this.x = parseInt(Math.random()*MAP_WIDTH)*32;
			this.y = 416-32;
		}else if (vector==2){
			this.y = parseInt(Math.random()*MAP_HEIGHT)*32;
			this.x = 0;
		}else if (vector==3){
			this.y = parseInt(Math.random()*MAP_HEIGHT)*32;
			this.x = 320-32;
		}
		this.dx=(this.posx-this.x)/20;
		this.dy=(this.posy-this.y)/20;
		if (this.dx > 0) this.scaleX=-1;
		
		this.image = game.assets['img/harvest.png'];
		this.frame = 5;
	},
	onenterframe:function(){
		if (this.x < 0 || this.x > 320 || this.y < 0 || this.y > 416){
			this.del=1;
			return;
		}
		
		this.frame = 5+this.age%2;
		if (this.get==0){
			this.x +=this.dx;
			this.y +=this.dy;
			this.scaleX=1;
			if (this.dx > 0) this.scaleX=-1;
		}else{
			if (this.vector==0 || this.vector==1){
				this.x +=this.dx;
				this.y -=this.dy;
				this.scaleX=1;
				if (this.dx > 0) this.scaleX=-1;
			}else if (this.vector==2 || this.vector==3){
				this.x -=this.dx;
				this.y +=this.dy;
				this.scaleX=1;
				if (-1*this.dx > 0) {
					this.scaleX=-1;
				}
			}
		}
		if (this.get!=1){
			if (this.parentNode.map.checkTile(this.x+16, this.y+16)===BLOCK_STAGE3){
				exp = new Explode(this.x+16,this.y+16);
				this.parentNode.exp.push(exp);
				this.parentNode.addChild(exp);
				this.parentNode.map.setTile(this.x+16,this.y+16,BLOCK_FINAL_STAGE);
				this.get = 1;
			}
		}
	}
});

var Farmer = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y){
		Sprite.call(this, 32, 32);
		this.x = x;
		this.y = y;
		this.image = game.assets['img/farmer.png'];
		this.frame = 0;
		this.move=false;
		this.action=-1;
	},
	onenterframe:function(){
		if (this.parentNode.go_f != 1 || this.parentNode.is_finish == true) return;
		
		if (this.move==false){
			if (this.parentNode.map.checkTile(this.x, this.y) === BLOCK_NORMAL){
				this.parentNode.map.setTile(this.x,this.y, BLOCK_STAGE1);
			}else if (this.parentNode.map.checkTile(this.x, this.y) === BLOCK_STAGE1){
				this.parentNode.map.setTile(this.x,this.y, BLOCK_STAGE2);
			}else if (this.parentNode.map.checkTile(this.x, this.y) === BLOCK_STAGE2){
				this.parentNode.map.setTile(this.x,this.y, BLOCK_STAGE3);
			}

			this.action = parseInt(Math.random()*4);
			this.move=true;
		}else{
			if (0<= this.action && this.action < 4){
				this.frame=this.action*6+this.age%3;
			}
			if (this.action==0){
				this.x +=0;
				this.y +=4;
			}else if (this.action==1){
				this.x -=4;
				this.y +=0;
			}else if (this.action==2){
				this.x +=4;
				this.y +=0;
			}else if (this.action==3){
				this.x +=0;
				this.y -=4;
			}
			if (this.x < 0){
				this.x = 0;
			}
			if (this.x > 320-32){
				this.x = 320-32;
			}
			if (this.y < 0){
				this.y = 0;
			}
			if (this.y > 416-32){
				this.y=416-32;
			}
			if (this.x%32==0 && this.y%32==0){
				this.move=false;
			}
		}

	}
});

var Explode = enchant.Class.create(enchant.Sprite, {
	initialize: function (x, y){
		enchant.Sprite.call(this,64,64);
		this.x = x-32;
		this.y = y-32;
		var game = enchant.Game.instance;
		this.image=game.assets['img/exp.png'];
		this.del =0;
	},
	onenterframe:function(){
		if (this.age > 30){
			this.parentNode.map.setTile(this.x+32,this.y+32,BLOCK_NORMAL);
			this.parentNode.removeChild(this);
			this.del=1;
		}
		this.frame++;
		if (this.frame == 10){
			this.visible=false;
		}
	}
});

var WaitMessage = enchant.Class.create(enchant.Group, {
	initialize: function() {
		enchant.Group.call(this);
		var game = enchant.Game.instance;
		this.end_massage = new Sprite(320, 416);
		this.end_massage._element.style.zIndex = 6;
		this.end_massage.image = game.assets['img/end_all.png'];
		this.end_massage.y = 30;
		this.addChild(this.end_massage);
		this.addEventListener(enchant.Event.ENTER_FRAME, this.enterframe);
	},
	enterframe: function() {
		if (this.end_massage.frame != 29) {
			this.end_massage.frame++;
		}
	}
});
var Clock = enchant.Class.create(enchant.Group, {
	initialize: function() {
		enchant.Group.call(this);
		var game = enchant.Game.instance;
		var bg = new Sprite(31, 360);
		bg.image = game.assets['img/time_bar2.png'];
		this.addChild(bg);
		this.bar = new Sprite(31, 360);
		this.bar.image = game.assets['img/time_bar.png'];
		this.addChild(this.bar);
		this.time = new Label("TIME");
		this.time.x = -2;
		this.time.y = -38;
		this.time.color = "#FFF";
		this.time._element.style.fontSize = "12pt";
		this.time.width = 27;
		this.time._element.style.textAlign = "center";
		this.addChild(this.time);
		this.time_no = new Label(this.bar.height / 12);
		this.time.x = -2;
		this.time_no.y = -22;
		this.time_no._element.style.fontSize = "12pt";
		this.time_no.color = "#FFF";
		this.time_no.width = 27;
		this.time_no._element.style.textAlign = "center";
		this.addChild(this.time_no);
	},
	start: function() {
		this.addEventListener(enchant.Event.ENTER_FRAME, this.enterframeAction);
	},
	stop: function() {
		this.removeEventListener(enchant.Event.ENTER_FRAME, this.enterframeAction);
	},
	enterframeAction: function() {
		if (Math.round((this.bar.height - 0.5) / 12) < 0) {
			this.removeEventListener(enchant.Event.ENTER_FRAME, this.enterframeAction);
			this.parentNode.setClose();
		} else {
			this.bar.height -= 1;
			this.time_no.text = Math.round(this.bar.height / 12);
		}
	}
});
var Ready = enchant.Class.create(enchant.Group, {
	initialize: function() {
		enchant.Group.call(this);
		var game = enchant.Game.instance;
		this.alpha = new Sprite(game.width, game.height);
		this.alpha.opacity = 0.75;
		this.alpha.backgroundColor = "#000000";
		this.addChild(this.alpha);
		this.start_name = new Label("touch to the<br/>game start...");
		this.start_name.width = 320;
		this.start_name.height = 416;
		this.start_name.y = 250;
		this.start_name.color = "#FFFFFF";
		this.start_name._element.style.textAlign = "center";
		this.start_name._element.style.zIndex = 6;
		this.start_name._element.style.fontSize = "16pt";
		this.start_name.opacity = 0;
		this.cnt = 0;
		this.addChild(this.start_name);
		this.stage_name = new Sprite(320, 416);
		this.stage_name.image = game.assets['img/ready_all.png'];
		this.addChild(this.stage_name);
		this.addEventListener(enchant.Event.ENTER_FRAME, this.enterframeAction);
	},
	touchAction: function(e) {
		this.start_name.opacity = 0;
		this.cnt = 0;
		this.parentNode.gs_f = 1;
		this.stage_name.frame = 8;
		this.removeEventListener(enchant.Event.TOUCH_START, this.touchAction);
	},
	enterframeAction: function() {
		if (this.parentNode.gs_f == 1) {
			if (this.cnt >= 8) {
				this.parentNode.go_f = 1;
				this.parentNode.clock.start();
				this.parentNode.removeChild(this);
			} else {
				this.cnt++;
			}
		} else {
			if (this.stage_name.frame < 6) {
				this.stage_name.frame++;
			} else {
				this.cnt++;
				if (this.cnt >= 5) {
					this.cnt = 0;
					if (this.stage_name.frame == 7) {
						this.stage_name.frame = 6;
					} else {
						this.stage_name.frame = 7;
					}
				}
				if (this.start_name.opacity != 1) {
					this.start_name.opacity = 1;
					var startBG = new Sprite(320, 416);
					this.addEventListener(enchant.Event.TOUCH_START, this.touchAction);
					this.addChild(startBG);
				}
			}
		}
	}
});