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

    let renderBufferPool:CanvasRenderBuffer[] = [];
    let temporaryBuffers:CanvasRenderBuffer[] = [];

    /**
     * @internal
     */
    export class CanvasEasel {

        /**
         * Creates a WebEasel instance.
         * @param width The width of the default render buffer in pixels.
         * @param height The height of the default render buffer in pixels.
         */
        public constructor(width:number, height:number) {
            this.buffer = this.makeRenderBuffer(width, height);
            this.canvas = this.buffer.canvas;
        }

        /**
         * The canvas element associated with the render buffer.
         */
        public canvas:HTMLCanvasElement;
        /**
         * The default render buffer of the easel, anything drawn to it will show on the canvas.
         */
        public buffer:CanvasRenderBuffer;

        /**
         * Creates an render buffer with specific size. The new render buffer is "compatible" with this one, in that it
         * will efficiently be able to be drawn into parent buffer.
         * @param width The width of the render buffer in pixels.
         * @param height The height of the render buffer in pixels.
         * @param temporary Whether the render buffer is created for temporary use.
         * @return A new render buffer instance.
         */
        public makeRenderBuffer(width:number, height:number, temporary?:boolean):CanvasRenderBuffer {
            let buffer:CanvasRenderBuffer;
            if (temporary) {
                // We use the global render buff pool because any canvas render buffer can be drawn to another one.
                buffer = renderBufferPool.pop();
                if (buffer) {
                    if (width < buffer.width) {
                        width = buffer.width;
                    }
                    if (height < buffer.height) {
                        height = buffer.height;
                    }
                    buffer.resize(width, height);
                }
            }
            if (!buffer) {
                let canvas:HTMLCanvasElement = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                buffer = new CanvasRenderBuffer(canvas, this);
            }
            if (temporary) {
                temporaryBuffers.push(buffer);
            }
            return buffer;
        }

        /**
         * Call to ensure all drawing to the render buffer has been issued to the underlying graphic API. This method is
         * usually called at the end of one drawing session.
         */
        public flush():void {
            for (let buffer of temporaryBuffers) {
                buffer.resize(0, 0);
                renderBufferPool.push(buffer);
            }
            temporaryBuffers = [];
            if (renderBufferPool.length > 6) {
                renderBufferPool.length = 6;
            }
        }

    }
}