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
namespace egret.native {

    /**
     * @internal
     */
    export interface OutputStream {
        /**
         * Write a string message to OutputStream.
         */
        write(message:string):void;
    }

    /**
     * @internal
     * The standard output stream is the default destination of output for applications. In most systems, it is usually
     * directed by default to the text console (generally, on the screen).
     */
    export let stdout:OutputStream;

    /**
     * @internal
     * The standard error stream is the default destination for error messages and other diagnostic warnings. Like stdout,
     * it is usually also directed by default to the text console (generally, on the screen).
     */
    export let stderr:OutputStream;


    function formatString(format):string {
        let objects = new Array(arguments.length);
        for (let index = 0; index < arguments.length; index++) {
            objects[index] = arguments[index];
        }
        return objects.join(' ');
    }

    /**
     * @internal
     */
    export class Console {

        public constructor(stdout:OutputStream, stderr:OutputStream) {
            this.stdout = stdout;
            this.stderr = stderr;
        }

        /**
         * The standard output stream.
         */
        private stdout:OutputStream;

        /**
         * The standard error stream.
         */
        private stderr:OutputStream;

        /**
         * Writes an message to the console.
         * @param message the message written to the console
         * @param optionalParams the extra messages written to the console
         */
        public log(message?:any, ...optionalParams:any[]):void {
            let text = formatString.apply(this, arguments);
            this.stdout.write(text + "\n");
        }

        /**
         * Writes an error message to the console if the assertion is false. If the assertion is true, nothing will happen.
         * @param assertion Any boolean expression. If the assertion is false, the message will get written to the console.
         * @param message the message written to the console
         * @param optionalParams the extra messages written to the console
         */
        public assert(assertion?:boolean, message?:string, ...optionalParams:any[]):void {
            if (!assertion) {
                this.stderr.write(message + "\n");
            }
        }

        /**
         * Writes a warning message to the console.
         * @param message the message written to the console
         * @param optionalParams the extra messages written to the console
         */
        public warn(message?:any, ...optionalParams:any[]):void {
            let text = formatString.apply(this, arguments);
            this.stderr.write(text + "\n");
        }

        /**
         * Writes an error message to the console.
         * @param message the message written to the console
         * @param optionalParams the extra messages written to the console
         */
        public error(message?:any, ...optionalParams:any[]):void {
            let text = formatString.apply(this, arguments);
            this.stderr.write(text + "\n");
        }

    }

}

this.console = new egret.native.Console(egret.native.stdout, egret.native.stderr);