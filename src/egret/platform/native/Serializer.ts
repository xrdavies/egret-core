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

    import blendModeMap = egret.sys.blendModeMap;
    import bitmapFillModeMap = egret.sys.bitmapFillModeMap;
    import gradientTypeMap = egret.sys.gradientTypeMap;
    import lineScaleModeMap = egret.sys.lineScaleModeMap;
    import capsStyleMap = egret.sys.capsStyleMap;
    import jointStyleMap = egret.sys.jointStyleMap;
    import textFieldTypeMap = egret.sys.textFieldTypeMap;
    import horizontalAlignMap = egret.sys.horizontalAlignMap;
    import verticalAlignMap = egret.sys.verticalAlignMap;
    import softKeyboardTypeMap = egret.sys.softKeyboardTypeMap;


    /**
     * @internal
     */
    export class Serializer {

        public static writeDrawToBitmap(target:egret.BitmapData, buffer:DataBuffer, source:egret.DisplayObject|egret.BitmapData,
                                        matrix?:egret.Matrix, alpha?:number, blendMode?:string,
                                        clipRect?:egret.Rectangle, smoothing?:boolean) {
            let isDisplayObject = source instanceof egret.DisplayObject;
            if (isDisplayObject) {
                Serializer.writeUpdates(<egret.DisplayObject>source, buffer);
            }
            buffer.writeInt(sys.MessageTag.DrawToBitmap);
            buffer.writeHandle(target.$handle);
            buffer.writeBoolean(isDisplayObject);
            buffer.writeHandle(source.$handle);
            if (matrix) {
                buffer.writeBoolean(true);
                Serializer.writeMatrix(matrix, buffer);
            }
            else {
                buffer.writeBoolean(false);
            }
            buffer.writeFloat(+alpha || 1);
            buffer.writeInt(blendModeMap[blendMode]);
            if (clipRect) {
                buffer.writeBoolean(true);
                Serializer.writeRectangle(clipRect, buffer);
            }
            else {
                buffer.writeBoolean(false);
            }
            if (!isDisplayObject) {
                buffer.writeBoolean(smoothing);
            }
        }

        public static writeUpdates(object:egret.DisplayObject, buffer:DataBuffer):void {
            if (!object.$handle) {
                object.$handle = sys.MakeNode(object, object.$nodeType);
            }
            if (object.$dirtyDescendents) {
                object.$dirtyDescendents = false;
                let children = object.$children;
                let length = children.length;
                for (let i = 0; i < length; i++) {
                    let child = children[i];
                    Serializer.writeUpdates(child, buffer);
                }
            }
            if (object.$dirty) {
                object.$dirty = false;
                Serializer.writeDisplayObject(object, buffer);
                switch (object.$nodeType) {
                    case sys.NodeType.Stage:
                        Serializer.writeStage(<egret.Stage><any>object, buffer);
                        break;
                    case sys.NodeType.BITMAP:
                        Serializer.writeBitmap(<egret.Bitmap><any>object, buffer);
                        break;
                    case sys.NodeType.GRAPHICS:
                        Serializer.writeGraphics(<egret.Shape><any>object, buffer);
                        break;
                    case sys.NodeType.TEXT:
                        Serializer.writeTextField(<egret.TextField><any>object, buffer);
                        break;
                }
                if (object.$dirtyChildren) {
                    object.$dirtyChildren = false;
                    Serializer.writeChildren(<egret.DisplayObjectContainer><any>object, buffer);
                }
            }
        }

        private static writeChildren(container:egret.DisplayObjectContainer, buffer:DataBuffer):void {
            buffer.writeInt(sys.MessageTag.UpdateChildren);
            buffer.writeHandle(container.$handle);
            let children = container.$children;
            buffer.writeBoolean(container.$notEmpty);
            if (container.$notEmpty) {
                let removedIDs = container.$removedHandles;
                let length = removedIDs.length;
                buffer.writeInt(length);
                for (let i = 0; i < length; i++) {
                    buffer.writeUnsignedInt(removedIDs[i]);
                }
                let addedIndices = container.$addedIndices;
                length = addedIndices.length;
                buffer.writeInt(length);
                for (let i = 0; i < length; i++) {
                    let index = addedIndices[i];
                    buffer.writeInt(index);
                    let child = children[index];
                    buffer.writeHandle(child.$handle);
                }
                container.$addedIndices = [];
                container.$removedHandles = [];
                container.$notEmpty = (children.length > 0)
            }
            else {
                let length = children.length;
                buffer.writeInt(length);
                for (let i = 0; i < length; i++) {
                    let child = children[i];
                    buffer.writeHandle(child.$handle);
                }
            }
        }

        private static writeStage(stage:egret.Stage, buffer:DataBuffer):void {
            let bits = stage.$stageBits;
            if (bits == 0) {
                return;
            }
            buffer.writeInt(sys.MessageTag.UpdateStage);
            buffer.writeHandle(stage.$handle);
            buffer.writeInt(bits);
            if (bits & sys.StageBits.DirtyColor) {
                buffer.writeUnsignedInt(stage.$color);
            }
            if (bits & sys.StageBits.DirtyDisplayRule) {
                let rule = stage.$displayRule;
                buffer.write6Floats(rule.stageWidth, rule.stageHeight, rule.displayX,
                    rule.displayY, rule.displayWidth, rule.displayHeight);
                buffer.writeFloat(rule.contentScaleFactor);
            }
            if (bits & sys.StageBits.DirtyFrameRate) {
                buffer.writeFloat(stage.frameRate);
            }
            stage.$stageBits = 0;
        }

        private static writeDisplayObject(dp:egret.DisplayObject, buffer:DataBuffer):void {
            let bits = dp.$displayObjectBits;
            if (bits === 0) {
                return;
            }
            buffer.writeInt(sys.MessageTag.UpdateDisplayObject);
            buffer.writeHandle(dp.$handle);
            buffer.writeInt(bits);
            if (bits & sys.DisplayObjectBits.DirtyMatrix) {
                Serializer.writeMatrix(dp.getDisplayMatrix(), buffer);
            }
            if (bits & sys.DisplayObjectBits.DirtyScrollRect) {
                if (dp.$scrollRect) {
                    buffer.writeBoolean(true);
                    Serializer.writeRectangle(dp.$scrollRect, buffer);
                }
                else {
                    buffer.writeBoolean(false);
                }
            }
            if (bits & sys.DisplayObjectBits.DirtyFilters) {

            }
            if (bits & sys.DisplayObjectBits.DirtyVisible) {
                buffer.writeBoolean(dp.$visible);
            }
            if (bits & sys.DisplayObjectBits.DirtyCacheAsBitmap) {
                buffer.writeBoolean(dp.$cacheAsBitmap);
            }
            if (bits & sys.DisplayObjectBits.DirtyAlpha) {
                buffer.writeFloat(dp.$alpha);
            }
            if (bits & sys.DisplayObjectBits.DirtyBlendMode) {
                buffer.writeInt(blendModeMap[dp.$blendMode]);
            }
            if (bits & sys.DisplayObjectBits.DirtyMask) {
                let mask = dp.$mask;
                if (mask) {
                    if (!mask.$handle) {
                        mask.$handle = sys.MakeNode(mask, mask.$nodeType);
                    }
                    buffer.writeHandle(mask.$handle);
                }
                else {
                    buffer.writeInt(0);
                }
            }
            if (bits & sys.DisplayObjectBits.DirtyMaskRect) {
                if (dp.$maskRect) {
                    buffer.writeBoolean(true);
                    Serializer.writeRectangle(dp.$maskRect, buffer);
                }
                else {
                    buffer.writeBoolean(false);
                }
            }
            dp.$displayObjectBits = 0;
        }

        private static writeBitmap(bitmap:egret.Bitmap, buffer:DataBuffer):void {
            let bits = bitmap.$bitmapBits;
            if (bits === 0) {
                return;
            }
            buffer.writeInt(sys.MessageTag.UpdateBitmap);
            buffer.writeHandle(bitmap.$handle);
            buffer.writeInt(bits);

            if (bits & sys.BitmapBits.DirtyBitmapData) {
                let bitmapData = bitmap.$bitmapData;
                buffer.writeHandle(bitmapData ? bitmapData.$handle : 0)
            }
            if (bits & sys.BitmapBits.DirtyScale9Grid) {
                if (bitmap.$scale9Grid) {
                    buffer.writeBoolean(true);
                    Serializer.writeRectangle(bitmap.$scale9Grid, buffer);
                }
                else {
                    buffer.writeBoolean(false);
                }

            }
            if (bits & sys.BitmapBits.DirtySmoothing) {
                buffer.writeBoolean(bitmap.$smoothing);
            }
            if (bits & sys.BitmapBits.DirtyFillMode) {
                buffer.writeInt(bitmapFillModeMap[bitmap.$fillMode]);
            }
            bitmap.$bitmapBits = 0;
        }

        private static writeGraphics(shape:egret.Shape, buffer:DataBuffer):void {
            let graphics = shape.graphics;
            if (graphics.$commands.length == 0) {
                return;
            }
            let commands = graphics.$commands;
            let args = graphics.$arguments;
            buffer.writeInt(sys.MessageTag.UpdateGraphics);
            buffer.writeHandle(shape.$handle);
            let length = commands.length;
            buffer.writeInt(length);
            let index = 0;
            for (let i = 0; i < length; i++) {
                let command = commands[i];
                buffer.writeInt(command);
                switch (command) {
                    case sys.GraphicsCommand.CLEAR:
                    case sys.GraphicsCommand.END_FILL:
                        break;
                    case sys.GraphicsCommand.BEGIN_FILL:
                        buffer.writeUnsignedInt(args[index++]);        // color
                        buffer.writeFloat(args[index++]);              // alpha
                        break;
                    case sys.GraphicsCommand.BEGIN_GRADIENT_FILL:
                        buffer.writeInt(gradientTypeMap[args[index++]]); // type
                        this.writeUintArray(args[index++], buffer);        // colors
                        this.writeFloatArray(args[index++], buffer);       // alphas
                        this.writeIntArray(args[index++], buffer);         // ratios
                        let matrix = args[index++];                        // matrix
                        if (matrix) {
                            buffer.writeBoolean(true);
                            this.writeMatrix(matrix, buffer);
                        }
                        else {
                            buffer.writeBoolean(false);
                        }
                        break;
                    case sys.GraphicsCommand.CUBIC_CURVE_TO:
                        buffer.write6Floats(args[index++], args[index++], args[index++],
                            args[index++], args[index++], args[index++]);
                        break;
                    case sys.GraphicsCommand.CURVE_TO:
                        buffer.write4Floats(args[index++], args[index++], args[index++], args[index++]);
                        break;
                    case sys.GraphicsCommand.DRAW_ARC:
                        buffer.write4Floats(args[index++], args[index++], args[index++], args[index++]);
                        buffer.writeFloat(args[index++]);
                        buffer.writeBoolean(args[index++]);
                        break;
                    case sys.GraphicsCommand.DRAW_CIRCLE:
                        buffer.write2Floats(args[index++], args[index++]);
                        buffer.writeFloat(args[index++]);
                        break;
                    case sys.GraphicsCommand.DRAW_ELLIPSE:
                        buffer.write4Floats(args[index++], args[index++], args[index++], args[index++]);
                        break;
                    case sys.GraphicsCommand.DRAW_RECT:
                        buffer.write4Floats(args[index++], args[index++], args[index++], args[index++]);
                        break;
                    case sys.GraphicsCommand.DRAW_ROUND_RECT:
                        buffer.write6Floats(args[index++], args[index++], args[index++],
                            args[index++], args[index++], args[index++]);
                        break;
                    case sys.GraphicsCommand.LINE_STYLE:
                        buffer.writeFloat(args[index++]);                      // thickness
                        buffer.writeUnsignedInt(args[index++]);                // color
                        buffer.writeFloat(args[index++]);                      // alpha
                        buffer.writeBoolean(args[index++]);                    // pixelHinting
                        buffer.writeInt(lineScaleModeMap[args[index++]]);    // scaleMode
                        buffer.writeInt(capsStyleMap[args[index++]]);        // caps
                        buffer.writeInt(jointStyleMap[args[index++]]);       // joints
                        buffer.writeFloat(args[index++]);                      // miterLimit
                        break;
                    case sys.GraphicsCommand.LINE_TO:
                        buffer.write2Floats(args[index++], args[index++]);
                        break;
                    case sys.GraphicsCommand.MOVE_TO:
                        buffer.write2Floats(args[index++], args[index++]);
                        break;
                }
            }
            commands.length = 0;
            args.length = 0;
        }

        private static writeTextField(textField:egret.TextField, buffer:DataBuffer):void {
            let bits = textField.$textFieldBits;
            if (bits === 0) {
                return;
            }
            buffer.writeInt(sys.MessageTag.UpdateTextField);
            buffer.writeHandle(textField.$handle);
            buffer.writeInt(bits);
            if (bits & sys.TextFieldBits.DirtyType) {
                buffer.writeInt(textFieldTypeMap[textField.$type]);
            }
            if (bits & sys.TextFieldBits.DirtyFontFamily) {
                buffer.writeString(textField.$fontFamily);
            }
            if (bits & sys.TextFieldBits.DirtySize) {
                buffer.writeInt(textField.$size);
            }
            if (bits & sys.TextFieldBits.DirtyBold) {
                buffer.writeBoolean(textField.$bold);
            }
            if (bits & sys.TextFieldBits.DirtyItalic) {
                buffer.writeBoolean(textField.$italic);
            }
            if (bits & sys.TextFieldBits.DirtyTextAlign) {
                buffer.writeInt(horizontalAlignMap[textField.$textAlign]);
            }
            if (bits & sys.TextFieldBits.DirtyVerticalAlign) {
                buffer.writeInt(verticalAlignMap[textField.$verticalAlign]);
            }
            if (bits & sys.TextFieldBits.DirtyLineSpacing) {
                buffer.writeInt(textField.$lineSpacing);
            }
            if (bits & sys.TextFieldBits.DirtyTextColor) {
                buffer.writeUnsignedInt(textField.$textColor);
            }
            if (bits & sys.TextFieldBits.DirtyWordWrap) {
                buffer.writeBoolean(textField.$wordWrap);
            }
            if (bits & sys.TextFieldBits.DirtyStroke) {
                buffer.writeFloat(textField.$stroke);
            }
            if (bits & sys.TextFieldBits.DirtyStrokeColor) {
                buffer.writeUnsignedInt(textField.$strokeColor);
            }
            if (bits & sys.TextFieldBits.DirtyBorder) {
                buffer.writeBoolean(textField.$border);
            }
            if (bits & sys.TextFieldBits.DirtyBorderColor) {
                buffer.writeUnsignedInt(textField.$borderColor);
            }
            if (bits & sys.TextFieldBits.DirtyBackground) {
                buffer.writeBoolean(textField.$background);
            }
            if (bits & sys.TextFieldBits.DirtyBackgroundColor) {
                buffer.writeUnsignedInt(textField.$backgroundColor);
            }
            if (bits & sys.TextFieldBits.DirtyText) {
                buffer.writeString(textField.$text);
            }
            if (bits & sys.TextFieldBits.DirtyDisplayAsPassword) {
                buffer.writeBoolean(textField.$displayAsPassword);
            }
            if (bits & sys.TextFieldBits.DirtyMaxChars) {
                buffer.writeInt(textField.$maxChars);
            }
            if (bits & sys.TextFieldBits.DirtyMultiline) {
                buffer.writeBoolean(textField.$multiline);
            }
            if (bits & sys.TextFieldBits.DirtyPattern) {
                buffer.writeString(textField.$pattern);
            }
            if (bits & sys.TextFieldBits.DirtySoftKeyboardType) {
                buffer.writeInt(softKeyboardTypeMap[textField.$softKeyboardType]);
            }
            textField.$textFieldBits = 0;
        }

        private static writeUintArray(colors:number[], buffer:DataBuffer):void {
            buffer.writeInt(colors.length);
            let length = colors.length;
            for (let i = 0; i < length; i++) {
                buffer.writeUnsignedInt(colors[i]);
            }
        }

        private static writeFloatArray(array:number[], buffer:DataBuffer):void {
            buffer.writeInt(array.length);
            let length = array.length;
            for (let i = 0; i < length; i++) {
                buffer.writeFloat(array[i]);
            }
        }

        private static writeIntArray(array:number[], buffer:DataBuffer):void {
            buffer.writeInt(array.length);
            let length = array.length;
            for (let i = 0; i < length; i++) {
                buffer.writeInt(array[i]);
            }
        }

        private static writeMatrix(matrix:egret.Matrix, buffer:DataBuffer):void {
            if (matrix.b === 0 && matrix.c === 0) {
                if (matrix.a === 1 && matrix.d === 1) {
                    buffer.writeInt(sys.MatrixEncoding.TranslationOnly);
                    buffer.write2Floats(matrix.tx, matrix.ty);
                } else {
                    if (matrix.a === matrix.d) {
                        buffer.writeInt(sys.MatrixEncoding.UniformScaleAndTranslationOnly);
                        buffer.writeFloat(matrix.a);
                    } else {
                        buffer.writeInt(sys.MatrixEncoding.ScaleAndTranslationOnly);
                        buffer.write2Floats(matrix.a, matrix.d);
                    }
                    buffer.write2Floats(matrix.tx, matrix.ty);
                }
            } else {
                buffer.writeInt(sys.MatrixEncoding.All);
                buffer.write6Floats(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
        }

        private static writeRectangle(rect:egret.Rectangle, buffer:DataBuffer):void {
            buffer.write4Floats(rect.x, rect.y, rect.width, rect.height);
        }

    }
}