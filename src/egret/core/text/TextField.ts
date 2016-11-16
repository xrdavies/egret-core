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

namespace egret {

    /**
     * The TextField class is used to create display objects for text display and input.The methods of the TextField class
     * let you set, select, and manipulate text in a dynamic or input text field that you create at runtime.<br/>
     */
    export class TextField extends DisplayObject {

        /**
         * Creates a new TextField object.
         */
        public constructor() {
            super();
            this.$nodeType = sys.NodeType.TEXT;
        }

        /**
         * @internal
         */
        $textFieldBits:number = 0;

        /**
         * @internal
         */
        $type:string = TextFieldType.DYNAMIC;

        /**
         * The type of the text field. Either one of the following TextFieldType constants:
         * TextFieldType.DYNAMIC, which specifies a dynamic text field, which a user cannot edit,
         * or TextFieldType.INPUT, which specifies an input text field, which a user can edit.
         * @default TextFieldType.DYNAMIC
         */
        public get type():string {
            return this.$type;
        }

        public set type(value:string) {
            this.setType(value);
        }

        protected setType(value:string):void {
            if (this.$type == value) {
                return;
            }
            this.$type = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyType;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $fontFamily:string = "Arial";

        /**
         * The name of the font to use, or a comma-separated list of font names.
         * @default "Arial"
         */
        public get fontFamily():string {
            return this.$fontFamily;
        }

        public set fontFamily(value:string) {
            this.setFontFamily(value);
        }

        protected setFontFamily(value:string):void {
            if (this.$fontFamily == value) {
                return;
            }
            this.$fontFamily = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyFontFamily;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $size:number = 30;

        /**
         * The size in pixels of text
         * @default 30
         */
        public get size():number {
            return this.$size;
        }

        public set size(value:number) {
            this.setSize(value);
        }

        protected setSize(value:number):void {
            value = +value || 0;
            if (this.$size == value) {
                return;
            }
            this.$size = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtySize;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $bold:boolean = false;

        /**
         * Specifies whether the text is boldface.
         * @default false
         */
        public get bold():boolean {
            return this.$bold;
        }

        public set bold(value:boolean) {
            this.setBold(value);
        }

        protected setBold(value:boolean):void {
            value = !!value;
            if (value == this.$bold) {
                return;
            }
            this.$bold = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyBold;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $italic:boolean = false;

        /**
         * Determines whether the text is italic font.
         * @default false
         */
        public get italic():boolean {
            return this.$italic;
        }

        public set italic(value:boolean) {
            this.setItalic(value);
        }

        protected setItalic(value:boolean):void {
            value = !!value;
            if (value == this.$italic) {
                return;
            }
            this.$italic = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyItalic;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $textAlign:string = HorizontalAlign.LEFT;

        /**
         * Horizontal alignment of text.
         * @default：HorizontalAlign.LEFT
         */
        public get textAlign():string {
            return this.$textAlign;
        }

        public set textAlign(value:string) {
            this.setTextAlign(value);
        }

        protected setTextAlign(value:string):void {
            if (this.$textAlign == value) {
                return;
            }
            this.$textAlign = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyTextAlign;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $verticalAlign:string = VerticalAlign.TOP;

        /**
         * Vertical alignment of text.
         * @default：VerticalAlign.TOP
         */
        public get verticalAlign():string {
            return this.$verticalAlign;
        }

        public set verticalAlign(value:string) {
            this.setVerticalAlign(value);
        }

        protected setVerticalAlign(value:string):void {
            if (this.$verticalAlign == value) {
                return;
            }
            this.$verticalAlign = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyVerticalAlign;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $lineSpacing:number = 0;

        /**
         * An integer representing the amount of vertical space between lines.
         * @default 0
         */
        public get lineSpacing():number {
            return this.$lineSpacing;
        }

        public set lineSpacing(value:number) {
            this.setLineSpacing(value);
        }

        protected setLineSpacing(value:number):void {
            value = +value || 0;
            if (this.$lineSpacing == value) {
                return;
            }
            this.$lineSpacing = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyLineSpacing;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $textColor:number = 0x000000;

        /**
         * Color of the text.
         * @default 0x000000
         */
        public get textColor():number {
            return this.$textColor;
        }

        public set textColor(value:number) {
            this.setTextColor(value);
        }

        protected setTextColor(value:number):void {
            value = +value >>> 0;
            if (this.$textColor == value) {
                return;
            }
            this.$textColor = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyTextColor;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $wordWrap:boolean = false;

        /**
         * A Boolean value that indicates whether the text field word wrap. If the value is true, then the text field by
         * word wrap; if the value is false, the text field by newline characters.
         * @default false
         */
        public get wordWrap():boolean {
            return this.$wordWrap;
        }

        public set wordWrap(value:boolean) {
            this.setWordWrap(value);
        }

        protected setWordWrap(value:boolean):void {
            value = !!value;
            if (value == this.$wordWrap) {
                return;
            }
            this.$wordWrap = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyWordWrap;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $text:string = "";

        /**
         * A string that is the current text in the text field. Lines are separated by the carriage return character
         * ('\r', ASCII 13).
         */
        public get text():string {
            return this.$text;
        }

        public set text(value:string) {
            this.setText(value);
        }

        protected setText(value:string):void {
            if (this.$text == value) {
                return;
            }
            this.$text = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyText;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $stroke:number = 0;

        /**
         * Indicate the stroke width.
         * 0 means no stroke.
         * @default 0
         */
        public get stroke():number {
            return this.$stroke;
        }

        public set stroke(value:number) {
            this.setStroke(value);
        }

        protected setStroke(value:number):void {
            value = +value || 0;
            if (this.$stroke == value) {
                return;
            }
            this.$stroke = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyStroke;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $strokeColor:number = 0x000000;

        /**
         * The stroke color of the text.
         * @default 0x000000
         */
        public get strokeColor():number {
            return this.$strokeColor;
        }

        public set strokeColor(value:number) {
            this.setStrokeColor(value);
        }

        protected setStrokeColor(value:number):void {
            value = +value >>> 0;
            if (this.$strokeColor == value) {
                return;
            }
            this.$strokeColor = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyStrokeColor;
            this.$invalidate();
        }


        /**
         * @internal
         */
        $border:boolean = false;

        /**
         * Specifies whether the text field has a border. If true, the text field has a border. If false, the text field
         * has no border. Use the borderColor property to set the border color.
         * @default false.
         */
        public get border():boolean {
            return this.$border;
        }

        public set border(value:boolean) {
            this.setBorder(value);
        }

        protected setBorder(value:boolean):void {
            value = !!value;
            if (value == this.$border) {
                return;
            }
            this.$border = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyBorder;
            this.$invalidateContentBounds();
        }

        /**
         * @internal
         */
        $borderColor:number = 0x000000;

        /**
         * The color of the text field border. This property can be retrieved or set, even if there currently is no
         * border, but the color is visible only if the text field has the border property set to true.
         * @default 0x000000
         */
        public get borderColor():number {
            return this.$borderColor;
        }

        public set borderColor(value:number) {
            this.setBorderColor(value);
        }

        protected setBorderColor(value:number):void {
            value = +value >>> 0;
            if (value == this.$borderColor) {
                return;
            }
            this.$borderColor = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyBorderColor;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $background:boolean = false;

        /**
         * Specifies whether the text field has a background fill. If true, the text field has a background fill. If false,
         * the text field has no background fill. Use the backgroundColor property to set the background color of a text
         * field.
         * @default false
         */
        public get background():boolean {
            return this.$background;
        }

        public set background(value:boolean) {
            this.setBackground(value);
        }

        protected setBackground(value:boolean):void {
            value = !!value;
            if (value == this.$background) {
                return;
            }
            this.$background = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyBackground;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $backgroundColor:number = 0xFFFFFF;

        /**
         * The color of the text field background. This property can be retrieved or set, even if there currently is no
         * background, but the color is visible only if the text field has the background property set to true.
         * @default 0xFFFFFF
         */
        public get backgroundColor():number {
            return this.$backgroundColor;
        }

        public set backgroundColor(value:number) {
            this.setBackgroundColor(value);
        }

        protected setBackgroundColor(value:number):void {
            value = +value >>> 0;
            if (value == this.$backgroundColor) {
                return;
            }
            this.$backgroundColor = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyBackgroundColor;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $displayAsPassword:boolean = false;

        /**
         * Specify whether the text field is a password text field.
         * If the value of this property is true, the text field is treated as a password text field and hides the input
         * characters using asterisks instead of the actual characters. If false, the text field is not treated as a
         * password text field.
         * @default false
         */
        public get displayAsPassword():boolean {
            return this.$displayAsPassword;
        }

        public set displayAsPassword(value:boolean) {
            this.setDisplayAsPassword(value);
        }

        protected setDisplayAsPassword(value:boolean):void {
            value = !!value;
            if (this.$displayAsPassword == value) {
                return;
            }
            this.$displayAsPassword = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyDisplayAsPassword;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $maxChars:number = 0;

        /**
         * The maximum number of characters that the text field can contain, as entered by a user. A script can insert
         * more text than maxChars allows; the maxChars property indicates only how much text a user can enter. If the
         * value of this property is 0, a user can enter an unlimited amount of text.
         * @default 0
         */
        public get maxChars():number {
            return this.$maxChars;
        }

        public set maxChars(value:number) {
            this.setMaxChars(value);
        }

        protected setMaxChars(value:number):void {
            value = +value || 0;
            if (this.$maxChars == value) {
                return;
            }
            this.$maxChars = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyMaxChars;
            this.$invalidate();
        }


        /**
         * @internal
         */
        $multiline:boolean = false;

        /**
         * Indicates whether field is a multiline text field. If the value is true, the text field is multiline; if the
         * value is false, the text field is a single-line text field. In a field of type TextFieldType.INPUT, the
         * multiline value determines whether the Enter key creates a new line (a value of false, and the Enter key is
         * ignored). If you paste text into a TextField with a multiline value of false, newlines are stripped out
         * of the text.
         * @default false.
         */
        public get multiline():boolean {
            return this.$multiline;
        }

        public set multiline(value:boolean) {
            this.setMultiline(value);
        }

        protected setMultiline(value:boolean):void {
            value = !!value;
            if (value == this.$multiline) {
                return;
            }
            this.$multiline = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyMultiline;
            this.$invalidate();
        }

        /**
         * @internal
         * A regular expression controls the set of characters that a user can enter into the text field. If the value of
         * the pattern property is null, you can enter any character. If the value of the pattern property is an empty
         * string, you cannot enter any character. <br/>
         * The pattern is not surrounded by forward slashes.
         */
        $pattern:string = null;

        /**
         * Indicates the set of characters that a user can enter into the text field. If the value of the restrict property
         * is null, you can enter any character. If the value of the restrict property is an empty string, you cannot enter
         * any character. If the value of the restrict property is a string of characters, you can enter only characters
         * in the string into the text field. The string is scanned from left to right. You can specify a range by using
         * the hyphen (-) character. Only user interaction is restricted; a script can put any text into the text field.<br/>
         * If the string begins with a caret (^) character, all characters are initially accepted and succeeding characters
         * in the string are excluded from the set of accepted characters. If the string does not begin with a caret (^)
         * character, no characters are initially accepted and succeeding characters in the string are included in the
         * set of accepted characters.<br/>
         * The following example allows only uppercase characters, spaces, and numbers to be entered into a text field:<br/>
         *
         * my_txt.restrict = "A-Z 0-9";<br/>
         *
         * The following example includes all characters, but excludes lowercase letters:<br/>
         *
         * my_txt.restrict = "^a-z";<br/>
         *
         * You can use a backslash to enter a ^ or - verbatim. The accepted backslash sequences are \-, \^ or \\. The
         * backslash must be an actual character in the string, so when specified in ActionScript, a double backslash
         * must be used. For example, the following code includes only the dash (-) and caret (^):<br/>
         *
         * my_txt.restrict = "\\-\\^";<br/>
         *
         * The ^ can be used anywhere in the string to toggle between including characters and excluding characters. The
         * following code includes only uppercase letters, but excludes the uppercase letter Q:<br/>
         *
         * my_txt.restrict = "A-Z^Q";<br/>
         *
         * You can use the \u escape sequence to construct restrict strings. The following code includes only the
         * characters from ASCII 32 (space) to ASCII 126 (tilde).<br/>
         *
         * my_txt.restrict = "\u0020-\u007E";<br/>
         *
         * @default null.
         */
        public get restrict():string {
            return this.$pattern;
        }

        public set restrict(value:string) {
            this.setRestrict(value);
        }

        protected setRestrict(value:string):void {
            if (value == this.$pattern) {
                return;
            }
            this.$pattern = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtyPattern;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $softKeyboardType:string = SoftKeyboardType.DEFAULT;

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
        public get softKeyboardType():string {
            return this.$softKeyboardType;
        }

        public set softKeyboardType(value:string) {
            this.setSoftKeyboardType(value);
        }

        protected setSoftKeyboardType(value:string):void {
            if (this.$softKeyboardType == value) {
                return;
            }
            this.$softKeyboardType = value;
            this.$textFieldBits |= sys.TextFieldBits.DirtySoftKeyboardType;
            this.$invalidate();
        }

        /**
         * @internal
         */
        $textWidth:number = 0;

        /**
         * The width of the text in pixels.
         */
        public get textWidth():number {
            return this.$textWidth;
        }

        /**
         * @internal
         */
        $textHeight:number = 0;

        /**
         * The height of the text in pixels.
         */
        public get textHeight():number {
            return this.$textHeight;
        }

        /**
         * @internal
         */
        $scrollH:number = 0;

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
        public get scrollH():number {
            return this.$scrollH;
        }

        public set scrollH(value:number) {
            this.setScrollH(value);
        }

        protected setScrollH(value:number):void {
            value = +value | 0;
            if (value == this.$scrollH) {
                return;
            }
            this.$scrollH = value;
        }


        /**
         * @internal
         */
        $scrollV:number = 1;

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
        public get scrollV():number {
            return this.$scrollV;
        }

        public set scrollV(value:number) {
            this.setScrollV(value);
        }

        protected setScrollV(value:number) {
            value = +value | 0;
            if (value == this.$scrollV) {
                return;
            }
            this.$scrollV = value;
        }

        /**
         * @internal
         */
        $maxScrollH:number = 0;

        /**
         * The maximum value of scrollH.
         */
        public get maxScrollH():number {
            return this.$maxScrollH;
        }

        /**
         * @internal
         */
        $maxScrollV:number = 1;

        /**
         * The maximum value of scrollV.
         */
        public get maxScrollV():number {
            return this.$maxScrollV;
        }

        /**
         * @internal
         */
        $numLines:number = 0;

        /**
         * Defines the number of text lines in a multiline text field. If wordWrap property is set to true, the number of
         * lines increases when text wraps.
         */
        public get numLines():number {
            return this.$numLines;
        }

        /**
         * @internal
         */
        $selectionActiveIndex:number = -1;

        /**
         * The zero-based character index value of the last character in the current selection. For example, the first
         * character is 0, the second character is 1, and so on.<br/>
         * If no text is selected, this method returns the insertion point. If the TextField instance does not have focus,
         * this method returns -1.<br/>
         */
        public get selectionActiveIndex():number {
            return this.$selectionActiveIndex;
        }

        /**
         * @internal
         */
        $selectionAnchorIndex:number = -1;

        /**
         * The zero-based character index value of the first character in the current selection. For example, the first
         * character is 0, the second character is 1, and so on.<br/>
         * If no text is selected, this method returns the insertion point. If the StageText instance does not have focus,
         * this method returns -1.<br/>
         */
        public get selectionAnchorIndex():number {
            return this.$selectionAnchorIndex;
        }

        /**
         * Appends the string specified by the newText parameter to the end of the text of the text field. This method is
         * more efficient than an addition assignment (+=) on a text property (such as someTextField.text += moreText),
         * particularly for a text field that contains a significant amount of content.
         * @param text The string to append to the existing text.
         */
        public appendText(text:string):void {

        }

        /**
         * Selects the text specified by the index values of the first and last characters. You specify the first and last
         * characters of the selection in the anchorIndex and activeIndex parameters. If both parameter values are the same,
         * this method sets the insertion point.<br/>
         * For some devices or operating systems, the selection is only visible when the StageText object has focus.
         * @param anchorIndex The zero-based index value of the first character in the selection (the first character's
         * index value is 0).
         * @param activeIndex The zero-based index value of the last character in the selection.
         */
        public selectRange(anchorIndex:number, activeIndex:number):void {
            anchorIndex = +anchorIndex | 0;
            activeIndex = +activeIndex | 0;
        }

        /**
         * Assigns focus to the TextField object. For non-editable objects, setFocus() does nothing.
         */
        public setFocus():void {

        }

        /**
         * @language zh_CN
         * 设置富文本
         * @see http://edn.egret.com/cn/index.php/article/index/id/146
         */
        /**
         * Set rich text
         * @version Egret 2.4
         * @platform Web,Native
         */
        public set textFlow(textArr:any) {
            //todo
        }

        public get textFlow():any {
            return null;
        }
    }
}