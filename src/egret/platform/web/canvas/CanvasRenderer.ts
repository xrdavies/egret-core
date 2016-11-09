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
namespace egret.web {

    let BLACK_COLOR = "#000000";
    let CAPS_STYLES = {0: 'round', 1: 'square', 2: 'butt'};
    let JOINTS_STYLES = {0: "round", 1: "bevel", 2: "miter"};

    /**
     * @private
     * 获取RGBA字符串
     */
    function getRGBAString(color:number, alpha:number):string {
        let red = color >> 16;
        let green = (color >> 8) & 0xFF;
        let blue = color & 0xFF;
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }

    /**
     * @private
     * 获取渐变填充样式对象
     */
    function getGradient(context:CanvasRenderingContext2D, type:number, colors:number[],
                         alphas:number[], ratios:number[]):CanvasGradient {
        let gradient:CanvasGradient;
        if (type == elf.GradientType.LINEAR) {
            gradient = context.createLinearGradient(-1, 0, 1, 0);
        }
        else {
            gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
        }
        let l = colors.length;
        for (let i = 0; i < l; i++) {
            gradient.addColorStop(ratios[i] / 255, getRGBAString(colors[i], alphas[i]));
        }
        return gradient;
    }

    /**
     * @internal
     */
    export class CanvasRenderer extends elf.Renderer {
        public constructor() {
            super();
        }

        protected renderNode(buffer:CanvasRenderBuffer, node:elf.Node):void {
            switch (node.nodeType) {
                case egret.sys.NodeType.BITMAP:
                    this.renderBitmap(buffer, <elf.Bitmap>node);
                    break;
                case egret.sys.NodeType.GRAPHICS:
                    this.renderGraphics(buffer, <elf.Graphics>node);
                    break;
                case egret.sys.NodeType.TEXT:
                    this.renderTextFiled(buffer, <elf.Text>node);
                    break;

            }
        }

        private renderBitmap(buffer:CanvasRenderBuffer, node:elf.Bitmap):void {
            let context = buffer.context;
            let bitmapData = <WebBitmapData>node.bitmapData;
            if (!bitmapData) {
                return;
            }
            buffer.setSmoothing(node.smoothing);
            context.drawImage(bitmapData.source, 0, 0);
        }

        public renderGraphics(buffer:CanvasRenderBuffer, node:elf.Graphics, forHitTest?:boolean):void {
            let context = buffer.context;
            for (let path of node.pathList) {
                switch (path.style.type) {
                    case elf.PathStyleType.Stroke:
                        let strokeStyle = <elf.StrokeStyle>path.style;
                        let lineWidth = strokeStyle.lineWidth;
                        context.lineWidth = lineWidth;
                        context.strokeStyle = forHitTest ? BLACK_COLOR : getRGBAString(strokeStyle.lineColor, strokeStyle.lineAlpha);
                        context.lineCap = CAPS_STYLES[strokeStyle.caps];
                        context.lineJoin = JOINTS_STYLES[strokeStyle.joints];
                        context.miterLimit = strokeStyle.miterLimit;
                        //对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
                        let isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
                        if (isSpecialCaseWidth) {
                            context.translate(0.5, 0.5);
                        }
                        this.renderPath(context, path);
                        let lineScaleMode = strokeStyle.lineScaleMode;
                        if (lineScaleMode == elf.LineScaleMode.NONE) {
                            context.save();
                            context.setTransform(1, 0, 0, 1, 0, 0);
                        }
                        context.stroke();
                        if (lineScaleMode == elf.LineScaleMode.NONE) {
                            context.restore();
                        }
                        if (isSpecialCaseWidth) {
                            context.translate(-0.5, -0.5);
                        }

                        break;
                    case elf.PathStyleType.Fill:
                        let fillStyle = <elf.FillStyle>path.style;
                        context.fillStyle = forHitTest ? BLACK_COLOR : getRGBAString(fillStyle.fillColor, fillStyle.fillAlpha);
                        this.renderPath(context, path);
                        context.fill();
                        break;
                    case elf.PathStyleType.GradientFill:
                        let gradientStyle = <elf.GradientFillStyle>path.style;
                        context.fillStyle = forHitTest ? BLACK_COLOR : getGradient(context, gradientStyle.gradientType,
                            gradientStyle.colors, gradientStyle.alphas, gradientStyle.ratios);
                        context.save();
                        let m = gradientStyle.matrix;
                        this.renderPath(context, path);
                        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        context.fill();
                        context.restore();
                        break;
                }
            }
        }

        private renderPath(context:CanvasRenderingContext2D, path:elf.Path2D):void {
            context.beginPath();
            let data = path.$data;
            let commands = path.$commands;
            let commandCount = commands.length;
            let pos = 0;
            for (let commandIndex = 0; commandIndex < commandCount; commandIndex++) {
                let command = commands[commandIndex];
                switch (command) {
                    case elf.PathCommand.CubicCurveTo:
                        context.bezierCurveTo(data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++]);
                        break;
                    case elf.PathCommand.CurveTo:
                        context.quadraticCurveTo(data[pos++], data[pos++], data[pos++], data[pos++]);
                        break;
                    case elf.PathCommand.LineTo:
                        context.lineTo(data[pos++], data[pos++]);
                        break;
                    case elf.PathCommand.MoveTo:
                        context.moveTo(data[pos++], data[pos++]);
                        break;
                }
            }
        }

        private renderTextFiled(buffer:CanvasRenderBuffer, node:elf.Text):void {

        }

    }
}