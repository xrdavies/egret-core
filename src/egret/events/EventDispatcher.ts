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
     * @private
     */
    let ONCE_EVENT_LIST:sys.EventBin[] = [];
    /**
     * @private
     */
    let eventPool:Event[] = [];

    /**
     * The EventDispatcher class is the base class for all classes that dispatchEvent events. The EventDispatcher class implements
     * the IEventDispatcher interface and is the base class for the DisplayObject class. The EventDispatcher class allows
     * any object on the display list to be an event target and as such, to use the methods of the IEventDispatcher interface.
     * Event targets are an important part of the Egret event model. The event target serves as the focal point for how events
     * flow through the display list hierarchy. When an event such as a touch tap, Egret dispatches an event object into the
     * event flow from the root of the display list. The event object then makes its way through the display list until it
     * reaches the event target, at which point it begins its return trip through the display list. This round-trip journey
     * to the event target is conceptually divided into three phases: <br/>
     * the capture phase comprises the journey from the root to the last node before the event target's node, the target
     * phase comprises only the event target node, and the bubbling phase comprises any subsequent nodes encountered on
     * the return trip to the root of the display list. In general, the easiest way for a user-defined class to gain event
     * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already extending
     * another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member, and write simple
     * hooks to route calls into the aggregated EventDispatcher.
     * @see egret.IEventDispatcher
     */
    export class EventDispatcher extends HashObject implements IEventDispatcher {

        /**
         * create an instance of the EventDispatcher class.
         * @param target The target object for events dispatched to the EventDispatcher object. This parameter is used when
         * the EventDispatcher instance is aggregated by a class that implements IEventDispatcher; it is necessary so that the
         * containing object can be the target for events. Do not use this parameter in simple cases in which a class extends EventDispatcher.
         */
        public constructor(target:IEventDispatcher = null) {
            super();
            this.$eventTarget = target || this;
            this.$eventsMap = sys.createMap<sys.EventBin[]>();
            this.$captureEventsMap = sys.createMap<sys.EventBin[]>();
        }

        /**
         * @internal
         */
        $eventTarget:IEventDispatcher;

        /**
         * @internal
         */
        $eventsMap:sys.Map<sys.EventBin[]>;

        /**
         * @internal
         */
        $captureEventsMap:sys.Map<sys.EventBin[]>;

        /**
         * @internal
         */
        $notifyLevel:number = 0;

        /**
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an
         * event. You can register event listeners on all nodes in the display list for a specific type of event, phase,
         * and priority. After you successfully register an event listener, you cannot change its priority through additional
         * calls to addEventListener(). To change a listener's priority, you must first call removeEventListener(). Then you can register the
         * listener again with the new priority level.After the listener is registered, subsequent calls to addEventListener() with a
         * different value for either type or useCapture result in the creation of a separate listener registration. <br/>
         * When you no longer need an event listener, remove it by calling EventDispatcher.removeEventListener(); otherwise, memory
         * problems might result. Objects with registered event listeners are not automatically removed from memory because
         * the garbage collector does not remove objects that still have references.Copying an EventDispatcher instance does
         * not copy the event listeners attached to it. (If your newly created node needs an event listener, you must attach
         * the listener after creating the node.) However, if you move an EventDispatcher instance, the event listeners attached
         * to it move along with it.If the event listener is being registered on a node while an event is also being processed
         * on this node, the event listener is not triggered during the current phase but may be triggered during a later phase
         * in the event flow, such as the bubbling phase.If an event listener is removed from a node while an event is being
         * processed on the node, it is still triggered by the current actions. After it is removed, the event listener is
         * never invoked again (unless it is registered again for future processing).
         * @param type The type of event.
         * @param listener The listener function that processes the event. This function must accept an event object as
         * its only parameter and must return nothing, as this example shows: function(evt:Event):void  The function can
         * have any name.
         * @param thisObject the listener function's "this"
         * @param useCapture Determines whether the listener works in the capture phase or the bubbling phases. If useCapture
         * is set to true, the listener processes the event only during the capture phase and not in the bubbling phase.
         * If useCapture is false, the listener processes the event only during the bubbling phase. To listen for the event
         * in all three phases, call addEventListener() twice, once with useCapture set to true, then again with useCapture set to false.
         * @param  priority The priority level of the event listener. Priorities are designated by a integer. The higher
         * the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1.
         * If two or more listeners share the same priority, they are processed in the order in which they were added.
         * The default priority is 0.
         * @see #once()
         * @see #removeEventListener()
         */
        public addEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void {
            this.$addListener(type, listener, thisObject, useCapture, priority);
        }

        /**
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an
         * event. Different from the addEventListener() method, the listener receives notification only once, and then it will be
         * removed automatically.
         * @param type The type of event.
         * @param listener The listener function that processes the event. This function must accept an event object as
         * its only parameter and must return nothing, as this example shows: function(evt:Event):void  The function can
         * have any name.
         * @param thisObject the listener function's "this"
         * @param useCapture Determines whether the listener works in the capture phase or the bubbling phases. If useCapture
         * is set to true, the listener processes the event only during the capture phase and not in the bubbling phase.
         * If useCapture is false, the listener processes the event only during the bubbling phase. To listen for the event
         * in all three phases, call addEventListener() twice, once with useCapture set to true, then again with useCapture set to false.
         * @param  priority The priority level of the event listener. Priorities are designated by a integer. The higher
         * the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1.
         * If two or more listeners share the same priority, they are processed in the order in which they were added.
         * The default priority is 0.
         * @see #addEventListener()
         * @see #removeEventListener()
         */
        public once(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void {
            this.$addListener(type, listener, thisObject, useCapture, priority, true);
        }

        /**
         * @internal
         */
        $addListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number, dispatchOnce?:boolean):void {
            let eventMap = useCapture ? this.$captureEventsMap : this.$eventsMap;
            let list:sys.EventBin[] = eventMap[type];
            if (!list) {
                list = eventMap[type] = [];
            }
            else if (this.$notifyLevel !== 0) {
                // If the notifyLevel is not 0, that indicates we are traversing the event list, so we need to concat it first.
                eventMap[type] = list = list.concat();
            }

            this.$insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
        }

        /**
         * @internal
         */
        $insertEventBin(list:Array<any>, type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number, dispatchOnce?:boolean):boolean {
            priority = +priority | 0;
            let insertIndex = -1;
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    return false;
                }
                if (insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            let eventBin:sys.EventBin = {
                type: type, listener: listener, thisObject: thisObject, priority: priority,
                target: this, useCapture: useCapture, dispatchOnce: !!dispatchOnce
            };
            if (insertIndex !== -1) {
                list.splice(insertIndex, 0, eventBin);
            }
            else {
                list.push(eventBin);
            }
            return true;
        }

        /**
         * Removes a listener from the EventDispatcher object. If there is no matching listener registered with the
         * EventDispatcher object, a call to this method has no effect.
         * @param type The type of event.
         * @param listener The listener object to remove.
         * @param thisObject the listener function's "this"
         * @param useCapture Specifies whether the listener was registered for the capture phase or the bubbling phases.
         * If the listener was registered for both the capture phase and the bubbling phases, two calls to removeEventListener()
         * are required to remove both: one call with useCapture set to true, and another call with useCapture set to false.
         */
        public removeEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean):void {

            let eventMap:Object = useCapture ? this.$captureEventsMap : this.$eventsMap;
            let list:sys.EventBin[] = eventMap[type];
            if (!list) {
                return;
            }
            if (this.$notifyLevel !== 0) {
                // If the notifyLevel is not 0, that indicates we are traversing the event list, so we need to concat it first.
                eventMap[type] = list = list.concat();
            }

            this.$removeEventBin(list, listener, thisObject);

            if (list.length == 0) {
                eventMap[type] = null;
            }
        }

        /**
         * @internal
         */
        $removeEventBin(list:Array<any>, listener:Function, thisObject:any):boolean {
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    list.splice(i, 1);
                    return true;
                }
            }

            return false;
        }

        /**
         * Checks whether the EventDispatcher object has any listeners registered for a specific type of event. This allows
         * you to determine where an EventDispatcher object has altered handling of an event type in the event flow hierarchy.
         * To determine whether a specific event type will actually trigger an event listener, use IEventDispatcher.willTrigger().
         * The difference between hasEventListener() and willTrigger() is that hasEventListener() examines only the object to
         * which it belongs, whereas willTrigger() examines the entire event flow for the event specified by the type parameter.
         * @param type The type of event.
         * @returns A value of true if a listener of the specified type is registered; false otherwise.
         * @see #willTrigger()
         */
        public hasEventListener(type:string):boolean {
            return !!(this.$eventsMap[type] || this.$captureEventsMap[type]);
        }

        /**
         * Checks whether an event listener is registered with this EventDispatcher object or any of its ancestors for the
         * specified event type. This method returns true if an event listener is triggered during any phase of the event
         * flow when an event of the specified type is dispatched to this EventDispatcher object or any of its descendants.
         * @param type The type of event.
         * @returns A value of true if a listener of the specified type will be triggered; false otherwise.
         * @see #hasEventListener()
         */
        public willTrigger(type:string):boolean {
            return this.hasEventListener(type);
        }


        /**
         * Dispatches an event into the event flow. The event target is the EventDispatcher object upon which dispatchEvent() is called.
         * @param event The event object dispatched into the event flow.
         * @returns A value of true unless preventDefault() is called on the event, in which case it returns false.
         */
        public dispatchEvent(event:Event):boolean {
            event.$currentTarget = this.$eventTarget;
            event.$setTarget(event.$currentTarget);
            return this.$notifyListener(event, false);
        }

        /**
         * @internal
         */
        $notifyListener(event:Event, capturePhase:boolean):boolean {
            let eventMap:Object = capturePhase ? this.$captureEventsMap : this.$eventsMap;
            let list:sys.EventBin[] = eventMap[event.$type];
            if (!list) {
                return true;
            }
            let length = list.length;
            if (length == 0) {
                return true;
            }
            let onceList = ONCE_EVENT_LIST;
            this.$notifyLevel++;
            for (let i = 0; i < length; i++) {
                let eventBin = list[i];
                eventBin.listener.call(eventBin.thisObject, event);
                if (eventBin.dispatchOnce) {
                    onceList.push(eventBin);
                }
                if (event.$isPropagationImmediateStopped) {
                    break;
                }
            }
            this.$notifyLevel--;
            while (onceList.length) {
                let eventBin = onceList.pop();
                eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
            }
            return !event.$isDefaultPrevented;
        }

        /**
         * Distribute a specified event parameters.
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param data the optional data associated with this event
         */
        public dispatchEventWith(type:string, bubbles?:boolean, data?:any):boolean {
            if (bubbles || this.hasEventListener(type)) {
                let event:Event;
                if (eventPool.length) {
                    event = eventPool.pop();
                    event.$type = type;
                    event.$bubbles = !!bubbles;
                    event.$isDefaultPrevented = false;
                    event.$isPropagationStopped = false;
                    event.$isPropagationImmediateStopped = false;
                    event.$eventPhase = EventPhase.AT_TARGET;
                }
                event = new Event(type, bubbles);
                event.data = data;
                let result = this.dispatchEvent(event);
                event.$clean();
                eventPool.push(event);
                return result;
            }
            return true;
        }
    }

}

/**
 * @internal
 */
namespace egret.sys {
    /**
     * @internal
     * Data with event information.
     */
    export interface EventBin {

        type:string;

        listener:Function;

        thisObject:any;

        priority:number;

        target:egret.IEventDispatcher;

        useCapture:boolean;

        dispatchOnce:boolean;
    }
}