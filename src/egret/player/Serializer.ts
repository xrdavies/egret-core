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
    export class Serializer {

        public static writeDrawToBitmap(target:egret.BitmapData, buffer:Buffer, source:egret.DisplayObject|egret.BitmapData,
                                        matrix?:egret.Matrix, alpha?:number, blendMode?:string,
                                        clipRect?:egret.Rectangle, smoothing?:boolean) {
            let isDisplayObject = source instanceof egret.DisplayObject;
            if (isDisplayObject) {
                sys.Serializer.writeUpdates(<egret.DisplayObject>source, buffer);
            }
            buffer.writeInt(MessageTag.DrawToBitmap);
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
            buffer.writeInt(sys.BlendMode[blendMode] || 0);
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

        public static writeUpdates(object:egret.DisplayObject, buffer:Buffer):void {
            if (!object.$handle) {
                object.$handle = sys.GFX.makeNode(object, object.$nodeType);
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
                    case NodeType.Stage:
                        Serializer.writeStage(<egret.Stage><any>object, buffer);
                        break;
                    case NodeType.BITMAP:
                        Serializer.writeBitmap(<egret.Bitmap><any>object, buffer);
                        break;
                    case NodeType.GRAPHICS:
                        Serializer.writeGraphics(<egret.Shape><any>object, buffer);
                        break;
                    case NodeType.TEXT_FIELD:
                        Serializer.writeTextField(<egret.TextField><any>object, buffer);
                        break;
                }
                if (object.$dirtyChildren) {
                    object.$dirtyChildren = false;
                    Serializer.writeChildren(<egret.DisplayObjectContainer><any>object, buffer);
                }
            }
        }

        private static writeChildren(container:egret.DisplayObjectContainer, buffer:Buffer):void {
            buffer.writeInt(MessageTag.UpdateChildren);
            buffer.writeHandle(container.$handle);
            let children = container.$children;
            buffer.writeBoolean(container.$notEmpty);
            if (container.$notEmpty) {
                let removedIDs = container.$removedIDs;
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
                container.$removedIDs = [];
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

        private static writeStage(stage:egret.Stage, buffer:Buffer):void {
            let bits = stage.$stageBits;
            if (bits == 0) {
                return;
            }
            buffer.writeInt(MessageTag.UpdateStage);
            buffer.writeHandle(stage.$handle);
            buffer.writeInt(bits);
            if (bits & StageBits.DirtyColor) {
                buffer.writeUnsignedInt(stage.$color);
            }
            if (bits & StageBits.DirtyDisplayRule) {
                let info = stage.$displayRule;
                buffer.write6Floats(info.stageWidth, info.stageHeight, info.displayX,
                    info.displayY, info.displayScaleX, info.displayScaleY);
                buffer.writeFloat(info.contentScaleFactor);
            }
            if (bits & StageBits.DirtyFrameRate) {
                buffer.writeFloat(stage.frameRate);
            }
            stage.$stageBits = 0;
        }

        private static writeDisplayObject(dp:egret.DisplayObject, buffer:Buffer):void {
            let bits = dp.$displayObjectBits;
            if (bits === 0) {
                return;
            }
            buffer.writeInt(MessageTag.UpdateDisplayObject);
            buffer.writeHandle(dp.$handle);
            buffer.writeInt(bits);
            if (bits & DisplayObjectBits.DirtyMatrix) {
                Serializer.writeMatrix(dp.$getMatrix(), buffer);
            }
            if (bits & DisplayObjectBits.DirtyScrollRect) {
                if (dp.$scrollRect) {
                    buffer.writeBoolean(true);
                    Serializer.writeRectangle(dp.$scrollRect, buffer);
                }
                else {
                    buffer.writeBoolean(false);
                }
            }
            if (bits & DisplayObjectBits.DirtyFilters) {

            }
            if (bits & DisplayObjectBits.DirtyVisible) {
                buffer.writeBoolean(dp.$visible);
            }
            if (bits & DisplayObjectBits.DirtyCacheAsBitmap) {
                buffer.writeBoolean(dp.$cacheAsBitmap);
            }
            if (bits & DisplayObjectBits.DirtyAlpha) {
                buffer.writeFloat(dp.$alpha);
            }
            if (bits & DisplayObjectBits.DirtyBlendMode) {
                buffer.writeInt(BlendMode[dp.$blendMode] || 0);
            }
            if (bits & DisplayObjectBits.DirtyMask) {
                let mask = dp.$mask;
                if (mask) {
                    if (!mask.$handle) {
                        mask.$handle = sys.GFX.makeNode(mask, mask.$nodeType);
                    }
                    buffer.writeHandle(mask.$handle);
                }
                else {
                    buffer.writeInt(0);
                }
            }
            if (bits & DisplayObjectBits.DirtyMaskRect) {
                if (dp.$maskRect) {
                    buffer.writeBoolean(true);
                    Serializer.writeRectangle(dp.$maskRect, buffer);
                }
                else {
                    buffer.writeBoolean(false);
                }
            }
            if (bits & DisplayObjectBits.DirtyAnchorPoint) {
                buffer.write2Floats(dp.$anchorOffsetX, dp.$anchorOffsetY);
            }
            dp.$displayObjectBits = 0;
        }

        private static writeBitmap(bitmap:egret.Bitmap, buffer:Buffer):void {
            let bits = bitmap.$bitmapBits;
            if (bits === 0) {
                return;
            }
            buffer.writeInt(MessageTag.UpdateBitmap);
            buffer.writeHandle(bitmap.$handle);
            buffer.writeInt(bits);

            if (bits & BitmapBits.DirtyBitmapData) {
                let bitmapData = bitmap.$bitmapData;
                buffer.writeHandle(bitmapData ? bitmapData.$handle : 0)
            }
            if (bits & BitmapBits.DirtyScale9Grid) {
                if (bitmap.$scale9Grid) {
                    buffer.writeBoolean(true);
                    Serializer.writeRectangle(bitmap.$scale9Grid, buffer);
                }
                else {
                    buffer.writeBoolean(false);
                }

            }
            if (bits & BitmapBits.DirtySmoothing) {
                buffer.writeBoolean(bitmap.$smoothing);
            }
            if (bits & BitmapBits.DirtyFillMode) {
                buffer.writeInt(BitmapFillMode[bitmap.$fillMode] || 0);
            }
            bitmap.$bitmapBits = 0;
        }

        private static writeGraphics(shape:egret.Shape, buffer:Buffer):void {
            let graphics = shape.graphics;
            if (graphics.$commands.length == 0) {
                return;
            }
            let commands = graphics.$commands;
            let args = graphics.$arguments;
            buffer.writeInt(MessageTag.UpdateGraphics);
            buffer.writeHandle(shape.$handle);
            let length = commands.length;
            buffer.writeInt(length);
            let index = 0;
            for (let i = 0; i < length; i++) {
                let command = commands[i];
                buffer.writeInt(command);
                switch (command) {
                    case GraphicsCommand.CLEAR:
                    case GraphicsCommand.END_FILL:
                        break;
                    case GraphicsCommand.BEGIN_FILL:
                        buffer.writeUnsignedInt(args[index++]);        // color
                        buffer.writeFloat(args[index++]);              // alpha
                        break;
                    case GraphicsCommand.BEGIN_GRADIENT_FILL:
                        buffer.writeInt(<any>GradientType[args[index++]]); // type
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
                    case GraphicsCommand.CUBIC_CURVE_TO:
                        buffer.write6Floats(args[index++], args[index++], args[index++],
                            args[index++], args[index++], args[index++]);
                        break;
                    case GraphicsCommand.CURVE_TO:
                        buffer.write4Floats(args[index++], args[index++], args[index++], args[index++]);
                        break;
                    case GraphicsCommand.DRAW_ARC:
                        buffer.write4Floats(args[index++], args[index++], args[index++], args[index++]);
                        buffer.writeFloat(args[index++]);
                        buffer.writeBoolean(args[index++]);
                        break;
                    case GraphicsCommand.DRAW_CIRCLE:
                        buffer.write2Floats(args[index++], args[index++]);
                        buffer.writeFloat(args[index++]);
                        break;
                    case GraphicsCommand.DRAW_ELLIPSE:
                        buffer.write4Floats(args[index++], args[index++], args[index++], args[index++]);
                        break;
                    case GraphicsCommand.DRAW_RECT:
                        buffer.write4Floats(args[index++], args[index++], args[index++], args[index++]);
                        break;
                    case GraphicsCommand.DRAW_ROUND_RECT:
                        buffer.write6Floats(args[index++], args[index++], args[index++],
                            args[index++], args[index++], args[index++]);
                        break;
                    case GraphicsCommand.LINE_STYLE:
                        buffer.writeFloat(args[index++]);                      // thickness
                        buffer.writeUnsignedInt(args[index++]);                // color
                        buffer.writeFloat(args[index++]);                      // alpha
                        buffer.writeBoolean(args[index++]);                    // pixelHinting
                        buffer.writeInt(<any>LineScaleMode[args[index++]]);    // scaleMode
                        buffer.writeInt(<any>CapsStyle[args[index++]]);        // caps
                        buffer.writeInt(<any>JointStyle[args[index++]]);       // joints
                        buffer.writeFloat(args[index++]);                      // miterLimit
                        break;
                    case GraphicsCommand.LINE_TO:
                        buffer.write2Floats(args[index++], args[index++]);
                        break;
                    case GraphicsCommand.MOVE_TO:
                        buffer.write2Floats(args[index++], args[index++]);
                        break;
                }
            }
            commands.length = 0;
            args.length = 0;
        }

        private static writeTextField(textField:egret.TextField, buffer:Buffer):void {
            let bits = textField.$textFieldBits;
            if (bits === 0) {
                return;
            }
            buffer.writeInt(MessageTag.UpdateTextField);
            buffer.writeHandle(textField.$handle);
            buffer.writeInt(bits);
            if (bits & TextFieldBits.DirtyType) {
                buffer.writeInt(TextFieldType[textField.$type]);
            }
            if (bits & TextFieldBits.DirtyFontFamily) {
                buffer.writeString(textField.$fontFamily);
            }
            if (bits & TextFieldBits.DirtySize) {
                buffer.writeInt(textField.$size);
            }
            if (bits & TextFieldBits.DirtyBold) {
                buffer.writeBoolean(textField.$bold);
            }
            if (bits & TextFieldBits.DirtyItalic) {
                buffer.writeBoolean(textField.$italic);
            }
            if (bits & TextFieldBits.DirtyTextAlign) {
                buffer.writeInt(HorizontalAlign[textField.$textAlign]);
            }
            if (bits & TextFieldBits.DirtyVerticalAlign) {
                buffer.writeInt(VerticalAlign[textField.$verticalAlign]);
            }
            if (bits & TextFieldBits.DirtyLineSpacing) {
                buffer.writeInt(textField.$lineSpacing);
            }
            if (bits & TextFieldBits.DirtyTextColor) {
                buffer.writeUnsignedInt(textField.$textColor);
            }
            if (bits & TextFieldBits.DirtyWordWrap) {
                buffer.writeBoolean(textField.$wordWrap);
            }
            if (bits & TextFieldBits.DirtyStroke) {
                buffer.writeFloat(textField.$stroke);
            }
            if (bits & TextFieldBits.DirtyStrokeColor) {
                buffer.writeUnsignedInt(textField.$strokeColor);
            }
            if (bits & TextFieldBits.DirtyBorder) {
                buffer.writeBoolean(textField.$border);
            }
            if (bits & TextFieldBits.DirtyBorderColor) {
                buffer.writeUnsignedInt(textField.$borderColor);
            }
            if (bits & TextFieldBits.DirtyBackground) {
                buffer.writeBoolean(textField.$background);
            }
            if (bits & TextFieldBits.DirtyBackgroundColor) {
                buffer.writeUnsignedInt(textField.$backgroundColor);
            }
            if (bits & TextFieldBits.DirtyText) {
                buffer.writeString(textField.$text);
            }
            if (bits & TextFieldBits.DirtyDisplayAsPassword) {
                buffer.writeBoolean(textField.$displayAsPassword);
            }
            if (bits & TextFieldBits.DirtyMaxChars) {
                buffer.writeInt(textField.$maxChars);
            }
            if (bits & TextFieldBits.DirtyMultiline) {
                buffer.writeBoolean(textField.$multiline);
            }
            if (bits & TextFieldBits.DirtyPattern) {
                buffer.writeString(textField.$pattern);
            }
            if (bits & TextFieldBits.DirtySoftKeyboardType) {
                buffer.writeInt(SoftKeyboardType[textField.$softKeyboardType]);
            }
            textField.$textFieldBits = 0;
        }

        private static writeUintArray(colors:number[], buffer:Buffer):void {
            buffer.writeInt(colors.length);
            let length = colors.length;
            for (let i = 0; i < length; i++) {
                buffer.writeUnsignedInt(colors[i]);
            }
        }

        private static writeFloatArray(array:number[], buffer:Buffer):void {
            buffer.writeInt(array.length);
            let length = array.length;
            for (let i = 0; i < length; i++) {
                buffer.writeFloat(array[i]);
            }
        }

        private static writeIntArray(array:number[], buffer:Buffer):void {
            buffer.writeInt(array.length);
            let length = array.length;
            for (let i = 0; i < length; i++) {
                buffer.writeInt(array[i]);
            }
        }

        private static writeMatrix(matrix:egret.Matrix, buffer:Buffer):void {
            if (matrix.b === 0 && matrix.c === 0) {
                if (matrix.a === 1 && matrix.d === 1) {
                    buffer.writeInt(MatrixEncoding.TranslationOnly);
                    buffer.write2Floats(matrix.tx, matrix.ty);
                } else {
                    if (matrix.a === matrix.d) {
                        buffer.writeInt(MatrixEncoding.UniformScaleAndTranslationOnly);
                        buffer.writeFloat(matrix.a);
                    } else {
                        buffer.writeInt(MatrixEncoding.ScaleAndTranslationOnly);
                        buffer.write2Floats(matrix.a, matrix.d);
                    }
                    buffer.write2Floats(matrix.tx, matrix.ty);
                }
            } else {
                buffer.writeInt(MatrixEncoding.All);
                buffer.write6Floats(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
        }

        private static writeRectangle(rect:egret.Rectangle, buffer:Buffer):void {
            buffer.write4Floats(rect.x, rect.y, rect.width, rect.height);
        }

    }
}