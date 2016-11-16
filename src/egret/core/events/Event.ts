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
         * @language zh_CN
         * 循环完成
         */
        /**
         * Dispatched when loop completed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LOOP_COMPLETE:string = "loopComplete";
        /**
         * @language zh_CN
         * TextInput实例获得焦点
         */
        /**
         * Dispatched when the TextInput instance gets focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static FOCUS_IN:string = "focusIn";
        /**
         * @language zh_CN
         * TextInput实例失去焦点
         */
        /**
         * Dispatched when the TextInput instance loses focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static FOCUS_OUT:string = "focusOut";
        /**
         * @language zh_CN
         * 动画声音等播放完成
         */
        /**
         * Dispatched when the playback is ended.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ENDED:string = "ended";
        /**
         * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CLOSE:string = "close";
        /**
         * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CONNECT:string = "connect";
        /**
         * Event.LEAVE_STAGE 常量定义 leaveStage 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LEAVE_STAGE:string = "leaveStage";
        /**
         * Event.SOUND_COMPLETE 常量定义 在声音完成播放后调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static SOUND_COMPLETE:string = "soundComplete";
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

        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的事件实例。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：若使用此方法来创建自定义事件的实例，自定义的构造函数参数列表必须跟Event类一致。
         * @param EventClass Event类名。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @example
         * <pre>
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data;  //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         */
        /**
         * Gets one event instance from the object pool or create a new one. We highly recommend using the Event.create()
         * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
         * which allows you to get better code execution performance.<br/>
         * Note: If you want to use this method to initialize your custom event object,you must make sure the constructor
         * of your custom event is the same as the constructor of egret.Event.
         * @param EventClass Event Class。
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @example
         * <pre>
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data;    //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create<T extends Event>(EventClass:{new (type:string, bubbles?:boolean, cancelable?:boolean): T;eventPool?:Event[]},
                                              type:string, bubbles?:boolean, cancelable?:boolean):T {
            let eventPool:Event[] = EventClass.eventPool;
            if (!eventPool) {
                eventPool = EventClass.eventPool = [];
            }
            if (eventPool.length) {
                let event:T = <T> eventPool.pop();
                event.$type = type;
                event.$bubbles = !!bubbles;
                event.$cancelable = !!cancelable;
                event.$isDefaultPrevented = false;
                event.$isPropagationStopped = false;
                event.$isPropagationImmediateStopped = false;
                event.$eventPhase = EventPhase.AT_TARGET;
                return event;
            }
            return new EventClass(type, bubbles, cancelable);
        }

        /**
         * @language zh_CN
         * 释放一个事件对象，并缓存到对象池。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：此方法只能传入由Event.create()创建的事件实例，传入非法对象实例可能会导致报错。
         * @example
         * <pre>
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data;   //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         */
        /**
         * Releases an event object and cache it into the object pool.We highly recommend using the Event.create()
         * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
         * which allows you to get better code execution performance.<br/>
         * Note: The parameters of this method only accepts an instance created by the Event.create() method.
         * if not,it may throw an error.
         * @example
         * <pre>
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data; //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static release(event:Event):void {
            event.$clean();
            let EventClass:any = Object.getPrototypeOf(event).constructor;
            EventClass.eventPool.push(event);
        }
    }
}