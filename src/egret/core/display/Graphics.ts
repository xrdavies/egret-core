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

namespace egret {

    /**
     * @private
     */
    function clampAngle(value):number {
        value %= Math.PI * 2;
        if (value < 0) {
            value += Math.PI * 2;
        }
        return value;
    }

    /**
     * The Graphics class contains a set of methods for creating vector shape. Display objects that support drawing
     * include Sprite and Shape objects. Each of these classes includes a graphics property that is a Graphics object.
     * The following auxiliary functions are provided for ease of use: drawRect(), drawRoundRect(), drawCircle(), and
     * drawEllipse().
     */
    export class Graphics {

        /**
         * @internal
         */
        $targetDisplay:DisplayObject;

        /**
         * @internal
         */
        $commands = [];

        /**
         * @internal
         */
        $arguments = [];

        /**
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for
         * example, lineTo() and drawCircle()) when drawing. Calling the clear() method will clear the fill.
         * @param color Filled color
         * @param alpha Filled Alpha value
         */
        public beginFill(color:number, alpha:number = 1):void {
            alpha = +alpha || 0;
            this.$commands.push(sys.GraphicsCommand.BEGIN_FILL);
            this.$arguments.push(color, alpha);
            this.$targetDisplay.$invalidate();
        }


        /**
         * Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle())
         * for the object. Calling the clear() method clears the fill.
         * @param type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR
         * or GradientType.RADIAL.
         * @param colors An array of RGB hexadecimal color values used in the gradient; for example, red is 0xFF0000, blue
         * is 0x0000FF, and so on. You can specify up to 15 colors. For each color, specify a corresponding value in the
         * alphas and ratios parameters.
         * @param alphas An array of alpha values for the corresponding colors in the colors array.
         * @param ratios An array of color distribution ratios; valid values are 0-255.
         * @param matrix A transformation matrix as defined by the Matrix class. The Matrix class includes a
         * createGradientBox() method, which lets you conveniently set up the matrix for use with the beginGradientFill()
         * method.
         */
        public beginGradientFill(type:string, colors:number[], alphas:number[], ratios:number[], matrix?:Matrix):void {
            colors = colors ? colors.concat() : [];
            if (colors.length == 0) {
                return;
            }
            alphas = alphas ? alphas.concat() : [];
            ratios = ratios ? ratios.concat() : [];
            if (matrix) {
                matrix = matrix.clone();
            }
            this.$commands.push(sys.GraphicsCommand.BEGIN_GRADIENT_FILL);
            this.$arguments.push(type, colors, alphas, ratios, matrix);
            this.$targetDisplay.$invalidate();
        }

        /**
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         */
        public endFill():void {
            this.$commands.push(sys.GraphicsCommand.END_FILL);
            this.$targetDisplay.$invalidate();
        }

        /**
         * Specify a line style that will be used for subsequent calls to Graphics methods such as lineTo() and drawCircle().
         * @param thickness An integer, indicating the thickness of the line in points. Valid values are 0 to 255. If a
         * number is not specified, or if the parameter is undefined, a line is not drawn. If a value less than 0 is passed,
         * the default value is 0. Value 0 indicates hairline thickness; the maximum thickness is 255. If a value greater
         * than 255 is passed, the default value is 255.
         * @param color A hexadecimal color value of the line (for example, red is 0xFF0000, and blue is 0x0000FF, etc.).
         * If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha Indicates Alpha value of the line's color. Valid values are 0 to 1. If no value is specified, the
         * default value is 1 (solid). If the value is less than 0, the default value is 0. If the value is greater than
         * 1, the default value is 1.
         * @param pixelHinting A boolean value that specifies whether to hint strokes to full pixels. This affects both
         * the position of anchors of a curve and the line stroke size itself. With pixelHinting set to true, the line
         * width is adjusted to full pixel width. With pixelHinting set to false, disjoints can appear for curves and
         * straight lines.
         * @param scaleMode A value from the LineScaleMode class that specifies which scale mode to use.
         * (default = LineScaleMode.NORMAL)
         * @param caps Specifies the value of the CapsStyle class of the endpoint type at the end of the line.
         * (default = CapsStyle.ROUND)
         * @param joints Specifies the type of joint appearance of corner.  (default = JointStyle.ROUND)
         * @param miterLimit Indicates the limit number of cut miter. (default = 3)
         */
        public lineStyle(thickness:number = 0, color:number = 0, alpha:number = 1.0, pixelHinting?:boolean,
                         scaleMode?:string, caps?:string, joints?:string, miterLimit:number = 3):void {
            thickness = +thickness || 0;
            alpha = +alpha || 0;
            miterLimit = +miterLimit || 0;
            this.$commands.push(sys.GraphicsCommand.LINE_STYLE);
            this.$arguments.push(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit);
            this.$targetDisplay.$invalidate();
        }

        /**
         * Draw a rectangle
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         */
        public drawRect(x:number, y:number, width:number, height:number):void {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            this.$commands.push(sys.GraphicsCommand.DRAW_RECT);
            this.$arguments.push(x, y, width, height);
            this.extendBoundsByPoint(x + width, y + height);
            this.updatePosition(x, y);
        }

        /**
         * Draw a rectangle with rounded corners.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @param ellipseWidth Width used to draw an ellipse with rounded corners (in pixels).
         * @param ellipseHeight Height used to draw an ellipse with rounded corners (in pixels). (Optional) If no value is specified, the default value matches the value of the ellipseWidth parameter.
         */
        public drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            ellipseWidth = +ellipseWidth || 0;
            ellipseHeight = +ellipseHeight || 0;
            this.$commands.push(sys.GraphicsCommand.DRAW_ROUND_RECT);
            this.$arguments.push(x, y, width, height, ellipseWidth, ellipseHeight);
            this.$targetDisplay.$invalidateContentBounds();

            let radiusX = (ellipseWidth * 0.5) | 0;
            let radiusY = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;
            let right = x + width;
            let bottom = y + height;
            let ybw = bottom - radiusY;
            this.extendBoundsByPoint(x, y);
            this.extendBoundsByPoint(right, bottom);
            this.updatePosition(right, ybw);
        }

        /**
         * Draw a circle.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param radius Radius of the circle (in pixels).
         */
        public drawCircle(x:number, y:number, radius:number):void {
            x = +x || 0;
            y = +y || 0;
            radius = +radius || 0;
            this.$commands.push(sys.GraphicsCommand.DRAW_CIRCLE);
            this.$arguments.push(x, y, radius);
            this.extendBoundsByPoint(x - radius, y - radius);
            this.extendBoundsByPoint(x + radius, y + radius);
            this.updatePosition(x + radius, y);
        }


        /**
         * Draw an ellipse.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display
         * object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display
         * object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         */
        public drawEllipse(x:number, y:number, width:number, height:number):void {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            this.$commands.push(sys.GraphicsCommand.DRAW_ELLIPSE);
            this.$arguments.push(x, y, width, height);
            this.extendBoundsByPoint(x + width, y + height);
            this.updatePosition(x + width, y + height * 0.5);
        }

        /**
         * Move the current drawing position to (x, y). If any of these parameters is missed, calling this method will
         * fail and the current drawing position keeps unchanged.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display
         * object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display
         * object (in pixels).
         */
        public moveTo(x:number, y:number):void {
            x = +x || 0;
            y = +y || 0;
            this.$commands.push(sys.GraphicsCommand.MOVE_TO);
            this.$arguments.push(x, y);
            this.$targetDisplay.$invalidate();
            this.includeLastPosition = false;
            this.lastX = x;
            this.lastY = y;
        }

        /**
         * Draw a straight line from the current drawing position to (x, y) using the current line style; the current
         * drawing position is then set to (x, y).
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display
         * object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display
         * object (in pixels).
         */
        public lineTo(x:number, y:number):void {
            x = +x || 0;
            y = +y || 0;
            this.$commands.push(sys.GraphicsCommand.LINE_TO);
            this.$arguments.push(x, y);
            this.updatePosition(x, y);
        }

        /**
         * Draw a quadratic Bezier curve from the current drawing position to (anchorX, anchorY) using the current line
         * style according to the control points specified by (controlX, controlY). The current drawing position is then
         * set to (anchorX, anchorY).
         * If the curveTo() method is called before the moveTo() method, the default value of the current drawing position
         * is (0, 0). If any of these parameters is missed, calling this method will fail and the current drawing position
         * keeps unchanged.
         * The drawn curve is a quadratic Bezier curve. A quadratic Bezier curve contains two anchor points and one control
         * point. The curve interpolates the two anchor points and bends to the control point.
         * @param controlX A number indicating the horizontal position of the control point, relative to the registration
         * point of the parent display object.
         * @param controlY A number indicating the vertical position of the control point, relative to the registration
         * point of the parent display object.
         * @param anchorX A number indicating the horizontal position of the next anchor point, relative to the registration
         * point of the parent display object.
         * @param anchorY A number indicating the vertical position of the next anchor point, relative to the registration
         * point of the parent display object.
         */
        public curveTo(controlX:number, controlY:number, anchorX:number, anchorY:number):void {
            controlX = +controlX || 0;
            controlY = +controlY || 0;
            anchorX = +anchorX || 0;
            anchorY = +anchorY || 0;
            this.$commands.push(sys.GraphicsCommand.CURVE_TO);
            this.$arguments.push(controlX, controlY, anchorX, anchorY);
            this.extendBoundsByPoint(controlX, controlY);
            this.extendBoundsByPoint(anchorX, anchorY);
            this.updatePosition(anchorX, anchorY);
        }

        /**
         * Draws a cubic Bezier curve from the current drawing position to the specified anchor. Cubic Bezier curves
         * consist of two anchor points and two control points. The curve interpolates the two anchor points and two
         * control points to the curve.
         * @param controlX1 Specifies the first control point relative to the registration point of the parent display
         * the horizontal position of the object.
         * @param controlY1 Specifies the first control point relative to the registration point of the parent display
         * the vertical position of the object.
         * @param controlX2 Specify the second control point relative to the registration point of the parent display
         * the horizontal position of the object.
         * @param controlY2 Specify the second control point relative to the registration point of the parent display
         * the vertical position of the object.
         * @param anchorX Specifies the anchor point relative to the registration point of the parent display the horizontal
         * position of the object.
         * @param anchorY Specifies the anchor point relative to the registration point of the parent display the vertical
         * position of the object.
         */
        public cubicCurveTo(controlX1:number, controlY1:number, controlX2:number,
                            controlY2:number, anchorX:number, anchorY:number):void {
            controlX1 = +controlX1 || 0;
            controlY1 = +controlY1 || 0;
            controlX2 = +controlX2 || 0;
            controlY2 = +controlY2 || 0;
            anchorX = +anchorX || 0;
            anchorY = +anchorY || 0;
            this.$commands.push(sys.GraphicsCommand.CUBIC_CURVE_TO);
            this.$arguments.push(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            this.extendBoundsByPoint(controlX1, controlY1);
            this.extendBoundsByPoint(controlX2, controlY2);
            this.extendBoundsByPoint(anchorX, anchorY);
            this.updatePosition(anchorX, anchorY);
        }

        /**
         * adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending
         * at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
         * @param x The x coordinate of the arc's center.
         * @param y The y coordinate of the arc's center.
         * @param radius The arc's radius.
         * @param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed
         * in radians.
         * @param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in
         * radians.
         * @param anticlockwise if true, causes the arc to be drawn counter-clockwise between the two angles. By default
         * it is drawn clockwise.
         */
        public drawArc(x:number, y:number, radius:number, startAngle:number, endAngle:number, anticlockwise?:boolean):void {
            if (radius < 0 || startAngle === endAngle) {
                return;
            }
            x = +x || 0;
            y = +y || 0;
            radius = +radius || 0;
            startAngle = +startAngle || 0;
            endAngle = +endAngle || 0;
            this.$commands.push(sys.GraphicsCommand.DRAW_ARC);
            this.$arguments.push(x, y, radius, startAngle, endAngle, anticlockwise);
            startAngle = clampAngle(startAngle);
            endAngle = clampAngle(endAngle);
            if (anticlockwise) {
                this.arcBounds(x, y, radius, endAngle, startAngle);
            }
            else {
                this.arcBounds(x, y, radius, startAngle, endAngle);
            }
            let endX = x + Math.cos(endAngle) * radius;
            let endY = y + Math.sin(endAngle) * radius;
            this.updatePosition(endX, endY);
        }

        /**
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
         */
        public clear():void {
            this.$commands = [sys.GraphicsCommand.CLEAR];
            this.$arguments = [arguments];
            this.updatePosition(0, 0);
            this.minX = Infinity;
            this.minY = Infinity;
            this.maxX = -Infinity;
            this.maxY = -Infinity;
        }

        /**
         * @private
         */
        private arcBounds(x:number, y:number, radius:number, startAngle:number, endAngle:number):void {
            let PI = Math.PI;
            if (Math.abs(startAngle - endAngle) < 0.01) {
                this.extendBoundsByPoint(x - radius, y - radius);
                this.extendBoundsByPoint(x + radius, y + radius);
                return;
            }
            if (startAngle > endAngle) {
                endAngle += PI * 2;
            }
            let startX = Math.cos(startAngle) * radius;
            let endX = Math.cos(endAngle) * radius;
            let xMin = Math.min(startX, endX);
            let xMax = Math.max(startX, endX);

            let startY = Math.sin(startAngle) * radius;
            let endY = Math.sin(endAngle) * radius;
            let yMin = Math.min(startY, endY);
            let yMax = Math.max(startY, endY);

            let startRange = startAngle / (PI * 0.5);
            let endRange = endAngle / (PI * 0.5);
            for (let i = Math.ceil(startRange); i <= endRange; i++) {
                switch (i % 4) {
                    case 0:
                        xMax = radius;
                        break;
                    case 1:
                        yMax = radius;
                        break;
                    case 2:
                        xMin = -radius;
                        break;
                    case 3:
                        yMin = -radius;
                        break;
                }
            }
            xMin = Math.floor(xMin);
            yMin = Math.floor(yMin);
            xMax = Math.ceil(xMax);
            yMax = Math.ceil(yMax);
            this.extendBoundsByPoint(xMin + x, yMin + y);
            this.extendBoundsByPoint(xMax + x, yMax + y);
        }

        private lastX:number = 0;
        private lastY:number = 0;
        private topLeftStrokeWidth = 0;
        private bottomRightStrokeWidth = 0;

        private setStrokeWidth(width:number) {
            switch (width) {
                case 1:
                    this.topLeftStrokeWidth = 0;
                    this.bottomRightStrokeWidth = 1;
                    break;
                case 3:
                    this.topLeftStrokeWidth = 1;
                    this.bottomRightStrokeWidth = 2;
                    break;
                default:
                    let half = Math.ceil(width * 0.5) | 0;
                    this.topLeftStrokeWidth = half;
                    this.bottomRightStrokeWidth = half;
                    break;
            }
        }

        /**
         * @private
         */
        private minX:number = Infinity;
        /**
         * @private
         */
        private minY:number = Infinity;
        /**
         * @private
         */
        private maxX:number = -Infinity;
        /**
         * @private
         */
        private maxY:number = -Infinity;

        /**
         * @private
         */
        private extendBoundsByPoint(x:number, y:number):void {
            this.extendBoundsByX(x);
            this.extendBoundsByY(y);
        }

        /**
         * @private
         */
        private extendBoundsByX(x:number):void {
            this.minX = Math.min(this.minX, x - this.topLeftStrokeWidth);
            this.maxX = Math.max(this.maxX, x + this.bottomRightStrokeWidth);
        }

        /**
         * @private
         */
        private extendBoundsByY(y:number):void {
            this.minY = Math.min(this.minY, y - this.topLeftStrokeWidth);
            this.maxY = Math.max(this.maxY, y + this.bottomRightStrokeWidth);
        }

        private includeLastPosition:boolean = true;

        /**
         * @private
         */
        private updatePosition(x:number, y:number):void {
            if (!this.includeLastPosition) {
                this.extendBoundsByPoint(this.lastX, this.lastY);
                this.includeLastPosition = true;
            }
            this.lastX = x;
            this.lastY = y;
            this.extendBoundsByPoint(x, y);
            this.$targetDisplay.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $measureContentBounds(bounds:Rectangle):void {
            if (this.minX === Infinity) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
            }
        }
    }
}