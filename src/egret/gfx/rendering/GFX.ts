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

    let stageList:Stage[] = [];

    /**
     * Creates a backend node, and returns the id of the node.
     */
    export function MakeNode(dp:egret.DisplayObject, nodeType:number):any {
        let node:Node;
        switch (nodeType) {
            case egret.sys.NodeType.BITMAP:
                node = new Bitmap();
                break;
            case egret.sys.NodeType.GRAPHICS:
                node = new Graphics();
                break;
            case egret.sys.NodeType.TEXT:
                node = new Text();
                break;
            default:
                node = new Node();
                break;
        }
        node.externalHandle = dp;
        return node;
    }

    /**
     * Creates a backend stage width the specified stage instance, and returns the id of the stage node.
     */
    export function MakeStage(stage:egret.Stage):any {
        let node = new Stage();
        node.externalHandle = stage;
        stageList.push(node);
        return node;
    }

    export function DestroyStage(handle:any):void {
        let node = <Stage>handle;
        node.externalHandle = null;
        let index = stageList.indexOf(node);
        if (index != -1) {
            stageList.splice(index, 1);
        }
    }

    /**
     * Synchronizes the display object with the backend node.
     */
    export function SyncNode(dp:egret.DisplayObject):void {
        Synchronizer.readUpdates(dp);
    }

    /**
     * Performs a rendering session. Draws all changed display objects to the screen.
     * @param triggeredByFrame Indicates whether this call is triggered at the end of a frame.
     * @param scriptCost The cost time of executing javascript, in million seconds.
     * @param syncCost The cost time of synchronizing display list, in million seconds.
     */
    export function Render(triggeredByFrame:boolean, scriptCost:number, syncCost:number):void {
        let renderCost = 0;
        for (let stage of stageList) {
            renderCost += stage.render();
        }
        FPS.updateFrame(triggeredByFrame, scriptCost, syncCost, renderCost);
    }
}