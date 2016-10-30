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

    let tempMatrix = new Matrix();
    let tempBounds = new Rectangle();
    let rectanglePool:Rectangle[] = [];

    /**
     * @internal
     */
    export class Node {

        public type:number = NodeType.Node;

        public externalHandle:any;
        /**
         * A Matrix object containing values that alter the scaling, rotation, and translation of the display node.
         */
        public matrix:Matrix = new Matrix();

        public setMatrix(m:Matrix):void {
            this.matrix.copyFrom(m);
            this.invalidateTransform();
        }

        /**
         * Whether or not the display node is visible.
         */
        public visible:boolean = true;

        public setVisible(value:boolean):void {
            this.visible = value;
            this.invalidateTransform();
        }

        /**
         * If set to true, runtime caches an internal bitmap representation of the display node. This caching can
         * increase performance for display nodes that contain complex vector content. After you set the cacheAsBitmap
         * property to true, the rendering does not change, however the display node performs pixel snapping letmatically.
         * The execution speed can be significantly faster depending on the complexity of the content.The cacheAsBitmap
         * property is best used with display nodes that have mostly static content and that do not scale and rotate
         * frequently.<br/>
         * Note: The display node will not create the bitmap caching when the memory exceeds the upper limit, even if
         * you set it to true.
         */
        public cacheAsBitmap:boolean = false;

        public setCacheAsBitmap(value:boolean):void {
            this.cacheAsBitmap = value;
            this.updateCacheAsBitmap();
        }

        private updateCacheAsBitmap():void {
            let needDisplayList:boolean = this.cacheAsBitmap || !!(this.filters && this.filters.length) || this.blendMode === BlendMode.LAYER;
            let hasDisplayList = !!this.displayList;
            if (hasDisplayList == needDisplayList) {
                return;
            }
            let parentDisplayList = this.parentDisplayList;
            if (needDisplayList) {
                this.displayList = new DisplayList(this);
                if (parentDisplayList) {
                    this.displayList.setStageHandle(parentDisplayList.stageHandle);
                }
            } else {
                if (parentDisplayList && this.displayList.drawn) {
                    parentDisplayList.invalidateRect(this.displayList.region);
                }
                this.displayList = null;
            }
            if (this.children) {
                let parentCache = needDisplayList ? this.displayList : parentDisplayList;
                for (let child of this.children) {
                    child.setParentDisplayList(parentCache);
                }
            }
        }


        /**
         * Indicates the alpha transparency value of the node specified. Valid values are 0 (fully transparent) to 1
         * (fully opaque).
         */
        public alpha:number = 1;

        public setAlpha(value:number):void {
            this.alpha = value;
            this.invalidateTransform();
        }

        /**
         * The scroll rectangle bounds of the display node. The display node is cropped to the size defined by the rectangle,
         * and it scrolls within the rectangle when you change the x and y properties of the scrollRect object. A scrolled display
         * object always scrolls in whole pixel increments.You can scroll an object left and right by setting the x property of
         * the scrollRect Rectangle object. You can scroll an object up and down by setting the y property of the scrollRect
         * Rectangle object. If the display node is rotated 90° and you scroll it left and right, the display node actually
         * scrolls up and down.
         */
        public scrollRect:Rectangle = null;

        public setScrollRect(value:Rectangle):void {
            if (value) {
                if (!this.scrollRect) {
                    this.scrollRect = new Rectangle();
                }
                this.scrollRect.copyFrom(value);
            } else {
                this.scrollRect = null;
            }
            this.invalidateTransform();
        }

        /**
         * A value from the BlendMode class that specifies which blend mode to use. Determine how a source image (new one)
         * is drawn on the target image (old one).
         */
        public blendMode:number = BlendMode.NORMAL;

        public setBlendMode(value:number):void {
            this.blendMode = value;
            this.updateCacheAsBitmap();
            this.invalidateTransform();
        }

        public maskedObject:Node = null;
        /**
         * The calling display node is masked by the specified mask object. To ensure that masking works when the Stage
         * is scaled, the mask display node must be in an active part of the display list. The mask object itself is not drawn.
         * Set mask to null to remove the mask. To be able to scale a mask object, it must be on the display list. To be
         * able to drag a mask object , it must be on the display list. <br/>
         * Note: A single mask object cannot be used to mask more than one calling display node. When the mask is assigned
         * to a second display node, it is removed as the mask of the first object, and that object's mask property becomes null.
         */
        public mask:Node = null;

        public setMask(value:Node):void {
            if (value === this.mask || value === this) {
                return;
            }
            let oldMask = this.mask;
            if (oldMask) {
                oldMask.maskedObject = null;
                oldMask.invalidateTransform();
            }
            this.mask = value;
            if (value) {
                if (value.maskedObject) {
                    value.maskedObject.mask = null;
                }
                value.maskedObject = this;
                value.invalidateTransform();
            }
            this.invalidateTransform();
        }

        /**
         * The mask rectangle bounds of the display node. The display node is cropped to the size defined by the rectangle.
         * Different from the scrollRect object, the display node does not scroll when you change the x and y properties
         * of the maskRect object.<br/>
         * Note: The maskRect is ignored when scrollRect is not null.
         */
        public maskRect:Rectangle = null;

        public setMaskRect(value:Rectangle):void {
            if (value) {
                if (!this.maskRect) {
                    this.maskRect = new Rectangle();
                }
                this.maskRect.copyFrom(value);
            } else {
                this.maskRect = null;
            }
            this.invalidateTransform();
        }

        /**
         * An indexed array that contains each filter object currently associated with the display node. <br/>
         * To apply a filter, you must make a temporary copy of the entire filters array, modify the temporary array,
         * then assign the value of the temporary array back to the filters array. You cannot directly add a new filter
         * object to the filters array.
         */
        public filters:BitmapFilter[] = null;

        public setFilters(value:BitmapFilter[]):void {
            this.filters = value;
            if (this.displayList) {
                this.displayList.dirtyTransform = true;
            }
            this.updateCacheAsBitmap();
            this.invalidateTransform();
        }

        /**
         * Indicates the Node object that contains this Node object.
         */
        public parent:Node = null;

        public children:Node[] = null;

        public resetChildren(list:Node[]):void {
            if (!this.children) {
                this.children = [];
            }
            let parentCache = this.displayList ? this.displayList : this.parentDisplayList;
            for (let node of this.children) {
                if (parentCache) {
                    node.invalidateDrawn(parentCache);
                }
                node.parent = null;
                node.setParentDisplayList(null);
            }
            this.children = list;
            for (let node of this.children) {
                node.parent = this;
                if (parentCache) {
                    node.setParentDisplayList(parentCache);
                }
                node.invalidateTransform();
            }
        }

        public updateChildren(removedNodes:Node[], addedNodes:Node[], addedIndices:number[]):void {
            let parentCache = this.displayList ? this.displayList : this.parentDisplayList;
            let children = this.children;
            for (let node of removedNodes) {
                let index = children.indexOf(node);
                if (index != -1) {
                    children.splice(index, 1);
                }
                // If the removed node is not in the added node list, which means it is really removed.
                if (addedNodes.indexOf(node) == -1) {
                    if (parentCache) {
                        node.invalidateDrawn(parentCache);
                    }
                    node.parent = null;
                    node.setParentDisplayList(null);
                }
            }
            for (let index of addedIndices) {
                let node = addedNodes[index];
                children.splice(index, 0, node);
                //If the added node is not in the removed node list, which means it is a newly added node.
                if (removedNodes.indexOf(node) == -1) {
                    node.parent = this;
                    if (parentCache) {
                        node.setParentDisplayList(parentCache);
                    }
                }
                node.invalidateTransform();
            }
        }

        public displayList:DisplayList = null;
        public parentDisplayList:DisplayList = null;

        public setParentDisplayList(parentCache:DisplayList):void {
            this.parentDisplayList = parentCache;
            if (this.displayList) {
                if (parentCache) {
                    this.displayList.setStageHandle(parentCache.stageHandle);
                }
                return;
            }
            if (this.children) {
                for (let child of this.children) {
                    child.setParentDisplayList(parentCache);
                }
            }
        }

        /**
         * Indicates the matrix of the display node when drawn to parent display list.
         */
        public renderMatrix:Matrix = new Matrix();
        /**
         * Indicates the alpha transparency value of the display node when drawn to parent display list.
         */
        public renderAlpha:number = 1;

        /**
         * Indicates whether one of children contains a true value of dirtyContent, dirtyTransform or dirtyDescendents.
         */
        public dirtyDescendents:boolean = false;
        /**
         * Indicates whether the content of self is dirty. If this value if true, the region must be non-null.
         */
        public dirtyContent:boolean = false;
        /**
         * Indicates whether the content bounds of self is dirty.
         */
        public dirtyContentBounds:boolean = false;
        /**
         * Indicates whether the transform of self is dirty, if true, it means self and all the children, grandchildren
         * , great-grandchildren... are dirty.
         */
        public dirtyTransform:boolean = false;
        /**
         * Indicates whether the content of self is drawn to parent display list, If this value if true, the region must
         * be non-null.
         */
        public drawn:boolean = false;


        /**
         * Marks the content of self is dirty, and propagates dirty descendents flags up the display list. Propagation
         * stops if the flag is already set.
         */
        public invalidateContent():void {
            this.dirtyContentBounds = this.dirtyContent = true;
            let p = this.parent;
            while (p && !p.dirtyDescendents) {
                p.dirtyDescendents = true;
                p = p.parent;
            }
        }

        /**
         * Marks the transform of self is dirty, and propagates dirty descendents flags up the display list. Propagation
         * stops if the flag is already set.
         */
        public invalidateTransform():void {
            this.dirtyTransform = true;
            let p = this.parent;
            while (p && !p.dirtyDescendents) {
                p.dirtyDescendents = true;
                p = p.parent;
            }
        }

        public region:Rectangle = null;

        /**
         * Merges all the regions of the node and its children to the specified Rectangle.
         */
        public mergeRegions(bounds:Rectangle):void {
            if (this.region) {
                bounds.merge(this.region);
            }
            if (this.children) {
                for (let child of this.children) {
                    child.mergeRegions(bounds);
                }
            }
        }

        /**
         * Returns a matrix that represents the combination of the matrix and the offset of the scrollRect.
         */
        public getMatrixWithScrollOffset():Matrix {
            if (this.scrollRect) {
                let scrollRect = this.scrollRect;
                let m = tempMatrix.copyFrom(this.matrix);
                m.tx -= scrollRect.left * m.a + scrollRect.top * m.c;
                m.ty -= scrollRect.left * m.b + scrollRect.top * m.d;
                return m;
            }
            return this.matrix;
        }

        /**
         * Gets a matrix that represents the combined transformation matrixes of the display node and all of its parent
         * objects, back to the root level.
         */
        public getConcatenatedMatrix(result:Matrix):void {
            result.copyFrom(this.getMatrixWithScrollOffset());
            let parent = this.parent;
            while (parent) {
                result.concat(parent.getMatrixWithScrollOffset());
                parent = parent.parent;
            }
        }

        private contentBounds:Rectangle = new Rectangle();

        /**
         * Measures the content bounds of the node.
         */
        protected measureContentBounds(bounds:Rectangle):void {
            bounds.setEmpty();
        }

        /**
         * Measure the bounds of the node, includes the contentBounds and the bouds of child nodes.
         */
        public measureBounds(bounds:Rectangle):void {
            if (this.dirtyContentBounds) {
                this.measureContentBounds(this.contentBounds);
                this.dirtyContentBounds = false;
            }
            bounds.copyFrom(this.contentBounds);
            let children = this.children;
            if (children && children.length) {
                let childBounds = rectanglePool.length ? rectanglePool.pop() : new Rectangle();
                for (let child of children) {
                    child.measureBounds(childBounds);
                    if (childBounds.isEmpty()) {
                        continue;
                    }
                    child.getMatrixWithScrollOffset().transformBounds(childBounds);
                    bounds.merge(childBounds);
                }
                rectanglePool.push(childBounds);
            }
        }

        /**
         * Invalidate all the child nodes with a drawn property of true.
         */
        private invalidateDrawn(parentCache:DisplayList):void {
            let displayList = this.displayList;
            if (displayList) {
                if (displayList.drawn) {
                    parentCache.invalidateRect(displayList.region);
                    displayList.drawn = false;
                }
                return;
            }
            if (this.drawn) {
                parentCache.invalidateRect(this.region);
                this.drawn = false;
            }
            if (this.children) {
                for (let child of this.children) {
                    child.invalidateDrawn(parentCache);
                }
            }
        }

        /**
         * Updates the concatenatedMatrix and concatenatedAlpha properties, and caculates dirty regions.
         */
        public update(forceDirtyTransform?:boolean, clipRegion?:Rectangle):void {
            if (this.dirtyContent || (forceDirtyTransform && this.region)) {
                let region = this.region;
                let parentCache = this.displayList ? this.displayList : this.parentDisplayList;
                if (this.drawn) {
                    parentCache.invalidateRect(region);
                    this.drawn = false;
                }
                if (this.dirtyContentBounds) {
                    this.measureContentBounds(this.contentBounds);
                    this.dirtyContentBounds = false;
                }
                region.copyFrom(this.contentBounds);
                this.renderMatrix.transformBounds(region);
                if (clipRegion) {
                    region.intersect(clipRegion);
                }
                parentCache.invalidateRect(region);
                this.dirtyContent = false;
            }
            if (this.dirtyDescendents || (forceDirtyTransform && this.children)) {
                this.dirtyDescendents = false;
                for (let child of this.children) {
                    let childDirtyTransform = forceDirtyTransform || child.dirtyTransform;
                    let childDisplayList = child.displayList;
                    if (childDirtyTransform) {
                        child.dirtyTransform = false;
                        child.renderAlpha = this.renderAlpha * child.alpha;
                        let childRenderMatrix:Matrix;
                        if (childDisplayList) {
                            childDisplayList.updateRenderAlpha();
                            childRenderMatrix = childDisplayList.renderMatrix;
                        } else {
                            childRenderMatrix = child.renderMatrix;
                        }
                        child.getMatrixWithScrollOffset().concatInto(this.renderMatrix, childRenderMatrix);
                    }

                    let clipRect = child.scrollRect ? child.scrollRect : child.maskRect;
                    if (clipRect) {
                        let childRenderMatrix = childDisplayList ?
                            childDisplayList.renderMatrix : child.renderMatrix;
                        childRenderMatrix.transformBounds(clipRect);
                        if (clipRegion) {
                            clipRect = clipRect.clone();
                            clipRect.intersect(clipRegion);
                        }
                        if (childDisplayList) {
                            childDisplayList.update(childDirtyTransform, clipRect);
                        } else {
                            child.update(childDirtyTransform, clipRect);
                        }
                    } else {
                        if (childDisplayList) {
                            childDisplayList.update(childDirtyTransform, clipRegion);
                        } else {
                            child.update(childDirtyTransform, clipRegion);
                        }
                    }
                }
            }
        }

    }
}