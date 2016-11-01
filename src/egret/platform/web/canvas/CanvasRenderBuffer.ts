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

    let blendModes = ["source-over", "source-over", "lighter", "destination-out", "darken", "difference", "hard-light",
        "lighten", "multiply", "overlay", "screen", "color-dodge", "color-burn", "soft-light", "exclusion", "hue",
        "saturation", "color", "luminosity"];
    let compositeOperations = ["destination-in"];
    let sharedCanvas:HTMLCanvasElement;
    let ImageSmoothingEnabledKey:string = "";

    /**
     * @private
     */
    function getImageSmoothingEnabledKey(context:any):string {
        let keys = ["imageSmoothingEnabled", "webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
        for (let key of keys) {
            if (key in context) {
                return key;
            }
        }
        return "imageSmoothingEnabled"
    }

    export class CanvasRenderBuffer implements elf.RenderBuffer {
        public constructor(canvas:HTMLCanvasElement, transparent:boolean, easelHost:CanvasEasel) {
            this.canvas = canvas;
            this.transparent = transparent;
            this.easelHost = easelHost;
            let context = <CanvasRenderingContext2D>canvas.getContext("2d", {alpha: transparent});
            this.context = context;
            if (!ImageSmoothingEnabledKey) {
                ImageSmoothingEnabledKey = getImageSmoothingEnabledKey(context);
            }
            this._smoothing = context[ImageSmoothingEnabledKey];
        }

        private easelHost:CanvasEasel;
        private transparent:boolean;
        public canvas:HTMLCanvasElement;
        public context:CanvasRenderingContext2D;

        /**
         * The width of the render buffer in pixels.
         */
        public get width():number {
            return this.canvas.width;
        }

        /**
         * The height of the render buffer in pixels.
         */
        public get height():number {
            return this.canvas.height;
        }


        /**
         * Resize the render buffer. It will keep the old content if you pass the contentOffset parameter, the top/left
         * corner of old content will be at (offsetX,offsetY). Otherwise, it clears the old content.
         */
        public resize(width:number, height:number, contentOffset?:elf.Point):void {
            if (contentOffset) {
                this.resizeWithContent(width, height, contentOffset.x, contentOffset.y);
                return;
            }
            let canvas = this.canvas;
            canvas.width = width;
            canvas.height = height;
        }

        private resizeWithContent(width:number, height:number, offsetX:number, offsetY:number):void {
            if (!sharedCanvas) {
                sharedCanvas = document.createElement("canvas");
            }
            let oldCanvas = this.canvas;
            let newSurface = sharedCanvas;
            let newContext:CanvasRenderingContext2D = newSurface.getContext("2d");
            sharedCanvas = oldCanvas;
            this.context = newContext;
            this.canvas = newSurface;
            // A canvas will not be hardware accelerated if it is small than 256 x 256.
            newSurface.width = Math.max(width, 257);
            newSurface.height = Math.max(height, 257);
            newContext.setTransform(1, 0, 0, 1, 0, 0);
            newContext.drawImage(oldCanvas, offsetX, offsetY);
            oldCanvas.height = 0;
            oldCanvas.width = 0;
        }

        private _alpha:number = 1;

        /**
         * Specifies the alpha value that is applied to shapes and images before they are drawn onto the render buffer.
         * The value is in the range from 0.0 (fully transparent) to 1.0 (fully opaque).
         */
        public setAlpha(value:number):void {
            if (this._alpha === value) {
                return;
            }
            this._alpha = value;
            this.context.globalAlpha = value;
        }

        private _smoothing:boolean;

        /**
         * Whether or not images are smoothed when scaled.
         */
        public setSmoothing(value:boolean):void {
            if (this._smoothing === value) {
                return;
            }
            this._smoothing = value;
            this.context[ImageSmoothingEnabledKey] = value;
        }

        /**
         * Sets all pixels in the rectangle defined by starting point (x, y) and size (width, height) to specified color,
         * erasing any previously drawn content.
         */
        public clearRect(rect:elf.Rectangle, color?:number):void {
            this.context.clearRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
            if (!color) {
                return;
            }
            let r = (color >> 16) & 0xFF;
            let g = (color >> 8) & 0xFF;
            let b = color & 0xFF;
            let context = this.context;
            if (this.transparent) {
                let a = ((color >> 24) & 0xFF) / 255;
                context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
            }
            else {
                context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            }
            context.globalAlpha = 1;
            context.fillRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
        }

        /**
         * Saves the entire state of the render buffer by pushing the current state onto a stack.
         */
        public save():void {
            this.context.save();
        }

        /**
         * Restores the most recently saved canvas state by popping the top entry in the drawing state stack. If there
         * is no saved state, this method does nothing.
         */
        public restore():void {
            this.context.restore();
        }

        /**
         * Resets (overrides) the current transformation to the identity matrix and then invokes a transformation described
         * by the arguments of this method.
         */
        public setMatrix(m:elf.Matrix):void {
            this.context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        }

        /**
         * Resets the current transform by the identity matrix.
         */
        public resetMatrix():void {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }

        /**
         * Translates the matrix of buffer along the x and y axes, as specified by the dx and dy parameters.
         */
        public translate(dx:number, dy:number):void {
            this.context.translate(dx, dy);
        }

        private _blendMode:elf.BlendMode = 0;

        /**
         * Specifies the type of blend mode to apply when drawing new shapes.
         * @see elf.BlendMode
         */
        public setBlendMode(value:elf.BlendMode):void {
            if (this._blendMode === value) {
                return;
            }
            this._blendMode = value;
            if (value < 0) {
                this.context.globalCompositeOperation = compositeOperations[-value];
            }
            else {
                this.context.globalCompositeOperation = blendModes[value];
            }
        }

        /**
         * Modify the current clip with the specified rectangle.
         */
        public clipRect(rect:elf.Rectangle):void {
            let context = this.context;
            context.beginPath();
            context.rect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
            context.clip();
        }

        /**
         * returns a data URI containing a representation of the image in the format specified by the type parameter
         */
        public toDataURL(type?:string, encoderOptions?:any):string {
            return this.canvas.toDataURL(type, encoderOptions);
        }

        /**
         * Returns the color value for the specified pixel region
         */
        public getPixels(x:number, y:number, width:number, height:number):Uint8ClampedArray {
            return this.context.getImageData(x, y, width, height).data;
        }

        /**
         * Draws the render buffer to the specified render context, with its top/left corner at (x,y).
         */
        public drawBuffer(buffer:CanvasRenderBuffer, x:number, y:number):void {
            this.context.drawImage(buffer.canvas, x, y);
        }

        /**
         * Draws the BitmapData object to the render context, with its top/left corner at (x,y).
         */
        public drawImage(data:WebBitmapData, x:number, y:number):void {
            this.context.drawImage(data.source, x, y);
        }

        /**
         * Creates an render buffer with specific size. The new render buffer is "compatible" with this one, in that it
         * will efficiently be able to be drawn into parent render buffer.
         * @param width The width of the render buffer in pixels.
         * @param height The height of the render buffer in pixels.
         * @param temporary Whether the render buffer is created for temporary use.
         */
        public makeRenderBuffer(width:number, height:number, temporary?:boolean):CanvasRenderBuffer {
            return this.easelHost.makeRenderBuffer(width, height, temporary);
        }

    }

}