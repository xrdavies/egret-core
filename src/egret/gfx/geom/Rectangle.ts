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

    const RectEmptyFlag = 0x07FFFFFF;

    /**
     * @internal
     * A Rectangle object is an area defined by its position, as indicated by its top-left corner point (left, top) and by its
     * width and its height.<br/>
     */
    export class Rectangle {
        /**
         * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified
         * width and height parameters.
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         */
        public constructor(x?:number, y?:number, width?:number, height?:number) {
            if (arguments.length > 0) {
                this.setTo(x, y, width, height);
            }

        }

        /**
         * The x coordinate of the top-left corner of the rectangle.
         */
        public left:number = RectEmptyFlag;

        /**
         * The y coordinate of the top-left corner of the rectangle.
         */
        public top:number = RectEmptyFlag;

        /**
         * The x coordinate of the bottom-right corner of the rectangle.
         */
        public right:number = RectEmptyFlag;

        /**
         * The y coordinate of the bottom-right corner of the rectangle.
         */
        public bottom:number = RectEmptyFlag;

        /**
         * The width of the rectangle, in pixels.
         */
        public width():number {
            return this.right - this.left;
        }

        /**
         * The height of the rectangle, in pixels.
         */
        public height():number {
            return this.bottom - this.top;
        }

        /**
         * The area of the Rectangle, in pixels.
         */
        public area():number {
            return (this.right - this.left) * (this.bottom - this.top);
        }

        /**
         * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original
         * Rectangle object.
         * @returns A new Rectangle object with the same values for the x, y, width, and height properties as the original
         * Rectangle object.
         */
        public clone():Rectangle {
            return new Rectangle().set(this.left, this.top, this.right, this.bottom);
        }

        /**
         * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.<br/>
         * @param toCompare The rectangle to compare to this Rectangle object.
         * @returns A value of true if the object has exactly the same values for the left, right, top, and bottom properties
         * as this Rectangle object; otherwise false.
         */
        public equals(toCompare:Rectangle):boolean {
            if (this === toCompare) {
                return true;
            }
            return this.left === toCompare.left && this.top === toCompare.top
                && this.right === toCompare.right && this.bottom === toCompare.bottom;
        }

        /**
         * Sets the members of Rectangle to the specified values
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         */
        public setTo(x:number, y:number, width:number, height:number):Rectangle {
            this.left = x;
            this.top = y;
            this.right = x + width;
            this.bottom = y + height;
            this.validate();
            return this;
        }

        /**
         * Sets the members of Rectangle to the specified values
         * @param left The x coordinate of the top-left corner of the rectangle.
         * @param top The y coordinate of the top-left corner of the rectangle.
         * @param right The x coordinate of the bottom-right corner of the rectangle.
         * @param bottom The y coordinate of the bottom-right corner of the rectangle.
         */
        public set(left:number, top:number, right:number, bottom:number):Rectangle {
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
            this.validate();
            return this;
        }

        /**
         * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
         * @param sourceRect The Rectangle object from which to copy the data.
         */
        public copyFrom(sourceRect:Rectangle):Rectangle {
            this.left = sourceRect.left;
            this.top = sourceRect.top;
            this.right = sourceRect.right;
            this.bottom = sourceRect.bottom;
            return this;
        }

        /**
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * @param x The x coordinate (horizontal position) of the point.
         * @param y The y coordinate (vertical position) of the point.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         */
        public contains(x:number, y:number):boolean {
            return this.left <= x &&
                this.right >= x &&
                this.top <= y &&
                this.bottom >= y;
        }

        /**
         * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, sets this
         * Rectangle to the area of intersection . If the rectangles do not intersect, this method sets this Rectangle to empty
         * Rectangle with its properties set to 0.
         * @param toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
         */
        public intersect(toIntersect:Rectangle):void {
            if (toIntersect.left === RectEmptyFlag) {
                this.setEmpty();
                return;
            }
            if (this.left === RectEmptyFlag) {
                return;
            }
            if (this.left < toIntersect.left) {
                this.left = toIntersect.left;
            }
            if (this.right > toIntersect.right) {
                this.right = toIntersect.right;
            }
            if (this.left >= this.right) {
                this.setEmpty();
                return;
            }
            if (this.top < toIntersect.top) {
                this.top = toIntersect.top;
            }

            if (this.bottom > toIntersect.bottom) {
                this.bottom = toIntersect.bottom;
            }
            if (this.top >= this.bottom) {
                this.setEmpty();
            }
        }

        /**
         * Increases the size of the Rectangle object by the specified amounts, in pixels.
         * The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx
         * value, and to the top and the bottom by the dy value.
         * @param dx The value to be added to the left and the right of the Rectangle object.
         * @param dy The value to be added to the top and the bottom of the Rectangle.
         */
        public inflate(dx:number, dy:number):void {
            this.left -= dx;
            this.right += dx;
            this.top -= dy;
            this.bottom += dy;
            this.validate();
        }

        /**
         * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object.
         * This method checks the x, y, width, and height properties of the specified Rectangle object to see if it
         * intersects with this Rectangle object.
         * @param toIntersect The Rectangle object to compare against this Rectangle object.
         * @returns A value of true if the specified object intersects with this Rectangle object; otherwise false.
         */
        public intersects(toIntersect:Rectangle):boolean {
            if (this.left === RectEmptyFlag) {
                return false;
            }
            let max = this.left > toIntersect.left ? this.left : toIntersect.left;
            let min = this.right < toIntersect.right ? this.right : toIntersect.right;
            if (max > min) {
                return false;
            }

            max = this.top > toIntersect.top ? this.top : toIntersect.top;
            min = this.bottom < toIntersect.bottom ? this.bottom : toIntersect.bottom;
            return max <= min;
        }


        /**
         * Determines whether or not this Rectangle object is empty.
         * @returns A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
         */
        public isEmpty():boolean {
            return this.left === RectEmptyFlag;
        }

        /**
         * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
         */
        public setEmpty():Rectangle {
            this.left = this.top = this.right = this.bottom = RectEmptyFlag;
            return this;
        }


        /**
         * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
         * @param dx Moves the x value of the Rectangle object by this amount.
         * @param dy Moves the y value of the Rectangle object by this amount.
         */
        public offset(dx:number, dy:number):void {
            this.left += dx;
            this.top += dy;
            this.right += dx;
            this.bottom += dy;
            this.validate();
        }

        /**
         * Adds a rectangle into this rectangle, by filling in the horizontal and vertical space between the two rectangles.
         * @param toMerge A Rectangle object to add to this Rectangle object.
         */
        public merge(toMerge:Rectangle):void {
            if (toMerge.left === RectEmptyFlag) {
                return;
            }
            if (this.left === RectEmptyFlag) {
                this.copyFrom(toMerge);
                return;
            }
            if (this.left > toMerge.left) {
                this.left = toMerge.left;
            }
            if (this.top > toMerge.top) {
                this.top = toMerge.top;
            }
            if (this.right < toMerge.right) {
                this.right = toMerge.right;
            }
            if (this.bottom < toMerge.bottom) {
                this.bottom = toMerge.bottom;
            }
        }


        private validate():void {
            if (this.left >= this.right || this.top >= this.bottom) {
                this.setEmpty();
            }
        }
    }
}