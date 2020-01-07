var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this) || this;
        _this.snakeSize = 15;
        _this.appleSize = 15;
        _this.score = 0;
        _this.speed = 0;
        _this.moveDistance = "right";
        _this.timeUpdate = 1;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    GameScene.prototype.onAddToStage = function (e) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        this.createBg();
        this.createSnake();
        this.createApple();
        this.createScoreText();
        this.createControl();
        this.addEventListener(egret.Event.ENTER_FRAME, this.viewUpdate, this);
    };
    GameScene.prototype.createBg = function () {
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x061f27);
        bg.graphics.drawRect(0, 0, this.stageW, this.stageH);
        bg.graphics.endFill();
        this.addChild(bg);
    };
    GameScene.prototype.createSnake = function () {
        this.snake = [];
        for (var i = 0; i < 10; i++) {
            var snakeImp = new egret.Bitmap(RES.getRes("snake_png"));
            this.addChild(snakeImp);
            snakeImp.x = 150 + this.snakeSize * i;
            snakeImp.y = 150;
            this.snake.push(snakeImp);
        }
    };
    GameScene.prototype.createApple = function () {
        var appleImp = new egret.Bitmap(RES.getRes("apple_png"));
        this.addChild(appleImp);
        appleImp.x = Math.floor(Math.random() * (this.stageW / this.appleSize)) * this.appleSize;
        appleImp.y = Math.floor(Math.random() * (this.stageH / this.appleSize)) * this.appleSize;
        this.apple = appleImp;
    };
    GameScene.prototype.createScoreText = function () {
        this.scoreText = new egret.TextField;
        this.scoreText.text = "SCORE : " + this.score;
        this.addChild(this.scoreText);
        this.scoreText.x = this.appleSize;
        this.scoreText.y = this.appleSize;
        this.speedText = new egret.TextField();
        this.speedText.text = "SPEED : " + this.speed;
        this.addChild(this.speedText);
        this.speedText.x = this.stageW - this.speedText.width - this.appleSize;
        this.speedText.y = this.appleSize;
    };
    GameScene.prototype.createControl = function () {
        //上
        var upControl = new egret.Bitmap(RES.getRes('control_png'));
        GameUntil.createBitmap(upControl, 90, this.stageW - upControl.width * 4, this.stageH - upControl.height * 4);
        this.upControl = upControl;
        this.upControl.touchEnabled = true;
        this.addChild(this.upControl);
        this.upControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startControl, this);
        //下
        var downControl = new egret.Bitmap(RES.getRes('control_png'));
        GameUntil.createBitmap(downControl, -90, this.stageW - downControl.width * 4, this.stageH - downControl.height);
        this.downControl = downControl;
        this.downControl.touchEnabled = true;
        this.addChild(this.downControl);
        this.downControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startControl, this);
        //左
        var leftControl = new egret.Bitmap(RES.getRes('control_png'));
        GameUntil.createBitmap(leftControl, 0, this.stageW - leftControl.width * 6, this.stageH - leftControl.height / 2 * 5);
        this.leftControl = leftControl;
        this.leftControl.touchEnabled = true;
        this.addChild(this.leftControl);
        this.leftControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startControl, this);
        //右
        var rightControl = new egret.Bitmap(RES.getRes('control_png'));
        GameUntil.createBitmap(rightControl, 180, this.stageW - rightControl.width * 2, this.stageH - rightControl.height / 2 * 5);
        this.rightControl = rightControl;
        this.rightControl.touchEnabled = true;
        this.addChild(this.rightControl);
        this.rightControl.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startControl, this);
    };
    GameScene.prototype.startControl = function (e) {
        if (e.target == this.upControl && this.moveDistance != "down") {
            this.newDistance = "up";
        }
        else if (e.target == this.downControl && this.moveDistance != "up") {
            this.newDistance = "down";
        }
        else if (e.target == this.leftControl && this.moveDistance != "right") {
            this.newDistance = "left";
        }
        else if (e.target == this.rightControl && this.moveDistance != "left") {
            this.newDistance = "right";
        }
        this.moveDistance = this.newDistance;
    };
    GameScene.prototype.gameOver = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.viewUpdate, this);
        this.upControl.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.startControl, this);
        this.downControl.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.startControl, this);
        this.leftControl.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.startControl, this);
        this.rightControl.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.startControl, this);
    };
    GameScene.prototype.viewUpdate = function (e) {
        var head = this.snake[this.snake.length - 1];
        var headX = head.x;
        var headY = head.y;
        var tail = this.snake[0];
        var tailX = tail.x;
        var tailY = tail.y;
        this.timeUpdate++;
        if (this.speed != 9) {
            this.speed = Math.floor(this.score / 4);
        }
        //吃到苹果
        for (var i = 0; i < this.snake.length; i++) {
            var snakeBody = this.snake[i];
            if (snakeBody.x == this.apple.x && snakeBody.y == this.apple.y) {
                this.removeChild(this.apple);
                this.score++;
                var body = new egret.Bitmap(RES.getRes('snake_png'));
                this.addChild(body);
                body.x = tailX;
                body.y = tailY;
                this.snake.unshift(body);
                this.scoreText.text = "SCORE:" + this.score;
                this.speedText.text = "SPEED:" + this.speed;
                this.createApple();
            }
        }
        //蛇身相撞，游戏结束
        for (var i = 0; i < this.snake.length - 1; i++) {
            if (headX == this.snake[i].x && headY == this.snake[i].y) {
                var over = new egret.TextField();
                over.text = "GAME OVER";
                this.addChild(over);
                over.x = (this.stageW - over.width) / 2;
                over.y = this.stageH / 2;
                this.gameOver();
            }
        }
        //蛇身移动
        if (this.timeUpdate % (10 - this.speed) == 0) {
            if (this.moveDistance == 'up') {
                if (headY <= 0) {
                    tail.y = this.stageH - this.snakeSize;
                }
                else {
                    tail.y = headY - this.snakeSize;
                }
                tail.x = headX;
                this.snake.shift();
                this.snake.push(tail);
            }
            else if (this.moveDistance == 'down') {
                if (headY >= this.stageH - this.snakeSize) {
                    tail.y = 0;
                }
                else {
                    tail.y = headY + this.snakeSize;
                }
                tail.x = headX;
                this.snake.shift();
                this.snake.push(tail);
            }
            else if (this.moveDistance == 'left') {
                if (headX <= 0) {
                    tail.x = this.stageW - this.snakeSize;
                }
                else {
                    tail.x = headX - this.snakeSize;
                }
                tail.y = headY;
                this.snake.shift();
                this.snake.push(tail);
            }
            else if (this.moveDistance == 'right') {
                if (headX >= this.stageW - this.snakeSize) {
                    tail.x = 0;
                }
                else {
                    tail.x = headX + this.snakeSize;
                }
                tail.y = headY;
                this.snake.shift();
                this.snake.push(tail);
            }
        }
    };
    return GameScene;
}(egret.DisplayObjectContainer));
__reflect(GameScene.prototype, "GameScene");
