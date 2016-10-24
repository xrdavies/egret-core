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

namespace egret.sys {
    /**
     * @internal
     */
    export let stage_instantiated_guard = true;
}

namespace egret {

    /**
     * The Stage class represents the main drawing area.The Stage object is not globally accessible. You need to access
     * it through the stage property of a DisplayObject instance.<br/>
     * The Stage class has several ancestor classes — Sprite, DisplayObject, and EventDispatcher — from which it inherits
     * properties and methods. Many of these properties and methods are inapplicable to Stage objects.
     * @event egret.Event.RESIZE Dispatched when the stageWidth or stageHeight property of the Stage object is changed.
     */
    export class Stage extends DisplayObjectContainer {

        public constructor() {
            super();
            if (sys.stage_instantiated_guard) {
                throw new Error("The Stage class cannot be instantiated.");
            }

            this.$stage = this;
            this.$nestLevel = 1;
            this.$nodeType = sys.NodeType.Stage;
            this.$handle = sys.MakeStage(this);
        }

        /**
         * @internal
         */
        $stageBits = sys.StageBits.DirtyFrameRate;
        /**
         * @internal
         */
        $color:number = 0xFFFFFFFF;

        /**
         * The stage background color.
         */
        public get color():number {
            return this.$color;
        }

        public set color(value:number) {
            value = +value >>> 0; // format to uint32.
            value = value | 0xFF000000; // set alpha to 255
            if (value == this.$color) {
                return;
            }
            this.$color = value;
            this.$stageBits |= sys.StageBits.DirtyColor;
            this.$invalidate();
        }

        /**
         * Gets and sets the frame rate of the stage. The frame rate is defined as frames per second. Valid range for the
         * frame rate is from 0.01 to 1000 frames per second.<br/>
         * Note: setting the frameRate property of one Stage object changes the frame rate for all Stage objects
         * @default 30
         */
        public get frameRate():number {
            return sys.systemTicker.frameRate;
        }

        public set frameRate(value:number) {
            value = +value || 0;
            if (value <= 0) {
                return;
            }
            if (sys.systemTicker.frameRate == value) {
                return;
            }
            sys.systemTicker.setFrameRate(value);
            this.$stageBits |= sys.StageBits.DirtyFrameRate;
            this.$invalidate();
        }

        /**
         * After you call the invalidate() method, when the display list is next rendered, the runtime sends a render
         * event to each display object that has registered to listen for the render event. You must call the invalidate()
         * method each time you want the runtime to send render events.
         */
        public invalidate():void {
            sys.systemTicker.requestRenderEvent();
        }

        private _stageWidth:number = 0;

        /**
         * Indicates the width of the stage, in pixels.
         */
        public get stageWidth():number {
            return this._stageWidth;
        }

        private _stageHeight:number = 0;

        /**
         * Indicates the height of the stage, in pixels.
         */
        public get stageHeight():number {
            return this._stageHeight;
        }

        private _scaleMode:string = "";

        /**
         * A StageScaleMode class that specifies which scale mode to use.
         * @default egret.StageScaleMode.NO_SCALE
         */
        public get scaleMode():string {
            return this._scaleMode;
        }

        public set scaleMode(value:string) {
            if (this._scaleMode == value) {
                return;
            }
            this._scaleMode = value;
            this.updateStageDisplayRule();
        }

        private _contentWidth:number = 400;

        private _contentHeight:number = 300;

        /**
         * Specifies the size of the stage content, in pixels.
         * @param contentWidth The unscaled width of the stage content, in pixels. The default value is 400.
         * @param contentHeight The unscaled height of the stage content, in pixels. The default value is 300.
         */
        public setContentSize(contentWidth:number, contentHeight:number):void {
            contentWidth = +contentWidth || 0;
            contentHeight = +contentHeight || 0;
            if (this._contentWidth === contentWidth && this._contentHeight === contentHeight) {
                return;
            }
            this._contentWidth = contentWidth;
            this._contentHeight = contentHeight;
            this.updateStageDisplayRule();
        }

        private _scaleFactor:number = 1;

        /**
         * Indicates the effective pixel scaling factor of the stage. This value is 1 on standard screens and 2 on HiDPI
         * (Retina display) screens.
         */
        public get contentsScaleFactor():number {
            return this._scaleFactor;
        }

        private _screenWidth:number = 0;

        private _screenHeight:number = 0;

        /**
         * @internal
         */
        $updateScreenSize(screenWidth:number, screenHeight:number, scaleFactor:number):void {
            screenWidth = +screenWidth || 0;
            screenHeight = +screenHeight || 0;
            scaleFactor = +scaleFactor || 0;
            if (screenWidth === this._screenWidth && screenHeight === this._screenHeight && this._scaleFactor == scaleFactor) {
                return;
            }
            this._screenWidth = screenWidth;
            this._screenHeight = screenHeight;
            this._scaleFactor = scaleFactor;
            this.updateStageDisplayRule();
            sys.systemTicker.requestScreenUpdate();
        }

        /**
         * @internal
         */
        $displayRule:sys.StageDisplayRule = new sys.StageDisplayRule();

        /**
         * @private
         */
        private updateStageDisplayRule():void {
            let screenWidth = this._screenWidth;
            let screenHeight = this._screenHeight;
            let displaySize = sys.screenAdapter.calculateStageSize(this._scaleMode, screenWidth, screenHeight,
                this._contentWidth, this._contentHeight);

            let transform = this.$displayRule;
            transform.stageWidth = displaySize.stageWidth;
            transform.stageHeight = displaySize.stageHeight;
            transform.displayX = (screenWidth - displaySize.displayWidth) * 0.5;
            transform.displayY = (screenHeight - displaySize.displayHeight) * 0.5;
            transform.displayScaleX = screenWidth / displaySize.displayWidth;
            transform.displayScaleY = screenHeight / displaySize.displayHeight;
            transform.contentScaleFactor = 1;
            let scaleFactor = this._scaleFactor;
            if (scaleFactor != 1) {
                transform.displayX *= scaleFactor;
                transform.displayY *= scaleFactor;
                transform.displayScaleX *= scaleFactor;
                transform.displayScaleY *= scaleFactor;
            }
            this.$stageBits |= sys.StageBits.DirtyDisplayRule;
            this.$invalidate();
            if (this._stageWidth != displaySize.stageWidth || this._stageHeight != displaySize.stageHeight) {
                this._stageWidth = displaySize.stageWidth;
                this._stageHeight = displaySize.stageHeight;
                this.dispatchEventWith(Event.RESIZE);
            }
        }


    }

    /**
     * @private
     */
    function markCannotUse(instance:any, property:string, defaultValue:any):void {
        Object.defineProperty(instance.prototype, property, {
            get: function () {
                return defaultValue;
            },
            set: function (value) {
                throw new Error("The Stage class does not implement this property or method.");
            },
            enumerable: true,
            configurable: true
        });
    }

    markCannotUse(Stage, "alpha", 1);
    markCannotUse(Stage, "visible", true);
    markCannotUse(Stage, "x", 0);
    markCannotUse(Stage, "y", 0);
    markCannotUse(Stage, "scaleX", 1);
    markCannotUse(Stage, "scaleY", 1);
    markCannotUse(Stage, "rotation", 0);
    markCannotUse(Stage, "skewX", 0);
    markCannotUse(Stage, "skewY", 0);
    markCannotUse(Stage, "anchorOffsetX", 0);
    markCannotUse(Stage, "anchorOffsetY", 0);
    markCannotUse(Stage, "cacheAsBitmap", false);
    markCannotUse(Stage, "scrollRect", null);
    markCannotUse(Stage, "filters", null);
    markCannotUse(Stage, "blendMode", null);
    markCannotUse(Stage, "touchEnabled", true);
    markCannotUse(Stage, "touchChildren", true);
    markCannotUse(Stage, "matrix", null);

}