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
     */
    export interface RenderContext {
        /**
         * The surface object associated with the render context.
         */
        readonly surface?:Surface;

        /**
         * Specifies the alpha value that is applied to shapes and images before they are drawn onto the surface. The
         * value is in the range from 0.0 (fully transparent) to 1.0 (fully opaque).
         */
        globalAlpha:number;

        /**
         * Whether or not images are smoothed when scaled.
         */
        imageSmoothingEnabled?:boolean;

        /**
         * Sets all pixels in the rectangle defined by starting point (x, y) and size (width, height) to transparent black,
         * erasing any previously drawn content.
         */
        clearRect(x:number, y:number, w:number, h:number):void;

        /**
         * Saves the entire state of the surface by pushing the current state onto a stack.
         */
        save():void;

        /**
         * Restores the most recently saved canvas state by popping the top entry in the drawing state stack. If there
         * is no saved state, this method does nothing.
         */
        restore():void;

        /**
         * Resets (overrides) the current transformation to the identity matrix and then invokes a transformation described
         * by the arguments of this method.
         */
        setTransform(a:number, b:number, c:number, d:number, tx:number, ty:number):void;

        /**
         * Specifies the type of blend mode to apply when drawing new shapes.
         * @see elf.BlendMode
         */
        setBlendMode?(value:BlendMode);

        /**
         * Modify the current clip with the specified rectangle.
         */
        clipRect?(x:number, y:number, width:number, height:number):void;
    }
}