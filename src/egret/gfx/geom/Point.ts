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
     * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal
     * axis and y represents the vertical axis.
     */
    export class Point {

        /**
         * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         */
        public constructor(x:number = 0, y:number = 0) {
            this.x = x;
            this.y = y;
        }


        /**
         * The horizontal coordinate.
         */
        public x:number;

        /**
         * The vertical coordinate.
         */
        public y:number;

        /**
         * Sets the members of Point to the specified values
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         */
        public setTo(x:number, y:number):Point {
            this.x = x;
            this.y = y;
            return this;
        }

        /**
         * Copies all of the point data from the source Point object into the calling Point object.
         * @param sourcePoint The Point object from which to copy the data.
         */
        public copyFrom(sourcePoint:Point):void {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        }
    }
}