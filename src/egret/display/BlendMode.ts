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
     * A class that provides constant values for visual blend mode effects. These constants are used in the blendMode
     * property of the DisplayObject class.
     * @see egret.DisplayObject#blendMode
     */
    export class BlendMode {
        /**
         * The display object appears in front of the background. Pixel values of the display object override the pixel
         * values of the background. Where the display object is transparent, the background is visible.
         */
        public static readonly NORMAL:string = "normal";

        /**
         * Forces the creation of a transparency group for the display object. This means that the display object is
         * precomposed in a temporary buffer before it is processed further. The precomposition is done automatically if
         * the display object is precached by means of bitmap caching or if the display object is a display object
         * container that has at least one child object with a blendMode setting other than "normal".
         */
        public static readonly LAYER:string = "layer";

        /**
         * Adds the values of the constituent colors of the display object to the colors of its background, applying a
         * ceiling of 0xFF. This setting is commonly used for animating a lightening dissolve between two objects. <br/>
         * For example, if the display object has a pixel with an RGB value of 0xAAA633, and the background pixel has an
         * RGB value of 0xDD2200, the resulting RGB value for the displayed pixel is 0xFFC833 (because 0xAA + 0xDD > 0xFF,
         * 0xA6 + 0x22 = 0xC8, and 0x33 + 0x00 = 0x33).
         */
        public static readonly ADD:string = "add";

        /**
         * Erases the background based on the alpha value of the display object. This process requires that the blendMode
         * property of the parent display object be set to BlendMode.LAYER.
         */
        public static readonly ERASE:string = "erase";

        /**
         * Selects the darker of the constituent colors of the display object and the colors of the background (the colors
         * with the smaller values). This setting is commonly used for superimposing type. <br/>
         * For example, if the display object has a pixel with an RGB value of 0xFFCC33, and the background pixel has an
         * RGB value of 0xDDF800, the resulting RGB value for the displayed pixel is 0xDDCC00 (because 0xFF > 0xDD,
         * 0xCC < 0xF8, and 0x33 > 0x00 = 33).
         */
        public static readonly DARKEN:string = "darken";

        /**
         * Compares the constituent colors of the display object with the colors of its background, and subtracts the
         * darker of the values of the two constituent colors from the lighter value. This setting is commonly used for
         * more vibrant colors. <br/>
         * For example, if the display object has a pixel with an RGB value of 0xFFCC33, and the background pixel has an
         * RGB value of 0xDDF800, the resulting RGB value for the displayed pixel is 0x222C33 (because 0xFF - 0xDD = 0x22,
         * 0xF8 - 0xCC = 0x2C, and 0x33 - 0x00 = 0x33).
         */
        public static readonly DIFFERENCE:string = "difference";

        /**
         * Adjusts the color of each pixel based on the darkness of the display object. If the display object is lighter
         * than 50% gray, the display object and background colors are screened, which results in a lighter color. If the
         * display object is darker than 50% gray, the colors are multiplied, which results in a darker color. This
         * setting is commonly used for shading effects.
         */
        public static readonly HARDLIGHT:string = "hardlight";

        /**
         * Selects the lighter of the constituent colors of the display object and the colors of the background (the
         * colors with the larger values). This setting is commonly used for superimposing type.<br/>
         * For example, if the display object has a pixel with an RGB value of 0xFFCC33, and the background pixel has an
         * RGB value of 0xDDF800, the resulting RGB value for the displayed pixel is 0xFFF833 (because 0xFF > 0xDD,
         * 0xCC < 0xF8, and 0x33 > 0x00 = 33).
         */
        public static readonly LIGHTEN:string = "lighten";

        /**
         * Multiplies the values of the display object constituent colors by the constituent colors of the background
         * color, and normalizes by dividing by 0xFF, resulting in darker colors. This setting is commonly used for
         * shadows and depth effects.<br/>
         * For example, if a constituent color (such as red) of one pixel in the display object and the corresponding
         * color of the pixel in the background both have the value 0x88, the multiplied result is 0x4840. Dividing by
         * 0xFF yields a value of 0x48 for that constituent color, which is a darker shade than the color of the display
         * object or the color of the background.
         */
        public static readonly MULTIPLY:string = "multiply";

        /**
         * Adjusts the color of each pixel based on the darkness of the background. If the background is lighter than
         * 50% gray, the display object and background colors are screened, which results in a lighter color. If the
         * background is darker than 50% gray, the colors are multiplied, which results in a darker color. This setting
         * is commonly used for shading effects.
         */
        public static readonly OVERLAY:string = "overlay";

        /**
         * Multiplies the complement (inverse) of the display object color by the complement of the background color,
         * resulting in a bleaching effect. This setting is commonly used for highlights or to remove black areas of the
         * display object.
         */
        public static readonly SCREEN:string = "screen";

        /**
         * The final color is the result of dividing the bottom color by the inverse of the top color.<br/>
         * A black foreground leads to no change. A foreground with the inverse color of the backdrop leads to a fully
         * lit color.<br/>
         * This blend mode is similar to screen, but the foreground need only be as light as the inverse of the backdrop
         * to reach a fully lit color.
         */
        public static readonly COLORDODGE:string = "colordodge";

        /**
         * This final color is the result of inverting the bottom color, dividing the value by the top color, and inverting
         * that value.<br/>
         * A white foreground leads to no change. A foreground with the inverse color of the backdrop leads to a black
         * final image.<br/>
         * This blend mode is similar to multiply, but the foreground need only be as dark as the inverse of the backdrop
         * to make the final image black.
         */
        public static readonly COLORBURN:string = "colorburn";

        /**
         * The final color is similar to hard-light, but softer. The effect is similar to shining a diffused spotlight
         * on the backdrop.
         */
        public static readonly SOFTLIGHT:string = "softlight";

        /**
         * The final color is similar to difference, but with less contrast. As with difference,  a black layer has no
         * effect, while a white layer inverts the other layer's color.
         */
        public static readonly EXCLUSION:string = "exclusion";

        /**
         * The final color has the hue of the top color, while using the saturation and luminosity of the bottom color.
         */
        public static readonly HUE:string = "hue";

        /**
         * The final color has the saturation of the top color, while using the hue and luminosity of the bottom color.
         * A pure gray backdrop, having no saturation, will have no effect.
         */
        public static readonly SATURATION:string = "saturation";

        /**
         * The final color has the hue and saturation of the top color, while using the luminosity of the bottom color.
         * The effect preserves gray levels and can be used to colorize the foreground.
         */
        public static readonly COLOR:string = "color";

        /**
         * The final color has the luminosity of the top color, while using the hue and saturation of the bottom color.
         * This blend mode is equivalent to color, but with the layers swapped.
         */
        public static readonly LUMINOSITY:string = "luminosity";
    }
}
