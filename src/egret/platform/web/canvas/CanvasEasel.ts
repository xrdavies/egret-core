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
         * @param width The width of the default surface in pixels.
         * @param height The height of the default surface in pixels.
         */
        public constructor(width:number, height:number) {
            this.buffer = this.makeRenderBuffer(width, height);
            this.canvas = this.buffer.canvas;
        }

        /**
         * The canvas element associated with the surface.
         */
        public canvas:HTMLCanvasElement;
        /**
         * The default surface of the easel, anything drawn to it will show on the canvas.
         */
        public buffer:CanvasRenderBuffer;

        /**
         * Creates an buffer with specific size. The new buffer is "compatible" with this one, in that it will
         * efficiently be able to be drawn into parent buffer.
         * @param width The width of the buffer in pixels.
         * @param height The height of the buffer in pixels.
         * @param temporary Whether the buffer is created for temporary use.
         * @return A new buffer instance.
         */
        public makeRenderBuffer(width:number, height:number, temporary?:boolean):CanvasRenderBuffer {
            let buffer:CanvasRenderBuffer;
            if (temporary) {
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
                else {
                    buffer = new CanvasRenderBuffer(width, height);
                }
                temporaryBuffers.push(buffer);
            }
            else {
                buffer = new CanvasRenderBuffer(width, height);
            }
            buffer.easelHost = this;
            return buffer;
        }

        /**
         * Call to ensure all drawing to the surface has been issued to the underlying graphic API. This method is usually
         * called at the end of one drawing session.
         */
        public flush():void {
            for (let surface of temporaryBuffers) {
                surface.resize(0, 0);
                renderBufferPool.push(surface);
            }
            temporaryBuffers = [];
            if (renderBufferPool.length > 6) {
                renderBufferPool.length = 6;
            }
        }

    }
}