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
     * Bitmap 类表示用于显示位图图片的显示对象。
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象引用的 Bitmap 对象。创建了 Bitmap 对象后，
     * 使用父级 DisplayObjectContainer 实例的 addChild() 或 addChildAt() 方法可以将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 texture 引用，与缩放或旋转属性无关。
     * 由于能够创建引用相同 texture 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的 texture 对象，
     * 而不会因为每个显示对象实例使用一个 texture 对象而产生额外内存开销。
     */
    /**
     * The Bitmap class represents display objects that represent bitmap images. <br/>
     * The Bitmap() constructor allows you to create a Bitmap object that contains a reference to a BitmapData object.
     * After you create a Bitmap object, use the addChild() or addChildAt() method of the parent DisplayObjectContainer
     * instance to place the bitmap on the display list.<br/>
     * A Bitmap object can share its BitmapData reference among several Bitmap objects, independent of translation or
     * rotation properties. Because you can create multiple Bitmap objects that reference the same BitmapData object,
     * multiple display objects can use the same complex BitmapData object without incurring the memory overhead of a
     * BitmapData object for each display object instance.
     * @see egret.BitmapData
     * @see egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Bitmap.ts
     */
    export class Bitmap extends DisplayObject {
        /**
         * @language zh_CN
         * 创建一个引用指定 BitmapData|Texture 实例的 Bitmap 对象
         * @param value 被引用的 BitmapData|Texture 实例
         */
        /**
         * Initializes a Bitmap object to refer to the specified BitmapData object.
         * @param value The BitmapData|Texture object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(value?:BitmapData) {
            super();
            this.$nodeType = sys.NodeType.BITMAP;
            this.bitmapData = value;
        }

        /**
         * @internal
         */
        $bitmapBits = 0;

        /**
         * @internal
         */
        $bitmapData:BitmapData;

        /**
         * @language zh_CN
         * 被引用的 BitmapData 对象。
         * 如果传入构造函数的类型为 Texture 或者最后设置的为 texture，则此值返回 null。
         */
        /**
         * The BitmapData object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bitmapData():BitmapData {
            return this.$bitmapData;
        }

        public set bitmapData(value:BitmapData) {
            this.setBitmapData(value);
        }

        protected setBitmapData(value:BitmapData):void {
            if (value == this.$bitmapData) {
                return;
            }
            this.$bitmapData = value;
            this.$bitmapBits |= sys.BitmapBits.DirtyBitmapData;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $smoothing:boolean = true;

        /**
         * @language en_US
         * Whether or not the bitmap is smoothed when scaled.
         */
        /**
         * Whether or not the bitmap is smoothed when scaled.
         * @default true
         * @version Egret 2.4
         * @platform Web
         */
        public get smoothing():boolean {
            return this.$smoothing;
        }

        public set smoothing(value:boolean) {
            this.setSmoothing(value);
        }

        protected setSmoothing(value:boolean):void {
            value = !!value;
            if (value == this.$smoothing) {
                return;
            }
            this.$smoothing = value;
            this.$bitmapBits |= sys.BitmapBits.DirtySmoothing;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $scale9Grid:Rectangle = null;
        /**
         * @language zh_CN
         * 一个矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
         */
        /**
         * The current scaling grid that is in effect. If set to null, the entire bitmap is scaled normally when any scale
         * transformation is applied. <br/>
         * When you define the scale9Grid property, the bitmap is divided into a grid with nine regions based on the
         * scale9Grid rectangle, which defines the center region of the grid. The eight other regions of the grid are
         * the following areas:<p/>
         *
         * The upper-left corner outside of the rectangle <br/>
         * The area above the rectangle <br/>
         * The upper-right corner outside of the rectangle <br/>
         * The area to the left of the rectangle <br/>
         * The area to the right of the rectangle <br/>
         * The lower-left corner outside of the rectangle <br/>
         * The area below the rectangle <br/>
         * The lower-right corner outside of the rectangle <p/>
         *
         * You can think of the eight regions outside of the center (defined by the rectangle) as being like a picture frame
         * that has special rules applied to it when scaled. <br/>
         * When the scale9Grid property is set and a bitmap is scaled, the following rules apply: <p/>
         *
         * Content in the center region is scaled normally. <br/>
         * Content in the corners is not scaled. <br/>
         * Content in the top and bottom regions is scaled horizontally only. Content in the left and right regions is
         * scaled vertically only. <br/>
         * All bitmaps are stretched to fit their shapes. <p/>
         *
         * Note: This property is valid only when fillMode is BitmapFillMode.SCALE
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get scale9Grid():Rectangle {
            return this.$scale9Grid;
        }

        public set scale9Grid(value:Rectangle) {
            this.setScale9Grid(value);
        }

        protected setScale9Grid(value:Rectangle):void {
            this.$scale9Grid = value;
            this.$bitmapBits |= sys.BitmapBits.DirtyScale9Grid;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $fillMode:string = BitmapFillMode.SCALE;

        /**
         * Determines how the bitmap fills in the dimensions.<br/>
         * When set to egret.BitmapFillMode.REPEAT, the bitmap repeats to fill the region.<br/>
         * When set to egret.BitmapFillMode.SCALE, the bitmap stretches to fill the region.<br/>
         * When set to egret.BitmapFillMode.CLIP, The bitmap ends at the edge of the region.<br/>
         * @default egret.BitmapFillMode.SCALE
         */
        public get fillMode():string {
            return this.$fillMode;
        }

        public set fillMode(value:string) {
            this.setFillMode(value);
        }

        protected setFillMode(value:string):void {
            if (value == this.$fillMode) {
                return;
            }
            this.$fillMode = value;
            this.$bitmapBits |= sys.BitmapBits.DirtyFillMode;
            this.$invalidateContentBounds();
        }


        private _pixelHitTest:boolean = false;

        /**
         * Specifies whether this object use precise hit testing by checking the alpha value of each pixel.If pixelHitTest
         * is set to true, the transparent area of the bitmap will not receive touch, or other user input.<br/>
         * Note: The pixelHitTest property is invalid if the image is loaded from cross origin.
         * @default false
         */
        public get pixelHitTest():boolean {
            return this._pixelHitTest;
        }

        public set pixelHitTest(value:boolean) {
            this._pixelHitTest = !!value;
        }

        private explicitWidth:number = NaN;

        protected getWidth():number {
            return isNaN(this.explicitWidth) ? this.measuredWidth : this.explicitWidth;
        }

        protected setWidth(value:number):void {
            value = +value || 0;
            if (value < 0 || value === this.explicitWidth) {
                return;
            }
            this.explicitWidth = value;
            this.$invalidateContentBounds();
        }

        private explicitHeight:number = NaN;

        protected getHeight():number {
            return isNaN(this.explicitHeight) ? this.measuredHeight : this.explicitHeight;
        }

        protected setHeight(value:number):void {
            value = +value || 0;
            if (value < 0 || value === this.explicitHeight) {
                return;
            }
            this.explicitHeight = value;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $measureContentBounds(bounds:Rectangle):void {
            let bitmapData = this.$bitmapData;
            if (bitmapData) {
                let width = isNaN(this.explicitWidth) ? bitmapData.width : this.explicitWidth;
                let height = isNaN(this.explicitHeight) ? bitmapData.height : this.explicitHeight;
                bounds.setTo(0, 0, width, height);
            }
            else {
                let width = isNaN(this.explicitWidth) ? 0 : this.explicitWidth;
                let height = isNaN(this.explicitHeight) ? 0 : this.explicitHeight;
                bounds.setTo(0, 0, width, height);
            }
        }

    }
}