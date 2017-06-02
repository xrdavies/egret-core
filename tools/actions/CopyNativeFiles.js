/// <reference path="../lib/types.d.ts" />
var FileUtil = require("../lib/FileUtil");
var CopyFilesCommand = require("../commands/copyfile");
var ChangeEntranceCMD = require("../actions/ChangeEntranceCommand");
var EgretProject = require("../parser/EgretProject");
var CopyNativeFiles = (function () {
    function CopyNativeFiles() {
    }
    CopyNativeFiles.copyProjectFiles = function (platform, nativePath, isDebug) {
        var options = egret.args;
        //拷贝项目到native工程中
        var cpFiles = new CopyFilesCommand();
        if (platform == "android" || platform == "android_as") {
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets");
        }
        else if (platform == "ios") {
            url2 = FileUtil.joinPath(nativePath, "Resources");
        }
        FileUtil.remove(url2);
        if (isDebug) {
            var config = EgretProject.utils;
            try {
                cpFiles.outputPath = url2;
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();
            }
            catch (e) {
                globals.exit(10021);
            }
            for (var _i = 0, _a = FileUtil.getDirectoryAllListing(EgretProject.utils.getProjectRoot()); _i < _a.length; _i++) {
                var each = _a[_i];
                var relativePath = FileUtil.getRelativePath(EgretProject.utils.getProjectRoot(), each);
                FileUtil.copy(each, FileUtil.joinPath(url2, "egret-game", relativePath));
            }
            for (var _b = 0, _c = FileUtil.getDirectoryListing(url2); _b < _c.length; _b++) {
                var each = _c[_b];
                if (each !== FileUtil.joinPath(url2, "egret-game")) {
                    FileUtil.remove(each);
                }
            }
            // EgretProject.utils.getModulesConfig('web').forEach(m => {
            //     FileUtil.copy(m.sourceDir, FileUtil.joinPath(url2, m.targetDir));
            // })
        }
        else {
            FileUtil.copy(options.releaseDir, url2);
        }
    };
    CopyNativeFiles.refreshNative = function (isDebug, versionFile) {
        if (versionFile === void 0) { versionFile = null; }
        var config = EgretProject.utils;
        var nativePath;
        if (nativePath = config.getNativePath("android_as")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.android");
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets");
            CopyNativeFiles.copyProjectFiles("android_as", nativePath, isDebug);
            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "android_as", versionFile);
            entrance.execute();
        }
        if (nativePath = config.getNativePath("ios")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.ios");
            var url2 = FileUtil.joinPath(nativePath, "Resources");
            CopyNativeFiles.copyProjectFiles("ios", nativePath, isDebug);
            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "ios", versionFile);
            entrance.execute();
        }
    };
    CopyNativeFiles.oldCopyProjectFiles = function (platform, nativePath, isDebug) {
        var options = egret.args;
        //拷贝项目到native工程中
        var cpFiles = new CopyFilesCommand();
        if (platform == "android" || platform == "android_as") {
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets", "egret-game");
        }
        else if (platform == "ios") {
            url2 = FileUtil.joinPath(nativePath, "Resources", "egret-game");
        }
        FileUtil.remove(url2);
        if (isDebug) {
            var config = EgretProject.utils;
            try {
                cpFiles.outputPath = url2;
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();
            }
            catch (e) {
                globals.exit(10021);
            }
            var sourceRuntime = FileUtil.joinPath(options.templateDir, "runtime");
            var outputRuntime = FileUtil.joinPath(url2, "launcher");
            FileUtil.copy(sourceRuntime, outputRuntime);
            EgretProject.utils.getModulesConfig('native').forEach(function (m) {
                FileUtil.copy(m.sourceDir, FileUtil.joinPath(url2, m.targetDir));
            });
        }
        else {
            FileUtil.copy(options.releaseDir, url2);
        }
    };
    CopyNativeFiles.oldRefreshNative = function (isDebug, versionFile) {
        if (versionFile === void 0) { versionFile = null; }
        var config = EgretProject.utils;
        var nativePath;
        if (nativePath = config.getNativePath("android_as")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.android");
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets", "egret-game");
            CopyNativeFiles.copyProjectFiles("android_as", nativePath, isDebug);
            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "android_as", versionFile);
            entrance.execute();
        }
        if (nativePath = config.getNativePath("android")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.android");
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets", "egret-game");
            CopyNativeFiles.copyProjectFiles("android", nativePath, isDebug);
            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "android", versionFile);
            entrance.execute();
        }
        if (nativePath = config.getNativePath("ios")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.ios");
            var url2 = FileUtil.joinPath(nativePath, "Resources", "egret-game");
            CopyNativeFiles.copyProjectFiles("ios", nativePath, isDebug);
            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "ios", versionFile);
            entrance.execute();
        }
    };
    return CopyNativeFiles;
}());
module.exports = CopyNativeFiles;
