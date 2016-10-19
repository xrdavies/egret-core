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
    export declare class GFX {
        /**
         * Performs a rendering session. Draws all changed display objects to the screen.
         * @param triggeredByFrame Indicates whether this call is triggered at the end of a frame.
         * @param jsCost The cost time of executing javascript, in million seconds.
         * @param syncCost The cost time of synchronizing display list, in million seconds.
         */
        static render(triggeredByFrame:boolean, jsCost:number, syncCost:number):void;

        /**
         * Sends the commands to the backend to be executed.
         */
        static updateAndGet(input:ArrayBuffer, inputLength:number, stringTable:string[], output?:ArrayBuffer):void;

        /**
         * Creates a backend node, and returns the id of the node.
         */
        static makeNode(dp:egret.DisplayObject, nodeType:number):number;

        /**
         * Creates a backend stage width the specified stage instance, and returns the id of the stage node.
         */
        static makeStage(stage:egret.Stage):number;
    }


    /**
     * @internal
     */
    export const enum NodeType {
        Node       = 0,
        Stage      = 1,
        BITMAP     = 2,
        GRAPHICS   = 3,
        TEXT_FIELD = 4
    }

    /**
     * @internal
     */
    export const enum MessageTag {
        EndOfFile           = 0,
        UpdateDisplayObject = 10,
        UpdateChildren      = 11,
        UpdateStage         = 12,
        UpdateBitmap        = 13,
        UpdateGraphics      = 14,
        UpdateTextField     = 15,
        DrawToBitmap        = 20
    }

    /**
     * @internal
     */
    export const enum DisplayObjectBits {
        DirtyMatrix        = 1 << 0,
        DirtyScrollRect    = 1 << 1,
        DirtyFilters       = 1 << 2,
        DirtyVisible       = 1 << 3,
        DirtyCacheAsBitmap = 1 << 4,
        DirtyAlpha         = 1 << 5,
        DirtyBlendMode     = 1 << 6,
        DirtyMask          = 1 << 7,
        DirtyMaskRect      = 1 << 8,
        DirtyAnchorPoint   = 1 << 9,
    }

    /**
     * @internal
     */
    export const enum StageBits {
        DirtyColor       = 0x1,
        DirtyDisplayRule = 0x2,
        DirtyFrameRate   = 0x4
    }

    /**
     * @internal
     */
    export const enum BitmapBits {
        DirtyBitmapData = 0x1,
        DirtyScale9Grid = 0x2,
        DirtySmoothing  = 0x4,
        DirtyFillMode   = 0x8
    }

    export const enum TextFieldBits {
        DirtyType              = 0x1,
        DirtyFontFamily        = 0x2,
        DirtySize              = 0x3,
        DirtyBold              = 0x8,
        DirtyItalic            = 0x10,
        DirtyTextAlign         = 0x20,
        DirtyVerticalAlign     = 0x40,
        DirtyLineSpacing       = 0x80,
        DirtyTextColor         = 0x100,
        DirtyWordWrap          = 0x200,
        DirtyStroke            = 0x400,
        DirtyStrokeColor       = 0x800,
        DirtyBorder            = 0x1000,
        DirtyBorderColor       = 0x2000,
        DirtyBackground        = 0x4000,
        DirtyBackgroundColor   = 0x8000,
        DirtyText              = 0x10000,
        DirtyDisplayAsPassword = 0x20000,
        DirtyMaxChars          = 0x40000,
        DirtyMultiline         = 0x80000,
        DirtyPattern           = 0x100000,
        DirtySoftKeyboardType  = 0x200000
    }

    /**
     * @internal
     * Dictates how matrices are encoded.
     */
    export const enum MatrixEncoding {
        TranslationOnly                = 0,
        UniformScaleAndTranslationOnly = 1,
        ScaleAndTranslationOnly        = 2,
        All                            = 3
    }

    /**
     * @internal
     */
    export class StageDisplayRule {
        /**
         * Indicates the width of the stage content, in pixels. this is the
         */
        public stageWidth:number = 0;

        /**
         * Indicates the height of the stage content, in pixels.
         */
        public stageHeight:number = 0;
        /**
         * The X coordinate in the destination screen at which to place the top-left corner of the stage.
         */
        public displayX:number = 0;

        /**
         * The Y coordinate in the destination screen at which to place the top-left corner of the stage.
         */
        public displayY:number = 0;

        /**
         * Indicates the horizontal scale (percentage) of the stage. It is applied when drawing the stage to the screen.
         * 1.0 equals 100% scale.
         */
        public displayScaleX:number = 1;
        /**
         * Indicates the vertical scale (percentage) of the stage. It is applied when drawing the stage to the screen.
         * 1.0 equals 100% scale.
         */
        public displayScaleY:number = 1;
        /**
         * Specifies the effective pixel scaling factor of the stage. It is applied when drawing nodes to the stage.
         */
        public contentScaleFactor:number = 1;

    }

    /**
     * @internal
     */
    export enum BlendMode {
        "normal", "layer", "add", "erase", "darken", "difference", "hardlight", "lighten", "multiply", "overlay",
                  "screen", "colordodge", "colorburn", "softlight", "exclusion", "hue", "saturation", "color", "luminosity"
    }

    /**
     * @internal
     */
    export enum BitmapFillMode {
        "scale", "repeat", "clip"
    }

    /**
     * @internal
     */
    export const enum GraphicsCommand {
        BEGIN_FILL          = 1,
        BEGIN_GRADIENT_FILL = 2,
        CLEAR               = 3,
        CUBIC_CURVE_TO      = 4,
        CURVE_TO            = 5,
        DRAW_ARC            = 6,
        DRAW_CIRCLE         = 7,
        DRAW_ELLIPSE        = 8,
        DRAW_RECT           = 9,
        DRAW_ROUND_RECT     = 10,
        END_FILL            = 11,
        LINE_STYLE          = 12,
        LINE_TO             = 13,
        MOVE_TO             = 14
    }

    /**
     * @internal
     */
    export enum GradientType {
        "linear", "radial"
    }

    /**
     * @internal
     */
    export enum LineScaleMode{
        "normal", "none", "horizontal", "vertical"
    }

    /**
     * @internal
     */
    export enum CapsStyle {
        "round", "square", "none"
    }

    /**
     * @internal
     */
    export enum JointStyle {
        "round", "bevel", "miter"
    }

    /**
     * @internal
     */
    export enum TextFieldType {
        "dynamic", "input"
    }

    /**
     * @internal
     */
    export enum HorizontalAlign {
        "left", "right", "center"
    }

    /**
     * @internal
     */
    export enum VerticalAlign {
        "top", "bottom", "middle"
    }

    /**
     * @internal
     */
    export enum SoftKeyboardType {
        "default", "contact", "email", "number", "punctuation", "url"
    }
}