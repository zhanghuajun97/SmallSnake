class GameScene extends egret.DisplayObjectContainer{
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
	}

	private stageW:number;
	private stageH:number;
	private onAddToStage(e:egret.Event):void{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
		this.stageW = this.stage.stageWidth;
		this.stageH = this.stage.stageHeight;
		this.createBg();
		this.createSnake();
		this.createApple();
		this.createScoreText();
		this.createControl();
		this.addEventListener(egret.Event.ENTER_FRAME,this.viewUpdate,this);
	}

	private createBg():void{
		var bg:egret.Shape = new egret.Shape();
		bg.graphics.beginFill(0x061f27);
		bg.graphics.drawRect(0,0,this.stageW,this.stageH);
		bg.graphics.endFill();
		this.addChild(bg);
	}

	private snake:egret.Bitmap[];
	private snakeSize:number = 15;
	private createSnake():void{
		this.snake = [];
		for (var i = 0; i < 10; i++) {
			var snakeImp:egret.Bitmap = new egret.Bitmap(RES.getRes("snake_png"));
			this.addChild(snakeImp);
			snakeImp.x = 150+this.snakeSize*i;
			snakeImp.y = 150;
			this.snake.push(snakeImp);
		}
	}

	private apple:egret.Bitmap;
	private appleSize:number = 15;
	private createApple():void{
		var appleImp:egret.Bitmap = new egret.Bitmap(RES.getRes("apple_png"));
		this.addChild(appleImp);
		appleImp.x = Math.floor(Math.random()*(this.stageW/this.appleSize))*this.appleSize;
		appleImp.y = Math.floor(Math.random()*(this.stageH/this.appleSize))*this.appleSize;
		this.apple = appleImp;
	}

	private score:number = 0;
	private speed:number = 0;
	private scoreText:egret.TextField;
	private speedText:egret.TextField;
	private createScoreText():void{
		this.scoreText =  new egret.TextField;
		this.scoreText.text = "SCORE : " + this.score;
		this.addChild(this.scoreText);
		this.scoreText.x = this.appleSize;
		this.scoreText.y = this.appleSize;

		this.speedText = new egret.TextField();
		this.speedText.text = "SPEED : " + this.speed;
		this.addChild(this.speedText);
		this.speedText.x = this.stageW-this.speedText.width-this.appleSize;
		this.speedText.y = this.appleSize;
	}

	private upControl:egret.Bitmap;
	private downControl:egret.Bitmap;
	private leftControl:egret.Bitmap;
	private rightControl:egret.Bitmap;
	private createControl():void{
        //上
        let upControl=new egret.Bitmap(RES.getRes('control_png'))
        GameUntil.createBitmap(upControl,90,this.stageW-upControl.width*4,this.stageH-upControl.height*4);
        this.upControl=upControl;
        this.upControl.touchEnabled=true;
        this.addChild(this.upControl);
        this.upControl.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startControl,this);
        //下
        let downControl=new egret.Bitmap(RES.getRes('control_png'));
        GameUntil.createBitmap(downControl,-90,this.stageW-downControl.width*4,this.stageH-downControl.height);
        this.downControl=downControl;
        this.downControl.touchEnabled=true;
        this.addChild(this.downControl);
        this.downControl.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startControl,this);
        //左
        let leftControl=new egret.Bitmap(RES.getRes('control_png'));
        GameUntil.createBitmap(leftControl,0,this.stageW-leftControl.width*6,this.stageH-leftControl.height/2*5);
        this.leftControl=leftControl;
        this.leftControl.touchEnabled=true;
        this.addChild(this.leftControl);
        this.leftControl.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startControl,this);
        //右
        let rightControl=new egret.Bitmap(RES.getRes('control_png'));
        GameUntil.createBitmap(rightControl,180,this.stageW-rightControl.width*2,this.stageH-rightControl.height/2*5);
        this.rightControl=rightControl;
        this.rightControl.touchEnabled=true;
        this.addChild(this.rightControl);
        this.rightControl.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startControl,this);  
	}

	private moveDistance:string = "right";
	private newDistance:string;
	private startControl(e:egret.TouchEvent):void{
		if (e.target == this.upControl && this.moveDistance != "down") {
			this.newDistance = "up";
		}else if (e.target == this.downControl && this.moveDistance != "up") {
			this.newDistance = "down";
		}else if (e.target == this.leftControl && this.moveDistance != "right") {
			this.newDistance = "left";
		}else if (e.target == this.rightControl && this.moveDistance != "left") {
			this.newDistance = "right";
		}
		this.moveDistance = this.newDistance;
	}

	private gameOver():void{
		this.removeEventListener(egret.Event.ENTER_FRAME,this.viewUpdate,this);
		this.upControl.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.startControl,this);
		this.downControl.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.startControl,this);
		this.leftControl.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.startControl,this);
		this.rightControl.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.startControl,this);
	}

	private timeUpdate:number = 1;
	private viewUpdate(e:egret.Event):void{
		var head = this.snake[this.snake.length-1];
		var headX:number = head.x;
		var headY:number = head.y;
		var tail = this.snake[0];
		var tailX = tail.x;
		var tailY = tail.y;

		this.timeUpdate++;

		if (this.speed != 9) {
			this.speed = Math.floor(this.score/4);
		}

	//吃到苹果
	for(var i=0;i<this.snake.length;i++){
		var snakeBody=this.snake[i];
		if(snakeBody.x==this.apple.x&&snakeBody.y==this.apple.y){
			this.removeChild(this.apple);
			this.score++;
			var body:egret.Bitmap=new egret.Bitmap(RES.getRes('snake_png'));
			this.addChild(body);
			body.x=tailX;
			body.y=tailY;
			this.snake.unshift(body);
			this.scoreText.text="SCORE:"+this.score;
			this.speedText.text="SPEED:"+this.speed;
			this.createApple();
		}
	}
	//蛇身相撞，游戏结束
	for(var i=0;i<this.snake.length-1;i++){
		if(headX==this.snake[i].x&&headY==this.snake[i].y){
			var over:egret.TextField=new egret.TextField();
			over.text="GAME OVER";
			this.addChild(over);
			over.x=(this.stageW-over.width)/2;
			over.y=this.stageH/2;
			this.gameOver();
		}
	}
	//蛇身移动
	if(this.timeUpdate%(10-this.speed)==0){
		if(this.moveDistance=='up'){
			if(headY<=0){
				tail.y=this.stageH-this.snakeSize;
			}else{
				tail.y=headY-this.snakeSize;
			}
			tail.x=headX;
			this.snake.shift();
			this.snake.push(tail);
		}else if(this.moveDistance=='down'){
			if(headY>=this.stageH-this.snakeSize){
				tail.y=0;
			}else{
				tail.y=headY+this.snakeSize;
			}
			tail.x=headX;
			this.snake.shift();
			this.snake.push(tail);
		}else if(this.moveDistance=='left'){
			if(headX<=0){
				tail.x=this.stageW-this.snakeSize;
			}else{
				tail.x=headX-this.snakeSize;
			}
			tail.y=headY;
			this.snake.shift();
			this.snake.push(tail);
		}else if(this.moveDistance=='right'){
			if(headX>=this.stageW-this.snakeSize){
				tail.x=0;
			}else{
				tail.x=headX+this.snakeSize;
			}
			tail.y=headY;
			this.snake.shift();
			this.snake.push(tail);
		}
	}

	}
		
}