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

    let DEG_TO_RAD = Math.PI / 180;
    let tempBounds = new Rectangle();
    let offsetMatrix = new Matrix();
    let concatenatedMatrix = new Matrix();
    let tempMatrix = new Matrix();

    /**
     * @private
     */
    function clampRotation(value):number {
        value %= 360;
        if (value > 180) {
            value -= 360;
        } else if (value < -180) {
            value += 360;
        }
        return value;
    }

    /**
     * @private
     */
    function getBaseWidth(bounds:Rectangle, skewX:number, skewY:number):number {
        let u = Math.abs(sys.cos(skewY));
        let v = Math.abs(sys.sin(skewX));
        return u * bounds.width + v * bounds.height;
    }

    /**
     * @private
     */
    function getBaseHeight(bounds:Rectangle, skewX:number, skewY:number):number {
        let u = Math.abs(sys.cos(skewX));
        let v = Math.abs(sys.sin(skewY));
        return v * bounds.width + u * bounds.height;
    }

    /**
     * The DisplayObject class is the base class for all objects that can be placed on the display list. The display list
     * manages all objects displayed in the runtime. Use the DisplayObjectContainer class to arrange the display
     * objects in the display list. DisplayObjectContainer objects can have child display objects, while other display objects,
     * such as Shape and TextField objects, are "leaf" nodes that have only parents and siblings, no children.
     * The DisplayObject class supports basic functionality like the x and y position of an object, as well as more advanced
     * properties of the object such as its transformation matrix.<br/>
     * The DisplayObject class contains several broadcast events. Normally, the target of any particular event is a specific
     * DisplayObject instance. For example, the target of an added event is the specific DisplayObject instance that was added
     * to the display list. Having a single target restricts the placement of event listeners to that target and in some cases
     * the target's ancestors on the display list. With broadcast events, however, the target is not a specific DisplayObject
     * instance, but rather all DisplayObject instances, including those that are not on the display list. This means that you
     * can add a listener to any DisplayObject instance to listen for broadcast events.<br/>     *
     * DisplayObject is an abstract base class, therefore, it cannot be instantiated directly.
     *
     * @event egret.Event.ENTER_FRAME [broadcast event] Dispatched when the playhead is entering a new frame.
     * @event egret.Event.RENDER [broadcast event] Dispatched when the display list is about to be updated and rendered.
     * @event egret.Event.ADDED Dispatched when a display object is added to the display list.
     * @event egret.Event.ADDED_TO_STAGE Dispatched when a display object is added to the on stage display list, either directly
     * or through the addition of a sub tree in which the display object is contained.
     * @event egret.Event.REMOVED Dispatched when a display object is about to be removed from the display list.
     * @event egret.Event.REMOVED_FROM_STAGE Dispatched when a display object is about to be removed from the display list,
     * either directly or through the removal of a sub tree in which the display object is contained.
     * @event egret.TouchEvent.TOUCH_MOVE Dispatched when the user touches the device, and is continuously dispatched until
     * the point of contact is removed.
     * @event egret.TouchEvent.TOUCH_BEGIN Dispatched when the user first contacts a touch-enabled device (such as touches
     * a finger to a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_END Dispatched when the user removes contact with a touch-enabled device (such as
     * lifts a finger off a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_TAP Dispatched when the user lifts the point of contact over the same DisplayObject
     * instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from
     * a single point over a display object on a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_RELEASE_OUTSIDE Dispatched when the user lifts the point of contact over the different
     * DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases
     * a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     *
     */
    export abstract class DisplayObject extends EventDispatcher {

        /**
         * @internal
         * Indicates the type of the display object.
         * @see egret.sys.NodeType
         */
        $nodeType:number = 0;

        /**
         * @internal
         * The handle of the backend node.
         */
        $handle:any = 0;

        /**
         * @internal
         */
        $children:DisplayObject[] = null;

        /**
         * @internal
         */
        $dirtyChildren:boolean = false;

        /**
         * Indicates the instance name of the DisplayObject. The object can be identified in the child list of its parent
         * display object container by calling the getChildByName() method of the display object container.
         */
        public name:string = "";

        /**
         * @internal
         */
        $parent:DisplayObjectContainer = null;

        /**
         * Indicates the DisplayObjectContainer object that contains this display object. Use the parent property to specify
         * a relative path to display objects that are above the current display object in the display list hierarchy.
         */
        public get parent():DisplayObjectContainer {
            return this.$parent;
        }

        /**
         * @internal
         */
        $stage:Stage = null;

        /**
         * The Stage of the display object. you can create and load multiple display objects into the display list, and
         * the stage property of each display object refers to the same Stage object.<br/>
         * If a display object is not added to the display list, its stage property is set to null.
         */
        public get stage():Stage {
            return this.$stage;
        }

        /**
         * @internal
         */
        $hasAddToStage:boolean = false;

        /**
         * @internal
         */
        $doAddToStage(stage:Stage, nestLevel:number):void {
            this.$stage = stage;
            this.$nestLevel = nestLevel;
            this.$hasAddToStage = true;
            DisplayObjectContainer.$addedToStageList.push(this);
            this.onAddedToStage();
        }

        /**
         * @internal
         */
        $doRemoveFromStage():void {
            this.$nestLevel = 0;
            DisplayObjectContainer.$removedFromStageList.push(this);
            this.onRemovedFromStage();
        }

        /**
         * This method is called automatically when the display object has been added to the stage.
         */
        protected onAddedToStage():void {

        }

        /**
         * This method is called automatically when the display object is being removed from the stage.
         */
        protected onRemovedFromStage():void {

        }

        /**
         * @internal
         */
        $nestLevel = 0;

        /**
         * The top-level Stage has a nestLevel of 1. Its immediate children have a nestLevel of 2. Their children have a
         * nestLevel of 3, and so on. The display object has a nestLevel of 0 if it is not in the display list.
         */
        public get nestLevel():number {
            return this.$nestLevel;
        }

        /**
         * @private
         */
        private matrixChanged:boolean = false;
        /**
         * @internal
         */
        $matrix:Matrix = new Matrix();

        /**
         * A Matrix object containing values that alter the scaling, rotation, and translation of the display object.<br/>
         * Note: to change the value of a display object's matrix, you must make a copy of the entire matrix object, then copy
         * the new object into the matrix property of the display object.
         * @example the following code increases the tx value of a display object's matrix
         * <pre>
         *     let myMatrix:Matrix = myDisplayObject.matrix;
         *     myMatrix.tx += 10;
         *     myDisplayObject.matrix = myMatrix;
         * </pre>
         */
        public get matrix():Matrix {
            let m = new Matrix();
            m.tx = this._x;
            m.ty = this._y;
            let rotation = this._rotation;
            let scaleX = this._scaleX;
            let scaleY = this._scaleY;
            if (rotation == 0) {
                m.a = scaleX;
                m.b = m.c = 0;
                m.d = scaleY;
                return m;
            }
            let u = sys.cos(rotation);
            let v = sys.sin(rotation);
            m.a = u * scaleX;
            m.b = v * scaleX;
            m.c = -v * scaleY;
            m.d = u * scaleY;
            return m;
        }

        public set matrix(value:Matrix) {
            this.setMatrix(value);
        }

        protected setMatrix(m:Matrix):void {
            // update scale
            this._x = m.tx;
            this._y = m.ty;
            let determinant = m.a * m.d - m.b * m.c;
            if (m.a == 1 && m.b == 0) {
                this._scaleX = 1;
            }
            else {
                let result = Math.sqrt(m.a * m.a + m.b * m.b);
                this._scaleX = determinant < 0 ? -result : result;
            }
            if (m.c == 0 && m.d == 1) {
                this._scaleY = 1;
            }
            else {
                let result = Math.sqrt(m.c * m.c + m.d * m.d);
                this._scaleY = determinant < 0 ? -result : result;
            }
            // update rotation
            let skewY = Math.atan2(m.b, m.a);
            this._rotation = clampRotation(skewY / DEG_TO_RAD);
            this.invalidateMatrix();
        }

        /**
         * Returns a Matrix object that represents the combination of the matrix of the display object and its skewX,
         * skewY, anchorOffsetX, anchorOffsetY properties.
         */
        public getDisplayMatrix():Matrix {
            let m = this.$matrix;
            if (!this.matrixChanged) {
                return m;
            }
            this.matrixChanged = false;
            m.tx = this._x;
            m.ty = this._y;
            if (this._skewX || this._skewY) {
                let skewX = this._skewX;
                let skewY = this._skewY;
                let anchorX = this._anchorOffsetX;
                let anchorY = this._anchorOffsetY;
                let scaleX = this._scaleX;
                let scaleY = this._scaleY;
                let rotation = this._rotation;

                let sr = sys.sin(rotation);
                let cr = sys.cos(rotation);
                let cy = sys.cos(skewY);
                let sy = sys.sin(skewY);
                let nsx = -sys.sin(skewX);
                let cx = sys.cos(skewX);

                let a = cr * scaleX;
                let b = sr * scaleX;
                let c = -sr * scaleY;
                let d = cr * scaleY;

                m.a = cy * a + sy * c;
                m.b = cy * b + sy * d;
                m.c = nsx * a + cx * c;
                m.d = nsx * b + cx * d;
            }
            else {
                if (this._rotation) {
                    let rotation = this._rotation;
                    let scaleX = this._scaleX;
                    let scaleY = this._scaleY;
                    let u = sys.cos(rotation);
                    let v = sys.sin(rotation);
                    m.a = u * scaleX;
                    m.b = v * scaleX;
                    m.c = -v * scaleY;
                    m.d = u * scaleY;
                }
                else {
                    m.a = this._scaleX;
                    m.b = m.c = 0;
                    m.d = this._scaleY;
                }
            }
            if (this._anchorOffsetX || this._anchorOffsetY) {
                m.tx -= this._anchorOffsetX * m.a + this._anchorOffsetY * m.c;
                m.ty -= this._anchorOffsetX * m.b + this._anchorOffsetY * m.d;
            }
            return m;
        }

        private _x:number = 0;
        /**
         * Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent
         * DisplayObjectContainer.<br/>
         * If the object is inside a DisplayObjectContainer that has transformations, it is in
         * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer
         * rotated 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is
         * rotated 90° counterclockwise. The object's coordinates refer to the registration point position.
         * @default 0
         */
        public get x():number {
            return this._x;
        }

        public set x(value:number) {
            this.setX(value);
        }

        protected setX(value:number):void {
            value = +value || 0;
            if (value === this._x) {
                return;
            }
            this._x = value;
            this.invalidateMatrix();
        }

        private _y:number = 0;
        /**
         * Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent
         * DisplayObjectContainer. <br/>
         * If the object is inside a DisplayObjectContainer that has transformations, it is in
         * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer rotated
         * 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is rotated 90°
         * counterclockwise. The object's coordinates refer to the registration point position.
         * @default 0
         */
        public get y():number {
            return this._y;
        }

        public set y(value:number) {
            this.setY(value);
        }

        protected setY(value:number):void {
            value = +value || 0;
            if (value === this._y) {
                return;
            }
            this._y = value;
            this.invalidateMatrix();
        }

        private _scaleX:number = 1;

        /**
         * Indicates the horizontal scale (percentage) of the object as applied from the registration point. <br/>
         * The default 1.0 equals 100% scale.
         * @default 1
         */
        public get scaleX():number {
            return this._scaleX;
        }

        public set scaleX(value:number) {
            this.setScaleX(value);
        }

        protected setScaleX(value:number):void {
            value = +value || 0;
            if (value == this._scaleX) {
                return;
            }
            this._scaleX = value;
            this.invalidateMatrix();
        }

        private _scaleY:number = 1;

        /**
         * Indicates the vertical scale (percentage) of an object as applied from the registration point of the object.
         * 1.0 is 100% scale.
         * @default 1
         */
        public get scaleY():number {
            return this._scaleY;
        }

        public set scaleY(value:number) {
            this.setScaleY(value);

        }

        protected setScaleY(value:number):void {
            value = +value || 0;
            if (value == this._scaleY) {
                return;
            }
            this._scaleY = value;
            this.invalidateMatrix();
        }

        private _rotation:number = 0;

        /**
         * Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation. Values from
         * 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside
         * this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement
         * myDisplayObject.rotation = 450 is the same as myDisplayObject.rotation = 90.
         * @default 0
         */
        public get rotation():number {
            return this._rotation;
        }

        public set rotation(value:number) {
            this.setRotation(value);
        }

        protected setRotation(value:number):void {
            value = +value || 0;
            value = clampRotation(value);
            if (value == this._rotation) {
                return;
            }
            this._rotation = value;
            this.invalidateMatrix();
        }

        private _skewX:number = 0;

        /**
         * Indicates the x skew value of the DisplayObject instance, in degrees, from its original orientation. Values from
         * 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside
         * this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement
         * myDisplayObject.skewX = 450 is the same as myDisplayObject.skewX = 90.
         */
        public get skewX():number {
            return this._skewX;
        }

        public set skewX(value:number) {
            this.setSkewX(value);
        }

        protected setSkewX(value:number):void {
            value = +value || 0;
            value = clampRotation(value);
            if (value == this._skewX) {
                return;
            }
            this._skewX = value;
            this.invalidateMatrix();

        }

        private _skewY:number = 0;
        /**
         * Indicates the y skew value of the DisplayObject instance,in degrees, from its original orientation. Values from
         * 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside
         * this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement
         * myDisplayObject.skewY = 450 is the same as myDisplayObject.skewY = 90.
         */
        public get skewY():number {
            return this._skewY;
        }

        public set skewY(value:number) {
            this.setSkewY(value);
        }

        protected setSkewY(value:number):void {
            value = +value || 0;
            value = clampRotation(value);
            if (value == this._skewY) {
                return;
            }
            this._skewY = value;
            this.invalidateMatrix();
        }

        /**
         * Indicates the width of the display object, in pixels. The width is calculated based on the bounds of the content
         * of the display object.
         */
        public get width():number {
            return this.getWidth();
        }

        protected getWidth():number {
            this.measureBounds(tempBounds);
            this.getDisplayMatrix().transformBounds(tempBounds);
            return tempBounds.width;
        }

        public set width(value:number) {
            this.setWidth(value);
        }

        protected setWidth(value:number):void {
            value = +value || 0;
            if (value < 0) {
                return;
            }
            this.measureBounds(tempBounds);
            let skewX = this._skewX;
            let skewY = this._skewY;
            let baseWidth = getBaseWidth(tempBounds, skewX, skewY);
            if (!baseWidth) {
                return;
            }
            let baseHeight = getBaseHeight(tempBounds, skewX, skewY);
            this.getDisplayMatrix().transformBounds(tempBounds);
            this._scaleY = tempBounds.height / baseHeight;
            this._scaleX = value / baseWidth;
            this.invalidateMatrix();
        }

        /**
         * Indicates the height of the display object, in pixels. The height is calculated based on the bounds of the
         * content of the display object.
         */
        public get height():number {
            return this.getHeight();
        }

        protected getHeight():number {
            this.measureBounds(tempBounds);
            this.getDisplayMatrix().transformBounds(tempBounds);
            return tempBounds.height;
        }

        public set height(value:number) {
            this.setHeight(value);
        }

        protected setHeight(value:number):void {
            value = +value || 0;
            if (value < 0) {
                return;
            }
            this.measureBounds(tempBounds);
            let skewX = this._skewX;
            let skewY = this._skewY;
            let baseHeight = getBaseHeight(tempBounds, skewX, skewY);
            if (!baseHeight) {
                return;
            }
            let baseWidth = getBaseWidth(tempBounds, skewX, skewY);
            this.getDisplayMatrix().transformBounds(tempBounds);
            this._scaleY = value / baseHeight;
            this._scaleX = tempBounds.width / baseWidth;
            this.invalidateMatrix();
        }

        /**
         * Indicates the measured width of the display object, in pixels. The width is not transformed by the matrix.
         */
        public get measuredWidth():number {
            this.measureBounds(tempBounds);
            return tempBounds.width;
        }

        /**
         * Indicates the measured height of the display object, in pixels. The height is not transformed by the matrix.
         */
        public get measuredHeight():number {
            this.measureBounds(tempBounds);
            return tempBounds.height;
        }

        private _anchorOffsetX:number = 0;

        /**
         * Indicates the horizontal coordinate of the registration point, in pixels.
         * @default 0
         */
        public get anchorOffsetX():number {
            return this._anchorOffsetX;
        }

        public set anchorOffsetX(value:number) {
            this.setAnchorOffsetX(value);
        }

        protected setAnchorOffsetX(value:number):void {
            value = +value || 0;
            if (value == this._anchorOffsetX) {
                return;
            }
            this._anchorOffsetX = value;
            this.invalidateMatrix();
        }

        private _anchorOffsetY:number = 0;

        /**
         * Indicates the vertical coordinate of the registration point, in pixels.
         * @default 0
         */
        public get anchorOffsetY():number {
            return this._anchorOffsetY;
        }

        public set anchorOffsetY(value:number) {
            this.setAnchorOffsetY(value);
        }

        protected setAnchorOffsetY(value:number):void {
            value = +value || 0;
            if (value == this._anchorOffsetY) {
                return;
            }
            this._anchorOffsetY = value;
            this.invalidateMatrix();
        }

        /**
         * @internal
         */
        $visible:boolean = true;

        /**
         * Whether or not the display object is visible. Display objects that are not visible are disabled. For example,
         * if visible=false for an DisplayObject instance, it cannot receive touch or other user input.
         * @default true
         */
        public get visible():boolean {
            return this.$visible;
        }

        public set visible(value:boolean) {
            this.setVisible(value);
        }

        protected setVisible(value:boolean):void {
            value = !!value;
            if (value == this.$visible) {
                return;
            }
            this.$visible = value;
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyVisible;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $cacheAsBitmap:boolean = false;

        /**
         * If set to true, runtime caches an internal bitmap representation of the display object. This caching can
         * increase performance for display objects that contain complex vector content. After you set the cacheAsBitmap
         * property to true, the rendering does not change, however the display object performs pixel snapping automatically.
         * The execution speed can be significantly faster depending on the complexity of the content.The cacheAsBitmap
         * property is best used with display objects that have mostly static content and that do not scale and rotate frequently.<br/>
         * Note: The display object will not create the bitmap caching when the memory exceeds the upper limit, even if you set it to true.
         * @default false
         */
        public get cacheAsBitmap():boolean {
            return this.$cacheAsBitmap;
        }

        public set cacheAsBitmap(value:boolean) {
            this.setCacheAsBitmap(value);
        }

        protected setCacheAsBitmap(value:boolean):void {
            value = !!value;
            if (value == this.$cacheAsBitmap) {
                return;
            }
            this.$cacheAsBitmap = value;
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyCacheAsBitmap;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $alpha:number = 1;

        /**
         * Indicates the alpha transparency value of the object specified. Valid values are 0 (fully transparent) to 1 (fully opaque).
         * The default value is 1. Display objects with alpha set to 0 are active, even though they are invisible.
         * @default 1
         */
        public get alpha():number {
            return this.$alpha;
        }

        public set alpha(value:number) {
            this.setAlpha(value);
        }

        protected setAlpha(value:number):void {
            value = +value || 0;
            if (value == this.$alpha) {
                return;
            }
            this.$alpha = value;
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyAlpha;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $scrollRect:Rectangle = null;

        /**
         * The scroll rectangle bounds of the display object. The display object is cropped to the size defined by the rectangle,
         * and it scrolls within the rectangle when you change the x and y properties of the scrollRect object. A scrolled display
         * object always scrolls in whole pixel increments.You can scroll an object left and right by setting the x property of
         * the scrollRect Rectangle object. You can scroll an object up and down by setting the y property of the scrollRect
         * Rectangle object. If the display object is rotated 90° and you scroll it left and right, the display object actually
         * scrolls up and down.<br/>
         *
         * Note: to change the value of a display object's scrollRect, you must make a copy of the entire scrollRect object, then copy
         * the new object into the scrollRect property of the display object.
         * @example the following code increases the x value of a display object's scrollRect
         * <pre>
         *     let myRectangle:Rectangle = myDisplayObject.scrollRect;
         *     myRectangle.x += 10;
         *     myDisplayObject.scrollRect = myRectangle;
         * </pre>
         */
        public get scrollRect():Rectangle {
            return this.$scrollRect;
        }

        public set scrollRect(value:Rectangle) {
            this.setScrollRect(value);
        }

        protected setScrollRect(value:Rectangle):void {
            if (!value && !this.$scrollRect) {
                return;
            }
            if (value) {
                if (!this.$scrollRect) {
                    this.$scrollRect = new Rectangle();
                }
                this.$scrollRect.copyFrom(value);
            }
            else {
                this.$scrollRect = null;
            }
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyScrollRect;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $blendMode:string = BlendMode.NORMAL;

        /**
         * A value from the BlendMode class that specifies which blend mode to use. Determine how a source image (new one)
         * is drawn on the target image (old one).<br/>
         * If you attempt to set this property to an invalid value, runtime sets the value to BlendMode.NORMAL.
         * @default egret.BlendMode.NORMAL
         * @see egret.BlendMode
         */
        public get blendMode():string {
            return this.$blendMode;
        }

        public set blendMode(value:string) {
            this.setBlendMode(value);
        }

        protected setBlendMode(value:string):void {
            if (value == this.$blendMode) {
                return;
            }
            this.$blendMode = value;
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyBlendMode;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $maskedObject:DisplayObject = null;

        /**
         * @internal
         */
        $mask:DisplayObject = null;

        /**
         * The calling display object is masked by the specified mask object. To ensure that masking works when the Stage
         * is scaled, the mask display object must be in an active part of the display list. The mask object itself is not
         * drawn.<br/>
         * Set mask to null to remove the mask. To be able to scale a mask object, it must be on the display list. To be
         * able to drag a mask object , it must be on the display list. <br/>
         * When display objects are cached by setting the cacheAsBitmap property to true, both the mask and the display
         * object being masked must be part of the same cached bitmap. Thus, if an ancestor of the display object on the
         * display list is cached, then the mask must be a child of that ancestor or one of its descendents. If more than
         * one ancestor of the display object is cached, then the mask must be a descendant of the cached container closest
         * to the display object in the display list.<br/>
         * Note: A single mask object cannot be used to mask more than one calling display object. When the mask is assigned
         * to a second display object, it is removed as the mask of the first object, and that object's mask property
         * becomes null.
         */
        public get mask():DisplayObject {
            return this.$mask;
        }

        public set mask(value:DisplayObject) {
            this.setMask(value);
        }

        protected setMask(value:DisplayObject):void {
            if (value === this.$mask || value === this || value === this.$maskedObject) {
                return;
            }
            if (this.$mask) {
                this.$mask.$maskedObject = null;
            }
            this.$mask = value;
            if (value) {
                if (value.$maskedObject) {
                    value.$maskedObject.mask = null;
                }
                value.$maskedObject = this;
            }
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyMask;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $maskRect:Rectangle = null;

        /**
         * The mask rectangle bounds of the display node. The display node is cropped to the size defined by the rectangle.
         * Different from the scrollRect object, the display node does not scroll when you change the x and y properties
         * of the maskRect object.<br/>
         * Note: The maskRect is ignored when scrollRect is not null.
         */
        public get maskRect():Rectangle {
            return this.$maskRect;
        }

        public set maskRect(value:Rectangle) {
            this.setMaskRect(value);
        }

        protected setMaskRect(value:Rectangle):void {
            if (!value && !this.$maskRect) {
                return;
            }
            if (value) {
                if (!this.$maskRect) {
                    this.$maskRect = new Rectangle();
                }
                this.$maskRect.copyFrom(value);
            }
            else {
                this.$maskRect = null;
            }
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyMaskRect;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $filters:BitmapFilter[] = null;

        /**
         * An indexed array that contains each filter object currently associated with the display object. <br/>
         * To apply a filter, you must make a temporary copy of the entire filters array, modify the temporary array,
         * then assign the value of the temporary array back to the filters array. You cannot directly add a new filter
         * object to the filters array.
         */
        public get filters():BitmapFilter[] {
            return this.$filters;
        }

        public set filters(value:BitmapFilter[]) {
            this.setFilters(value);
        }

        protected setFilters(value:BitmapFilter[]):void {
            this.filters = value;
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyFilters;
            this.$invalidate();
        }

        /**
         * @internal
         * The default touchEnabled property of DisplayObject
         * @default false
         */
        static defaultTouchEnabled:boolean = false;

        /**
         * @internal
         */
        $touchEnabled:boolean = DisplayObject.defaultTouchEnabled;

        /**
         * Specifies whether this object receives touch or other user input. The default value is false, which means that
         * by default any DisplayObject instance that is on the display list cannot receive touch events. If touchEnabled is
         * set to false, the instance does not receive any touch events (or other user input events). Any children of
         * this instance on the display list are not affected. To change the touchEnabled behavior for all children of
         * an object on the display list, use DisplayObjectContainer.touchChildren.
         * @see egret.DisplayObjectContainer#touchChildren
         * @default false
         */
        public get touchEnabled():boolean {
            return this.$touchEnabled;
        }

        public set touchEnabled(value:boolean) {
            this.$touchEnabled = !!value;
        }

        /**
         * @internal
         */
        $displayObjectBits = 0;
        /**
         * @internal
         */
        $dirtyDescendents:boolean = false;

        /**
         * @internal
         */
        $dirty:boolean = false;

        /**
         * @internal
         * Propagates dirty descendents flags up the display list. Propagation stops if the flag is already set.
         */
        $invalidate():void {
            if (this.$dirty) {
                return;
            }
            this.$dirty = true;
            let parent = this.$parent;
            while (parent && !parent.$dirtyDescendents) {
                parent.$dirtyDescendents = true;
                parent = parent.$parent;
            }
        }

        /**
         * @internal
         * Mark properties and the content bounds as dirty.
         */
        $invalidateContentBounds() {
            this.dirtyContentBounds = true;
            this.$invalidate();
        }

        /**
         * @internal
         */
        private invalidateMatrix():void {
            if (this.matrixChanged) {
                return;
            }
            this.matrixChanged = true;
            this.$displayObjectBits |= sys.DisplayObjectBits.DirtyMatrix;
            this.$invalidate();
        }

        /**
         * Returns a rectangle that defines the original area of the display object, which is not transformed by the matrix.
         * @param resultRect A reusable instance of Rectangle for storing the results. Passing this parameter can reduce
         * the number of internal reallocate objects.
         * @param includeAnchorPoint Specifies whether to calculate the anchor point.
         */
        public getBounds(resultRect?:Rectangle, includeAnchorPoint?:boolean):egret.Rectangle {
            if (!resultRect) {
                resultRect = new Rectangle();
            }
            this.measureBounds(resultRect);
            if (includeAnchorPoint) {
                resultRect.x -= this._anchorOffsetX;
                resultRect.y -= this._anchorOffsetY;
            }
            return resultRect;
        }

        /**
         * Returns a rectangle that defines the area of the display object relative to the coordinate system of the
         * targetCoordinateSpace object.
         * @param targetCoordinateSpace The display object that defines the coordinate system to use.
         * @param resultRect A reusable instance of Rectangle for storing the results. Passing this parameter can reduce
         * the number of internal reallocate objects.
         * @returns The rectangle that defines the area of the display object relative to the targetCoordinateSpace
         * object's coordinate system.
         */
        public getTransformedBounds(targetCoordinateSpace:DisplayObject, resultRect?:Rectangle):Rectangle {
            targetCoordinateSpace = targetCoordinateSpace || this;
            if (!resultRect) {
                resultRect = new Rectangle();
            }
            this.measureBounds(resultRect);
            if (targetCoordinateSpace === this || resultRect.isEmpty()) {
                return resultRect;
            }
            targetCoordinateSpace.$getConcatenatedMatrix(tempMatrix);
            tempMatrix.invert();
            this.$getConcatenatedMatrix(concatenatedMatrix);
            concatenatedMatrix.concat(tempMatrix);
            concatenatedMatrix.transformBounds(resultRect);
            return resultRect;
        }

        /**
         * @private
         */
        private measureBounds(bounds:Rectangle):void {
            if (this.dirtyContentBounds) {
                this.$measureContentBounds(this.contentBounds);
                this.dirtyContentBounds = false;
            }
            bounds.copyFrom(this.contentBounds);
            let children = this.$children;
            if (children && children.length > 0) {
                let xMin = bounds.x, xMax = xMin + bounds.width, yMin = bounds.y, yMax = yMin + bounds.width;
                let isEmpty = bounds.isEmpty();
                let childBounds = tempBounds;
                let length = children.length;
                for (let i = 0; i < length; i++) {
                    let child = children[i];
                    child.measureBounds(childBounds);
                    if (childBounds.isEmpty()) {
                        continue;
                    }
                    let matrix = child.$getMatrixWithScrollOffset();
                    matrix.transformBounds(childBounds);
                    if (isEmpty) {
                        isEmpty = false;
                        xMin = childBounds.x;
                        xMax = xMin + childBounds.width;
                        yMin = childBounds.y;
                        yMax = yMin + childBounds.height;
                    }
                    else {
                        if (xMin > childBounds.x) {
                            xMin = childBounds.x;
                        }
                        if (yMin > childBounds.y) {
                            yMin = childBounds.y;
                        }
                        let childXMax = childBounds.x + childBounds.width;
                        if (xMax < childXMax) {
                            xMax = childXMax;
                        }
                        let childYMax = childBounds.y + childBounds.height;
                        if (yMax < childYMax) {
                            yMax = childYMax;
                        }
                    }
                }
                bounds.setTo(xMin, yMin, xMax - xMin, yMax - yMin);
            }
        }

        /**
         * @private
         */
        private dirtyContentBounds:boolean = false;

        /**
         * @private
         */
        private contentBounds:Rectangle = new Rectangle();

        /**
         * @internal
         */
        $measureContentBounds(bounds:Rectangle):void {
            bounds.setEmpty();
        }

        $getMatrixWithScrollOffset():Matrix {
            if (this.$scrollRect) {
                let m = this.getDisplayMatrix();
                m = offsetMatrix.copyFrom(m);
                let scrollRect = this.$scrollRect;
                m.tx -= scrollRect.x * m.a + scrollRect.y * m.c;
                m.ty -= scrollRect.x * m.b + scrollRect.y * m.d;
                return m;
            }
            return this.getDisplayMatrix();
        }

        $getConcatenatedMatrix(result:Matrix):void {
            result.copyFrom(this.$getMatrixWithScrollOffset());
            let parent = this.$parent;
            while (parent) {
                result.concat(parent.$getMatrixWithScrollOffset());
                parent = parent.$parent;
            }
        }

        /**
         * Converts the point object from the Stage (global) coordinates to the display object's (local) coordinates. <br/>
         * @param stageX the x value in the global coordinates
         * @param stageY the y value in the global coordinates
         * @param resultPoint A reusable instance of Point for storing the results. Passing this parameter can reduce
         * the number of internal reallocate objects.
         */
        public globalToLocal(stageX:number, stageY:number, resultPoint?:Point):Point {
            this.$getConcatenatedMatrix(tempMatrix);
            tempMatrix.invert();
            return tempMatrix.transformPoint(stageX, stageY);
        }

        /**
         * Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.
         * @param localX the x value in the local coordinates
         * @param localY the x value in the local coordinates
         * @param resultPoint A reusable instance of Point for storing the results. Passing this parameter can reduce
         * the number of internal reallocate objects.
         */
        public localToGlobal(localX:number, localY:number, resultPoint?:Point):Point {
            this.$getConcatenatedMatrix(tempMatrix);
            tempMatrix.invert();
            return tempMatrix.transformPoint(localX, localY, resultPoint);
        }

        /**
         * Calculate the display object to determine whether it overlaps or crosses with the points specified by the x and y parameters.
         * The x and y parameters specify the points in the coordinates of the stage, rather than the points in the display object container
         * that contains display objects (except the situation where the display object container is a stage). <br/>
         * Note: Don't use accurate pixel collision detection on a large number of objects. Otherwise, this will cause serious performance
         * deterioration.
         * @param x The x coordinate to test against this object.
         * @param y The y coordinate to test against this object.
         * @param shapeFlag Whether to check the actual pixel of object (true) or check that of border (false).
         * @returns If display object overlaps or crosses with the specified point, it is true; otherwise, it is false.
         */
        public hitTestPoint(x:number, y:number, shapeFlag?:boolean):boolean {
            return false;
        }


        /**
         * @internal
         */
        static $enterFrameCallBackList:DisplayObject[] = [];
        /**
         * @internal
         */
        static $renderCallBackList:DisplayObject[] = [];


        /**
         * @internal
         */
        $addListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number, dispatchOnce?:boolean):void {
            super.$addListener(type, listener, thisObject, useCapture, priority, dispatchOnce);
            let isEnterFrame = (type == Event.ENTER_FRAME);
            if (isEnterFrame || type == Event.RENDER) {
                let list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                if (list.indexOf(this) == -1) {
                    list.push(this);
                }
            }
        }

        /**
         * @inheritDoc
         */
        public removeEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean):void {
            super.removeEventListener(type, listener, thisObject, useCapture);
            let isEnterFrame:boolean = (type == Event.ENTER_FRAME);
            if ((isEnterFrame || type == Event.RENDER) && !this.hasEventListener(type)) {
                let list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                let index = list.indexOf(this);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
        }

        /**
         * @inheritDoc
         */
        public willTrigger(type:string):boolean {
            let parent:DisplayObject = this;
            while (parent) {
                if (parent.hasEventListener(type))
                    return true;
                parent = parent.$parent;
            }
            return false;
        }

        /**
         * @inheritDoc
         */
        public dispatchEvent(event:Event):boolean {
            if (!event.$bubbles) {
                return super.dispatchEvent(event);
            }

            let list:DisplayObject[] = [];
            let target:DisplayObject = this;
            while (target) {
                list.push(target);
                target = target.$parent;
            }
            let captureList = list.concat();
            captureList.reverse();
            list = captureList.concat(list);
            let targetIndex = list.length * 0.5;
            event.$setTarget(this);
            this.dispatchEventFlow(event, list, targetIndex);
            return !event.$isDefaultPrevented;
        }

        /**
         * @private
         */
        private dispatchEventFlow(event:Event, list:DisplayObject[], targetIndex:number):void {
            let length = list.length;
            let captureIndex = targetIndex - 1;
            for (let i = 0; i < length; i++) {
                let currentTarget = list[i];
                event.$currentTarget = currentTarget;
                if (i < captureIndex)
                    event.$eventPhase = EventPhase.CAPTURING_PHASE;
                else if (i == targetIndex || i == captureIndex)
                    event.$eventPhase = EventPhase.AT_TARGET;
                else
                    event.$eventPhase = EventPhase.BUBBLING_PHASE;
                currentTarget.$notifyListener(event, i < targetIndex);
                if (event.$isPropagationStopped || event.$isPropagationImmediateStopped) {
                    return;
                }
            }
        }

        /**
         * Resumes the event propagation from the specified display object. Usually we call this method to resume an
         * event propagation which is stopped previously at the stopPoint display object.
         * @param event The event object dispatched into the event flow.
         * @param stopPoint The display object in the event flow which the event propagation was stopped at previously.
         * It must contains this display object in the display list, otherwise no events will be dispatched.
         * @param fromCapturePhase Specifies whether the event flow is resumed from the capture phase.
         * @returns A value of true unless preventDefault() is called on the event, in which case it returns false.
         */
        protected resumeEventPropagation(event:Event, stopPoint:DisplayObject, fromCapturePhase?:boolean):boolean {
            let list:DisplayObject[] = [];
            let target:DisplayObject = this;
            let startIndex = -1;
            while (target) {
                if (target === stopPoint) {
                    startIndex = list.length;
                }
                list.push(target);
                target = target.$parent;
            }
            if (startIndex === -1) {
                return true;
            }
            let targetIndex:number;
            if (fromCapturePhase) {
                let length = list.length;
                let captureList = list.concat();
                captureList.reverse();
                list = captureList.concat(list);
                list.splice(0, length - startIndex);
                targetIndex = startIndex;
            }
            else {
                list.splice(0, startIndex + 1);
                targetIndex = -1;
            }

            event.$setTarget(this);
            this.dispatchEventFlow(event, list, targetIndex);
            return !event.$isDefaultPrevented;
        }
    }
}