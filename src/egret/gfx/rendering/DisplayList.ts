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
    let tempRect = new Rectangle();
    let tempPoint = new Point();
    let regionPool:Rectangle[] = [];

    /**
     * @private
     */
    function unionArea(r1:Rectangle, r2:Rectangle):number {
        let left = r1.left < r2.left ? r1.left : r2.left;
        let top = r1.top < r2.top ? r1.top : r2.top;
        let right = r1.right > r2.right ? r1.right : r2.right;
        let bottom = r1.bottom > r2.bottom ? r1.bottom : r2.bottom;
        return (right - left) * (bottom - top);
    }


    /**
     * @internal
     */
    export class DisplayList {
        public constructor(root:Node) {
            this.root = root;
            root.renderMatrix.identity();
        }

        private root:Node;
        public buffer:RenderBuffer = null;
        public drawn:boolean = false;
        public stageHandle:any = null;

        public setStageHandle(handle:any):void {
            if (handle === this.stageHandle) {
                return;
            }
            this.stageHandle = handle;
            this.resetSurface();
            this.updateStageHandle(this.root, handle);
        }

        public resetSurface():void {
            if (this.buffer) {
                this.buffer.resize(0, 0);
                this.buffer = null;
                this.dirtyTransform = true;
                this.root.invalidateTransform();
            }
        }

        private updateStageHandle(node:Node, handle:any):void {
            let children = node.children;
            if (children) {
                for (let child of children) {
                    if (child.displayList) {
                        child.displayList.setStageHandle(handle);
                    }
                    else {
                        this.updateStageHandle(child, handle);
                    }
                }
            }
        }


        private ignoreDirtyRect:boolean = false;
        private dirtyList:Rectangle[] = [];
        private clipRegion:Rectangle = null;

        public setClipRegion(rect:Rectangle):void {
            this.clipRegion = rect;
            this.bounds.copyFrom(rect);
        }

        /**
         * Marks an area as dirty.
         */
        public invalidateRect(rect:Rectangle):void {
            if (this.ignoreDirtyRect || rect.isEmpty()) {
                return;
            }
            let region = regionPool.pop() || new Rectangle();
            region.copyFrom(rect);
            this.dirtyList.push(region);
            this.mergeDirtyList(this.dirtyList.length > 3);

        }

        private mergeDirtyList(forceMerge?:boolean):boolean {
            let dirtyList = this.dirtyList;
            let length = dirtyList.length;
            if (length < 2) {
                return false;
            }
            let bestDelta = forceMerge ? 0x7FFFFFFF : 0;
            let mergeA = 0;
            let mergeB = 0;
            let delta = 0;
            let totalArea = 0;
            for (let i = 0; i < length - 1; i++) {
                let regionA = dirtyList[i];
                let areaA = (regionA.right - regionA.left) * (regionA.bottom - regionA.top); // inline the area()
                totalArea += areaA;
                for (let j = i + 1; j < length; j++) {
                    let regionB = dirtyList[j];
                    let areaB = (regionB.right - regionB.left) * (regionB.bottom - regionB.top); // inline the area()
                    delta = unionArea(regionA, regionB) - areaA - areaB;
                    if (delta < bestDelta) {
                        mergeA = i;
                        mergeB = j;
                        bestDelta = delta;
                    }
                }
            }
            if (mergeA !== mergeB) {
                let regionB = dirtyList[mergeB];
                dirtyList[mergeA].merge(regionB);
                dirtyList.splice(mergeB, 1);
                regionPool.push(regionB);
                totalArea += bestDelta;
            }
            if (totalArea / this.boundsArea > 0.95) {
                this.ignoreDirtyRect = true;
            }
            return mergeA !== mergeB;
        }

        private clearDirtyList():void {
            for (let region of this.dirtyList) {
                regionPool.push(region);
            }
            this.dirtyList.length = 0;
        }

        public region:Rectangle = new Rectangle();
        public dirtyTransform:boolean = true;
        public renderMatrix:Matrix = new Matrix();
        private offsetPoint:Point = null;
        private bounds:Rectangle = new Rectangle();
        private boundsArea:number = 0;

        /**
         * Updates the concatenatedMatrix and concatenatedAlpha properties, and caculates dirty regions.
         */
        public update(forceDirtyTransform?:boolean, clipRegion?:Rectangle):boolean {
            let root = this.root;
            let dirtyContent = (this.dirtyTransform || root.dirtyContent || root.dirtyDescendents);
            if (dirtyContent) {
                this.ignoreDirtyRect = this.dirtyTransform || this.ignoreDirtyRect;
                root.update(this.dirtyTransform, this.clipRegion);
                this.dirtyTransform = false;
                if(!this.clipRegion){
                    this.updateBounds();
                }
                if (this.ignoreDirtyRect) {
                    this.clearDirtyList();
                    let region = regionPool.pop() || new Rectangle();
                    region.copyFrom(this.bounds);
                    this.dirtyList.push(region);
                    this.ignoreDirtyRect = false;
                }
                else {
                    while (this.mergeDirtyList(this.dirtyList.length > 3)) {

                    }
                }
            }
            let parentDisplayList = root.parentDisplayList;
            if (parentDisplayList && (forceDirtyTransform || dirtyContent)) {
                this.drawn = false;
                let region = this.region;
                region.copyFrom(this.bounds);
                let renderMatrix = this.renderMatrix;
                renderMatrix.transformBounds(region);
                if (clipRegion) {
                    region.intersect(clipRegion);
                }
                for (let dirtyRect of this.dirtyList) {
                    tempRect.copyFrom(dirtyRect);
                    renderMatrix.transformBounds(tempRect);
                    parentDisplayList.invalidateRect(tempRect);
                }
            }
            return dirtyContent;
        }

        private updateBounds():void {
            let bounds = this.bounds;
            this.root.mergeRegions(tempRect);
            if (tempRect.equals(bounds)) {
                return;
            }
            let oldLeft = bounds.left;
            let oldTop = bounds.top;
            bounds.copyFrom(tempRect);
            if (bounds.left !== 0 || bounds.top !== 0) {
                this.offsetPoint = new Point(-bounds.left, -bounds.top);
            }
            else {
                this.offsetPoint = null;
            }
            if (this.buffer) {
                this.buffer.resize(bounds.width(), bounds.height(), tempPoint.setTo(oldLeft - bounds.left, oldTop - bounds.top));
            }
        }

        private lastRenderAlpha:number = 1;

        public updateRenderAlpha():void {
            if (this.lastRenderAlpha != this.root.renderAlpha) {
                this.lastRenderAlpha = this.root.renderAlpha;
                this.dirtyTransform = true;
            }
        }

        /**
         * Checks whether the display list need to call the render method. If yes, apply the renderMatrix and renderAlpha
         * then call the render method.
         */
        public renderCheck(buffer:RenderBuffer, clipRegion:Rectangle, offset?:Point):void {
            if (!clipRegion || clipRegion.intersects(this.region)) {
                let renderMatrix = this.renderMatrix;
                if (offset) {
                    renderMatrix = tempMatrix.copyFrom(renderMatrix);
                    renderMatrix.tx += offset.x;
                    renderMatrix.ty += offset.y;
                }
                buffer.setMatrix(renderMatrix);
                buffer.setAlpha(1);
                this.render(buffer);
                this.drawn = true;
            }
        }

        public drawToBuffer():void {
            let displayBuffer = this.buffer;
            let offset = this.offsetPoint;
            if (this.dirtyList.length > 0) {
                let root = this.root;
                for (let rect of this.dirtyList) {
                    displayBuffer.save();
                    displayBuffer.resetMatrix();
                    if (offset) {
                        displayBuffer.translate(offset.x, offset.y);
                    }
                    displayBuffer.clearRect(rect);
                    displayBuffer.clipRect(rect);
                    systemRenderer.render(displayBuffer, root, rect, offset);
                    displayBuffer.restore();
                }
                this.clearDirtyList();
            }
        }

        /**
         * Draws the content to the specified render buffer.
         */
        public render(buffer:RenderBuffer):void {
            let bounds = this.bounds;
            if (!this.buffer) {
                this.buffer = buffer.makeRenderBuffer(bounds.width(), bounds.height())
            }
            this.drawToBuffer();
            buffer.setSmoothing(true);
            buffer.drawBuffer(this.buffer, bounds.left, bounds.top);
        }

    }
}