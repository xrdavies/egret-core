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

    export class CmdCacheObject extends HashObject {
        public constructor() {
            super();
        }

        // 0x01 WebGLObject
        // 0x02 WebGLBuffer
        // 0x03 WebGLFramebuffer
        // 0x04 WebGLProgram
        // 0x05 WebGLRenderbuffer
        // 0x06 WebGLShader
        // 0x07 WebGLTexture
        // 0x08 WebGLUniformLocation
        // 0x09 WebGLActiveInfo
        // 0x10 WebGLAttribLocation
        public $objType:number = 0x00; 
    }

    /**
     * @private
     * 缓存WebGL命令管理器
     */
    export class WebGLCmdArrayManager {
        /*
         * 存储绘制命令的 array buffer
         **/
        private maxArrayBufferLen = 80000 * 4;
        private arrayBuffer:ArrayBuffer = new ArrayBuffer(this.maxArrayBufferLen);
        private dataView:DataView = new DataView(this.arrayBuffer);

        private arrayBufferLen:number = 0;

        private static SIZE_OF_UINT16:number = 2;
        private static SIZE_OF_UINT32:number = 4;
        private static SIZE_OF_FLOAT32:number = 4;

        public DEPTH_BUFFER_BIT:number = 0x00000100;
        public STENCIL_BUFFER_BIT:number = 0x00000400;
        public COLOR_BUFFER_BIT:number = 0x00004000;
        public POINTS:number = 0x0000;
        public LINES:number = 0x0001;
        public LINE_LOOP:number = 0x0002;
        public LINE_STRIP:number = 0x0003;
        public TRIANGLES:number = 0x0004;
        public TRIANGLE_STRIP:number = 0x0005;
        public TRIANGLE_FAN:number = 0x0006;
        public ZERO:number = 0;
        public ONE:number = 1;
        public SRC_COLOR:number = 0x0300;
        public ONE_MINUS_SRC_COLOR:number = 0x0301;
        public SRC_ALPHA:number = 0x0302;
        public ONE_MINUS_SRC_ALPHA:number = 0x0303;
        public DST_ALPHA:number = 0x0304;
        public ONE_MINUS_DST_ALPHA:number = 0x0305;
        public DST_COLOR:number = 0x0306;
        public ONE_MINUS_DST_COLOR:number = 0x0307;
        public SRC_ALPHA_SATURATE:number = 0x0308;
        public FUNC_ADD:number = 0x8006;
        public BLEND_EQUATION:number = 0x8009;
        public BLEND_EQUATION_RGB:number = 0x8009;
        public BLEND_EQUATION_ALPHA:number = 0x883D;
        public FUNC_SUBTRACT:number = 0x800A;
        public FUNC_REVERSE_SUBTRACT:number = 0x800B;
        public BLEND_DST_RGB:number = 0x80C8;
        public BLEND_SRC_RGB:number = 0x80C9;
        public BLEND_DST_ALPHA:number = 0x80CA;
        public BLEND_SRC_ALPHA:number = 0x80CB;
        public CONSTANT_COLOR:number = 0x8001;
        public ONE_MINUS_CONSTANT_COLOR:number = 0x8002;
        public CONSTANT_ALPHA:number = 0x8003;
        public ONE_MINUS_CONSTANT_ALPHA:number = 0x8004;
        public BLEND_COLOR:number = 0x8005;
        public ARRAY_BUFFER:number = 0x8892;
        public ELEMENT_ARRAY_BUFFER:number = 0x8893;
        public ARRAY_BUFFER_BINDING:number = 0x8894;
        public ELEMENT_ARRAY_BUFFER_BINDING:number = 0x8895;
        public STREAM_DRAW:number = 0x88E0;
        public STATIC_DRAW:number = 0x88E4;
        public DYNAMIC_DRAW:number = 0x88E8;
        public BUFFER_SIZE:number = 0x8764;
        public BUFFER_USAGE:number = 0x8765;
        public CURRENT_VERTEX_ATTRIB:number = 0x8626;
        public FRONT:number = 0x0404;
        public BACK:number = 0x0405;
        public FRONT_AND_BACK:number = 0x0408;
        public TEXTURE_2D:number = 0x0DE1;
        public CULL_FACE:number = 0x0B44;
        public BLEND:number = 0x0BE2;
        public DITHER:number = 0x0BD0;
        public STENCIL_TEST:number = 0x0B90;
        public DEPTH_TEST:number = 0x0B71;
        public SCISSOR_TEST:number = 0x0C11;
        public POLYGON_OFFSET_FILL:number = 0x8037;
        public SAMPLE_ALPHA_TO_COVERAGE:number = 0x809E;
        public SAMPLE_COVERAGE:number = 0x80A0;
        public NO_ERROR:number = 0;
        public INVALID_ENUM:number = 0x0500;
        public INVALID_VALUE:number = 0x0501;
        public INVALID_OPERATION:number = 0x0502;
        public OUT_OF_MEMORY:number = 0x0505;
        public CW:number = 0x0900;
        public CCW:number = 0x0901;
        public LINE_WIDTH:number = 0x0B21;
        public ALIASED_POINT_SIZE_RANGE:number = 0x846D;
        public ALIASED_LINE_WIDTH_RANGE:number = 0x846E;
        public CULL_FACE_MODE:number = 0x0B45;
        public FRONT_FACE:number = 0x0B46;
        public DEPTH_RANGE:number = 0x0B70;
        public DEPTH_WRITEMASK:number = 0x0B72;
        public DEPTH_CLEAR_VALUE:number = 0x0B73;
        public DEPTH_FUNC:number = 0x0B74;
        public STENCIL_CLEAR_VALUE:number = 0x0B91;
        public STENCIL_FUNC:number = 0x0B92;
        public STENCIL_FAIL:number = 0x0B94;
        public STENCIL_PASS_DEPTH_FAIL:number = 0x0B95;
        public STENCIL_PASS_DEPTH_PASS:number = 0x0B96;
        public STENCIL_REF:number = 0x0B97;
        public STENCIL_VALUE_MASK:number = 0x0B93;
        public STENCIL_WRITEMASK:number = 0x0B98;
        public STENCIL_BACK_FUNC:number = 0x8800;
        public STENCIL_BACK_FAIL:number = 0x8801;
        public STENCIL_BACK_PASS_DEPTH_FAIL:number = 0x8802;
        public STENCIL_BACK_PASS_DEPTH_PASS:number = 0x8803;
        public STENCIL_BACK_REF:number = 0x8CA3;
        public STENCIL_BACK_VALUE_MASK:number = 0x8CA4;
        public STENCIL_BACK_WRITEMASK:number = 0x8CA5;
        public VIEWPORT:number = 0x0BA2;
        public SCISSOR_BOX:number = 0x0C10;
        public COLOR_CLEAR_VALUE:number = 0x0C22;
        public COLOR_WRITEMASK:number = 0x0C23;
        public UNPACK_ALIGNMENT:number = 0x0CF5;
        public PACK_ALIGNMENT:number = 0x0D05;
        public MAX_TEXTURE_SIZE:number = 0x0D33;
        public MAX_VIEWPORT_DIMS:number = 0x0D3A;
        public SUBPIXEL_BITS:number = 0x0D50;
        public RED_BITS:number = 0x0D52;
        public GREEN_BITS:number = 0x0D53;
        public BLUE_BITS:number = 0x0D54;
        public ALPHA_BITS:number = 0x0D55;
        public DEPTH_BITS:number = 0x0D56;
        public STENCIL_BITS:number = 0x0D57;
        public POLYGON_OFFSET_UNITS:number = 0x2A00;
        public POLYGON_OFFSET_FACTOR:number = 0x8038;
        public TEXTURE_BINDING_2D:number = 0x8069;
        public SAMPLE_BUFFERS:number = 0x80A8;
        public SAMPLES:number = 0x80A9;
        public SAMPLE_COVERAGE_VALUE:number = 0x80AA;
        public SAMPLE_COVERAGE_INVERT:number = 0x80AB;
        public COMPRESSED_TEXTURE_FORMATS:number = 0x86A3;
        public DONT_CARE:number = 0x1100;
        public FASTEST:number = 0x1101;
        public NICEST:number = 0x1102;
        public GENERATE_MIPMAP_HINT:number = 0x8192;
        public BYTE:number = 0x1400;
        public UNSIGNED_BYTE:number = 0x1401;
        public SHORT:number = 0x1402;
        public UNSIGNED_SHORT:number = 0x1403;
        public INT:number = 0x1404;
        public UNSIGNED_INT:number = 0x1405;
        public FLOAT:number = 0x1406;
        public DEPTH_COMPONENT:number = 0x1902;
        public ALPHA:number = 0x1906;
        public RGB:number = 0x1907;
        public RGBA:number = 0x1908;
        public LUMINANCE:number = 0x1909;
        public LUMINANCE_ALPHA:number = 0x190A;
        public UNSIGNED_SHORT_4_4_4_4:number = 0x8033;
        public UNSIGNED_SHORT_5_5_5_1:number = 0x8034;
        public UNSIGNED_SHORT_5_6_5:number = 0x8363;
        public FRAGMENT_SHADER:number = 0x8B30;
        public VERTEX_SHADER:number = 0x8B31;
        public MAX_VERTEX_ATTRIBS:number = 0x8869;
        public MAX_VERTEX_UNIFORM_VECTORS:number = 0x8DFB;
        public MAX_VARYING_VECTORS:number = 0x8DFC;
        public MAX_COMBINED_TEXTURE_IMAGE_UNITS:number = 0x8B4D;
        public MAX_VERTEX_TEXTURE_IMAGE_UNITS:number = 0x8B4C;
        public MAX_TEXTURE_IMAGE_UNITS:number = 0x8872;
        public MAX_FRAGMENT_UNIFORM_VECTORS:number = 0x8DFD;
        public SHADER_TYPE:number = 0x8B4F;
        public DELETE_STATUS:number = 0x8B80;
        public LINK_STATUS:number = 0x8B82;
        public VALIDATE_STATUS:number = 0x8B83;
        public ATTACHED_SHADERS:number = 0x8B85;
        public ACTIVE_UNIFORMS:number = 0x8B86;
        public ACTIVE_ATTRIBUTES:number = 0x8B89;
        public SHADING_LANGUAGE_VERSION:number = 0x8B8C;
        public CURRENT_PROGRAM:number = 0x8B8D;
        public NEVER:number = 0x0200;
        public LESS:number = 0x0201;
        public EQUAL:number = 0x0202;
        public LEQUAL:number = 0x0203;
        public GREATER:number = 0x0204;
        public NOTEQUAL:number = 0x0205;
        public GEQUAL:number = 0x0206;
        public ALWAYS:number = 0x0207;
        public KEEP:number = 0x1E00;
        public REPLACE:number = 0x1E01;
        public INCR:number = 0x1E02;
        public DECR:number = 0x1E03;
        public INVERT:number = 0x150A;
        public INCR_WRAP:number = 0x8507;
        public DECR_WRAP:number = 0x8508;
        public VENDOR:number = 0x1F00;
        public RENDERER:number = 0x1F01;
        public VERSION:number = 0x1F02;
        public NEAREST:number = 0x2600;
        public LINEAR:number = 0x2601;
        public NEAREST_MIPMAP_NEAREST:number = 0x2700;
        public LINEAR_MIPMAP_NEAREST:number = 0x2701;
        public NEAREST_MIPMAP_LINEAR:number = 0x2702;
        public LINEAR_MIPMAP_LINEAR:number = 0x2703;
        public TEXTURE_MAG_FILTER:number = 0x2800;
        public TEXTURE_MIN_FILTER:number = 0x2801;
        public TEXTURE_WRAP_S:number = 0x2802;
        public TEXTURE_WRAP_T:number = 0x2803;
        public TEXTURE:number = 0x1702;
        public TEXTURE_CUBE_MAP:number = 0x8513;
        public TEXTURE_BINDING_CUBE_MAP:number = 0x8514;
        public TEXTURE_CUBE_MAP_POSITIVE_X:number = 0x8515;
        public TEXTURE_CUBE_MAP_NEGATIVE_X:number = 0x8516;
        public TEXTURE_CUBE_MAP_POSITIVE_Y:number = 0x8517;
        public TEXTURE_CUBE_MAP_NEGATIVE_Y:number = 0x8518;
        public TEXTURE_CUBE_MAP_POSITIVE_Z:number = 0x8519;
        public TEXTURE_CUBE_MAP_NEGATIVE_Z:number = 0x851A;
        public MAX_CUBE_MAP_TEXTURE_SIZE:number = 0x851C;
        public TEXTURE0:number = 0x84C0;
        public TEXTURE1:number = 0x84C1;
        public TEXTURE2:number = 0x84C2;
        public TEXTURE3:number = 0x84C3;
        public TEXTURE4:number = 0x84C4;
        public TEXTURE5:number = 0x84C5;
        public TEXTURE6:number = 0x84C6;
        public TEXTURE7:number = 0x84C7;
        public TEXTURE8:number = 0x84C8;
        public TEXTURE9:number = 0x84C9;
        public TEXTURE10:number = 0x84CA;
        public TEXTURE11:number = 0x84CB;
        public TEXTURE12:number = 0x84CC;
        public TEXTURE13:number = 0x84CD;
        public TEXTURE14:number = 0x84CE;
        public TEXTURE15:number = 0x84CF;
        public TEXTURE16:number = 0x84D0;
        public TEXTURE17:number = 0x84D1;
        public TEXTURE18:number = 0x84D2;
        public TEXTURE19:number = 0x84D3;
        public TEXTURE20:number = 0x84D4;
        public TEXTURE21:number = 0x84D5;
        public TEXTURE22:number = 0x84D6;
        public TEXTURE23:number = 0x84D7;
        public TEXTURE24:number = 0x84D8;
        public TEXTURE25:number = 0x84D9;
        public TEXTURE26:number = 0x84DA;
        public TEXTURE27:number = 0x84DB;
        public TEXTURE28:number = 0x84DC;
        public TEXTURE29:number = 0x84DD;
        public TEXTURE30:number = 0x84DE;
        public TEXTURE31:number = 0x84DF;
        public ACTIVE_TEXTURE:number = 0x84E0;
        public REPEAT:number = 0x2901;
        public CLAMP_TO_EDGE:number = 0x812F;
        public MIRRORED_REPEAT:number = 0x8370;
        public FLOAT_VEC2:number = 0x8B50;
        public FLOAT_VEC3:number = 0x8B51;
        public FLOAT_VEC4:number = 0x8B52;
        public INT_VEC2:number = 0x8B53;
        public INT_VEC3:number = 0x8B54;
        public INT_VEC4:number = 0x8B55;
        public BOOL:number = 0x8B56;
        public BOOL_VEC2:number = 0x8B57;
        public BOOL_VEC3:number = 0x8B58;
        public BOOL_VEC4:number = 0x8B59;
        public FLOAT_MAT2:number = 0x8B5A;
        public FLOAT_MAT3:number = 0x8B5B;
        public FLOAT_MAT4:number = 0x8B5C;
        public SAMPLER_2D:number = 0x8B5E;
        public SAMPLER_CUBE:number = 0x8B60;
        public VERTEX_ATTRIB_ARRAY_ENABLED:number = 0x8622;
        public VERTEX_ATTRIB_ARRAY_SIZE:number = 0x8623;
        public VERTEX_ATTRIB_ARRAY_STRIDE:number = 0x8624;
        public VERTEX_ATTRIB_ARRAY_TYPE:number = 0x8625;
        public VERTEX_ATTRIB_ARRAY_NORMALIZED:number = 0x886A;
        public VERTEX_ATTRIB_ARRAY_POINTER:number = 0x8645;
        public VERTEX_ATTRIB_ARRAY_BUFFER_BINDING:number = 0x889F;
        public IMPLEMENTATION_COLOR_READ_TYPE:number = 0x8B9A;
        public IMPLEMENTATION_COLOR_READ_FORMAT:number = 0x8B9B;
        public COMPILE_STATUS:number = 0x8B81;
        public LOW_FLOAT:number = 0x8DF0;
        public MEDIUM_FLOAT:number = 0x8DF1;
        public HIGH_FLOAT:number = 0x8DF2;
        public LOW_INT:number = 0x8DF3;
        public MEDIUM_INT:number = 0x8DF4;
        public HIGH_INT:number = 0x8DF5;
        public FRAMEBUFFER:number = 0x8D40;
        public RENDERBUFFER:number = 0x8D41;
        public RGBA4:number = 0x8056;
        public RGB5_A1:number = 0x8057;
        public RGB565:number = 0x8D62;
        public DEPTH_COMPONENT16:number = 0x81A5;
        public STENCIL_INDEX:number = 0x1901;
        public STENCIL_INDEX8:number = 0x8D48;
        public DEPTH_STENCIL:number = 0x84F9;
        public RENDERBUFFER_WIDTH:number = 0x8D42;
        public RENDERBUFFER_HEIGHT:number = 0x8D43;
        public RENDERBUFFER_INTERNAL_FORMAT:number = 0x8D44;
        public RENDERBUFFER_RED_SIZE:number = 0x8D50;
        public RENDERBUFFER_GREEN_SIZE:number = 0x8D51;
        public RENDERBUFFER_BLUE_SIZE:number = 0x8D52;
        public RENDERBUFFER_ALPHA_SIZE:number = 0x8D53;
        public RENDERBUFFER_DEPTH_SIZE:number = 0x8D54;
        public RENDERBUFFER_STENCIL_SIZE:number = 0x8D55;
        public FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:number = 0x8CD0;
        public FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:number = 0x8CD1;
        public FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:number = 0x8CD2;
        public FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:number = 0x8CD3;
        public COLOR_ATTACHMENT0:number = 0x8CE0;
        public DEPTH_ATTACHMENT:number = 0x8D00;
        public STENCIL_ATTACHMENT:number = 0x8D20;
        public DEPTH_STENCIL_ATTACHMENT:number = 0x821A;
        public NONE:number = 0;
        public FRAMEBUFFER_COMPLETE:number = 0x8CD5;
        public FRAMEBUFFER_INCOMPLETE_ATTACHMENT:number = 0x8CD6;
        public FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:number = 0x8CD7;
        public FRAMEBUFFER_INCOMPLETE_DIMENSIONS:number = 0x8CD9;
        public FRAMEBUFFER_UNSUPPORTED:number = 0x8CDD;
        public FRAMEBUFFER_BINDING:number = 0x8CA6;
        public RENDERBUFFER_BINDING:number = 0x8CA7;
        public MAX_RENDERBUFFER_SIZE:number = 0x84E8;
        public INVALID_FRAMEBUFFER_OPERATION:number = 0x0506;
        public UNPACK_FLIP_Y_WEBGL:number = 0x9240;
        public UNPACK_PREMULTIPLY_ALPHA_WEBGL:number = 0x9241;
        public CONTEXT_LOST_WEBGL:number = 0x9242;
        public UNPACK_COLORSPACE_CONVERSION_WEBGL:number = 0x9243;
        public BROWSER_DEFAULT_WEBGL:number = 0x9244;

        /*
         * 存储字符串的数组
         */
        private strArray:Array<string> = new Array();

        private typedArrays:Array<any> = new Array();

        /*
         * native上下文
         */
        private _canvas:any;

        public constructor(canvas: any) {
            this._canvas = canvas;
        }

        public initCacheContext() {
            var that = this;
            egret_native.Label["bindTexture"] = function (...args) {
                that.bindLabelTexture.apply(that, args);
            }
        }

        /*
         * 上传绘制命令到C
         */
        public flushCmd() {
            var supportGLBatch = this._canvas.sendGLArray; 
            if(supportGLBatch) {
                this._canvas.sendGLArray(this.dataView.buffer, this.arrayBufferLen, this.strArray, this.typedArrays);
            }

            this.arrayBufferLen = 0;
            this.strArray.length = 0;
            this.typedArrays.length = 0;
        }

        /*
         * 压入一个字符串并返回索引 
         */
        private pushString(str:string):number {
            var array = this.strArray;
            var len = array.length;
            array[len] = str;
            return len;
        }
        /*
         * 压入ArrayBufferView或是ArrayBuffer并返回索引 
         */
        private pushTypedArrays(item:any):number {
            var array = this.typedArrays;
            var len = array.length;
            array[len] = item;
            return len;
        }

        // 0x29 clear(mask: number): void;
        public clear(mask: number) {
            if(this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x29, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, mask, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x48 enable(cap: number): void;
        public enable(cap: number) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x48, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, cap, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x44 disable(cap: number): void;
        public disable(cap: number) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x44, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, cap, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x45 disableVertexAttribArray(index: number): void;
        public disableVertexAttribArray(index: CmdCacheObject) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x45, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, index.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x77 scissor(x: number, y: number, width: number, height: number): void;
        public scissor(x: number, y: number, width: number, height: number) {
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x77, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, x, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, y, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, width, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, height, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;

        }

        // 0x74 readPixels(x: number, y: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView | null): void;
        public readPixels(x: number, y: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView) {
            //TODO
        }

        // 0x75 renderbufferStorage(target: number, internalformat: number, width: number, height: number): void;
        public renderbufferStorage(target: number, internalformat: number, width: number, height: number) {
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x75, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4; 
            dataView.setUint32(arrayBufferLen, internalformat, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, width, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, height, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x4C framebufferRenderbuffer(target: number, attachment: number, renderbuffertarget: number, renderbuffer: WebGLRenderbuffer | null): void;
        public framebufferRenderbuffer(target: number, attachment: number, renderbuffertarget: number, renderbuffer: CmdCacheObject) {
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x4C, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4; 
            dataView.setUint32(arrayBufferLen, attachment, true);
            arrayBufferLen += 4; 
            dataView.setUint32(arrayBufferLen, renderbuffertarget, true);
            arrayBufferLen += 4; 
            dataView.setUint32(arrayBufferLen, renderbuffer.hashCode, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x4D framebufferTexture2D(target: number, attachment: number, textarget: number, texture: WebGLTexture | null, level: number): void;
        public framebufferTexture2D(target: number, attachment: number, textarget: number, texture: CmdCacheObject, level: number) {
            if (this.arrayBufferLen + 24 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x4D, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4; 
            dataView.setUint32(arrayBufferLen, attachment, true);
            arrayBufferLen += 4; 
            dataView.setUint32(arrayBufferLen, textarget, true);
            arrayBufferLen += 4; 
            dataView.setUint32(arrayBufferLen, texture.hashCode, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, level, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x24 blendFunc(sfactor: number, dfactor: number): void;
        public blendFunc(sfactor: number, dfactor: number) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x24, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, sfactor, true);
            arrayBufferLen += 4; 
            dataView.setUint32(arrayBufferLen, dfactor, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x79 stencilFunc(func: number, ref: number, mask: number): void;
        public stencilFunc(func: number, ref: number, mask: number) {

        }

        // 0x7A stencilFuncSeparate(face: number, func: number, ref: number, mask: number): void;
        public stencilFuncSeparate(face: number, func: number, ref: number, mask: number) {

        }

        // 0x7D stencilOp(fail: number, zfail: number, zpass: number): void;
        public stencilOp(fail: number, zfail: number, zpass: number) {

        }
        // 0x7E stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number): void;
        public stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number) {

        }

        // 0x4A finish(): void;
        public finish() {
            if (this.arrayBufferLen + 4 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x4A, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x4B flush(): void;
        public flush() {
            if (this.arrayBufferLen + 4 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x4B, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x2A clearColor(red: number, green: number, blue: number, alpha: number): void;
        public clearColor(red: number, green: number, blue: number, alpha: number){
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x2A, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, red, true);
            arrayBufferLen += 4; 
            dataView.setFloat32(arrayBufferLen, green, true);
            arrayBufferLen += 4; 
            dataView.setFloat32(arrayBufferLen, blue, true);
            arrayBufferLen += 4; 
            dataView.setFloat32(arrayBufferLen, alpha, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x2D colorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
        public colorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean) {
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x2D, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, (red ? 1 : 0), true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, (green ? 1 : 0), true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, (blue ? 1 : 0), true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, (alpha ? 1 : 0), true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0xA3 viewport(x: number, y: number, width: number, height: number): void;
        public viewport(x: number, y: number, width: number, height: number) {
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0xA3, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, x, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, y, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, width, true);
            arrayBufferLen += 4; 
            dataView.setInt32(arrayBufferLen, height, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x33 createBuffer(): WebGLBuffer | null;
        public createBuffer() {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            var webGLObject = new CmdCacheObject();
            webGLObject.$objType = 0x02;

            dataView.setUint32(arrayBufferLen, 0x33, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, webGLObject.hashCode, true);
            arrayBufferLen += 4; 

            this.arrayBufferLen = arrayBufferLen;
            return webGLObject;
        }

        // 0x34 createFramebuffer(): WebGLFramebuffer | null;
        public createFramebuffer() {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            var webGLObject = new CmdCacheObject();
            webGLObject.$objType = 0x03;
            dataView.setUint32(arrayBufferLen, 0x34, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, webGLObject.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
            return webGLObject;
        }

        // 0x36 createRenderbuffer(): WebGLRenderbuffer | null;
        public createRenderbuffer() {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            var webGLObject = new CmdCacheObject();
            webGLObject.$objType = 0x05;
            dataView.setUint32(arrayBufferLen, 0x36, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, webGLObject.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
            return webGLObject;

        }

        // 0x1D bindBuffer(target: number, buffer: WebGLBuffer | null): void;
        public bindBuffer(target: number, bufferObj: CmdCacheObject) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x1D, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, bufferObj.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x1E bindFramebuffer(target: number, framebuffer: WebGLFramebuffer | null): void;
        public bindFramebuffer(target: number, framebuffer: CmdCacheObject) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x1E, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            if(framebuffer == null) {  //TODO || pixels == 0) {
                dataView.setUint32(arrayBufferLen, 0xFFFFFFFF, true);
            }
            else {
                dataView.setUint32(arrayBufferLen, framebuffer.hashCode, true);
            }
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;

        }

        // 0x1F bindRenderbuffer(target: number, renderbuffer: WebGLRenderbuffer | null): void;
        public bindRenderbuffer(target: number, renderbuffer: CmdCacheObject) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x1F, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            if(renderbuffer == null || renderbuffer.hashCode == 0) {
                dataView.setUint32(arrayBufferLen, 0, true);
            }
            else {
                dataView.setUint32(arrayBufferLen, renderbuffer.hashCode, true);
            }
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;

        }

        // 0x35 createProgram(): WebGLProgram | null;
        public createProgram() {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            var webGLObject = new CmdCacheObject();
            webGLObject.$objType = 0x04;
            dataView.setUint32(arrayBufferLen, 0x35, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, webGLObject.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
            return webGLObject;
        }

        // 0x98 useProgram(program: WebGLProgram | null): void;
        public useProgram(program: CmdCacheObject) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x98, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, program.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        //0x37 createShader(type: number): WebGLShader | null;
        public createShader(type: number) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            var webGLObject = new CmdCacheObject();
            webGLObject.$objType = 0x07;
            dataView.setUint32(arrayBufferLen, 0x37, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, webGLObject.hashCode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, type, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
            return webGLObject;
        }

        // 0x2E compileShader(shader: WebGLShader | null): void;
        public compileShader(shader: CmdCacheObject) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x2E, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, shader.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x60 shaderSource(shader: WebGLShader | null, source: string): void;
        public shaderSource(shader: CmdCacheObject, source: string) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            var sourceid = this.pushString(source);
            dataView.setUint32(arrayBufferLen, 0x60, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, shader.hashCode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, sourceid, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x5E getShaderParameter(shader: WebGLShader | null, pname: number): any;
        public getShaderParameter(shader: CmdCacheObject, pname: number) {
            // TODO
            return 1;
        }
        // 0x5B getProgramParameter(program: WebGLProgram | null, pname: number): any;
        public getProgramParameter(program: CmdCacheObject, pname: number) {
            // TODO
            return 1;
        }
        // 0x5D getShaderInfoLog(shader: WebGLShader | null): string | null;
        public getShaderInfoLog() {
            // TODO
            return "TODO - getShaderInfoLog";
        }

        // 0x1B attachShader(program: WebGLProgram | null, shader: WebGLShader | null): void;
        public attachShader(program: CmdCacheObject, shader: CmdCacheObject) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x1B, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, program.hashCode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, shader.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x71 linkProgram(program: WebGLProgram | null): void;
        public linkProgram(program: CmdCacheObject) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x71, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, program.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x72 pixelStorei(pname: number, param: number): void;
        public pixelStorei(pname: number, param: number) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x72, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, pname, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, param, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x38 createTexture(): WebGLTexture | null;
        public createTexture() {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            var webGLObject = new CmdCacheObject();
            webGLObject.$objType = 0x07;
            dataView.setUint32(arrayBufferLen, 0x38, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, webGLObject.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
            return webGLObject;
        }

        // 0x3A deleteBuffer(buffer: WebGLBuffer | null): void;
        public deleteBuffer(buffer: CmdCacheObject) {
            if(buffer == null || buffer.hashCode <= 0) {
                return;
            }
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            dataView.setUint32(arrayBufferLen, 0x3A, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, buffer.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }
        // 0x3B deleteFramebuffer(framebuffer: WebGLFramebuffer | null): void;
        public deleteFramebuffer(framebuffer: CmdCacheObject) {
            if(framebuffer == null || framebuffer.hashCode <= 0) {
                return;
            }
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            dataView.setUint32(arrayBufferLen, 0x3B, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, framebuffer.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x3C deleteProgram(program: WebGLProgram | null): void;
        public deleteProgram(program: CmdCacheObject) {
            if(program == null || program.hashCode <= 0) {
                return;
            }
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            dataView.setUint32(arrayBufferLen, 0x3C, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, program.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;

        }
        // 0x3D deleteRenderbuffer(renderbuffer: WebGLRenderbuffer | null): void;
        public deleteRenderbuffer(renderbuffer: CmdCacheObject) {
                if(renderbuffer == null || renderbuffer.hashCode <= 0) {
                return;
            }
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            dataView.setUint32(arrayBufferLen, 0x3D, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, renderbuffer.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }
        // 0x3E deleteShader(shader: WebGLShader | null): void;
        public deleteShader(texture: CmdCacheObject) {
            if(texture == null || texture.hashCode <= 0) {
                return;
            }
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            dataView.setUint32(arrayBufferLen, 0x3E, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, texture.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x3F deleteTexture(texture: WebGLTexture | null): void;
        public deleteTexture(texture: CmdCacheObject) {
            if(texture == null || texture.hashCode <= 0) {
                return;
            }
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;
            dataView.setUint32(arrayBufferLen, 0x3F, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, texture.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x1A activeTexture(texture: number): void;
        public activeTexture(texture: number) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x1A, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, texture, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x20 bindTexture(target: number, texture: WebGLTexture | null): void;
        public bindTexture(target: number, texture: CmdCacheObject) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x20, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            if(texture == null) {
	    	// TODO check
                dataView.setUint32(arrayBufferLen, 0xFFFFFFFF, true);
            }
            else {
                dataView.setUint32(arrayBufferLen, texture.hashCode, true);
            }
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x64 getUniformLocation(program: WebGLProgram | null, name: string): WebGLUniformLocation | null;
        public getUniformLocation(program: CmdCacheObject, name: string) {
            if(program == null) {
                return;
            }
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x64, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, program.hashCode, true);
            arrayBufferLen += 4;
            var nameid = this.pushString(name);
            dataView.setUint32(arrayBufferLen, nameid, true);
            arrayBufferLen += 4;
            var webGLObject = new CmdCacheObject();
            webGLObject.$objType = 0x08;
            dataView.setUint32(arrayBufferLen, webGLObject.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
            return webGLObject;
        }

        // 0x53 getAttribLocation(program: WebGLProgram | null, name: string): number;
        public getAttribLocation(program: CmdCacheObject, name: string) {
            if(this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }

            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x53, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, program.hashCode, true);
            arrayBufferLen += 4;

            var nameid = this.pushString(name);
            dataView.setUint32(arrayBufferLen, nameid, true);
            arrayBufferLen += 4;

            var webGLObject = new CmdCacheObject();
            webGLObject.$objType = 0x10;
            dataView.setUint32(arrayBufferLen, webGLObject.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
            return webGLObject;
        }

        // 0x50 getActiveAttrib(program: WebGLProgram | null, index: number): WebGLActiveInfo | null;
        public getActiveAttrib(program: CmdCacheObject, index: number) {
            // TODO
        }

        // 0x65 getVertexAttrib(index: number, pname: number): any;
        // 0x66 getVertexAttribOffset(index: number, pname: number): number;
        public getVertexAttrib(index: number, pname: number) {
            // TOOD
        } 

        // 0x49 enableVertexAttribArray(index: number): void;
        public enableVertexAttribArray(indx: CmdCacheObject) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x49, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, indx.hashCode, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0xA2 vertexAttribPointer(indx: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void;
        public vertexAttribPointer(indx: CmdCacheObject, size: number, type: number, normalized: boolean, stride: number, offset: number) {
            if (this.arrayBufferLen + 28 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0xA2, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, indx.hashCode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, size, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, type, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, normalized ? 1 : 0, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, stride, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, offset, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        public uniformxv(location: CmdCacheObject, v: any, type: number) {
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, type);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            var arrayid = this.pushTypedArrays(v);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, arrayid, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x88 uniform1iv(location: WebGLUniformLocation, v: Int32Array | number[]): void;
        public uniform1iv(location: CmdCacheObject, v: Int32Array) {
            this.uniformxv(location, v, 0x88);

        }

        // 0x8C uniform2iv(location: WebGLUniformLocation, v: Int32Array | number[]): void;
        public uniform2iv(location: CmdCacheObject, v: Int32Array) {
            this.uniformxv(location, v, 0x8C);
        }

        // 0x90 uniform3iv(location: WebGLUniformLocation, v: Int32Array | number[]): void;
        public uniform3iv(location: CmdCacheObject, v: Int32Array) {
            this.uniformxv(location, v, 0x90);
        }
        // 0x94 uniform4iv(location: WebGLUniformLocation, v: Int32Array | number[]): void;
        public uniform4iv(location: CmdCacheObject, v: Int32Array) {
            this.uniformxv(location, v, 0x94);
        }

        // 0x86 uniform1fv(location: WebGLUniformLocation, v: Float32Array | number[]): void;
        public uniform1fv(location: CmdCacheObject, v: Float32Array) {
            this.uniformxv(location, v, 0x86);
        }

        // 0x8A uniform2fv(location: WebGLUniformLocation, v: Float32Array | number[]): void;
        public uniform2fv(location: CmdCacheObject, v: Float32Array) {
            this.uniformxv(location, v, 0x8A);
        }

        // 0x8E uniform3fv(location: WebGLUniformLocation, v: Float32Array | number[]): void;
        public uniform3fv(location: CmdCacheObject, v: Float32Array) {
            this.uniformxv(location, v, 0x8E);
        }
        
        // 0x92 uniform4fv(location: WebGLUniformLocation, v: Float32Array | number[]): void;
        public uniform4fv(location: CmdCacheObject, v: Float32Array) {
            this.uniformxv(location, v, 0x92);
        }

        // 0x85 uniform1f(location: WebGLUniformLocation | null, x: number): void;
        public uniform1f(location: CmdCacheObject, x: number){
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x85, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, x, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x87 uniform1i(location: WebGLUniformLocation | null, x: number): void;
        public uniform1i(location: CmdCacheObject, x: number){
            if (this.arrayBufferLen + 12 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x87, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, x, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x89 uniform2f(location: WebGLUniformLocation | null, x: number, y: number): void;
        public uniform2f(location: CmdCacheObject, x: number, y: number) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x89, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, x, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, y, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x8B uniform2i(location: WebGLUniformLocation | null, x: number, y: number): void;
        public uniform2i(location: CmdCacheObject, x: number, y: number) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x8B, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, x, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, y, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x8D uniform3f(location: WebGLUniformLocation | null, x: number, y: number, z: number): void;
        public uniform3f(location: CmdCacheObject, x: number, y: number, z: number) {
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x8D, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, x, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, y, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, z, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x8F uniform3i(location: WebGLUniformLocation | null, x: number, y: number, z: number): void;
        public uniform3i(location: CmdCacheObject, x: number, y: number, z: number) {
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x8F, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, x, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, y, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, z, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }
        // 0x91 uniform4f(location: WebGLUniformLocation | null, x: number, y: number, z: number, w: number): void;
        public uniform4f(location: CmdCacheObject, x: number, y: number, z: number, w: number) {
            if (this.arrayBufferLen + 24 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x91, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, x, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, y, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, z, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, w, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }
        // 0x93 uniform4i(location: WebGLUniformLocation | null, x: number, y: number, z: number, w: number): void;
        public uniform4i(location: CmdCacheObject, x: number, y: number, z: number, w: number) {
            if (this.arrayBufferLen + 24 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x93, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, x, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, y, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, z, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, w, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x95 uniformMatrix2fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array | number[]): void;
        public uniformMatrix2fv(location: CmdCacheObject, transpose: boolean, value: Float32Array) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x95, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, transpose ? 1 : 0, true);
            arrayBufferLen += 4;
            var arrayid = 0;
            if(value instanceof Array) {
                var arrayObj = new Float32Array(value);
                arrayid = this.pushTypedArrays(arrayObj);
            }
            else {
                arrayid = this.pushTypedArrays(value);
            }
            dataView.setUint32(arrayBufferLen, arrayid, true);
            arrayBufferLen += 4;
            
            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x96 uniformMatrix3fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array | number[]): void;
        public uniformMatrix3fv(location: CmdCacheObject, transpose: boolean, value: Float32Array) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x96, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, transpose ? 1 : 0, true);
            arrayBufferLen += 4;
            var arrayid = 0;
            if(value instanceof Array) {
                var arrayObj = new Float32Array(value);
                arrayid = this.pushTypedArrays(arrayObj);
            }
            else {
                arrayid = this.pushTypedArrays(value);
            }
            dataView.setUint32(arrayBufferLen, arrayid, true);
            arrayBufferLen += 4;
            
            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x97 uniformMatrix4fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array | number[]): void;
        public uniformMatrix4fv(location: CmdCacheObject, transpose: boolean, value: Float32Array) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x97, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, location.hashCode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, transpose ? 1 : 0, true);
            arrayBufferLen += 4;
            var arrayid = 0;
            if(value instanceof Array) {
                var arrayObj = new Float32Array(value);
                arrayid = this.pushTypedArrays(arrayObj);
            }
            else {
                arrayid = this.pushTypedArrays(value);
            }
            dataView.setUint32(arrayBufferLen, arrayid, true);
            arrayBufferLen += 4;
            
            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x7F texImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, format: number, type: number, pixels?: ArrayBufferView): void;
        public texImage2Di(target: number, level: number, internalformat: number, width: number, height: number, border: number, format: number, type: number, pixels?: ArrayBufferView) {
            if (this.arrayBufferLen + 40 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x7F, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, level, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, internalformat, true);
            arrayBufferLen += 4;

            dataView.setInt32(arrayBufferLen, width, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, height, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, border, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, format, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, type, true);
            arrayBufferLen += 4;

            if(pixels == null) {  //TODO || pixels == 0) {
                dataView.setUint32(arrayBufferLen, 0xFFFFFFFF, true);
            }
            else {
                var arrayid = this.pushTypedArrays(pixels);
                dataView.setUint32(arrayBufferLen, arrayid, true);
            }
            arrayBufferLen += 4;
            
            this.arrayBufferLen = arrayBufferLen;

        }

        // 0x80 texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels?: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): void;
        // TODO HTMLCanvasElement
        public texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels?: BitmapData) {
            if (this.arrayBufferLen + 32 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x80, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, level, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, internalformat, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, format, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, type, true);
            arrayBufferLen += 4;

            if(pixels == null) {
                dataView.setUint32(arrayBufferLen, 0, true);
                arrayBufferLen += 4;
                dataView.setUint32(arrayBufferLen, 0, true);
                arrayBufferLen += 4;
            }
            else if (pixels.source == null || pixels.source == undefined) {
                console.log("js error pixels =" + pixels + ".format =" + pixels.format);
            }
            else if(pixels.source.___native_p__) {
                var addr = pixels.source.___native_p__;
                dataView.setUint32(arrayBufferLen, (addr / 4294967296) >>> 0, true);
                arrayBufferLen += 4;
                dataView.setUint32(arrayBufferLen, (addr & 4294967295) >>> 0, true);
                arrayBufferLen += 4;
            }
            
            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x81 texParameterf(target: number, pname: number, param: number): void;
        public texParameterf(target: number, pname: number, param: number) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x81, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, pname, true);
            arrayBufferLen += 4;
            dataView.setFloat32(arrayBufferLen, param, true);
            arrayBufferLen += 4;
            
            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x82 texParameteri(target: number, pname: number, param: number): void;
        public texParameteri(target: number, pname: number, param: number) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x82, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, pname, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, param, true);
            arrayBufferLen += 4;
            
            this.arrayBufferLen = arrayBufferLen;
        }

        //0x4F generateMipmap(target: number): void;
        public generateMipmap(target: number) {
            if (this.arrayBufferLen + 8 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x4F, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            
            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x26 bufferData(target: number, arrayData number | ArrayBufferView | ArrayBuffer, usage: number): void;
        public bufferData(target: number, arrayData: any,  usage: number) { 
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x26, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            if(arrayData) {
                var arrayid = this.pushTypedArrays(arrayData);
                dataView.setUint32(arrayBufferLen, arrayid, true);
                arrayBufferLen += 4;
            }
            //TODO arrayData: number
            // else{
            //     dataView.setFloat32(arrayBufferLen, target, true);
            //     arrayBufferLen += 4;
            // }

            dataView.setUint32(arrayBufferLen, usage, true);
            arrayBufferLen += 4;
            
            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x27 bufferSubData(target: number, offset: number, data: ArrayBufferView | ArrayBuffer): void;
        public bufferSubData(target: number, offset: number, arrayData: any) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x27, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, target, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, offset, true);
            arrayBufferLen += 4;
            if(arrayData.byteLength) {
                var arrayid = this.pushTypedArrays(arrayData);
                dataView.setUint32(arrayBufferLen, arrayid, true);
                arrayBufferLen += 4;
            }
            //TODO arrayData: number
            // else
            // {
            //     dataView.setFloat32(arrayBufferLen, target, true);
            //     arrayBufferLen += 4;
            // }

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x46 drawArrays(mode: number, first: number, count: number): void;
        public drawArrays(mode: number, first: number, count: number) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x46, true);
            arrayBufferLen += 4;

            dataView.setUint32(arrayBufferLen, mode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, first, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, count, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0x47 drawElements(mode: number, count: number, type: number, offset: number): void;
        public drawElements(mode: number, count: number, type: number, offset: number) {
            if (this.arrayBufferLen + 20 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0x47, true);
            arrayBufferLen += 4;

            dataView.setUint32(arrayBufferLen, mode, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, count, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, type, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, offset, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0xFF drawText(str: string, transform: Float32Array, textColor: number, stroke: boolean, strokeColor: number)
        public drawText(str: string, transform: Float32Array, textColor: number, stroke: boolean, strokeColor: number) {
            if (this.arrayBufferLen + 24 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0xFF, true);
            arrayBufferLen += 4;
            
            var strId = this.pushString(str); 
            dataView.setUint32(arrayBufferLen, strId, true);
            arrayBufferLen += 4;
            var transformId = this.pushTypedArrays(transform);
            dataView.setUint32(arrayBufferLen, transformId, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, textColor, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, stroke ? 1 : 0, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, strokeColor, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

        // 0xFE bindLabelTexture(fontatlasId: number, textureId: number)
        public bindLabelTexture(fontatlasAddr: number, textureId: number) {
            if (this.arrayBufferLen + 16 > this.maxArrayBufferLen) {
                this.flushCmd();
            }
            var dataView = this.dataView;
            var arrayBufferLen = this.arrayBufferLen;

            dataView.setUint32(arrayBufferLen, 0xFE, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, (fontatlasAddr/ 4294967296) >>> 0, true);
            arrayBufferLen += 4;
            dataView.setUint32(arrayBufferLen, (fontatlasAddr& 4294967295) >>> 0, true);
            arrayBufferLen += 4;
            dataView.setInt32(arrayBufferLen, textureId, true);
            arrayBufferLen += 4;

            this.arrayBufferLen = arrayBufferLen;
        }

    }
}
