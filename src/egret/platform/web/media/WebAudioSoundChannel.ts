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

namespace egret.web {

    /**
     * @internal
     * @inheritDoc
     */
    export class WebAudioSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {


        /**
         * @internal
         */
        $url:string;
        /**
         * @internal
         */
        $loops:number;
        /**
         * @internal
         */
        $startTime:number = 0;

        /**
         * @internal
         * audio音频对象
         * @member {any} egret.Sound#audio
         */
        $audioBuffer:AudioBuffer;
        /**
         * @internal
         */
        private gain;
        /**
         * @internal
         */
        private bufferSource:AudioBufferSourceNodeEgret = null;

        /**
         * @internal
         */
        private context = WebAudioDecode.ctx;

        //声音是否已经播放完成
        private isStopped:boolean = false;

        /**
         * @internal
         */
        constructor() {
            super();

            if (this.context["createGain"]) {
                this.gain = this.context["createGain"]();
            }
            else {
                this.gain = this.context["createGainNode"]();
            }
        }

        /**
         * @internal
         */
        private _currentTime:number = 0;
        /**
         * @internal
         */
        private _volume:number = 1;

        $play():void {
            if (this.isStopped) {
                egret.$error(1036);
                return;
            }

            if (this.bufferSource) {
                this.bufferSource.onended = null;
                this.bufferSource = null;
            }
            let context = this.context;
            let gain = this.gain;
            let bufferSource = context.createBufferSource();
            this.bufferSource = bufferSource;
            bufferSource.buffer = this.$audioBuffer;
            bufferSource.connect(gain);
            gain.connect(context.destination);
            bufferSource.onended = this.onPlayEnd;

            this._startTime = Date.now();
            this.gain.gain.value = this._volume;
            bufferSource.start(0, this.$startTime);
            this._currentTime = 0;
        }

        public stop():void {
            if (this.bufferSource) {
                let sourceNode = this.bufferSource;
                if (sourceNode.stop) {
                    sourceNode.stop(0);
                }
                else {
                    sourceNode.noteOff(0);
                }
                this.bufferSource.disconnect();
                this.bufferSource = null;

                this.$audioBuffer = null;
            }

            if (!this.isStopped) {
                sys.$popSoundChannel(this);
            }

            this.isStopped = true;
        }

        /**
         * @internal
         */
        private onPlayEnd = () => {
            if (this.$loops == 1) {
                this.stop();
                this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                return;
            }

            if (this.$loops > 0) {
                this.$loops--;
            }

            /////////////
            this.$play();
        };

        /**
         * @internal
         * @inheritDoc
         */
        public get volume():number {
            return this._volume;
        }

        /**
         * @inheritDoc
         */
        public set volume(value:number) {
            if (this.isStopped) {
                egret.$error(1036);
                return;
            }

            this._volume = value;
            this.gain.gain.value = value;
        }

        /**
         * @internal
         */
        private _startTime:number = 0;
        /**
         * @internal
         * @inheritDoc
         */
        public get position():number {
            if (this.bufferSource) {
                return (Date.now() - this._startTime) / 1000 + this.$startTime;
            }
            return 0;
        }
    }
}