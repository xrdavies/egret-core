//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided this the following conditions are met:
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

namespace egret.native2 {
    /**
     * @private
     */
    export class NativeTouchHandler extends HashObject {
        private $touch:egret.sys.TouchHandler;

        constructor(stage:Stage) {
            super();
            this.$touch = new egret.sys.TouchHandler(stage);

            let _that = this;
            window.addEventListener("touchstart", function(event:any) {
                let l = event.changedTouches.length;
                for (let i:number = 0; i < l; i++) {
                    var touch = event.changedTouches[i];
                    var locationX = (touch.pageX - _that.touchOffsetX) / (_that.touchScaleX);
                    var locationY = (touch.pageY - _that.touchOffsetY) / (_that.touchScaleY);
                    _that.$touch.onTouchBegin(locationX, locationY, touch.identifier);
                }
            });
            window.addEventListener("touchmove", function(event:any) {
                let l = event.changedTouches.length;
                for (let i:number = 0; i < l; i++) {
                    var touch = event.changedTouches[i];
                    var locationX = (touch.pageX - _that.touchOffsetX) / (_that.touchScaleX);
                    var locationY = (touch.pageY - _that.touchOffsetY) / (_that.touchScaleY);
                    _that.$touch.onTouchMove(locationX, locationY, touch.identifier);
                }
            });
            window.addEventListener("touchend", function(event:any) {
                let l = event.changedTouches.length;
                for (let i:number = 0; i < l; i++) {
                    var touch = event.changedTouches[i];
                    var locationX = (touch.pageX - _that.touchOffsetX) / (_that.touchScaleX);
                    var locationY = (touch.pageY - _that.touchOffsetY) / (_that.touchScaleY);
                    _that.$touch.onTouchEnd(locationX, locationY, touch.identifier);
                }
            });
            window.addEventListener("touchcancel", function(event:any) {
                let l = event.changedTouches.length;
                for (let i:number = 0; i < l; i++) {
                    var touch = event.changedTouches[i];
                    var locationX = (touch.pageX - _that.touchOffsetX) / (_that.touchScaleX);
                    var locationY = (touch.pageY - _that.touchOffsetY) / (_that.touchScaleY);
                    _that.$touch.onTouchEnd(locationX, locationY, touch.identifier);
                }
            });
            // egret_native.touchDown = function (num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
            //     _that.$executeTouchCallback(num, ids, xs_array, ys_array, _that.$touch.onTouchBegin);
            // };
            // egret_native.touchMove = function (num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
            //     _that.$executeTouchCallback(num, ids, xs_array, ys_array, _that.$touch.onTouchMove);
            // };
            // egret_native.touchUp = function (num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
            //     _that.$executeTouchCallback(num, ids, xs_array, ys_array, _that.$touch.onTouchEnd);
            // };
            // egret_native.touchCancel = function (num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {

            // };
        }

        // private $executeTouchCallback(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>, callback:Function) {
        //     for (let i = 0; i < num; i++) {
        //         let id = ids[i];
        //         let x = xs_array[i];
        //         let y = ys_array[i];
        //         callback.call(this.$touch, x, y, id);
        //     }
        // }

        /**
         * @private
         */
        private scaleX:number = 1;
        /**
         * @private
         */
        private scaleY:number = 1;
        /**
         * @private
         */
        private rotation:number = 0;
        /**
         * @private 更新Stage相对于屏幕的缩放比例，用于计算准确的点击位置。
         * @platform Native
         */
        private touchScaleX:number = 1;
        private touchScaleY:number = 1;
        private touchOffsetX:number = 0;
        private touchOffsetY:number = 0;
        /**
         * @private
         * 更新屏幕当前的缩放比例，用于计算准确的点击位置。
         * @param scaleX 水平方向的缩放比例。
         * @param scaleY 垂直方向的缩放比例。
         */
        public updateScaleMode(scaleX:number, scaleY:number, rotation:number):void {
            this.scaleX = scaleX;
            this.scaleY = scaleY;
            this.rotation = rotation;
        }

        public updateTouchOffset(scalex:number, scaley:number, top:number, left:number) {
                this.touchScaleX = scalex;
                this.touchScaleY = scaley;
                this.touchOffsetX = left;
                this.touchOffsetY = top;
        }

        /**
         * @private
         * 更新同时触摸点的数量
         */
        public $updateMaxTouches():void {
            this.$touch.$initMaxTouches();
        }
    }
}