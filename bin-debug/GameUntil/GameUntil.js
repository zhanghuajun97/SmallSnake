var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameUntil = (function () {
    function GameUntil() {
    }
    GameUntil.createBitmap = function (bitmap, rota, x, y) {
        var anX = bitmap.width / 2;
        var anY = bitmap.height / 2;
        bitmap.anchorOffsetX = anX;
        bitmap.anchorOffsetY = anY;
        bitmap.rotation = rota;
        bitmap.x = x;
        bitmap.y = y;
    };
    return GameUntil;
}());
__reflect(GameUntil.prototype, "GameUntil");
