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
namespace egret.native {

    /**
     * Creates a backend node, and returns the id of the node.
     */
    export declare function MakeNode(dp:egret.DisplayObject, nodeType:number):number;

    /**
     * Creates a backend stage width the specified stage instance, and returns the id of the stage node.
     */
    export declare function MakeStage(stage:egret.Stage):number;

    /**
     * Performs a rendering session. Draws all changed display objects to the screen.
     * @param triggeredByFrame Indicates whether this call is triggered at the end of a frame.
     * @param jsCost The cost time of executing javascript, in million seconds.
     * @param syncCost The cost time of synchronizing display list, in million seconds.
     */
    export declare function Render(triggeredByFrame:boolean, jsCost:number, syncCost:number):void;

    /**
     * Sends the commands to the backend to be executed.
     */
    export declare function UpdateAndGet(input:ArrayBuffer, inputLength:number, stringTable:string[], output?:ArrayBuffer):void;

    sys.MakeNode = native.MakeNode;
    sys.MakeStage = native.MakeStage;
    sys.Render = native.Render;
    sys.UpdateAndGet = function (buffer:NativeBuffer, output?:ArrayBuffer) {
        native.UpdateAndGet(buffer.arrayBuffer, buffer.length, buffer.stringTable, output);
    };
}