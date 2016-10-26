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

    let timerEvent = new egret.TimerEvent(egret.TimerEvent.TIMER);
    let timerCompleteEvent = new egret.TimerEvent(egret.TimerEvent.TIMER_COMPLETE);

    /**
     * The Timer class is the interface to timers, which let you run code on a specified time sequence. Use the start()
     * method to start a timer. Add an event listener for the timer event to set up code to be run on the timer interval.<br/>
     * You can create Timer objects to run once or repeat at specified intervals to execute code on a schedule. Depending
     * on the frame rate or the runtime environment (available memory and other factors), the runtime may dispatchEvent events at
     * slightly offset intervals.
     * @see egret.TimerEvent
     */
    export class Timer extends EventDispatcher {

        /**
         * Constructs a new Timer object with the specified delay and repeatCount states.
         * @param delay The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.
         * Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
         * @param repeatCount Specifies the number of repetitions. If zero, the timer repeats indefinitely.If nonzero,
         * the timer runs the specified number of times and then stops.
         */
        public constructor(delay:number, repeatCount:number = 0) {
            super();
            this.delay = delay;
            this.repeatCount = +repeatCount | 0;
        }

        /**
         * @private
         */
        private _delay:number = 0;
        /**
         * The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.<br/>
         * Note: Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
         */
        public get delay():number {
            return this._delay;
        }

        public set delay(value:number) {
            value = +value || 0;
            if (value < 1) {
                value = 1;
            }
            if (this._delay == value) {
                return;
            }
            this._delay = value;
            let interval = Math.round(60 * value);
            if (interval < 1000) { // 1000 equals 16.6ms, it is the minimum delta time we can get.
                interval = 1000;
            }
            this.lastCount = this.updateInterval = interval;
        }

        /**
         * The total number of times the timer is set to run. If the repeat count is set to 0, the timer continues indefinitely,
         * until the stop() method is invoked or the program stops. If the repeat count is nonzero, the timer runs the specified
         * number of times. If repeatCount is set to a total number that is the same or less then currentCount the timer stops and
         * will not fire again.
         */
        public repeatCount:number;

        /**
         * @private
         */
        private _currentCount:number = 0;

        /**
         * The total number of times the timer has fired since it started at zero. If the timer has been reset, only the
         * fires since the reset are counted.
         */
        public get currentCount():number {
            return this._currentCount;
        }

        /**
         * @private
         */
        private _running:boolean = false;

        /**
         * The timer's current state; true if the timer is running, otherwise false.
         */
        public get running():boolean {
            return this._running;
        }

        /**
         * Stops the timer, if it is running, and sets the currentCount property back to 0, like the reset button of a stopwatch.
         * Then, when start() is called, the timer instance runs for the specified number of repetitions, as set by the repeatCount value.
         */
        public reset():void {
            this.stop();
            this._currentCount = 0;
        }

        /**
         * Starts the timer, if it is not already running.
         */
        public start() {
            if (this._running)
                return;
            this.lastCount = this.updateInterval;
            this.lastTimeStamp = getTimer();
            sys.systemTicker.startTick(this.update, this);
            this._running = true;
        }

        /**
         * Stops the timer. When start() is called after stop(), the timer instance runs for the remaining number of
         * repetitions, as set by the repeatCount property.
         */
        public stop() {
            if (!this._running)
                return;
            sys.systemTicker.stopTick(this.update, this);
            this._running = false;
        }

        /**
         * @private
         */
        private updateInterval:number;
        /**
         * @private
         */
        private lastCount:number;
        /**
         * @private
         */
        private lastTimeStamp:number = 0;

        /**
         * @private
         * Ticker will call this method at 60fps.
         */
        private update(timeStamp:number):boolean {
            let deltaTime = timeStamp - this.lastTimeStamp;
            this.lastTimeStamp = timeStamp;
            if (deltaTime >= this._delay) {
                this.lastCount = this.updateInterval;
            }
            else {
                this.lastCount -= 1000;
                if (this.lastCount > 0) {
                    return false;
                }
                this.lastCount += this.updateInterval;
            }
            this._currentCount++;
            let complete = (this.repeatCount > 0 && this._currentCount >= this.repeatCount);
            this.dispatchEvent(timerEvent);
            timerEvent.$clean();
            if (complete) {
                this.stop();
                this.dispatchEvent(timerCompleteEvent);
                timerEvent.$clean();
            }
            return false;
        }
    }
}