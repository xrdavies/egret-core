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
     * The DisplayObjectContainer class is the base class for all objects that can serve as display object containers on
     * the display list. The display list manages all objects displayed in the runtime. Use the DisplayObjectContainer class
     * to arrange the display objects in the display list. Each DisplayObjectContainer object has its own child list for
     * organizing the z-order of the objects. The z-order is the front-to-back order that determines which object is drawn
     * in front, which is behind, and so on. <br/>
     * The DisplayObjectContainer class is an abstract base class for all objects that can contain child objects. It cannot
     * be instantiated directly. Use the Sprite class instead.
     */
    export class DisplayObjectContainer extends DisplayObject {

        public constructor() {
            super();
            this.$children = [];
        }

        /**
         * @internal
         */
        static $addedToStageList:DisplayObject[] = [];
        /**
         * @internal
         */
        static $removedFromStageList:DisplayObject[] = [];

        /**
         * Returns the number of children of this object.
         */
        public get numChildren():number {
            return this.$children.length;
        }

        /**
         * Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added to the front
         * (top) of all other children in this DisplayObjectContainer instance. (To add a child to a specific index position,
         * use the addChildAt() method.)If you add a child object that already has a different display object container
         * as a parent, the object is removed from the child list of the other display object container.
         * @param child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
         * @returns 在 child The DisplayObject instance that you pass in the child parameter.
         * @see #addChildAt()
         */
        public addChild(child:DisplayObject):DisplayObject {
            let index:number = this.$children.length;
            if (child.$parent == this)
                index--;
            return this.doAddChild(child, index);
        }

        /**
         * Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added at the index position
         * specified. An index of 0 represents the back (bottom) of the display list for this DisplayObjectContainer object.
         * If you add a child object that already has a different display object container as a parent, the object is removed
         * from the child list of the other display object container.
         * @param child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
         * @param index The index position to which the child is added. If you specify a currently occupied index position,
         * the child object that exists at that position and all higher positions are moved up one position in the child list.
         * @returns The DisplayObject instance that you pass in the child parameter.
         * @see #addChild()
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length;
                if (child.$parent == this) {
                    index--;
                }
            }
            return this.doAddChild(child, index);
        }

        /**
         * @private
         */
        private doAddChild(child:DisplayObject, index:number):DisplayObject {
            if (child == this) {
                throw new Error("An object cannot be added as a child of itself.");
            }
            else if ((child instanceof DisplayObjectContainer) && (<DisplayObjectContainer>child).contains(this)) {
                throw new Error("An object cannot be added as a child to one of it's children (or children's children, etc.).");
            }

            let host:DisplayObjectContainer = child.$parent;
            if (host == this) {
                this.doSetChildIndex(child, index);
                return child;
            }

            if (host) {
                host.removeChild(child);
            }

            this.$children.splice(index, 0, child);
            child.$parent = this;
            let stage:Stage = this.$stage;
            if (stage) {
                child.$doAddToStage(stage, this.$nestLevel + 1);
            }
            child.dispatchEventWith(Event.ADDED, true);
            if (stage) {
                let list = DisplayObjectContainer.$addedToStageList;
                while (list.length) {
                    let childAddToStage = list.shift();
                    if (childAddToStage.$stage) {
                        childAddToStage.dispatchEventWith(Event.ADDED_TO_STAGE);
                    }
                }
            }
            this.$dirtyChildren = true;
            this.$invalidate();
            if (child.$dirtyDescendents || child.$dirty) {
                this.$dirtyDescendents = true;
            }
            this._childAdded(child, index);
            return child;
        }

        /**
         * Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance
         * itself. The search includes the entire display list including this DisplayObjectContainer instance. Grandchildren,
         * great-grandchildren, and so on each return true.
         * @param child The child object to test.
         * @returns true if the child object is a child of the DisplayObjectContainer or the container itself; otherwise false.
         */
        public contains(child:DisplayObject):boolean {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.$parent;
            }
            return false;
        }

        /**
         * Returns the child display object instance that exists at the specified index.
         * @param index The index position of the child object.
         * @returns The child display object at the specified index position.
         * @see #getChildByName()
         */
        public getChildAt(index:number):DisplayObject {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$children[index];
            }
            else {
                throw new RangeError("An index specified for a parameter was out of range.");
            }
        }

        /**
         * Returns the index position of a child DisplayObject instance.
         * @param child The DisplayObject instance to identify.
         * @returns The index position of the child display object to identify.
         */
        public getChildIndex(child:DisplayObject):number {
            return this.$children.indexOf(child);
        }

        /**
         * Returns the child display object that exists with the specified name. If more that one child display object has
         * the specified name, the method returns the first object in the child list.The getChildAt() method is faster than
         * the getChildByName() method. The getChildAt() method accesses a child from a cached array, whereas the getChildByName()
         * method has to traverse a linked list to access a child.
         * @param name The name of the child to return.
         * @returns The child display object with the specified name.
         * @see #getChildAt()
         * @see DisplayObject#name()
         */
        public getChildByName(name:string):DisplayObject {
            let children = this.$children;
            let length = children.length;
            let displayObject:DisplayObject;
            for (let i = 0; i < length; i++) {
                displayObject = children[i];
                if (displayObject.name == name) {
                    return displayObject;
                }
            }
            return null;
        }

        /**
         * Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
         * The parent property of the removed child is set to null , and the object is garbage collected if no other references
         * to the child exist. The index positions of any display objects above the child in the DisplayObjectContainer are
         * decreased by 1.
         * @param child The DisplayObject instance to remove.
         * @returns The DisplayObject instance that you pass in the child parameter.
         * @see #removeChildAt()
         */
        public removeChild(child:DisplayObject):DisplayObject {
            let index = this.$children.indexOf(child);
            if (index >= 0) {
                if (this.$children.length == 1) {
                    this.$removedIDs = [];
                    this.$addedIndices = [];
                    this.$notEmpty = false;
                }
                return this.doRemoveChild(index);
            }
            else {
                throw new Error("The supplied DisplayObject must be a child of the caller.");
            }
        }

        /**
         * Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer.
         * The parent property of the removed child is set to null, and the object is garbage collected if no other references
         * to the child exist. The index positions of any display objects above the child in the DisplayObjectContainer are decreased by 1.
         * @param index The child index of the DisplayObject to remove.
         * @returns The DisplayObject instance that was removed.
         * @see #removeChild()
         */
        public removeChildAt(index:number):DisplayObject {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                if (this.$children.length == 1) {
                    this.$removedIDs = [];
                    this.$addedIndices = [];
                    this.$notEmpty = false;
                }
                return this.doRemoveChild(index);
            }
            else {
                throw new RangeError("An index specified for a parameter was out of range.");
            }
        }

        /**
         * @private
         */
        private doRemoveChild(index:number):DisplayObject {
            index = +index | 0;
            let children = this.$children;
            let child:DisplayObject = children[index];
            this._childRemoved(child, index);
            child.dispatchEventWith(Event.REMOVED, true);
            if (this.$stage) {//在舞台上
                child.$doRemoveFromStage();
                let list = DisplayObjectContainer.$removedFromStageList;
                while (list.length > 0) {
                    let childAddToStage = list.shift();
                    if (childAddToStage.$hasAddToStage) {
                        childAddToStage.$hasAddToStage = false;
                        childAddToStage.dispatchEventWith(Event.REMOVED_FROM_STAGE);
                    }
                    childAddToStage.$stage = null;
                }
            }
            child.$parent = null;
            let indexNow = children.indexOf(child);
            if (indexNow != -1) {
                children.splice(indexNow, 1);
            }
            this.$dirtyChildren = true;
            this.$invalidate();
            return child;
        }

        /**
         * Changes the position of an existing child in the display object container. This affects the layering of child objects.
         * @param child The child DisplayObject instance for which you want to change the index number.
         * @param index The resulting index number for the child display object.
         * @see #addChildAt()
         * @see #getChildAt()
         */
        public setChildIndex(child:DisplayObject, index:number):void {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length - 1;
            }
            this.doSetChildIndex(child, index);
        }

        /**
         * @private
         */
        private doSetChildIndex(child:DisplayObject, index:number):void {
            let lastIndex = this.$children.indexOf(child);
            if (lastIndex < 0) {
                throw new Error("The supplied DisplayObject must be a child of the caller.");
            }
            if (lastIndex == index) {
                return;
            }
            this._childRemoved(child, lastIndex);
            this.$children.splice(lastIndex, 1);
            this.$children.splice(index, 0, child);
            this._childAdded(child, index);
            this.$dirtyChildren = true;
            this.$invalidate();
        }

        /**
         * Swaps the z-order (front-to-back order) of the child objects at the two specified index positions in the child
         * list. All other child objects in the display object container remain in the same index positions.
         * @param index1 The index position of the first child object.
         * @param index2 The index position of the second child object.
         * @see #swapChildren()
         */
        public swapChildrenAt(index1:number, index2:number):void {
            index1 = +index1 | 0;
            index2 = +index2 | 0;
            if (index1 >= 0 && index1 < this.$children.length && index2 >= 0 && index2 < this.$children.length) {
                this.doSwapChildrenAt(index1, index2);
            }
            else {
                throw new RangeError("An index specified for a parameter was out of range.");
            }
        }

        /**
         * Swaps the z-order (front-to-back order) of the two specified child objects. All other child objects in the
         * display object container remain in the same index positions.
         * @param child1 The first child object.
         * @param child2 The second child object.
         * @see #swapChildrenAt()
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void {
            let index1 = this.$children.indexOf(child1);
            let index2 = this.$children.indexOf(child2);
            if (index1 == -1 || index2 == -1) {
                throw new Error("The supplied DisplayObject must be a child of the caller.");
            }
            else {
                this.doSwapChildrenAt(index1, index2);
            }
        }

        /**
         * @private
         */
        private doSwapChildrenAt(index1:number, index2:number):void {
            if (index1 > index2) {
                let temp = index2;
                index2 = index1;
                index1 = temp;
            }
            else if (index1 == index2) {
                return;
            }
            let list:Array<DisplayObject> = this.$children;
            let child1:DisplayObject = list[index1];
            let child2:DisplayObject = list[index2];
            this._childRemoved(child1, index1);
            this._childRemoved(child2, index2);
            list[index1] = child2;
            list[index2] = child1;
            this._childAdded(child2, index1);
            this._childAdded(child1, index2);
            this.$dirtyChildren = true;
            this.$invalidate();
        }

        /**
         * Removes all child DisplayObject instances from the child list of the DisplayObjectContainer instance. The parent
         * property of the removed children is set to null , and the objects are garbage collected if no other references
         * to the children exist.
         * @see #removeChild()
         * @see #removeChildAt()
         */
        public removeChildren():void {
            this.$removedIDs = [];
            this.$addedIndices = [];
            this.$notEmpty = false;
            let children = this.$children;
            for (let i:number = children.length - 1; i >= 0; i--) {
                this.doRemoveChild(i);
            }
        }

        /**
         * @internal
         */
        $removedIDs:number[] = [];
        /**
         * @internal
         */
        $addedIndices:number[] = [];
        /**
         * @internal
         */
        $notEmpty:boolean = false;

        private _childAdded(child:DisplayObject, index:number):void {
            if (this.$notEmpty) {
                let list = this.$addedIndices;
                let length = list.length;
                if (length == 0) {
                    list.push(index);
                }
                else {
                    let insertIndex = length;
                    for (let i = 0; i < length; i++) {
                        if (index <= list[i]) {
                            insertIndex = i;
                            break;
                        }
                    }
                    for (let i = insertIndex; i < length; i++) {
                        list[i] += 1;
                    }
                    list.splice(insertIndex, 0, index);
                }
            }
            this.childAdded(child, index);
        }

        private _childRemoved(child:DisplayObject, index:number):void {
            if (this.$notEmpty) {
                let id = child.$handle;
                if (id && this.$removedIDs.indexOf(id) == -1) {
                    this.$removedIDs.push(id);
                }
                let list = this.$addedIndices;

                let deleteIndex = list.indexOf(index);
                if (deleteIndex != -1) {
                    list.splice(deleteIndex, 1);
                    let length = list.length;
                    for (let i = deleteIndex; i < length; i++) {
                        list[i] -= 1;
                    }
                }
            }

            this.childRemoved(child, index);
        }

        /**
         * This method is called automatically when a child has been added to this display object container.
         * @param child The childed that was added.
         * @param index The index where the item was added.
         */
        protected childAdded(child:DisplayObject, index:number):void {

        }

        /**
         * This method is called automatically when a child is being removed from this display object container.
         * @param child The child that is being removed.
         * @param index The index where the child is being removed.
         */
        protected childRemoved(child:DisplayObject, index:number):void {

        }

        /**
         * @internal
         */
        $doAddToStage(stage:Stage, nestLevel:number):void {
            super.$doAddToStage(stage, nestLevel);
            let children = this.$children;
            let length = children.length;
            nestLevel++;
            for (let i = 0; i < length; i++) {
                let child:DisplayObject = this.$children[i];
                child.$doAddToStage(stage, nestLevel);
            }
        }

        /**
         * @internal
         */
        $doRemoveFromStage():void {
            super.$doRemoveFromStage();
            let children = this.$children;
            let length = children.length;
            for (let i = 0; i < length; i++) {
                let child:DisplayObject = children[i];
                child.$doRemoveFromStage();
            }
        }

        private _touchChildren:boolean = true;

        /**
         * Determines whether or not the children of the object are touch, or user input device, enabled. If an object is
         * enabled, a user can interact with it by using touch or user input device. The default is true.<br/>
         * This property is useful when you create a button with an instance of the Sprite class. When you use a Sprite
         * instance to create a button, you can choose to decorate the button by using the addChild() method to add additional
         * Sprite instances. This process can cause unexpected behavior with touch events because the Sprite instances you
         * add as children can become the target object of a touch event when you expect the parent instance to be the target
         * object. To ensure that the parent instance serves as the target objects for touch events, you can set the touchChildren
         * property of the parent instance to false.<br/>
         * No event is dispatched by setting this property. You must use the addEventListener() method to create interactive functionality.
         */
        public get touchChildren():boolean {
            return this._touchChildren;
        }

        public set touchChildren(value:boolean) {
            this._touchChildren = value;
        }
    }
}