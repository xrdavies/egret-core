//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

/**
 * @internal
 */
namespace egret {
    /**
     * Defines the initialization options for the runEgret method.
     */
    export interface RunOptions {
        renderMode?:string;
        audioType?:number;
        screenAdapter?:sys.ScreenAdapter;
        antialias?:boolean;
    }
    /**
     * Egret project entry function
     * @param options An object containing the initialization options for Egret.
     */
    export declare function runEgret(options?:RunOptions):void;

    /**
     * Refresh the screen display
     */
    export declare function updateAllScreens():void;
}

/**
 * @internal
 */
namespace egret.web {

    /**
     * @private
     */
    function updateAllScreens():void {
        if (!isRunning) {
            return;
        }
        let containerList = document.querySelectorAll(".egret-player");
        let length = containerList.length;
        for (let i = 0; i < length; i++) {
            let container = containerList[i];
            let player = <WebPlayer>container["egret-player"];
            player.updateScreenSize();
        }
    }

    let isRunning:boolean = false;

    /**
     * @private
     */
    function runEgret(options?:{renderMode?:string; audioType?:number; screenAdapter?:sys.ScreenAdapter; antialias?:boolean}):void {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if (!options) {
            options = {};
        }

        let ticker = sys.systemTicker;
        startTicker(ticker);
        if (options.screenAdapter) {
            sys.screenAdapter = options.screenAdapter;
        }

        let list = document.querySelectorAll(".egret-player");
        let length = list.length;
        for (let i = 0; i < length; i++) {
            let container = <HTMLDivElement>list[i];
            let player = new WebPlayer(container);
            container["egret-player"] = player;
        }
    }

    /**
     * @private
     */
    function startTicker(ticker:egret.sys.SystemTicker):void {
        let requestAnimationFrame =
                window["requestAnimationFrame"] ||
                window["webkitRequestAnimationFrame"] ||
                window["mozRequestAnimationFrame"] ||
                window["oRequestAnimationFrame"] ||
                window["msRequestAnimationFrame"];

        if (!requestAnimationFrame) {
            requestAnimationFrame = function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        }

        requestAnimationFrame.call(window, onTick);
        function onTick(timeStamp:number):void {
            ticker.update(timeStamp);
            requestAnimationFrame.call(window, onTick);
        }
    }

    // The default implementation of the isNaN method calls the native code every time, which is very expensive. Here we
    // replace it with a compatible javascript implementation to achieve better performance (2x~10x).
    window["isNaN"] = function (value:number):boolean {
        value = +value;
        return value !== value;
    };

    egret.runEgret = runEgret;
    egret.updateAllScreens = updateAllScreens;

    let resizeTimer:number = NaN;

    function doResize() {
        resizeTimer = NaN;
        updateAllScreens();
    }

    window.addEventListener("resize", function () {
        if (isNaN(resizeTimer)) {
            resizeTimer = window.setTimeout(doResize, 300);
        }
    });
}