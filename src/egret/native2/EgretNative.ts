
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

module egret.native2 {

    let customContext: CustomContext;

    let context: EgretContext = {

        setAutoClear: function(value:boolean):void {
            WebGLRenderBuffer.autoClear = value;
        },

        save: function () {
            // do nothing
        },

        restore: function () {
            let context = WebGLRenderContext.getInstance(0, 0);
            let gl:any = context.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, context["vertexBuffer"]);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, context["indexBuffer"]);
            gl.activeTexture(gl.TEXTURE0);
            context.shaderManager.currentShader = null;
            context["bindIndices"] = false;
            let buffer = context.$bufferStack[1];
            context["activateBuffer"](buffer);
            gl.enable(gl.BLEND);
            context["setBlendMode"]("source-over");
        }
    }

    function setRendererContext(custom: CustomContext) {
        custom.onStart(context);
        customContext = custom;
    }
    egret.setRendererContext = setRendererContext;

    function updateAllScreens():void {
        if (!isRunning) {
            return;
        }
        let containerList = document.querySelectorAll(".egret-player");
        let length = containerList.length;
        for (let i = 0; i < length; i++) {
            let container = containerList[i];
            let player = <NativePlayer>container["egret-player"];
            player.updateScreenSize();
        }
    }

    var isRunning:boolean = false;

    function runEgret(options?:{renderMode?:string;audioType?:number;screenAdapter?:sys.IScreenAdapter}) {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if(!options){
            options = {};
        }
        
        setRenderMode(options.renderMode);
        if (DEBUG) {
            //todo 获得系统语言版本
            var language = "zh_CN";

            if (language in egret.$locale_strings)
                egret.$language = language;
        }
        try {
            Capabilities.$setNativeCapabilities(egret_native.getVersion());
        } catch (e) {

        }
        var ticker = egret.sys.$ticker;
        startTicker(ticker);
        if (!egret.sys.screenAdapter) {
            if(options.screenAdapter){
                egret.sys.screenAdapter = options.screenAdapter;
            }
            else{
                egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
            }
        }

        let list = document.querySelectorAll(".egret-player");
        let length = list.length;
        for (let i = 0; i < length; i++) {
            let container = <HTMLDivElement>list[i];
            let player = new NativePlayer();
            container["egret-player"] = player;
            //webgl模式关闭脏矩形
            if(Capabilities.$renderMode == "webgl") {
               player.$stage.dirtyRegionPolicy = DirtyRegionPolicy.OFF;
            }
        }
        if(Capabilities.$renderMode == "webgl") {
            egret.sys.DisplayList.prototype.setDirtyRegionPolicy = function () {};
        }
    }
    /**
     * 设置渲染模式。"auto","webgl","canvas"
     * @param renderMode
     */
    function setRenderMode(renderMode:string):void{
        sys.CanvasRenderBuffer = WebGLRenderBuffer;
        // sys.RenderBuffer = web.WebGLRenderBuffer;
        // sys.systemRenderer = new web.WebGLRenderer();
        // sys.canvasRenderer = new CanvasRenderer();
        // Capabilities.$renderMode = "webgl";

        // TODO rename
        sys.RenderBuffer = WebGLRenderBuffer;
        sys.systemRenderer = new WebGLRenderer();
        sys.canvasRenderer = new WebGLRenderer();
        sys.customHitTestBuffer = new WebGLRenderBuffer(3, 3);
        sys.canvasHitTestBuffer = window["canvasHitTestBuffer"];
        Capabilities.$renderMode = "webgl";
    }
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
        function onTick():void {

            if(customContext) {
                customContext.onRender(context);
            }

            ticker.update();
            requestAnimationFrame.call(window, onTick)
        }
    }

    //覆盖原生的isNaN()方法实现，在不同浏览器上有2~10倍性能提升。
    window["isNaN"] = function (value:number):boolean {
        value = +value;
        return value !== value;
    };

    egret.runEgret = runEgret;
    egret.updateAllScreens = updateAllScreens;

    let resizeTimer:number = NaN;

    function doResize() {
        resizeTimer = NaN;

        egret.updateAllScreens();

        if(customContext) {
            customContext.onResize(context);
        }
    }

    window.addEventListener("resize", function () {
        if (isNaN(resizeTimer)) {
            resizeTimer = window.setTimeout(doResize, 300);
        }
    });

    egret.runEgret = runEgret;
    egret.updateAllScreens = updateAllScreens;
}
