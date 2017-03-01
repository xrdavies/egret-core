declare namespace egret_native {
    namespace fs {
        function readFile(path: string, promise: any, type: string): ArrayBuffer | string;
        function isFileExistSync(path: string): boolean;
        function isAbsolutePathSync(url: string): boolean;
        function getAssetDirectorySync(): string;
    }
}
namespace egret {
    export namespace native2 {
        export class FileManager {
            static makeFullPath(url: string): string {
                console.log("makeFullPath = " + url);
                let fullPath = "";
                if (!egret_native.fs.isAbsolutePathSync(url)) {
                    console.log("========" + egret.Capabilities.os);
                    if (egret.Capabilities.os == "Android") {
                        fullPath = "egret-game/1/" + url;
                    }
                    else {
                        let workPath = egret_native.fs.getAssetDirectorySync();
                        //console.log("url = " + url);
                        //console.log("workPath = " + workPath);
                        if (workPath.lastIndexOf("/") !== workPath.length) {
                            workPath += "/";
                        }
                        fullPath = workPath + "egret-game/1/" + url;

                    }
                }
                else {
                    fullPath = url;
                }
                console.log("fullPath = " + fullPath);
                return fullPath;
            }

            static createImage(url: string, promise: any): void {
                let fullPath = FileManager.makeFullPath(url);
                console.log("YH __createImage = " + fullPath);
                egret_native.createRawImage(fullPath, promise);
            }

            static readFileAsync(url: string, promise: any, type: "String" | "ArrayBuffer"): void {
                let fullPath = FileManager.makeFullPath(url);
                console.log("YH __readFileAsync = " + fullPath + " type = " + type);
                egret_native.fs.readFile(fullPath, promise, type);
            }

            static isFileExistSync(url: string): boolean {
                let fullPath = FileManager.makeFullPath(url);
                console.log("YH __isFileExistSync = " + fullPath);
                return egret_native.fs.isFileExistSync(fullPath);
            }
        }
    }
}
