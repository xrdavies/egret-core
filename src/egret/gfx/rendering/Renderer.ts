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
    let rectanglePool:Rectangle[] = [];
    let pointPool:Point[] = [];

    /**
     * @private
     */
    function setMatrixWithOffset(context:RenderContext, m:Matrix, offset?:Point):void {
        if (offset) {
            context.setTransform(m.a, m.b, m.c, m.d, m.tx + offset.x, m.ty + offset.y);
        }
        else {
            context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        }
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
         * Draws the node and all its children onto the specified render context. This method updates the drawn property of the
         * display node after drawing.
         * @param context The render context to be drawn to.
         * @param node The node to draw to the render context.
         * @param clipRegion A Rectangle object that defines the area of the node to draw.
         * @param offset A Point object used to translate the coordinates of the node.
         */
        public render(context:RenderContext, node:Node, clipRegion:Rectangle, offset?:Point):void {
            this.renderNodeTree(context, node, clipRegion, offset);
        }

        private renderNodeTree(context:RenderContext, node:Node, clipRegion:Rectangle, offset?:Point):void {
            if (node.region) {
                if (!clipRegion || clipRegion.intersects(node.region)) {
                    setMatrixWithOffset(context, node.renderMatrix, offset);
                    context.globalAlpha = node.renderAlpha;
                    this.renderNode(context, node);
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
                    this.renderNodeTreeComplex(context, child, clipRegion, offset);
                } else {
                    let clipRect = child.scrollRect ? child.scrollRect : child.maskRect;
                    if (clipRect) {
                        if (clipRect.isEmpty()) {
                            continue;
                        }
                        setMatrixWithOffset(context, child.renderMatrix, offset);
                        context.clipRect(clipRect.left, clipRect.top, clipRect.width(), clipRect.height());

                    }
                    if (child.displayList) {
                        child.displayList.renderCheck(context, clipRegion, offset);
                    } else {
                        this.renderNodeTree(context, child, clipRegion, offset);
                    }
                    if (clipRect) {
                        context.restore();
                    }
                }
            }
        }

        private renderNodeTreeComplex(context:RenderContext, node:Node, clipRegion:Rectangle, offset?:Point):void {
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
            let nodeSurface = context.surface.makeSurface(nodeBounds.width(), nodeBounds.height(), true);
            let nodeContext = nodeSurface.context;
            // maskRect is ignored if scrollRect is not null.
            let clipRect = node.scrollRect ? node.scrollRect : node.maskRect;
            if (clipRect) {
                if (clipRect.isEmpty()) {
                    return;
                }
                nodeContext.save();
                setMatrixWithOffset(nodeContext, node.renderMatrix, offsetPoint);
                nodeContext.clipRect(clipRect.left, clipRect.top, clipRect.width(), clipRect.height());
            }
            if (node.displayList) {
                node.displayList.renderCheck(nodeContext, nodeBounds, offsetPoint);
            } else {
                this.renderNodeTree(nodeContext, node, nodeBounds, offsetPoint);
            }

            if (clipRect) {
                nodeContext.restore();
            }

            if (mask) {
                let maskSurface = context.surface.makeSurface(nodeBounds.width(), nodeBounds.height(), true);
                let maskContext = maskSurface.context;
                if (mask.displayList) {
                    mask.displayList.renderCheck(maskContext, nodeBounds, offsetPoint);
                } else {
                    this.renderNodeTree(maskContext, mask, nodeBounds, offsetPoint);
                }
                nodeContext.setTransform(1, 0, 0, 1, 0, 1);
                nodeContext.setBlendMode(BlendMode.MASK);
                nodeContext.globalAlpha = 1;
                maskSurface.drawTo(nodeContext, 0, 0);
            }

            offsetMatrix.tx = nodeBounds.left;
            offsetMatrix.ty = nodeBounds.top;
            setMatrixWithOffset(context, offsetMatrix, offset);
            context.setBlendMode(node.blendMode);
            context.globalAlpha = 1;
            nodeSurface.drawTo(context, 0, 0);

            rectanglePool.push(nodeBounds);
            if (offsetPoint) {
                pointPool.push(offsetPoint);
            }
        }

        /**
         * Draws the BitmapData object onto the specified render context. You can specify  matrix and a destination clipRect parameter to
         * control how the rendering performs.  Optionally, you can specify whether the bitmap should be smoothed when scaled
         * @param context The render context to be drawn to.
         * @param source The BitmapData object to draw to the render context.
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
        public drawBitmapData(context:RenderContext, source:BitmapData, matrix?:Matrix, alpha:number = 1,
                              blendMode:number = 0, clipRect?:Rectangle, smoothing?:boolean):void {
        }

        /**
         * Draws the node and all its children onto the specified render context. You can specify  matrix and a destination
         * clipRect parameter to control how the rendering performs.
         * @param context The render context to be drawn to.
         * @param node The node to draw to the render context.
         * @param matrix A Matrix object used to scale, rotate, or translate the coordinates of the node. If you do not
         * want to apply a matrix transformation to the image, set this parameter to an identity matrix, or pass a null
         * value.
         * @param alpha A float value that you use to adjust the alpha values of the node.
         * @param blendMode A string value, from the BlendMode class, specifying the blend mode to be applied to the node.
         * @param clipRect A Rectangle object that defines the area of the node to draw. If you do not supply this value,
         * no clipping occurs and the entire node is drawn.
         */
        public draw(context:RenderContext, node:Node, matrix?:Matrix, alpha:number = 1,
                    blendMode:number = 0, clipRect?:Rectangle):void {

        }


        private drawNodeTree(context:RenderContext, node:Node, renderMatrix:Matrix, renderAlpha:number):void {

        }

        private drawNodeTreeComplex(context:RenderContext, node:Node, renderMatrix:Matrix, renderAlpha:number,
                                    blendMode:number = 0, clipRect?:Rectangle, mask?:Node):void {

        }


        protected renderNode(context:RenderContext, node:Node):void {

        }

    }
}