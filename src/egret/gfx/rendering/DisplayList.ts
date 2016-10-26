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
    export class DisplayList {
        public constructor(target:Node) {

        }

        public stageHandle:any = null;

        public setStageHandle(handle:any):void {

        }

        public resetSurface():void {

        }

        public setClipRegion(rect:Rectangle):void {

        }

        public updateRenderAlpha():void {

        }

        public region:Rectangle = new Rectangle();
        public drawn:boolean = false;
        public dirtyTransform:boolean = true;

        public renderMatrix:Matrix = new Matrix();

        /**
         * Marks an area as dirty.
         */
        public invalidateRect(rect:Rectangle):void {

        }

        /**
         * Updates the concatenatedMatrix and concatenatedAlpha properties, and caculates dirty regions.
         */
        public update(forceDirtyTransform?:boolean, clipRegion?:Rectangle) {

        }

        /**
         * Checks whether the node need to call the render method. If yes, apply the renderMatrix and renderAlpha then \
         * call the render menthod.
         */
        public renderCheck(context:CanvasRenderingContext2D, clipRegion:Rectangle, matrix:Matrix):void {
            if (!clipRegion || clipRegion.intersects(this.region)) {
                //setCanvasMatrix(canvas, renderMatrix, matrix);
                this.render(context);
                this.drawn = true;
            }
        }

        /**
         * Draws the content to the specified canvas.
         */
        public render(context:CanvasRenderingContext2D):void {

        }

    }
}