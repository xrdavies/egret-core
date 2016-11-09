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
namespace egret.web {

    /**
     * @internal
     */
    export class WebPlayer extends egret.HashObject implements elf.Screen {

        public constructor(container:HTMLDivElement) {
            super();
            let easelHost = new WebEasel(0, 0, true);
            this.easelHost = easelHost;
            this.buffer = easelHost.buffer;
            this.init(container, easelHost.canvas);
        }

        private easelHost:WebEasel;

        /**
         * A render buffer instance associated with the screen. Anything drew to it will show on the screen. <br/>
         */
        public buffer:elf.RenderBuffer;

        /**
         * Indicates the width of the screen, in pixels. It contains the scaleFactor property.
         */
        public width:number;

        /**
         * Indicates the height of the screen, in pixels. It contains the scaleFactor property.
         */
        public height:number;

        /**
         * Specifies the effective pixel scaling factor of the screen. This value is 1 on standard screens and doubled on
         * HiDPI (Retina display) screens.
         */
        public scaleFactor:number;


        private playerOption:PlayerOption;

        /**
         * @private
         */
        private canvas:HTMLCanvasElement;
        /**
         * @private
         */
        private container:HTMLElement;

        /**
         * @internal
         */
        public stage:Stage;


        private init(container:HTMLDivElement, canvas:HTMLCanvasElement):void {
            let option = this.readOption(container);
            sys.stage_instantiated_guard = false;
            let stage = new egret.Stage();
            sys.stage_instantiated_guard = true;
            (<elf.Stage>stage.$handle).setScreen(this);
            stage.$scaleMode = option.scaleMode;
            stage.$resolutionMode = option.resolutionMode;
            stage.$contentWidth = option.contentWidth;
            stage.$contentHeight = option.contentHeight;
            stage.frameRate = option.frameRate;
            this.attachCanvas(container, canvas);

            this.playerOption = option;
            this.container = container;
            this.canvas = canvas;
            this.stage = stage;

            this.updateScreenSize();
            sys.systemTicker.addStage(stage);

            let entryInstance = sys.getEntryInstance(option.entryClassName);
            stage.addChild(entryInstance);
        }

        /**
         * 读取初始化参数
         */
        private readOption(container:HTMLDivElement):PlayerOption {
            let option:PlayerOption = {};
            option.entryClassName = container.getAttribute("data-entry-class");
            option.scaleMode = container.getAttribute("data-scale-mode") || "noScale";
            option.resolutionMode = container.getAttribute("data-resolution-mode") || "standard";
            option.frameRate = +container.getAttribute("data-frame-rate") || 30;
            option.contentWidth = +container.getAttribute("data-content-width") || 480;
            option.contentHeight = +container.getAttribute("data-content-height") || 800;
            option.orientation = container.getAttribute("data-orientation") || "auto";
            option.maxTouches = +container.getAttribute("data-multi-fingered") || 2;
            option.textureScaleFactor = +container.getAttribute("texture-scale-factor") || 1;
            option.showPaintRect = container.getAttribute("data-show-paint-rect") == "true";
            option.showFPS = container.getAttribute("data-show-fps") == "true";

            let styleStr = container.getAttribute("data-show-fps-style") || "";
            let stylesArr = styleStr.split(",");
            let styles = {};
            for (let i = 0; i < stylesArr.length; i++) {
                let tempStyleArr = stylesArr[i].split(":");
                styles[tempStyleArr[0]] = tempStyleArr[1];
            }
            option.fpsStyles = styles;

            option.showLog = container.getAttribute("data-show-log") == "true";
            option.logFilter = container.getAttribute("data-log-filter");
            return option;
        }

        /**
         * @private
         */
        private attachCanvas(container:HTMLElement, canvas:HTMLCanvasElement):void {
            let style = canvas.style;
            style.cursor = "inherit";
            style.position = "absolute";
            style.top = "0";
            style.bottom = "0";
            style.left = "0";
            style.right = "0";
            container.appendChild(canvas);
            style = container.style;
            style.overflow = "hidden";
            style.position = "relative";
            style["webkitTransform"] = "translateZ(0)";
        }

        /**
         * @internal
         */
        public updateScreenSize():void {
            let canvas = this.canvas;
            if (canvas['userTyping'])
                return;
            let screenRect = this.container.getBoundingClientRect();
            this.scaleFactor = window.devicePixelRatio;
            this.width = screenRect.width;
            this.height = screenRect.height;
            this.stage.$updateScreenSize(this.width, this.height, this.scaleFactor);
        }

        /**
         * Sets the background color of the screen.
         */
        public setColor(color:number):void {
            let r = (color >> 16) & 0xFF;
            let g = (color >> 8) & 0xFF;
            let b = color & 0xFF;
            let style = this.container.style;
            style.background = "rgb(" + r + "," + g + "," + b + ")";
        }

        /**
         * @internal
         */
        public applyDisplayRule(rule:sys.StageDisplayRule):void {
            let displayWidth = rule.displayWidth;
            let displayHeight = rule.displayHeight;
            //宽高不是2的整数倍会导致图片绘制出现问题
            if (displayWidth % 2 != 0) {
                displayWidth += 1;
            }
            if (displayHeight % 2 != 0) {
                displayHeight += 1;
            }
            let buffer = this.buffer;
            buffer.resize(rule.stageWidth, rule.stageHeight);
            let canvas = this.canvas;
            canvas.style.width = displayWidth + "px";
            canvas.style.height = displayHeight + "px";
            canvas.style.top = rule.displayX + "px";
            canvas.style.left = rule.displayY + "px";
        }

        /**
         * Call to ensure all drawing to the render buffer has been applied to the screen. This method is usually called
         * at the end of one drawing session
         */
        public present():void {
            this.easelHost.flush();
        }
    }

}