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

    let tempBounds:Rectangle = new Rectangle();
    let offsetMatrix:Matrix = new Matrix();
    let tempMatrix:Matrix = new Matrix();
    let rectanglePool:Rectangle[] = [];
    let pointPool:Point[] = [];

    /**
     * @private
     */
    function setMatrixWithOffset(context:RenderBuffer, m:Matrix, offset?:Point):void {
        if (offset) {
            m = tempMatrix.copyFrom(m);
            m.tx += offset.x;
            m.ty += offset.y;
        }
        context.setMatrix(m);
    }

    /**
     * @private
     */
    export let systemRenderer:Renderer;

    /**
     * @internal
     */
    export class Renderer {
        /**
         * Draws the node and all its children onto the specified render buffer. This method updates the drawn property of the
         * display node after drawing.
         * @param buffer The render buffer to be drawn to.
         * @param node The node to draw to the render buffer.
         * @param clipRegion A Rectangle object that defines the area of the node to draw.
         * @param offset A Point object used to translate the coordinates of the node.
         */
        public render(buffer:RenderBuffer, node:Node, clipRegion:Rectangle, offset?:Point):void {
            this.renderNodeTree(buffer, node, clipRegion, offset);
        }

        private renderNodeTree(buffer:RenderBuffer, node:Node, clipRegion:Rectangle, offset?:Point):void {
            if (node.region) {
                if (!clipRegion || clipRegion.intersects(node.region)) {
                    setMatrixWithOffset(buffer, node.renderMatrix, offset);
                    buffer.setAlpha(node.renderAlpha);
                    this.renderNode(buffer, node);
                    node.drawn = true;
                }
            }
            if (!node.children) {
                return;
            }
            for (let child of node.children) {
                if (child.renderAlpha == 0 || !child.visible || child.maskedObject) {
                    continue;
                }
                if (child.blendMode > BlendMode.LAYER || child.mask) {
                    this.renderNodeTreeComplex(buffer, child, clipRegion, offset);
                } else {
                    let clipRect = child.scrollRect ? child.scrollRect : child.maskRect;
                    if (clipRect) {
                        if (clipRect.isEmpty()) {
                            continue;
                        }
                        setMatrixWithOffset(buffer, child.renderMatrix, offset);
                        buffer.clipRect(clipRect);

                    }
                    if (child.displayList) {
                        child.displayList.renderCheck(buffer, clipRegion, offset);
                    } else {
                        this.renderNodeTree(buffer, child, clipRegion, offset);
                    }
                    if (clipRect) {
                        buffer.restore();
                    }
                }
            }
        }

        private renderNodeTreeComplex(buffer:RenderBuffer, node:Node, clipRegion:Rectangle, offset?:Point):void {
            let nodeBounds = rectanglePool.length ? rectanglePool.pop().setEmpty() : new Rectangle();
            node.mergeRegions(nodeBounds);

            let mask = node.mask;
            if (mask && !mask.parentDisplayList) {
                mask = null;
            }
            if (mask) {
                tempBounds.setEmpty();
                mask.mergeRegions(tempBounds);
                nodeBounds.intersect(tempBounds);
            }
            if (clipRegion) {
                nodeBounds.intersect(clipRegion);
            }
            if (nodeBounds.isEmpty()) {
                return;
            }
            let offsetPoint:Point;
            if (nodeBounds.left != 0 || nodeBounds.top != 0) {
                offsetPoint = pointPool.length ? pointPool.pop() : new Point();
                offsetPoint.setTo(-nodeBounds.left, -nodeBounds.top);
            }
            let nodeBuffer = buffer.makeRenderBuffer(nodeBounds.width(), nodeBounds.height(), true);
            // maskRect is ignored if scrollRect is not null.
            let clipRect = node.scrollRect ? node.scrollRect : node.maskRect;
            if (clipRect) {
                if (clipRect.isEmpty()) {
                    return;
                }
                nodeBuffer.save();
                setMatrixWithOffset(nodeBuffer, node.renderMatrix, offsetPoint);
                nodeBuffer.clipRect(clipRect);
            }
            if (node.displayList) {
                node.displayList.renderCheck(nodeBuffer, nodeBounds, offsetPoint);
            } else {
                this.renderNodeTree(nodeBuffer, node, nodeBounds, offsetPoint);
            }

            if (clipRect) {
                nodeBuffer.restore();
            }

            if (mask) {
                let maskBuffer = buffer.makeRenderBuffer(nodeBounds.width(), nodeBounds.height(), true);
                if (mask.displayList) {
                    mask.displayList.renderCheck(maskBuffer, nodeBounds, offsetPoint);
                } else {
                    this.renderNodeTree(maskBuffer, mask, nodeBounds, offsetPoint);
                }
                nodeBuffer.resetMatrix();
                nodeBuffer.setBlendMode(BlendMode.MASK);
                nodeBuffer.setAlpha(1);
                nodeBuffer.drawBuffer(maskBuffer, 0, 0);
            }

            offsetMatrix.tx = nodeBounds.left;
            offsetMatrix.ty = nodeBounds.top;
            setMatrixWithOffset(buffer, offsetMatrix, offset);
            buffer.setBlendMode(node.blendMode);
            buffer.setAlpha(1);
            buffer.drawBuffer(nodeBuffer, 0, 0);

            rectanglePool.push(nodeBounds);
            if (offsetPoint) {
                pointPool.push(offsetPoint);
            }
        }


        /**
         * Draws the node and all its children onto the specified render buffer. You can specify  matrix and a destination
         * clipRect parameter to control how the rendering performs.
         * @param buffer The render buffer to be drawn to.
         * @param node The node to draw to the render buffer.
         * @param matrix A Matrix object used to scale, rotate, or translate the coordinates of the node. If you do not
         * want to apply a matrix transformation to the image, set this parameter to an identity matrix, or pass a null
         * value.
         * @param alpha A float value that you use to adjust the alpha values of the node.
         * @param blendMode A string value, from the BlendMode class, specifying the blend mode to be applied to the node.
         * @param clipRect A Rectangle object that defines the area of the node to draw. If you do not supply this value,
         * no clipping occurs and the entire node is drawn.
         */
        public draw(buffer:RenderBuffer, node:Node, matrix?:Matrix, alpha:number = 1,
                    blendMode:number = 0, clipRect?:Rectangle):void {
            buffer.save();
            if (clipRect) {
                buffer.resetMatrix();
                buffer.clipRect(clipRect);
            }
            let renderMatrix = new Matrix();
            if (matrix) {
                renderMatrix.copyFrom(matrix);
            }
            if (blendMode > BlendMode.LAYER || clipRect) {
                this.drawNodeTreeComplex(buffer, node, renderMatrix, alpha, node.blendMode, clipRect);
            } else {
                this.drawNodeTree(buffer, node, renderMatrix, alpha);
            }
            buffer.restore();

        }


        private drawNodeTree(buffer:RenderBuffer, node:Node, renderMatrix:Matrix, renderAlpha:number):void {
            if (node.region) {
                buffer.setMatrix(renderMatrix);
                buffer.setAlpha(renderAlpha);
                this.renderNode(buffer, node);
            }
            if (!node.children) {
                return;
            }
            for (let child of node.children) {
                if (child.renderAlpha == 0 || !child.visible || child.maskedObject) {
                    continue;
                }
                let childRenderAlpha = renderAlpha * child.alpha;
                let childRenderMatrix = new Matrix();
                child.getMatrixWithScrollOffset().concatInto(renderMatrix, childRenderMatrix);
                if (child.blendMode > BlendMode.LAYER || child.mask) {
                    // maskRect is ignored if scrollRect is not null.
                    let clipRect = child.scrollRect ? child.scrollRect : child.maskRect;
                    this.drawNodeTreeComplex(buffer, child, childRenderMatrix, childRenderAlpha,
                        child.blendMode, clipRect, child.mask);
                } else {
                    let clipRect = child.scrollRect ? child.scrollRect : child.maskRect;
                    if (clipRect) {
                        if (clipRect.isEmpty()) {
                            continue;
                        }
                        buffer.save();
                        buffer.setMatrix(childRenderMatrix);
                        buffer.clipRect(clipRect);

                    }
                    this.drawNodeTree(buffer, child, childRenderMatrix, childRenderAlpha);
                    if (clipRect) {
                        buffer.restore();
                    }
                }
            }
        }

        private drawNodeTreeComplex(buffer:RenderBuffer, node:Node, renderMatrix:Matrix, renderAlpha:number,
                                    blendMode:number = 0, clipRect?:Rectangle, mask?:Node):void {
            let nodeBounds = rectanglePool.length ? rectanglePool.pop() : new Rectangle();
            node.measureBounds(nodeBounds);
            let maskMatrix:Matrix;
            if (mask) {
                maskMatrix = new Matrix();
                mask.getConcatenatedMatrix(maskMatrix);
                node.getConcatenatedMatrix(tempMatrix);
                tempMatrix.invert();
                maskMatrix.concat(tempMatrix);
                mask.measureBounds(tempBounds);
                maskMatrix.transformBounds(tempBounds);
                nodeBounds.intersect(tempBounds);
            }
            if (nodeBounds.isEmpty()) {
                return;
            }
            let offsetMatrix = new Matrix();
            if (nodeBounds.left != 0 || nodeBounds.top != 0) {
                offsetMatrix.setTo(1, 0, 0, 1, -nodeBounds.left, -nodeBounds.top);
            }
            let nodeBuffer = buffer.makeRenderBuffer(nodeBounds.width(), nodeBounds.height(), true);

            if (clipRect) {
                if (clipRect.isEmpty()) {
                    return;
                }
                nodeBuffer.save();
                nodeBuffer.setMatrix(offsetMatrix);
                nodeBuffer.clipRect(clipRect);
            }
            this.drawNodeTree(nodeBuffer, node, offsetMatrix, renderAlpha);
            if (clipRect) {
                nodeBuffer.restore();
            }

            if (mask) {
                let maskBuffer = buffer.makeRenderBuffer(nodeBounds.width(), nodeBounds.height(), true);
                maskMatrix.concat(offsetMatrix);
                this.drawNodeTree(maskBuffer, mask, maskMatrix, 1);
                nodeBuffer.resetMatrix();
                nodeBuffer.setBlendMode(BlendMode.MASK);
                nodeBuffer.drawBuffer(maskBuffer, 0, 0);
            }

            buffer.setMatrix(renderMatrix);
            buffer.setBlendMode(blendMode);
            buffer.setAlpha(1);
            buffer.drawBuffer(nodeBuffer, nodeBounds.left, nodeBounds.top);
            rectanglePool.push(nodeBounds);
        }

        /**
         * Draws the BitmapData object onto the specified render buffer. You can specify  matrix and a destination clipRect parameter to
         * control how the rendering performs.  Optionally, you can specify whether the bitmap should be smoothed when scaled
         * @param buffer The render buffer to be drawn to.
         * @param source The BitmapData object to draw to the render buffer.
         * @param matrix A Matrix object used to scale, rotate, or translate the coordinates of the BitmapData object. If
         * you do not want to apply a matrix transformation to the image, set this parameter to an identity matrix, or
         * pass a null value.
         * @param alpha A float value that you use to adjust the alpha values of the BitmapData object.
         * @param blendMode A string value, from the BlendMode class, specifying the blend mode to be applied to the
         * BitmapData object.
         * @param clipRect A Rectangle object that defines the area of the BitmapData object to draw. If you do not supply
         * this value, no clipping occurs and the entire node is drawn.
         * @param smoothing A Boolean value that determines whether a BitmapData object is smoothed when scaled or rotated,
         * due to a scaling or rotation in the matrix parameter. With smoothing set to false, the rotated or scaled
         * BitmapData object can appear pixelated or jagged.
         */
        public drawBitmapData(buffer:RenderBuffer, source:BitmapData, matrix?:Matrix, alpha:number = 1,
                              blendMode:number = 0, clipRect?:Rectangle, smoothing?:boolean):void {
            buffer.save();
            if (clipRect) {
                buffer.resetMatrix()
                buffer.clipRect(clipRect);
            }
            buffer.setSmoothing(smoothing);
            buffer.setAlpha(alpha);
            buffer.setBlendMode(blendMode);
            if (matrix) {
                buffer.setMatrix(matrix);
            }
            buffer.drawImage(source, 0, 0);
            buffer.restore();
        }


        protected renderNode(context:RenderBuffer, node:Node):void {

        }

    }
}