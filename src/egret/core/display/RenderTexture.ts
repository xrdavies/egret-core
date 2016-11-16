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

namespace egret {

    /**
     * @language zh_CN
     * RenderTexture 是动态纹理类，他实现了将显示对象及其子对象绘制成为一个纹理的功能
     * @includeExample egret/display/RenderTexture.ts
     */
    /**
     * RenderTexture is a dynamic texture.
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     */
    export class RenderTexture extends egret.Texture {

        constructor() {
            super();
        }

        /**
         * @language zh_CN
         * 将指定显示对象绘制为一个纹理
         * @param displayObject 需要绘制的显示对象
         * @param clipBounds 绘制矩形区域
         * @param scale 缩放比例
         */
        /**
         * The specified display object is drawn as a texture
         * @param displayObject the display to draw
         * @param clipBounds clip rect
         * @param scale scale factor
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawToTexture(displayObject:egret.DisplayObject, clipBounds?:Rectangle, scale:number = 1):boolean {
            //todo
            // if (clipBounds && (clipBounds.width == 0 || clipBounds.height == 0)) {
            //     return false;
            // }

            // let bounds = clipBounds || displayObject.$getOriginalBounds();
            // if (bounds.width == 0 || bounds.height == 0) {
            //     return false;
            // }

            // scale /= $TextureScaleFactor;
            // let width = (bounds.x + bounds.width) * scale;
            // let height = (bounds.y + bounds.height) * scale;
            // if (clipBounds) {
            //     width = bounds.width * scale;
            //     height = bounds.height * scale;
            // }

            // let renderBuffer = this.$renderBuffer;
            // if (!renderBuffer) {
            //     return false;
            // }
            // renderBuffer.resize(width, height);
            // this._bitmapData.width = width;
            // this._bitmapData.height = height;

            // let matrix = Matrix.create();
            // matrix.identity();
            // //应用裁切
            // if (clipBounds) {
            //     matrix.translate(-clipBounds.x, -clipBounds.y);
            // }
            // matrix.scale(scale, scale);
            // sys.systemRenderer.render(displayObject, renderBuffer, matrix, null, true);
            // Matrix.release(matrix);

            // //设置纹理参数
            // this.$initData(0, 0, width, height, 0, 0, width, height, width, height);
            
            return true;
        }
    }
}