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
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES:string = "";LOSS OF USE, DATA,
//  OR PROFITS:string = ""; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret {

    /**
     * The StageScaleMode class provides values for the Stage.scaleMode property.
     * @see egret.Stage#scaleMode.
     */
    export class StageScaleMode {

        /**
         * Specifies that the size of the application be fixed, so that it remains unchanged even as the size of the
         * screen changes. Cropping might occur if the screen is smaller than the content.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the screen size.
         */
        public static readonly NO_SCALE:string = "noScale";

        /**
         * Specifies that the entire application be visible in the specified area without distortion while maintaining
         * the original aspect ratio of the application. Borders can appear on two sides of the application.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the content size of the
         * stage. Use the egret.Stage#setContentSize method to specify the content size of the stage.
         * @see egret.Stage#setContentSize
         */
        public static readonly SHOW_ALL:string = "showAll";

        /**
         * Specifies that the entire application fill the specified area, without distortion but possibly with some
         * cropping, while maintaining the original aspect ratio of the application.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the content size of the
         * stage. Use the egret.Stage#setContentSize method to specify the content size of the stage.
         * @see egret.Stage#setContentSize
         */
        public static readonly NO_BORDER:string = "noBorder";

        /**
         * Specifies that the entire application be visible in the specified area without trying to preserve the original
         * aspect ratio. Distortion can occur.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the content size of the
         * stage. Use the egret.Stage#setContentSize method to specify the content size of the stage.
         * @see egret.Stage#setContentSize
         */
        public static readonly EXACT_FIT:string = "exactFit";

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal
         * and vertical directions to fill the viewport player, but only to keep the contents of the original application
         * constant width, height may change.<br/>
         * In this mode, the stage width (Stage.stageWidth) is always equal to initialize external incoming application
         * content width. Stage height (Stage.stageHeight) by the current scale with the player viewport height decision.
         */
        public static readonly FIXED_WIDTH:string = "fixedWidth";

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal
         * and vertical directions to fill the viewport player, but only to keep the contents of the original application
         * constant height, width may change.<br/>
         * In this mode, the stage height (Stage.stageHeight) is always equal to initialize external incoming application
         * content height. Stage width (Stage.stageWidth) by the current scale with the player viewport width decision.
         */
        public static readonly FIXED_HEIGHT:string = "fixedHeight";


        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal
         * and vertical directions to fill the viewport player,a narrow direction may not be wide enough and fill.<br/>
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale
         * with the player viewport size.
         */
        public static readonly FIXED_NARROW:string = "fixedNarrow";

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal
         * and vertical directions to fill the viewport player, a wide direction may exceed the viewport and the player is cut.<br/>
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale
         * with the player viewport size.
         */
        public static readonly FIXED_WIDE:string = "fixedWide";
    }
}