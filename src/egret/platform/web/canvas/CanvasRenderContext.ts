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

    let blendModes = ["source-over", "source-over", "lighter", "destination-out","darken", "difference", "hard-light",
        "lighten", "multiply", "overlay","screen", "color-dodge", "color-burn", "soft-light", "exclusion", "hue",
        "saturation", "color", "luminosity"];
    let compositeOperations = ["destination-in"];

    /**
     * Modify the current blend mode.
     */
    function setBlendMode(value:elf.BlendMode):void {
        if(this._blendMode === value){
            return;
        }
        this._blendMode = value;
        if(value<0){
            this.globalCompositeOperation = compositeOperations[-value];
        }
        else {
            this.globalCompositeOperation = blendModes[value];
        }
    }

    /**
     * Modify the current clip with the specified rectangle.
     */
    function clipRect(x:number, y:number, width:number, height:number):void {
        this.beginPath();
        this.rect(x, y, width, height);
        this.clip();
    }


    let ImageSmoothingEnabledKey:string = "";

    function addImageSmoothingEnabledShim(context:any) {
        if (!ImageSmoothingEnabledKey) {
            let keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
            for (let key of keys) {
                if (key in context) {
                    ImageSmoothingEnabledKey = key;
                    break;
                }
            }
        }
        const internalKey = "_$imageSmoothingEnabled";
        Object.defineProperty(context, "imageSmoothingEnabled", {
            get: function () {
                return this[internalKey];
            },
            set: function (value) {
                if (this[internalKey] == value) {
                    return;
                }
                this[internalKey] = value;
                this[ImageSmoothingEnabledKey] = value;
            }
        });
    }


    /**
     * Overrides the default set accessor with a new one that checks the value equality before calling the native code.
     */
    function optimizeSetAccessor(host:any, property:string):void {
        let data = Object.getOwnPropertyDescriptor(host, property);
        if (!data) {
            let prototype = Object.getPrototypeOf(host);
            if (prototype) {
                data = Object.getOwnPropertyDescriptor(prototype, property);
            }
        }
        let originalSet = data.set;
        let internalKey = "_$" + property;
        data.get = function ():any {
            return this[internalKey];
        };
        data.set = function (value:any) {
            if (this[internalKey] == value) {
                return;
            }
            this[internalKey] = value;
            originalSet.call(this, value);
        };
        Object.defineProperty(host, property, data);
    }

    /**
     * @internal
     */
    export function makeCanvasRenderContext(context:CanvasRenderingContext2D):elf.RenderContext {
        if (context["imageSmoothingEnabled"] === undefined) {
            addImageSmoothingEnabledShim(context);
        }
        else {
            optimizeSetAccessor(context, "imageSmoothingEnabled");
        }
        optimizeSetAccessor(context, "globalAlpha");
        optimizeSetAccessor(context, "font");
        optimizeSetAccessor(context, "textAlign");
        optimizeSetAccessor(context, "textBaseline");
        context["setBlendMode"] = setBlendMode;
        context["clipRect"] = clipRect;
        return context;
    }
}