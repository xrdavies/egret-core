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
 * @private
 */
declare namespace egret_native {

    let nativeType: string;

    /**
     * 游戏启动
     * @private
     */
    function startGame(): void;

    function _selectPhoto(promise: egret.PromiseObject): void;

    function loglevel(logType): void;

    function callRender(): void;

    function getVersion(): any;

    function setScreenCanvas(canvas: Canvas): void;

    function setFrameRate(frameRate: number): void;

    function onTouchesBegin(num: number, ids: any[], xs_array: any[], ys_array: any[]);

    function onTouchesMove(num: number, ids: any[], xs_array: any[], ys_array: any[]);

    function onTouchesEnd(num: number, ids: any[], xs_array: any[], ys_array: any[]);

    function onTouchesCancel(num: number, ids: any[], xs_array: any[], ys_array: any[]);

    //rt2
    function touchDown(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>);

    function touchMove(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>);

    function touchUp(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>);

    function touchCancel(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>);

    function sendToC(float32Array: Float32Array, arrayBufferLen: number, array: string[]): void;

    function sendGLArray(arrayBuffer:ArrayBuffer, arrayBufferLen:number, array:Array<string>, typedArrays:Array<any>):void;

    /**
     * 启动主循环
     * @param callback 主循环回调函数
     * @param thisObject
     */

    function setOnUpdate(callback:Function, thisObject:any):void;
    
    function executeMainLoop(callback: Function, thisObject: any): void;

    function pauseApp(): void;

    function resumeApp(): void;

    function readXML(filepath: string): any;

    function xmlStr2JsonStr(text: string): any;

    function isFileExists(filepath: string): boolean;

    function isRecordExists(filepath: string): boolean;

    function readFileSync(filepath: string, type?: string): any;

    function readResourceFileSync(filepath: string): any;

    function readUpdateFileSync(filepath: string): any;

    function deleteUpdateFile(filepath: string): void;

    function readFileAsync(filepath: string, promise: egret.PromiseObject, type?: string): any;

    function writeFileSync(filepath: string, fileContent: string): any;

    function pickPhoto(promise:egret.PromiseObject):void;

    function requireHttpSync(url:string, callback:Function):void;

    function requireHttp(url: string, param: any, callback: Function): void;

    function requestHttp(url: string, type:"GET"|"POST",stringfyHeaders:string,postData:string,forBinary:boolean, promise:egret.PromiseObject): void;

    function sendInfoToPlugin(info: string): void;

    function receivedPluginInfo(info: string): void;

    function loadRecord(filepath: string): string;

    function saveRecord(filepath: string, fileContent: string): void;

    function getOption(type: string): string;

    namespace Audio {
        function preloadBackgroundMusic(path: string): void;

        function playBackgroundMusic(path: string, loop: boolean): void;

        function setBackgroundMusicVolume(value: number): void;
        function setEffectsVolume(value: number): void;
        function getBackgroundMusicVolume(): number;
        function getEffectsVolume(): number;


        function stopBackgroundMusic(isRelease: boolean): void;

        function preloadEffect(path: string): void;

        function preloadEffectAsync(path: string, promise: egret.PromiseObject): void;

        function playEffect(path: string, loop: boolean): void;

        function unloadEffect(path: string): void;

        function stopEffect(effectId: number): void;

        function pauseBackgroundMusic(): void;

        function pauseAllEffects(): void;

        function resumeBackgroundMusic(): void;

        function resumeAllEffects(): void;
    }

    function download(url: string, savePath: string, promise: any): void;

    namespace Graphics {
        function lineTo(x: number, y: number): void;

        function cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;

        function curveTo(cx: number, cy: number, x: number, y: number): void;

        function moveTo(x: number, y: number): void;

        function translate(x: number, y: number): void;

        function bindTexture(texture: any, width: number, height: number): void;

        function generateTexture(): void;

        function beginPath(): void;

        function fill(color: number, alpha: number): void;

        function stroke(color: number, alpha: number, width: number): void;
    }

    namespace Label {
        function drawText(text: string, x: number, y: number, size: number, textColor: number, stroke: number, strokeColor: number): void;

        function setTextAlignment(type: string): void;

        function getTextWidth(text: string, size: number): number;

        function bindTexture(texture: any, width: number, height: number): void;

        function generateTexture(): void;
    }


    namespace EGTXML {


        function readXML(filepath: string): void;
    }

    function createImage(filePath:string, promise:any):any;

    namespace Texture {

        function create(filePath: string): any;

        function addTexture(filePath: string): any;

        function addTextureAsyn(filePath: string, promise: any): any;

        function addTextureUnsyn(filePath: string, promise: any): any;

        function removeTexture(filePath:string): void;

        function createTextureFromArrayBuffer(arrayBuffer:ArrayBuffer): any;

    }


    namespace TextInputOp {

        function setKeybordOpen(isOpen: boolean, jsonConfig?: Object): void

        function isFullScreenKeyBoard(): boolean

        function setInputTextMaxLenght(value: number): void;

        function updateConfig(jsonConfig?: Object): void
    }

    function EGT_TextInput(text: string): void

    function EGT_keyboardFinish(): void


    function EGT_deleteBackward(): void;

    function EGT_keyboardDidHide(): void;

    function EGT_keyboardDidShow(): void;

    function EGT_getTextEditerContentText(): string;
    
    function getDeviceWidth():number;

    function getDeviceHeight():number;

    function setVisibleRect(x:number, y:number, w:number, h:number):number;

    function setDesignSize(w:number, h:number):number;

    namespace EGTView {// native2废弃

        function getFrameWidth(): number;

        function getFrameHeight(): number;

        function setVisibleRect(x: number, y: number, w: number, h: number): number;

        function setDesignSize(w: number, h: number): number;
    }
    /**
     * @private
     */
    class RenderTexture {
        constructor(width: number, height: number);

        begin();

        end();

        dispose();

        toDataURL(type);

        saveToFile(type: string, filePath: string);
    }

    namespace rastergl {
        function arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;

        function quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;

        function lineTo(x: number, y: number): void;

        function fill(fillRule?: string): void;

        function closePath(): void;

        function rect(x: number, y: number, w: number, h: number): void;

        function moveTo(x: number, y: number): void;

        function fillRect(x: number, y: number, w: number, h: number): void;

        function bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;

        function stroke(): void;

        function strokeRect(x: number, y: number, w: number, h: number): void;

        function beginPath(): void;

        function arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;

        function transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;

        function translate(x: number, y: number): void;

        function scale(x: number, y: number): void;

        function rotate(angle: number): void;

        function save(): void;

        function restore(): void;

        function createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;

        function createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;

        /**
         * @private
         */
        export let lineWidth: number;
        /**
         * @private
         */
        export let strokeStyle: any;
        /**
         * @private
         */
        export let fillStyle: any;
    }

    namespace Game {
        function listResource(root, promise);

        function listUpdate(root, promise);
    }
    /**
     * @private
     */
    class RenderContext {
        clearScreen(r: number, g: number, b: number): void;

        drawImage(texture: any, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight): void;

        setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;

        setGlobalAlpha(alpha: number): void;

        pushClip(x: number, y: number, w: number, h: number): void;

        popClip(): void;
    }
    /**
     * @private
     */
    class Canvas {
        constructor(width: number, height: number);

        width: number;
        height: number;

        getContext(type: string): RenderContext;
    }
}