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
    /**
     * The IEventDispatcher interface defines methods for adding or removing event listeners, checks whether specific types
     * of event listeners are registered, and dispatches events. Event targets are an important part of the Egret event model.
     * The event target serves as the focal point for how events flow through the display list hierarchy. When an event
     * such as a touch tap occurs, an event object is dispatched into the event flow from the root of the display list.
     * The event object makes a round-trip journey to the event target, which is conceptually divided into three phases: <br/>
     * the capture phase includes the journey from the root to the last node before the event target's node; the target
     * phase includes only the event target node; and the bubbling phase includes any subsequent nodes encountered on the
     * return trip to the root of the display list.In general, the easiest way for a user-defined class to gain event
     * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already
     * extending another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member,
     * and write simple hooks to route calls into the aggregated EventDispatcher.
     * @see egret.EventDispatcher
     */
    export interface IEventDispatcher extends HashObject {

        /**
         * @copy egret.EventDispatcher#addEventListener
         */
        addEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void;

        /**
         * @copy egret.EventDispatcher#once
         */
        once(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void;

        /**
         * @copy egret.EventDispatcher#removeEventListener
         */
        removeEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean):void;

        /**
         * @copy egret.EventDispatcher#hasEventListener
         */
        hasEventListener(type:string):boolean;

        /**
         * @copy egret.EventDispatcher#dispatchEvent
         */
        dispatchEvent(event:Event):boolean;

        /**
         * @copy egret.EventDispatcher#willTrigger
         */
        willTrigger(type:string):boolean;
    }
}