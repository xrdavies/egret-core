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


    let DEG_TO_RAD:number = Math.PI / 180;
    let sinTable = {};
    let cosTable = {};

    /**
     * @private
     */
    function createTables():void {
        for (let i = 0; i < 360; i++) {
            sinTable[i] = Math.sin(i * DEG_TO_RAD);
            cosTable[i] = Math.cos(i * DEG_TO_RAD);
        }
        sinTable[90] = 1;
        cosTable[90] = 0;
        sinTable[180] = 0;
        cosTable[180] = -1;
        sinTable[270] = -1;
        cosTable[270] = 0;
    }

    createTables();


    /**
     * @private
     */
    function sinInt(value:number):number {
        value = value % 360;
        if (value < 0) {
            value += 360;
        }
        return sinTable[value];
    }

    /**
     * @private
     */
    function cosInt(value:number):number {
        value = value % 360;
        if (value < 0) {
            value += 360;
        }
        return cosTable[value];
    }

    /**
     * @internal
     * Obtain the approximate sin value of the corresponding angle value.
     * @param value The rotation angle in radians.
     */
    export function sin(value:number):number {
        let valueFloor = Math.floor(value);
        let valueCeil = valueFloor + 1;
        let resultFloor = sinInt(valueFloor);
        if (valueFloor == value) {
            return resultFloor;
        }
        let resultCeil = sinInt(valueCeil);

        return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
    }

    /**
     * @internal
     * Obtain the approximate cos value of the corresponding angle value.
     * @param value The rotation angle in radians.
     */
    export function cos(value:number):number {
        let valueFloor = Math.floor(value);
        let valueCeil = valueFloor + 1;
        let resultFloor = cosInt(valueFloor);
        if (valueFloor == value) {
            return resultFloor;
        }
        let resultCeil = cosInt(valueCeil);

        return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
    }

}