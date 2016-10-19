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
namespace egret.sys {

    /**
     * @internal
     */
    export class Buffer {

        public constructor(initialSize:number = 128) {
            if (initialSize == 0) {
                initialSize = 1;
            }
            this._arrayBuffer = new ArrayBuffer(initialSize);
            this.resetViews();
        }

        private _length:number = 0;

        public get length():number {
            return this._length;
        }

        public position:number = 0;

        public get bytesAvailable():number {
            return this._length - this.position;
        }

        private _arrayBuffer:ArrayBuffer;
        private int32Array:Int32Array;
        private uint32Array:Uint32Array;
        private float32Array:Float32Array;

        public get arrayBuffer():ArrayBuffer {
            return this._arrayBuffer;
        }

        private _stringTable:string[] = [];

        public get stringTable():string[] {
            return this._stringTable;
        }

        private byteLength:number = 0;

        /**
         * @private
         */
        private ensureCapacity(length:number) {
            length *= 4;
            let newLength = this._arrayBuffer.byteLength;
            while (newLength < length) {
                newLength *= 2;
            }
            let newBuffer = new ArrayBuffer(length);
            let oldView = this.float32Array;
            this._arrayBuffer = newBuffer;
            this.resetViews();
            this.float32Array.set(oldView);
        }

        private resetViews():void {
            this.int32Array = new Int32Array(this._arrayBuffer);
            this.uint32Array = new Uint32Array(this._arrayBuffer);
            this.float32Array = new Float32Array(this._arrayBuffer);
            this.byteLength = this._arrayBuffer.byteLength / 4;
        }

        public maxSizeOnClear:number = 4194304; // 4 MB

        public clear() {
            if (this._length > this.maxSizeOnClear) {
                let newBuffer = new ArrayBuffer(this.maxSizeOnClear);
                let currentView = this.float32Array;
                this._arrayBuffer = newBuffer;
                this.resetViews();
                this.float32Array.set(currentView);
            }
            this._length = 0;
            this.position = 0;
            this._stringTable = [];
        }

        /**
         * Reads a Boolean value from the byte stream. A signed 32-bit integer is read, and true is returned if the integer is
         * nonzero, false otherwise.
         */
        public readBoolean():boolean {
            return this.readInt() !== 0;
        }

        /**
         * Reads a signed 32-bit integer from the byte stream.
         */
        public readInt():number {
            if (this.position >= this._length) {
                throw new Error("End of file was encountered.");
            }
            return this.int32Array[this.position++];
        }

        /**
         * Reads an unsigned 32-bit integer from the byte stream. The returned value is in the range 0 to 4294967295.
         */
        public readUnsignedInt():number {
            if (this.position >= this._length) {
                throw new Error("End of file was encountered.");
            }
            return this.uint32Array[this.position++];
        }

        /**
         * Reads an IEEE 754 single-precision (32-bit) floating-point number from the byte stream.
         */
        public readFloat():number {
            if (this.position >= this._length) {
                throw new Error("End of file was encountered.");
            }
            return this.float32Array[this.position++];
        }

        /**
         * Reads a UTF-8 string from the byte stream.
         */
        public readString():string {
            let index = this.readInt();
            return this._stringTable[index];
        }

        /**
         * Writes a Boolean value. A signed 32-bit integer is written according to the value parameter, either 1 if true
         * or 0 if false.
         */
        public writeBoolean(value:boolean):void {
            this.writeInt(value ? 1 : 0);
        }

        /**
         * Writes a 32-bit signed integer to the byte stream.
         */
        public writeInt(value:number):void {
            let position = this.position;
            if (this.byteLength < position + 1) {
                this.ensureCapacity(position + 1);
            }
            this.int32Array[position++] = value;
            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

        /**
         * Writes two 32-bit signed integers to the byte stream.
         */
        public write2Ints(a:number, b:number):void {
            let position = this.position;
            if (this.byteLength < position + 2) {
                this.ensureCapacity(position + 2);
            }
            this.int32Array[position++] = a;
            this.int32Array[position++] = b;
            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

        /**
         * Writes four 32-bit signed integers to the byte stream.
         */
        public write4Ints(a:number, b:number, c:number, d:number):void {
            let position = this.position;
            if (this.byteLength < position + 4) {
                this.ensureCapacity(position + 4);
            }
            this.int32Array[position++] = a;
            this.int32Array[position++] = b;
            this.int32Array[position++] = c;
            this.int32Array[position++] = d;
            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

        /**
         * Writes a 32-bit unsigned integer to the byte stream.
         */
        public writeUnsignedInt(value:number):void {
            let position = this.position;
            if (this.byteLength < position + 1) {
                this.ensureCapacity(position + 1);
            }
            this.uint32Array[position++] = value;
            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

        /**
         * Writes an IEEE 754 single-precision (32-bit) floating-point number to the byte stream.
         */
        public writeFloat(value:number):void {
            let position = this.position;
            if (this.byteLength < position + 1) {
                this.ensureCapacity(position + 1);
            }
            this.float32Array[position++] = value;
            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

        /**
         * Writes two IEEE 754 single-precision (32-bit) floating-point numbers to the byte stream.
         */
        public write2Floats(a:number, b:number):void {
            let position = this.position;
            if (this.byteLength < position + 2) {
                this.ensureCapacity(position + 2);
            }
            this.float32Array[position++] = a;
            this.float32Array[position++] = b;
            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

        /**
         * Writes four IEEE 754 single-precision (32-bit) floating-point numbers to the byte stream.
         */
        public write4Floats(a:number, b:number, c:number, d:number):void {
            let position = this.position;
            if (this.byteLength < position + 4) {
                this.ensureCapacity(position + 4);
            }
            this.float32Array[position++] = a;
            this.float32Array[position++] = b;
            this.float32Array[position++] = c;
            this.float32Array[position++] = d;
            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

        /**
         * Writes six IEEE 754 single-precision (32-bit) floating-point numbers to the byte stream.
         */
        public write6Floats(a:number, b:number, c:number, d:number, e:number, f:number):void {
            let position = this.position;
            if (this.byteLength < position + 6) {
                this.ensureCapacity(position + 6);
            }
            this.float32Array[position++] = a;
            this.float32Array[position++] = b;
            this.float32Array[position++] = c;
            this.float32Array[position++] = d;
            this.float32Array[position++] = e;
            this.float32Array[position++] = f;
            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

        /**
         * Writes a UTF-8 string to the byte stream.
         */
        public writeString(value:string):void {
            this.writeInt(this._stringTable.length);
            this._stringTable.push(value);
        }

        public writeHandle(handle:any):void {
            let position = this.position;
            let length = (<Uint32Array>handle).length;
            if (this.byteLength < position + length) {
                this.ensureCapacity(position + length);
            }
            this.uint32Array[position++] = (<Uint32Array>handle)[0];
            if (length > 1) {
                this.uint32Array[position++] = (<Uint32Array>handle)[1];
            }

            this.position = position;
            if (position > this._length) {
                this._length = position;
            }
        }

    }

    /**
     * @internal
     */
    export let sharedBuffer:Buffer = new Buffer(4096);  // 4 Kb
}