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
namespace elf {
    /**
     * @internal
     */
    export class Bitmap extends Node {
        public constructor() {
            super();
            this.nodeType = egret.sys.NodeType.BITMAP;
            this.region = new Rectangle();
        }

        /**
         * The BitmapData object being referenced.
         */
        public bitmapData:BitmapData = null;

        /**
         * Whether or not the bitmap is smoothed when scaled.
         */
        public smoothing:boolean = true;

        /**
         * Determines how the bitmap fills in the dimensions.
         */
        public fillMode:number = BitmapFillMode.SCALE;

        /**
         * The current scaling grid that is in effect. If set to null, the entire bitmap is scaled normally when any scale
         * transformation is applied.
         */
        public scale9Grid:Rectangle = null;

        public setScale9Grid(value:Rectangle):void {
            if (value) {
                if (!this.scale9Grid) {
                    this.scale9Grid = new Rectangle();
                }
                this.scale9Grid.copyFrom(value);
            } else {
                this.scale9Grid = null;
            }
        }


        protected measureContentBounds(bounds:Rectangle):void {
            let bitmapData = this.bitmapData;
            if (bitmapData) {
                bounds.setTo(0, 0, bitmapData.width, bitmapData.height);
            }
            else {
                bounds.setEmpty();
            }
        }
    }
}