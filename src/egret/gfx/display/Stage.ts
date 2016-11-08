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
    export class Stage extends Node {
        public constructor() {
            super();
            this.nodeType = egret.sys.NodeType.Stage;
            this.displayList = new DisplayList(this);
            this.displayList.stageHandle = this;
        }

        private screen:Screen;

        public setScreen(value:Screen):void {
            this.screen = value;
            this.displayList.buffer = value.buffer;
        }

        public setColor(value:number):void {
            this.screen.setColor(value);
        }


        public setDisplayRule(rule:egret.sys.StageDisplayRule):void {
            this.stageBounds.set(0, 0, rule.stageWidth, rule.stageHeight);
            this.displayList.dirtyTransform = true;
            this.displayList.setClipRegion(this.stageBounds);
            this.screen.applyDisplayRule(rule);
        }

        private stageBounds:Rectangle = new Rectangle();

        public mergeRegions(bounds:Rectangle):void {
            bounds.copyFrom(this.stageBounds);
        }

        public render():number {
            let t = egret.getTimer();
            let displayList = this.displayList;
            let stageChanged = displayList.update(false);
            this.dirtyTransform = false;
            let t2 = egret.getTimer();
            if (stageChanged) {
                displayList.drawToBuffer();
                let t3 = egret.getTimer();
                this.screen.present();
                let t4 = egret.getTimer();
                return t4 - t;
            }
            return t2 - t;
        }
    }
}