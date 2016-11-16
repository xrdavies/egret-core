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
namespace egret.sys.BitmapData {
        let _displayList = egret.sys.createMap<DisplayObject[]>();
        export function $addDisplayObject(displayObject:DisplayObject, bitmapData:BitmapData|Texture):void {
            let hashCode:number;
            if((<Texture>bitmapData).$bitmapData && (<Texture>bitmapData).$bitmapData.hashCode) {
                hashCode = (<Texture>bitmapData).$bitmapData.hashCode;
            }
            else {
                hashCode = bitmapData.hashCode;
            }
            if(!hashCode) {
                return;
            }
            if (!_displayList[hashCode]) {
                _displayList[hashCode] = [displayObject];
                return;
            }

            let tempList:Array<DisplayObject> = _displayList[hashCode];
            if (tempList.indexOf(displayObject) < 0) {
                tempList.push(displayObject);
            }
        }

        export function $removeDisplayObject(displayObject:DisplayObject, bitmapData:BitmapData|Texture):void {
            let hashCode:number;
            if((<Texture>bitmapData).$bitmapData && (<Texture>bitmapData).$bitmapData.hashCode) {
                hashCode = (<Texture>bitmapData).$bitmapData.hashCode;
            }
            else {
                hashCode = bitmapData.hashCode;
            }
            if(!hashCode) {
                return;
            }
            if (!_displayList[hashCode]) {
                return;
            }

            let tempList:Array<DisplayObject> = _displayList[hashCode];
            let index:number = tempList.indexOf(displayObject);
            if (index >= 0) {
                tempList.splice(index);
            }
        }

        export function $invalidate(bitmapData:BitmapData|Texture):void {
            let hashCode:number;
            if((<Texture>bitmapData).$bitmapData && (<Texture>bitmapData).$bitmapData.hashCode) {
                hashCode = (<Texture>bitmapData).$bitmapData.hashCode;
            }
            else {
                hashCode = bitmapData.hashCode;
            }
            if(!hashCode) {
                return;
            }

            if (!_displayList[hashCode]) {
                return;
            }
            let tempList:Array<DisplayObject> = _displayList[hashCode];
            for (let i:number = 0; i < tempList.length; i++) {
                if (tempList[i] instanceof egret.Bitmap) {
                    var bitmap:Bitmap = <Bitmap>tempList[i];
                    bitmap.$bitmapBits |= sys.BitmapBits.DirtyBitmapData;
                    bitmap.$invalidateContentBounds();
                }
                tempList[i].$invalidateContentBounds();
            }
        }

        export function $dispose(bitmapData:BitmapData|Texture):void {
            let hashCode:number;
            if((<Texture>bitmapData).$bitmapData && (<Texture>bitmapData).$bitmapData.hashCode) {
                hashCode = (<Texture>bitmapData).$bitmapData.hashCode;
            }
            else {
                hashCode = bitmapData.hashCode;
            }
            if(!hashCode) {
                return;
            }

            if (!_displayList[hashCode]) {
                return;
            }
            let tempList:Array<DisplayObject> = _displayList[hashCode];
            for (let i:number = 0; i < tempList.length; i++) {
                // if (tempList[i] instanceof egret.Bitmap) {
                //     (<egret.Bitmap>tempList[i]).$Bitmap[sys.BitmapKeys.image] = null;
                // }
                tempList[i].$invalidateContentBounds();
            }
            delete _displayList[hashCode];
        }
}