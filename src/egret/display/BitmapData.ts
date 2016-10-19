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
     * @language zh_CN
     * BitmapData 对象是一个包含像素数据的数组。此数据可以表示完全不透明的位图，或表示包含 Alpha 通道数据的透明位图。
     * 以上任一类型的 BitmapData 对象都作为 32 位整数的缓冲区进行存储。每个 32 位整数确定位图中单个像素的属性。<br/>
     * 每个 32 位整数都是四个 8 位通道值（从 0 到 255）的组合，这些值描述像素的 Alpha 透明度以及红色、绿色、蓝色 (ARGB) 值。
     * （对于 ARGB 值，最高有效字节代表 Alpha 通道值，其后的有效字节分别代表红色、绿色和蓝色通道值。）
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
     * @see egret.Bitmap
     * @version Egret 2.4
     * @platform Web,Native
     */
    class BitmapData {
        /**
         * @language zh_CN
         * 创建一个具有指定的宽度和高度的 BitmapData 对象。如果为 fillColor 参数指定一个值，则位图中的每个像素都将设置为该颜色。<br/>
         * 默认情况下，将位图创建为透明位图，除非您为 transparent 参数传递值 false。创建了不透明位图后，将无法将其更改为透明位图。
         * 不透明位图中的每个像素仅使用 24 位的颜色通道信息。如果将位图定义为透明，则每个像素将使用 32 位的颜色通道信息，其中包括 Alpha
         * 透明度通道。<br/>
         * @param width 位图图像的宽度，以像素为单位。
         * @param height 位图图像的高度，以像素为单位。
         * @param transparent 指定位图图像是否支持每个像素具有不同的透明度。默认值为 true（透明）。要创建完全透明的位图，请将
         * transparent 参数的值设置为 true，将 fillColor 参数的值设置为 0x00000000（或设置为 0）。将 transparent 属性设置为 false
         * 可以略微提升呈现性能。默认值为 true。
         * @param fillColor 用于填充位图图像区域的 32 位 ARGB 颜色值。默认值为 0xFFFFFFFF（纯白色）。
         */
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
         * @version Egret 3.5
         * @platform Native
         */
        constructor(width:number, height:number, transparent?:boolean, fillColor?:number);

        /**
         * @internal
         * The handle of the backend bitmap data.
         */
        $handle:any;
        /**
         * @language zh_CN
         * 表示此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         */
        /**
         * Indicates the hash code of the instance, which is a unique number for identifying this instance.
         * @version Egret 2.4
         * @platform Web,Native
         */
        readonly hashCode:number;

        /**
         * @language zh_CN
         * 位图图像的宽度，以像素为单位。
         */
        /**
         * The width of the bitmap image in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        readonly width:number;

        /**
         * @language zh_CN
         * 位图图像的高度，以像素为单位。
         */
        /**
         * The height of the bitmap image in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        readonly height:number;

        /**
         * @language zh_CN
         * 定义位图图像是否支持每个像素具有不同的透明度。只有当通过为构造函数的 transparent 参数传入 true 来构造 BitmapData 对象时，
         * 才能设置此值。然后，在创建 BitmapData 对象之后，可以通过确定 transparent 属性的值是否为 true 来检查该对象是否支持每个像素
         * 具有不同的透明度。
         */
        /**
         * Defines whether the bitmap image supports per-pixel transparency. You can set this value only when you construct
         * a BitmapData object by passing in true for the transparent parameter of the constructor. Then, after you create
         * a BitmapData object, you can check whether it supports per-pixel transparency by determining if the value of
         * the transparent property is true.
         * @version Egret 3.5
         * @platform Native
         */
        readonly transparent:boolean;

        /**
         * @language zh_CN
         * 释放用来存储 BitmapData 对象的内存。<br/>
         * 对图像调用 dispose() 方法时，该图像的宽度和高度将设置为 0。对此 BitmapData 实例的方法或属性的所有后续调用都将失败，并引发异常。<br/>
         * BitmapData.dispose() 立即释放由实际的位图数据占用的内存。使用 BitmapData.dispose() 后，BitmapData 对象不再可用，而且，
         * 如果对 BitmapData 对象调用函数，运行时将引发异常。但是，BitmapData.dispose() 不会将 BitmapData 对象（大约 128 个字节）
         * 作为垃圾回收；由实际的 BitmapData 对象占用的内存在垃圾回收器收集 BitmapData 对象时释放。
         */
        /**
         * Frees memory that is used to store the BitmapData object. <br/>
         * When the dispose() method is called on an image, the width and height of the image are set to 0. All subsequent
         * calls to methods or properties of this BitmapData instance fail, and an exception is thrown. BitmapData.dispose()
         * releases the memory occupied by the actual bitmap data, immediately. After using BitmapData.dispose(), the
         * BitmapData object is no longer usable and the runtime throws an exception if you call functions on the BitmapData
         * object. However, BitmapData.dispose() does not garbage collect the BitmapData object (approximately 128 bytes);
         * the memory occupied by the actual BitmapData object is released at the time the BitmapData object is collected
         * by the garbage collector.
         * @version Egret 3.5
         * @platform Native
         */
        dispose():void;

        /**
         * @language zh_CN
         * 在位图图像上绘制 source 显示对象。可以指定 matrix、alpha、blendMode 和目标 clipRect 参数来控制呈现的执行方式。您可以根据
         * 需要指定是否应在缩放时对位图进行平滑处理（这只适用于源对象是 BitmapData 对象的情况）。
         * @param source 要绘制到 BitmapData 对象的显示对象或 BitmapData 对象。
         * @param matrix 一个 Matrix 对象，用于缩放、旋转位图或转换位图的坐标。如果不想将矩阵转换应用于图像，请将此参数设置为恒等矩阵（
         * 使用默认 new Matrix() 构造函数创建），或传递 null 值。
         * @param alpha 一个浮点数，用于调整位图的颜色值。默认值为 1。
         * @param blendMode 来自 egret.BlendMode 类的一个字符串值，指定要应用于所生成位图的混合模式。
         * @param clipRect 一个 Rectangle 对象，定义要绘制的源对象的区域。 如果不提供此值，则不会进行剪裁，并且将绘制整个源对象。
         * @param smoothing 一个布尔值，用于确定因在 matrix 参数中指定缩放或旋转而对 BitmapData 对象进行缩放或旋转以后，是否对该对象
         * 进行平滑处理。smoothing 参数只有在 source 参数是 BitmapData 对象时才适用。在将 smoothing 设置为 false 的情况下，经过旋
         * 转或缩放的 BitmapData 图像可能会显得像素化或带有锯齿。
         */
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
         * @version Egret 3.5
         * @platform Web,Native
         */
        draw(source:DisplayObject|BitmapData, matrix?:Matrix, alpha?:number, blendMode?:string, clipRect?:Rectangle, smoothing?:boolean);
    }
}