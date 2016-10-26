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
     * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to event
     * listeners when an event occurs.The properties of the Event class carry basic information about an event, such as
     * the event's type or whether the event's default behavior can be canceled. For many events, such as the events represented
     * by the Event class constants, this basic information is sufficient. Other events, however, may require more detailed
     * information. The methods of the Event class can be used in event listener functions to affect the behavior of the event
     * object. Some events have an associated default behavior. Your event listener can cancel this behavior by calling the
     * preventDefault() method. You can also make the current event listener the last one to process an event by calling
     * the stopPropagation() or stopImmediatePropagation() method.
     * @see egret.EventDispatcher
     */
    export class Event extends HashObject {
        /**
         * [broadcast event] Dispatched when the application become active.
         */
        public static ACTIVATE:string = "activate";
        /**
         * [broadcast event] Dispatched when the application become inactive.
         */
        public static DEACTIVATE:string = "deactivate";
        /**
         * [broadcast event] Dispatched when the playhead is entering a new frame.
         */
        public static ENTER_FRAME:string = "enterFrame";
        /**
         * [broadcast event] Dispatched when the display list is about to be updated and rendered.
         * Note: Every time you want to receive a render event,you must call the stage.invalidate() method.
         */
        public static RENDER:string = "render";
        /**
         * Dispatched when a display object is added to the on stage display list, either directly or through the addition
         * of a sub tree in which the display object is contained.
         */
        public static ADDED_TO_STAGE:string = "addedToStage";
        /**
         * Dispatched when a display object is about to be removed from the display list, either directly or through the removal
         * of a sub tree in which the display object is contained.
         */
        public static REMOVED_FROM_STAGE:string = "removedFromStage";
        /**
         * Dispatched when a display object is added to the display list.
         */
        public static ADDED:string = "added";
        /**
         * Dispatched when a display object is about to be removed from the display list.
         */
        public static REMOVED:string = "removed";
        /**
         * Dispatched when the size of stage is changed.
         */
        public static RESIZE:string = "resize";

        /**
         * Dispatched when the value or selection of a property is chaned.
         */
        public static CHANGE:string = "change";
        /**
         * Dispatched when the value or selection of a property is going to change.you can cancel this by calling the
         * preventDefault() method.
         */
        public static CHANGING:string = "changing";
        /**
         * Dispatched when the net request is complete.
         */
        public static COMPLETE:string = "complete";


        /**
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param data the optional data associated with this event
         */
        public constructor(type:string, bubbles?:boolean, cancelable?:boolean, data?:any) {
            super();
            this.$type = type;
            this.$bubbles = !!bubbles;
            this.$cancelable = !!cancelable;
            this.data = data;
        }

        /**
         * the optional data associated with this event
         */
        public data:any;

        /**
         * @internal
         */
        $type:string;

        /**
         * The type of event. The type is case-sensitive.
         */
        public get type():string {
            return this.$type;
        }

        /**
         * @internal
         */
        $bubbles:boolean;

        /**
         * Indicates whether an event is a bubbling event.
         */
        public get bubbles():boolean {
            return this.$bubbles;
        }

        /**
         * @internal
         */
        $cancelable:boolean;

        /**
         * Indicates whether the behavior associated with the event can be prevented. If the behavior can be
         * canceled, this value is true; otherwise it is false.
         * @see #preventDefault()
         */
        public get cancelable():boolean {
            return this.$cancelable;
        }

        /**
         * @internal
         */
        $eventPhase:number = 2;

        /**
         * The current phase in the event flow. This property can contain the following numeric values:
         * The capture phase (EventPhase.CAPTURING_PHASE).
         * The target phase (EventPhase.AT_TARGET)
         * The bubbling phase (EventPhase.BUBBLING_PHASE).
         * @see egret.EventPhase
         */
        public get eventPhase():number {
            return this.$eventPhase;
        }

        /**
         * @internal
         */
        $currentTarget:any = null;

        /**
         * The object that is actively processing the Event object with an event listener. For example, if a
         * user clicks an OK button, the current target could be the node containing that button or one of its ancestors
         * that has registered an event listener for that event.
         */
        public get currentTarget():any {
            return this.$currentTarget;
        }

        /**
         * @internal
         */
        $target:any = null;

        /**
         * The event target. This property contains the target node. For example, if a user clicks an OK button,
         * the target node is the display list node containing that button.
         */
        public get target():any {
            return this.$target;
        }

        /**
         * @internal
         */
        $setTarget(target:any):void {
            this.$target = target;
        }

        /**
         * @internal
         */
        $isDefaultPrevented:boolean = false;

        /**
         * Checks whether the preventDefault() method has been called on the event. If the preventDefault() method has been
         * called, returns true; otherwise, returns false.
         * @returns If preventDefault() has been called, returns true; otherwise, returns false.
         * @see #preventDefault()
         */
        public isDefaultPrevented():boolean {
            return this.$isDefaultPrevented;
        }

        /**
         * Cancels an event's default behavior if that behavior can be canceled.Many events have associated behaviors that
         * are carried out by default. For example, if a user types a character into a text input, the default behavior
         * is that the character is displayed in the text input. Because the TextEvent.TEXT_INPUT event's default behavior
         * can be canceled, you can use the preventDefault() method to prevent the character from appearing.
         * You can use the Event.cancelable property to check whether you can prevent the default behavior associated with
         * a particular event. If the value of Event.cancelable is true, then preventDefault() can be used to cancel the event;
         * otherwise, preventDefault() has no effect.
         * @see #cancelable
         * @see #isDefaultPrevented
         */
        public preventDefault():void {
            if (this.$cancelable)
                this.$isDefaultPrevented = true;
        }

        /**
         * @internal
         */
        $isPropagationStopped:boolean = false;

        /**
         * Prevents processing of any event listeners in nodes subsequent to the current node in the event flow. This method
         * does not affect any event listeners in the current node (currentTarget). In contrast, the stopImmediatePropagation()
         * method prevents processing of event listeners in both the current node and subsequent nodes. Additional calls to this
         * method have no effect. This method can be called in any phase of the event flow.<br/>
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         */
        public stopPropagation():void {
            if (this.$bubbles)
                this.$isPropagationStopped = true;
        }

        /**
         * @internal
         */
        $isPropagationImmediateStopped:boolean = false;

        /**
         * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
         * This method takes effect immediately, and it affects event listeners in the current node. In contrast, the
         * stopPropagation() method doesn't take effect until all the event listeners in the current node finish processing.<br/>
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopPropagation()
         * @see #preventDefault()
         */
        public stopImmediatePropagation():void {
            if (this.$bubbles)
                this.$isPropagationImmediateStopped = true;
        }

        /**
         * @internal
         * This method will be called automatically when the event object is being reused. We should override this method
         * to make sure all the references to external objects are cleaned. Otherwise, it may cause memory leaking.
         */
        $clean():void {
            this.data = this.$currentTarget = null;
            this.$setTarget(null);
        }
    }
}