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

module egret.native2 {

    /**
     * @private
     */
    export class FontShader extends EgretShader {

        public fragmentSrc:string =
            "precision lowp float;\n" +
            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +
            "uniform sampler2D uSampler;\n" +
            "uniform vec4 uTextColor;\n" +
            "uniform vec4 uStrokeColor;\n" +
            "void main(void) {\n" +
            "   vec4 sample = texture2D(uSampler, vTextureCoord);\n" +
            "   float fontAlpha = sample.a;\n" +
            "   float outlineAlpha = sample.r;\n" +
            "   if (fontAlpha + outlineAlpha > 0.0){\n" +
            "       vec4 color = uTextColor * fontAlpha + uStrokeColor * outlineAlpha;\n" +
            "       gl_FragColor = vColor * vec4(color.rgb, max(fontAlpha, outlineAlpha));\n" +
            "   }\n" +
            "   else {" +
            "       discard;" +
            "   }" +
            "}\n";
        public uniforms = {
            projectionVector: { type: '2f', value: { x: 0, y: 0 }, dirty: true },
            uTextColor: { type: '4f', value: { x: 0, y: 0, z: 0, w: 0 }, dirty: true },
            uStrokeColor: { type: '4f', value: { x: 0, y: 0, z: 0, w: 0 }, dirty: true },
        };

        public setTextColor(r, g, b, a) {
            var uniform = this.uniforms.uTextColor;
            if (r != uniform.value.x || g != uniform.value.y || b != uniform.value.z || a != uniform.value.w) {
                uniform.value.x = r;
                uniform.value.y = g;
                uniform.value.z = b;
                uniform.value.w = a;
                uniform.dirty = true;
            }
        }

        public setStrokeColor(r, g, b, a) {
            var uniform = this.uniforms.uStrokeColor;
            if (r != uniform.value.x || g != uniform.value.y || b != uniform.value.z || a != uniform.value.w) {
                uniform.value.x = r;
                uniform.value.y = g;
                uniform.value.z = b;
                uniform.value.w = a;
                uniform.dirty = true;
            }
        }

    }

}
