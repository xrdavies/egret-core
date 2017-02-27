
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/egret3d/egret3d.js",
	"bin-debug/E3dGame.js",
	"bin-debug/Main.js",
	//----auto game_file_list end----
];

// var window = this;

// egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
    egret.Capabilities.$runtimeType = egret.RuntimeType.NATIVE;
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
        //----auto option end----
    };

    egret.native2.NativePlayer.option = option;
    egret.runEgret();
    // egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    // egret_native.EGTView.preSetOffScreenBufferEnable(true);
};