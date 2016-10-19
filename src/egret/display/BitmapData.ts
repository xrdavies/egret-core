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

declare namespace egret {

    /**
     * The BitmapData class lets you work with the data (pixels) of a Bitmap object . You can use the methods of the BitmapData
     * class to create arbitrarily sized transparent or opaque bitmap images and manipulate them in various ways at runtime.
     * You can also access the BitmapData for a bitmap image that you load with the ImageLoader class.<br/>
     * The methods of the BitmapData class support effects that are not available through the filters available to non-bitmap
     * display objects.<br/>
     * A BitmapData object contains an array of pixel data. This data can represent either a fully opaque bitmap or a transparent
     * bitmap that contains alpha channel data. Either type of BitmapData object is stored as a buffer of 32-bit integers.
     * Each 32-bit integer determines the properties of a single pixel in the bitmap.<br/>
     * Each 32-bit integer is a combination of four 8-bit channel values (from 0 to 255) that describe the alpha transparency
     * and the red, green, and blue (ARGB) values of the pixel. (For ARGB values, the most significant byte represents the
     * alpha channel value, followed by red, green, and blue.)<br/>
     * You can attach BitmapData objects to a Bitmap object by using the bitmapData property of the Bitmap object.<br/>
     * Calls to any method or property of a BitmapData object throw an ArgumentError error if the BitmapData object is
     * invalid (for example, if it has height == 0 and width == 0) or it has been disposed of via dispose().
     */
    class BitmapData {
        /**
         * Creates a BitmapData object with a specified width and height. If you specify a value for the fillColor parameter,
         * every pixel in the bitmap is set to that color.<br/>
         * By default, the bitmap is created as transparent, unless you pass the value false for the transparent parameter.
         * After you create an opaque bitmap, you cannot change it to a transparent bitmap. Every pixel in an opaque bitmap
         * uses only 24 bits of color channel information. If you define the bitmap as transparent, every pixel uses 32 bits
         * of color channel information, including an alpha transparency channel.
         * @param width The width of the bitmap image in pixels.
         * @param height The height of the bitmap image in pixels.
         * @param transparent Specifies whether the bitmap image supports per-pixel transparency. The default value is true (transparent).
         * To create a fully transparent bitmap, set the value of the transparent parameter to true and the value of the fillColor
         * parameter to 0x00000000 (or to 0). Setting the transparent property to false can result in minor improvements in
         * rendering performance. The default value is true.
         * @param fillColor A 32-bit ARGB color value that you use to fill the bitmap image area.
         * The default value is 0xFFFFFFFF (solid white).
         */
        constructor(width:number, height:number, transparent?:boolean, fillColor?:number);

        /**
         * @internal
         * The handle of the backend bitmap data.
         */
        $handle:any;

        /**
         * Indicates the hash code of the instance, which is a unique number for identifying this instance.
         */
        readonly hashCode:number;

        /**
         * The width of the bitmap image in pixels.
         */
        readonly width:number;

        /**
         * The height of the bitmap image in pixels.
         */
        readonly height:number;

        /**
         * Defines whether the bitmap image supports per-pixel transparency. You can set this value only when you construct
         * a BitmapData object by passing in true for the transparent parameter of the constructor. Then, after you create
         * a BitmapData object, you can check whether it supports per-pixel transparency by determining if the value of
         * the transparent property is true.
         */
        readonly transparent:boolean;

        /**
         * Frees memory that is used to store the BitmapData object. <br/>
         * When the dispose() method is called on an image, the width and height of the image are set to 0. All subsequent
         * calls to methods or properties of this BitmapData instance fail, and an exception is thrown. BitmapData.dispose()
         * releases the memory occupied by the actual bitmap data, immediately (a bitmap can consume up to 64 MB of memory).
         * After using BitmapData.dispose(), the BitmapData object is no longer usable and the runtime throws an exception
         * if you call functions on the BitmapData object. However, BitmapData.dispose() does not garbage collect the BitmapData
         * object (approximately 128 bytes); the memory occupied by the actual BitmapData object is released at the time the
         * BitmapData object is collected by the garbage collector.
         */
        dispose():void;

        /**
         * Draws the source display object onto the bitmap image. You can specify matrix, alpha, blendMode, and a destination
         * clipRect parameter to control how the rendering performs. Optionally, you can specify whether the bitmap should
         * be smoothed when scaled (this works only if the source object is a BitmapData object).
         * @param source The display object or BitmapData object to draw to the BitmapData object.
         * @param matrix A Matrix object used to scale, rotate, or translate the coordinates of the node. If you do not
         * want to apply a matrix transformation to the image, set this parameter to an identity matrix, or pass a null
         * value.
         * @param alpha A float value that you use to adjust the alpha values of the node.
         * @param blendMode A string value, from the BlendMode class, specifying the blend mode to be applied to the node.
         * @param clipRect A Rectangle object that defines the area of the source object to draw. If you do not supply
         * this value, no clipping occurs and the entire source object is drawn.
         * @param smoothing  A Boolean value that determines whether a BitmapData object is smoothed when scaled or rotated,
         * due to a scaling or rotation in the matrix parameter. The smoothing parameter only applies if the source parameter
         * is a BitmapData object. With smoothing set to false, the rotated or scaled BitmapData image can appear pixelated
         * or jagged.
         */
        draw(source:DisplayObject|BitmapData, matrix?:Matrix, alpha?:number, blendMode?:string, clipRect?:Rectangle, smoothing?:boolean);
    }
}