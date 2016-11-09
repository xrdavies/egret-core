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
    export class Text extends Node {

        public constructor() {
            super();
            this.nodeType = egret.sys.NodeType.TEXT;
            this.region = new Rectangle();
        }

        /**
         * The type of the text field. Either one of the following TextFieldType constants:
         * TextFieldType.DYNAMIC, which specifies a dynamic text field, which a user cannot edit,
         * or TextFieldType.INPUT, which specifies an input text field, which a user can edit.
         * @default TextFieldType.DYNAMIC
         */
        public type:number = TextFieldType.DYNAMIC;

        /**
         * The name of the font to use, or a comma-separated list of font names.
         * @default "Arial"
         */
        public fontFamily:string = "Arial";

        /**
         * The size in pixels of text
         * @default 30
         */
        public size:number = 30;

        /**
         * Specifies whether the text is boldface.
         * @default false
         */
        public bold:boolean = false;

        /**
         * Determines whether the text is italic font.
         * @default false
         */
        public italic:boolean = false;

        /**
         * Horizontal alignment of text.
         * @default：HorizontalAlign.LEFT
         */
        public textAlign:number = HorizontalAlign.LEFT;

        /**
         * Vertical alignment of text.
         * @default：VerticalAlign.TOP
         */
        public verticalAlign:number = VerticalAlign.TOP;

        /**
         * An integer representing the amount of vertical space between lines.
         * @default 0
         */
        public lineSpacing:number = 0;

        /**
         * Color of the text.
         * @default 0x000000
         */
        public textColor:number = 0x000000;

        /**
         * A Boolean value that indicates whether the text field word wrap. If the value is true, then the text field by
         * word wrap; if the value is false, the text field by newline characters.
         * @default false
         */
        public wordWrap:boolean = false;

        /**
         * A string that is the current text in the text field. Lines are separated by the carriage return character
         * ('\r', ASCII 13).
         */
        public text:string = "";

        /**
         * Indicate the stroke width. 0 means no stroke.
         * @default 0
         */
        public stroke:number = 0;

        /**
         * The stroke color of the text.
         * @default 0x000000
         */
        public strokeColor:number = 0x000000;

        /**
         * Specifies whether the text field has a border. If true, the text field has a border. If false, the text field
         * has no border. Use the borderColor property to set the border color.
         * @default false.
         */
        public border:boolean = false;

        /**
         * The color of the text field border. This property can be retrieved or set, even if there currently is no
         * border, but the color is visible only if the text field has the border property set to true.
         * @default 0x000000
         */
        public borderColor:number = 0x000000;

        /**
         * Specifies whether the text field has a background fill. If true, the text field has a background fill. If false,
         * the text field has no background fill. Use the backgroundColor property to set the background color of a text
         * field.
         * @default false
         */
        public background:boolean = false;

        /**
         * The color of the text field background. This property can be retrieved or set, even if there currently is no
         * background, but the color is visible only if the text field has the background property set to true.
         * @default 0xFFFFFF
         */
        public backgroundColor:number = 0xFFFFFF;

        /**
         * Specify whether the text field is a password text field.
         * If the value of this property is true, the text field is treated as a password text field and hides the input
         * characters using asterisks instead of the actual characters. If false, the text field is not treated as a
         * password text field.
         * @default false
         */
        public displayAsPassword:boolean = false;

        /**
         * The maximum number of characters that the text field can contain, as entered by a user. A script can insert
         * more text than maxChars allows; the maxChars property indicates only how much text a user can enter. If the
         * value of this property is 0, a user can enter an unlimited amount of text.
         * @default 0
         */
        public maxChars:number = 0;

        /**
         * Indicates whether field is a multiline text field. If the value is true, the text field is multiline; if the
         * value is false, the text field is a single-line text field. In a field of type TextFieldType.INPUT, the
         * multiline value determines whether the Enter key creates a new line (a value of false, and the Enter key is
         * ignored). If you paste text into a TextField with a multiline value of false, newlines are stripped out
         * of the text.
         * @default false.
         */
        public multiline:boolean = false;

        /**
         * A regular expression controls the set of characters that a user can enter into the text field. If the value of
         * the pattern property is null, you can enter any character. If the value of the pattern property is an empty
         * string, you cannot enter any character. <br/>
         * The pattern is not surrounded by forward slashes.
         */
        public pattern:string = null;

        /**
         * Controls the appearance of the soft keyboard.<br/>
         * Devices with soft keyboards can customize the keyboard's buttons to match the type of input expected.
         * For example, if numeric input is expected, a device can use SoftKeyboardType.NUMBER to display only numbers
         * on the soft keyboard. Valid values are defined as constants in the SoftKeyboardType class:<br/>
         * "default"<br/>
         * "punctuation"<br/>
         * "url"<br/>
         * "number"<br/>
         * "contact"<br/>
         * "email"<br/>
         * These values serve as hints, to help a device display the best keyboard for the current operation.
         * @default SoftKeyboardType.DEFAULT
         */
        public softKeyboardType:number = SoftKeyboardType.DEFAULT;

        /**
         * The width of the text in pixels.
         */
        public textWidth:number = 0;

        /**
         * The height of the text in pixels.
         */
        public textHeight:number = 0;

        /**
         * The current horizontal scrolling position. If the scrollH property is 0, the text is not horizontally scrolled.
         * This property value is an integer that represents the horizontal position in pixels.<br/>
         * The units of horizontal scrolling are pixels, whereas the units of vertical scrolling are lines. Horizontal
         * scrolling is measured in pixels because most fonts you typically use are proportionally spaced; that is,
         * the characters can have different widths. Vertical scrolling is measured in lines because users usually want
         * to see a complete line of text rather than a partial line. Even if a line uses multiple fonts, the height of
         * the line adjusts to fit the largest font in use.
         * Note: The scrollH property is zero-based, not 1-based like the scrollV vertical scrolling property.
         */
        public scrollH:number = 0;

        /**
         * Vertical position of text in a text field. The scrollV property is useful for directing users to a specific
         * paragraph in a long passage, or creating scrolling text fields.<br/>
         * The units of vertical scrolling are lines, whereas the units of horizontal scrolling are pixels. If the first
         * line displayed is the first line in the text field, scrollV is set to 1 (not 0).<br/>
         * The units of horizontal scrolling are pixels, whereas the units of vertical scrolling are lines. Horizontal
         * scrolling is measured in pixels because most fonts you typically use are proportionally spaced; that is,
         * the characters can have different widths. Vertical scrolling is measured in lines because users usually want
         * to see a complete line of text rather than a partial line. Even if a line uses multiple fonts, the height of
         * the line adjusts to fit the largest font in use.
         */
        public scrollV:number = 1;

        /**
         * The maximum value of scrollH.
         */
        public maxScrollH:number = 0;

        /**
         * The maximum value of scrollV.
         */
        public maxScrollV:number = 1;

        /**
         * Defines the number of text lines in a multiline text field. If wordWrap property is set to true, the number of
         * lines increases when text wraps.
         */
        public numLines:number = 0;

        /**
         * The zero-based character index value of the last character in the current selection. For example, the first
         * character is 0, the second character is 1, and so on.<br/>
         * If no text is selected, this method returns the insertion point. If the TextField instance does not have focus,
         * this method returns -1.<br/>
         */
        public selectionActiveIndex:number = -1;

        /**
         * The zero-based character index value of the first character in the current selection. For example, the first
         * character is 0, the second character is 1, and so on.<br/>
         * If no text is selected, this method returns the insertion point. If the StageText instance does not have focus,
         * this method returns -1.<br/>
         */
        public selectionAnchorIndex:number = -1;
    }
}