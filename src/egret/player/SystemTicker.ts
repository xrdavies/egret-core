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
namespace egret.sys {

    /**
     * @internal
     */
    export let systemTicker:SystemTicker;

    /**
     * @internal
     */
    export interface SystemTicker {

        /**
         * The global frame rate.
         */
        frameRate:number;

        /**
         * Set the global frame rate for all stages.
         */
        setFrameRate(value:number):void;

        /**
         * Request runtime to broadcast render events before update the screen.
         */
        requestRenderEvent();

        /**
         * Request runtime to update the screen at this frame.
         */
        requestScreenUpdate();

        /**
         * Add a player and start running it.
         */
        addStage(stage:egret.Stage):void;

        /**
         * Stop a player from running.
         */
        removeStage(stage:egret.Stage):void;

        /**
         * Register and start a timer,which will notify the callback method at a rate of 60 FPS ,and pass the current time
         * stamp as parameters.<br/>
         * Note: After the registration,it will notify the callback method continuously,you can call the stopTick () method to stop it.
         * @param callBack The call back method. the timeStamp parameter of this method represents a high resolution milliseconds
         * since the runtime was initialized. If the return value of this method is true, it will force runtime to render
         * after processing of this method completes.
         * @param thisObject The call back method's "this"
         */
        startTick(callBack:(timeStamp:number) => boolean, thisObject:any):void;

        /**
         * Stops the timer started by the startTick() method.
         * @param callBack The call back method you passed in startTick method before.
         * @param thisObject The call back method's "this".
         */
        stopTick(callBack:(timeStamp:number) => boolean, thisObject:any):void;

        /**
         * This method will be called at a rate of 60 FPS.
         * @param timeStamp A high resolution milliseconds measured from the beginning of the runtime was initialized.
         */
        update(timeStamp:number):void;
    }


    /**
     * @private
     */
    class Ticker implements SystemTicker {

        public constructor() {
            this.frameDeltaTime = 1000 / this.frameRate;
            this.lastCount = this.frameInterval = Math.round(60000 / this.frameRate);
        }

        private requestRenderEventFlag:boolean = false;

        public requestRenderEvent() {
            this.requestRenderEventFlag = true;
        }

        private requestScreenUpdateFlag:boolean = false;

        public requestScreenUpdate() {
            this.requestScreenUpdateFlag = true;
        }

        public frameRate:number = 60;
        private frameInterval:number;
        private lastCount:number;
        private frameDeltaTime:number;
        private lastTimeStamp:number = 0;

        public setFrameRate(value:number):void {
            this.frameRate = value;
            if (value > 60) {
                value = 60;
            }

            this.frameDeltaTime = 1000 / value;
            //use '60*1000' to prevent float precision problem.
            this.lastCount = this.frameInterval = Math.round(60000 / value);
        }

        private stageList:egret.Stage[] = [];

        public addStage(stage:egret.Stage):void {
            if (this.stageList.indexOf(stage) != -1) {
                return;
            }
            this.stageList = this.stageList.concat();
            this.stageList.push(stage);
        }

        public removeStage(stage:egret.Stage):void {
            let index = this.stageList.indexOf(stage);
            if (index !== -1) {
                this.stageList = this.stageList.concat();
                this.stageList.splice(index, 1);
            }
        }

        private callBackList:Function[] = [];

        private thisObjectList:any[] = [];

        public startTick(callBack:(timeStamp:number)=>boolean, thisObject:any):void {
            let index = this.getTickIndex(callBack, thisObject);
            if (index != -1) {
                return;
            }
            this.concatTick();
            this.callBackList.push(callBack);
            this.thisObjectList.push(thisObject);
        }

        public stopTick(callBack:(timeStamp:number)=>boolean, thisObject:any):void {
            let index = this.getTickIndex(callBack, thisObject);
            if (index == -1) {
                return;
            }
            this.concatTick();
            this.callBackList.splice(index, 1);
            this.thisObjectList.splice(index, 1);
        }

        private getTickIndex(callBack:Function, thisObject:any):number {
            let callBackList = this.callBackList;
            let thisObjectList = this.thisObjectList;
            for (let i = callBackList.length - 1; i >= 0; i--) {
                if (callBackList[i] == callBack &&
                    thisObjectList[i] == thisObject) {//do not use '==='，because they may be 'undefined' and 'null'.
                    return i;
                }
            }
            return -1;
        }

        private concatTick():void {
            this.callBackList = this.callBackList.concat();
            this.thisObjectList = this.thisObjectList.concat();
        }


        private enterFrameCost:number = 0;


        public update(timeStamp:number):void {
            let t1 = egret.getTimer();
            let callBackList = this.callBackList;
            let thisObjectList = this.thisObjectList;
            let length = callBackList.length;
            let requestRenderingFlag = this.requestScreenUpdateFlag;
            for (let i = 0; i < length; i++) {
                if (callBackList[i].call(thisObjectList[i], timeStamp)) {
                    requestRenderingFlag = true;
                }
            }

            let t2 = egret.getTimer();
            let deltaTime = timeStamp - this.lastTimeStamp;
            this.lastTimeStamp = timeStamp;
            if (deltaTime >= this.frameDeltaTime) {
                this.lastCount = this.frameInterval;
            }
            else {
                this.lastCount -= 1000;
                if (this.lastCount > 0) {
                    if (requestRenderingFlag) {
                        this.render(false, this.enterFrameCost + t2 - t1);
                    }
                    return;
                }
                this.lastCount += this.frameInterval;
            }


            this.render(true, this.enterFrameCost + t2 - t1);
            let t3 = egret.getTimer();
            this.broadcastEnterFrame();
            let t4 = egret.getTimer();
            this.enterFrameCost = t4 - t3;
        }

        private render(triggeredByFrame:boolean, jsCost:number):void {
            let stageList = this.stageList;
            let length = stageList.length;
            if (length == 0) {
                return;
            }
            let t = egret.getTimer();
            if (this.requestRenderEventFlag) {
                this.broadcastRender();
                this.requestRenderEventFlag = false;
            }
            let t2 = egret.getTimer();
            let buffer = sys.sharedBuffer;
            for (let i = 0; i < length; i++) {
                let stage = stageList[i];
                sys.Serializer.writeUpdates(stage, buffer);
                if (buffer.length > 0) {
                    sys.GFX.updateAndGet(buffer.arrayBuffer, buffer.length, buffer.stringTable);
                    buffer.clear();
                }
            }
            let t3 = egret.getTimer();
            sys.GFX.render(triggeredByFrame, jsCost + t2 - t, t3 - t2);
            this.requestScreenUpdateFlag = false;
        }


        private broadcastEnterFrame():void {
            let list = egret.DisplayObject.$enterFrameCallBackList;
            let length = list.length;
            if (length === 0) {
                return;
            }
            list = list.concat();
            for (let i = 0; i < length; i++) {
                list[i].dispatchEventWith(egret.Event.ENTER_FRAME);
            }
        }


        private broadcastRender():void {
            let list = egret.DisplayObject.$renderCallBackList;
            let length = list.length;
            if (length === 0) {
                return;
            }
            list = list.concat();
            for (let i = 0; i < length; i++) {
                list[i].dispatchEventWith(egret.Event.RENDER);
            }
        }
    }

    sys.systemTicker = new Ticker();

}

