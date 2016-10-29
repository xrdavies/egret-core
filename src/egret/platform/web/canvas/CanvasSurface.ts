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

    let surfacePool:CanvasSurface[] = [];
    let temporarySurfaces:CanvasSurface[] = [];

    /**
     * @internal
     */
    export function cleanCanvasSurfacePool():void {
        for (let surface of temporarySurfaces) {
            surface.resize(0, 0);
            surfacePool.push(surface);
        }
        temporarySurfaces = [];
        if (surfacePool.length > 6) {
            surfacePool.length = 6;
        }
    }

    let sharedCanvas:HTMLCanvasElement;

    /**
     * create a canvas。
     */
    function createCanvas(width?:number, height?:number):HTMLCanvasElement {
        let canvas:HTMLCanvasElement = document.createElement("canvas");
        if (!isNaN(width) && !isNaN(height)) {
            canvas.width = width;
            canvas.height = height;
        }
        let context = canvas.getContext("2d");
        makeCanvasRenderContext(context);
        return canvas;
    }

    /**
     * @internal
     */
    export class CanvasSurface implements elf.Surface {

        public constructor(width:number, height:number) {
            this.canvas = createCanvas(width, height);
            this.context = this.canvas.getContext("2d");
            this.context["surface"] = this;
        }

        /**
         * The render context associated with the surface.
         */
        public context:CanvasRenderingContext2D;
        public canvas:HTMLCanvasElement;

        /**
         * The width of the surface in pixels.
         */
        public get width():number {
            return this.canvas.width;
        }

        /**
         * The height of the surface in pixels.
         */
        public get height():number {
            return this.canvas.height;
        }


        /**
         * Resize the surface. It will keep the old content if you pass the contentOffset parameter, the top/left corner
         * of old content will be at (offsetX,offsetY). Otherwise, it clears the old content.
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
                sharedCanvas = createCanvas();
            }
            let oldContext = this.context;
            let oldCanvas = this.canvas;
            let newSurface = sharedCanvas;
            let newContext:CanvasRenderingContext2D = newSurface.getContext("2d");
            oldContext["surface"] = null;
            sharedCanvas = oldCanvas;
            newContext["surface"] = this;
            this.context = newContext;
            this.canvas = newSurface;
            // A canvas will not be hardware accelerated if it is small than 256 x 256.
            newSurface.width = Math.max(width, 257);
            newSurface.height = Math.max(height, 257);
            newContext.setTransform(1, 0, 0, 1, 0, 0);
            newContext.drawImage(oldCanvas, offsetX, offsetY);
            oldCanvas.height = 1;
            oldCanvas.width = 1;
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
        public getPixels(x:number, y:number, width?:number, height?:number):Uint8ClampedArray {
            return this.context.getImageData(x, y, width, height).data;
        }

        /**
         * Draws the surface to the specified render context, with its top/left corner at (x,y).
         */
        public drawTo(context:CanvasRenderingContext2D, x:number, y:number):void {
            context.drawImage(this.canvas, x, y);
        }

        public makeSurface(width:number, height:number, temporary?:boolean):CanvasSurface {
            if(temporary){
                let surface = surfacePool.pop();
                if (surface) {
                    if(width<surface.width){
                        width = surface.width;
                    }
                    if(height<surface.height){
                        height = surface.height;
                    }
                    surface.resize(width, height);
                }
                else {
                    surface = new CanvasSurface(width, height);
                }
                temporarySurfaces.push(surface);
                return surface;
            }
            return new CanvasSurface(width, height);
        }
    }
}