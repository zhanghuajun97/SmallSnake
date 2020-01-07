class GameUntil {

    存放全局函数
    static createBitmap(bitmap:egret.Bitmap,rota:number,x:number,y:number){
        var anX:number=bitmap.width/2;
        var anY:number=bitmap.height/2;
        bitmap.anchorOffsetX=anX;
        bitmap.anchorOffsetY=anY;
        bitmap.rotation=rota;
        bitmap.x=x;
        bitmap.y=y;
    }

    
}