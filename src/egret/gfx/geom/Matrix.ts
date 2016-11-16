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
     * The Matrix class represents a transformation matrix that determines how to map points from one coordinate space to
     * another. You can perform autoious graphical transformations on a display object by setting the properties of a Matrix
     * object, applying that Matrix object to the matrix property of a display object, These transformation functions include
     * translation (x and y repositioning), rotation, scaling, and skewing.
     */
    export class Matrix {
        /**
         * Creates a new Matrix object with the specified parameters.
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         */
        public constructor(a:number = 1, b:number = 0, c:number = 0, d:number = 1, tx:number = 0, ty:number = 0) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @default 1
         */
        public a:number;
        /**
         * The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @default 0
         */
        public b:number;
        /**
         * The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @default 0
         */
        public c:number;
        /**
         * The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
         * @default 1
         */
        public d:number;
        /**
         * The distance by which to translate each point along the x axis.
         * @default 0
         */
        public tx:number;

        /**
         * The distance by which to translate each point along the y axis.
         * @default 0
         */
        public ty:number;

        /**
         * Returns a new Matrix object that is a clone of this matrix, with an exact copy of the contained object.
         */
        public clone():Matrix {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        }

        /**
         * Concatenates a matrix with the current matrix, effectively combining the geometric effects of the two. In mathematical
         * terms, concatenating two matrixes is the same as combining them using matrix multiplication.
         * @param other The matrix to be concatenated to the source matrix.
         */
        public concat(other:Matrix):void {
            let a = this.a * other.a;
            let b = 0.0;
            let c = 0.0;
            let d = this.d * other.d;
            let tx = this.tx * other.a + other.tx;
            let ty = this.ty * other.d + other.ty;

            if (this.b !== 0.0 || this.c !== 0.0 || other.b !== 0.0 || other.c !== 0.0) {
                a += this.b * other.c;
                d += this.c * other.b;
                b += this.a * other.b + this.b * other.d;
                c += this.c * other.a + this.d * other.c;
                tx += this.ty * other.c;
                ty += this.tx * other.b;
            }

            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        public concatInto(other:Matrix, target:Matrix):void {
            let a = this.a * other.a;
            let b = 0.0;
            let c = 0.0;
            let d = this.d * other.d;
            let tx = this.tx * other.a + other.tx;
            let ty = this.ty * other.d + other.ty;

            if (this.b != 0.0 || this.c != 0.0 || other.b != 0.0 || other.c != 0.0) {
                a += this.b * other.c;
                d += this.c * other.b;
                b += this.a * other.b + this.b * other.d;
                c += this.c * other.a + this.d * other.c;
                tx += this.ty * other.c;
                ty += this.tx * other.b;
            }

            target.a = a;
            target.b = b;
            target.c = c;
            target.d = d;
            target.tx = tx;
            target.ty = ty;
        }

        /**
         * Copies all of the matrix data from the source Point object into the calling Matrix object.
         * @param other  The Matrix object from which to copy the data.
         */
        public copyFrom(other:Matrix):Matrix {
            this.a = other.a;
            this.b = other.b;
            this.c = other.c;
            this.d = other.d;
            this.tx = other.tx;
            this.ty = other.ty;
            return this;
        }

        /**
         * Sets each matrix property to a value that causes a null transformation. An object transformed by applying an
         * identity matrix will be identical to the original. After calling the identity() method, the resulting matrix
         * has the following properties: a=1, b=0, c=0, d=1, tx=0, ty=0.
         */
        public identity():void {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
        }

        /**
         * Performs the opposite transformation of the original matrix. You can apply an inverted matrix to an object to
         * undo the transformation performed when applying the original matrix.
         */
        public invert():void {
            let a = this.a;
            let b  = this.b;
            let c  = this.c;
            let d = this.d;
            let tx = this.tx;
            let ty = this.ty;
            if (b == 0 && c == 0) {
                this.b = this.c = 0;
                if(a==0||d==0){
                    this.a = this.d = this.tx = this.ty = 0;
                }
                else{
                    a = this.a = 1 / a;
                    d = this.d = 1 / d;
                    this.tx = -a * tx;
                    this.ty = -d * ty;
                }

                return;
            }
            let determinant = a * d - b * c;
            if (determinant == 0) {
                this.identity();
                return;
            }
            determinant = 1 / determinant;
            let k = this.a =  d * determinant;
            b = this.b = -b * determinant;
            c = this.c = -c * determinant;
            d = this.d =  a * determinant;
            this.tx = -(k * tx + c * ty);
            this.ty = -(b * tx + d * ty);
        }


        /**
         * Sets the members of Matrix to the specified values
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         */
        public setTo(a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        }


        /**
         * Returns the result of applying the geometric transformation represented by the Matrix object to the specified point.
         * @param pointX The x coordinate for which you want to get the result of the Matrix transformation.
         * @param pointY The y coordinate for which you want to get the result of the Matrix transformation.
         * @param resultPoint A reusable instance of Point for storing the results. Passing this parameter can reduce
         * the number of internal reallocate objects.
         * @returns The point resulting from applying the Matrix transformation.
         */
        public transformPoint(pointX:number, pointY:number, resultPoint?:Point):Point {
            let x = this.a * pointX + this.c * pointY + this.tx;
            let y = this.b * pointX + this.d * pointY + this.ty;
            if (resultPoint) {
                return resultPoint.setTo(x, y);
            }
            return new Point(x, y);
        }

        /**
         * Translates the matrix along the x and y axes, as specified by the dx and dy parameters.
         * @param dx The amount of movement along the x axis to the right, in pixels.
         * @param dy The amount of movement down along the y axis, in pixels.
         */
        public translate(dx:number, dy:number):void {
            this.tx += dx;
            this.ty += dy;
        }

        /**
         * Determines whether two matrixes are equal.
         * @param other The matrix to be compared.
         * @returns A value of true if the object is equal to this Matrix object; false if it is not equal.
         */
        public equals(other:Matrix):boolean {
            return this.a == other.a && this.b == other.b &&
                this.c == other.c && this.d == other.d &&
                this.tx == other.tx && this.ty == other.ty;
        }


        /**
         * Applies the geometric transformation represented by the Matrix object to the specified rectangle.
         * @param bounds The rectangle for which you want to get the result of the matrix transformation.
         */
        public transformBounds(bounds:Rectangle):void {
            let a = this.a;
            let b = this.b;
            let c = this.c;
            let d = this.d;
            let tx = this.tx;
            let ty = this.ty;

            if (bounds.left == RectEmptyFlag) {
                return;
            } else if (a == 1 && b == 0 && c == 0 && d == 1) {
                bounds.offset(tx, ty);
                return;
            } else {
                let left = bounds.left;
                let top = bounds.top;
                let right = bounds.right;
                let bottom = bounds.bottom;

                let x0 = a * left + c * top + tx;
                let y0 = b * left + d * top + ty;
                let x1 = a * right + c * top + tx;
                let y1 = b * right + d * top + ty;
                let x2 = a * right + c * bottom + tx;
                let y2 = b * right + d * bottom + ty;
                let x3 = a * left + c * bottom + tx;
                let y3 = b * left + d * bottom + ty;

                let tmp = 0;

                if (x0 > x1) {
                    tmp = x0;
                    x0 = x1;
                    x1 = tmp;
                }
                if (x2 > x3) {
                    tmp = x2;
                    x2 = x3;
                    x3 = tmp;
                }

                bounds.left = Math.floor(x0 < x2 ? x0 : x2);
                bounds.right = Math.ceil(x1 > x3 ? x1 : x3);

                if (y0 > y1) {
                    tmp = y0;
                    y0 = y1;
                    y1 = tmp;
                }
                if (y2 > y3) {
                    tmp = y2;
                    y2 = y3;
                    y3 = tmp;
                }

                bounds.top = Math.floor(y0 < y2 ? y0 : y2);
                bounds.bottom = Math.ceil(y1 > y3 ? y1 : y3);
            }
        }

    }
}