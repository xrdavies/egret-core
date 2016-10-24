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
declare namespace egret.native {

    /**
     * @internal
     * load image from url.
     * @param url The URL of the image to be loaded.
     * @param callback The callback function that receive the loaded image data.
     * @param thisObject the listener function's "this"
     */
    function loadImageFromURL(url:string, callback:(data:egret.BitmapData)=>void, thisObject:any);

}

/**
 * @internal
 */
namespace egret.native {

    /**
     * @private
     */
    let ioErrorEvent = new egret.IOErrorEvent(egret.IOErrorEvent.IO_ERROR);

    /**
     * @internal
     * @copy egret.ImageLoader
     */
    class NativeImageLoader extends egret.EventDispatcher implements egret.ImageLoader {
        /**
         * @copy egret.ImageLoader#data
         */
        public data:egret.BitmapData = null;
        /**
         * @private
         */
        private currentURL:string;

        /**
         * @copy egret.ImageLoader#load
         */
        public load(url:string):void {
            this.currentURL = url;
            loadImageFromURL(url, this.onLoadFinish, this);
        }

        /**
         * @private
         */
        private onLoadFinish(data:egret.BitmapData) {
            this.data = data;
            if (data) {
                this.dispatchEventWith(egret.Event.COMPLETE);
            }
            else {
                let errorText = "Stream Error. URL: " + this.currentURL;
                ioErrorEvent.text = errorText;
                if (this.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                    this.dispatchEvent(ioErrorEvent);
                }
                else {
                    throw new URIError(errorText);
                }

            }

        }
    }

    egret.ImageLoader = NativeImageLoader;

}