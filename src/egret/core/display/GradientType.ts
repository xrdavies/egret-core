namespace egret {
    /**
     * The GradientType class provides values for the type parameter in the beginGradientFill() methods of the Graphics class.
     * @see egret.Graphics#beginGradientFill()
     */
    export class GradientType {
        /**
         * Value used to specify a linear gradient fill.
         */
        public static readonly LINEAR:string = "linear";

        /**
         * Value used to specify a radial gradient fill.
         */
        public static readonly RADIAL:string = "radial";
    }
}