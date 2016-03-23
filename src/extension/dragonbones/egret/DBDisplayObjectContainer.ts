/**
 * Created by Chenguang on 2016/3/21.
 */

module dragonBones {
    /**
     * @class dragonBones.EgretSlot
     * @extends dragonBones.Slot
     * @classdesc
     * egret引擎使用的插槽
     */
    export class DBDisplayObjectContainer extends egret.DisplayObjectContainer {
        constructor() {
            super();
            this.$renderNode = new egret.sys.GroupNode();
            this.addEventListener(egret.Event.ENTER_FRAME, function(){
                this.$invalidateContentBounds();
            }, this);
        }

        //private setAlphaNodeList:Array<egret.sys.SetAlphaNode> = [];
        private bitmapNodeList:Array<egret.sys.BitmapNode> = [];

        public dbChildren:Array<egret.DisplayObject>= [];

        public dbpush(item:any):void
        {
            for(var i:number = 0; i < this.dbChildren.length; i++)
            {
                if(this.dbChildren[i] == item)
                {
                    return;
                }
            }
            this.dbChildren.push(item);
            this.$invalidateContentBounds();
        }

        public $measureContentBounds(bounds:egret.Rectangle):void{
            bounds.setTo(0,0,100,100);
        }

        public $render():void{
            var item;
            for (var i:number = 0; i < this.dbChildren.length; i++) {
                item = this.dbChildren[i];
                //var setAlphaNode:egret.sys.SetAlphaNode;
                var bitmapNode:egret.sys.BitmapNode;
                if (!this.bitmapNodeList[i]) {
                    //this.setAlphaNodeList[i] = new egret.sys.SetAlphaNode();
                    this.bitmapNodeList[i] = new egret.sys.BitmapNode();
                    //(<egret.sys.GroupNode>this.$renderNode).addNode(this.setTransformNodeList[i]);
                    //(<egret.sys.GroupNode>this.$renderNode).addNode(this.setAlphaNodeList[i]);
                    (<egret.sys.GroupNode>this.$renderNode).addNode(this.bitmapNodeList[i]);
                }
                //setAlphaNode = this.setAlphaNodeList[i];
                bitmapNode = this.bitmapNodeList[i];

                var texture = item.texture;
                bitmapNode.image = texture._bitmapData;
                bitmapNode.matrix = item.$getMatrix();
                bitmapNode.drawImage(texture._bitmapX, texture._bitmapY, texture._bitmapWidth, texture._bitmapHeight, texture._offsetX - item.$getAnchorOffsetX(), texture._offsetY - item.$getAnchorOffsetY(), texture._textureWidth, texture._textureHeight);
            }

        }
    }
}