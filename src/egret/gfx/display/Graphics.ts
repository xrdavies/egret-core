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
    export class Graphics extends Node {

        public constructor() {
            super();
            this.nodeType = egret.sys.NodeType.GRAPHICS;
            this.region = new Rectangle();
        }

        public pathList:Path2D[] = [];
        private fillPath:Path2D = null;
        private strokePath:Path2D = null;
        private lastX:number = 0;
        private lastY:number = 0;

        /**
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for
         * example, lineTo() and drawCircle()) when drawing. Calling the clear() method will clear the fill.
         * @param color Filled color
         * @param alpha Filled Alpha value
         */
        public beginFill(color:number, alpha:number = 1):void {
            let style = <FillStyle>this.createFillPathAndStyle(PathStyleType.Fill);
            style.fillColor = color;
            style.fillAlpha = alpha;
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
        public beginGradientFill(type:number, colors:number[], alphas:number[], ratios:number[], matrix?:Matrix):void {
            let style = <GradientFillStyle>this.createFillPathAndStyle(PathStyleType.GradientFill);
            let colorCount = colors.length;
            while (alphas.length < colorCount) {
                alphas.push(1);
            }
            if (ratios.length < colorCount) {
                ratios = [];
                let gap = 255 / (colorCount - 1);
                for (let i = 0; i < colorCount - 1; i++) {
                    ratios.push(Math.round(i * gap))
                }
                ratios.push(255);
            }
            style.gradientType = type;
            style.colors = colors;
            style.alphas = alphas;
            style.ratios = ratios;
            let m = style.matrix = new Matrix();
            if (matrix) {
                m.a = matrix.a * 819.2;
                m.b = matrix.b * 819.2;
                m.c = matrix.c * 819.2;
                m.d = matrix.d * 819.2;
                m.tx = matrix.tx;
                m.ty = matrix.ty;
            }
            else {
                //默认值
                m.a = 100;
                m.d = 100;
            }
        }

        /**
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         */
        public endFill():void {
            this.fillPath = null;
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
                         scaleMode?:number, caps?:number, joints?:number, miterLimit?:number):void {
            if (thickness <= 0) {
                this.strokePath = null;
                return;
            }
            let style = <StrokeStyle>this.createStrokePathAndStyle(PathStyleType.Stroke);
            style.lineWidth = thickness;
            style.lineColor = color;
            style.lineAlpha = alpha;
            style.lineScaleMode = scaleMode;
            style.caps = caps;
            style.joints = joints;
            style.miterLimit = miterLimit;
        }

        /**
         * Draw a rectangle
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         */
        public drawRect(x:number, y:number, width:number, height:number):void {
            if (this.fillPath) {
                this.fillPath.drawRect(x, y, width, height);
            }
            if (this.strokePath) {
                this.strokePath.drawRect(x, y, width, height);
            }
            this.lastX = x;
            this.lastY = y;
            this.invalidateContent();
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
            if (this.fillPath) {
                this.fillPath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            }
            if (this.strokePath) {
                this.strokePath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            }
            let radiusX = ellipseWidth * 0.5;
            let radiusY = ellipseHeight ? ellipseHeight * 0.5 : radiusX;
            this.lastX = x + width;
            this.lastY = y + height - radiusY;
            this.invalidateContent();
        }

        /**
         * Draw a circle.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param radius Radius of the circle (in pixels).
         */
        public drawCircle(x:number, y:number, radius:number):void {
            if (this.fillPath) {
                this.fillPath.drawCircle(x, y, radius);
            }
            if (this.strokePath) {
                this.strokePath.drawCircle(x, y, radius);
            }
            this.lastX = x + radius;
            this.lastY = y;
            this.invalidateContent();
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
            if (this.fillPath) {
                this.fillPath.drawEllipse(x, y, width, height);
            }
            if (this.strokePath) {
                this.strokePath.drawEllipse(x, y, width, height);
            }
            this.lastX = x + width;
            this.lastY = y + height * 0.5;
            this.invalidateContent();
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
            if (this.fillPath) {
                this.fillPath.moveTo(x, y);
            }
            if (this.strokePath) {
                this.strokePath.moveTo(x, y);
            }
            this.lastX = x;
            this.lastY = y;
            this.invalidateContent();
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
            if (this.fillPath) {
                this.fillPath.lineTo(x, y);
            }
            if (this.strokePath) {
                this.strokePath.lineTo(x, y);
            }
            this.lastX = x;
            this.lastY = y;
            this.invalidateContent();
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
            if (this.fillPath) {
                this.fillPath.curveTo(controlX, controlY, anchorX, anchorY);
            }
            if (this.strokePath) {
                this.strokePath.curveTo(controlX, controlY, anchorX, anchorY);
            }
            this.lastX = anchorX;
            this.lastY = anchorY;
            this.invalidateContent();
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
            if (this.fillPath) {
                this.fillPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            }
            if (this.strokePath) {
                this.strokePath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            }
            this.lastX = anchorX;
            this.lastY = anchorY;
            this.invalidateContent();
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
            if (this.fillPath) {
                this.fillPath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            }
            if (this.strokePath) {
                this.strokePath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            }
            this.lastX = x + Math.cos(endAngle) * radius;
            this.lastY = y + Math.sin(endAngle) * radius;
            this.invalidateContent();
        }

        /**
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
         */
        public clear():void {
            this.pathList.length = 0;
            this.lastX = this.lastY = 0;
            this.fillPath = this.strokePath = null;
            this.invalidateContent();
        }

        public graphicsBounds:Rectangle = new Rectangle();

        protected measureContentBounds(bounds:Rectangle):void {
            bounds.copyFrom(this.graphicsBounds);
        }

        private createFillPathAndStyle(type:PathStyleType):PathStyle {
            this.fillPath = new Path2D(this.lastX, this.lastY);
            if (this.strokePath) {
                let index = this.pathList.indexOf(this.strokePath);
                this.pathList.splice(index, 0, this.fillPath);
            } else {
                this.pathList.push(this.fillPath);
            }
            return this.fillPath.style = {type: type};
        }

        private createStrokePathAndStyle(type:PathStyleType):PathStyle {
            this.strokePath = new Path2D(this.lastX, this.lastY);
            this.pathList.push(this.strokePath);
            return this.strokePath.style = {type: type};
        }
    }
}