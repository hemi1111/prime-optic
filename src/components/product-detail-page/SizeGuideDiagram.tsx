import {
  getFrameWidth,
  formatDimensions,
} from "../../utils/productDetail";

type TFunction = (key: string) => string;

type SizeGuideProduct = {
  lensWidth?: number;
  bridgeWidth?: number;
  templeLength?: number;
};

type SizeGuideDiagramProps = {
  product: SizeGuideProduct;
  t: TFunction;
};

const SizeGuideDiagram = ({ product, t }: SizeGuideDiagramProps) => {
  const { lensWidth, bridgeWidth, templeLength } = product;
  const frameWidth = getFrameWidth(lensWidth, bridgeWidth);
  const sizeCode = formatDimensions(t, lensWidth, bridgeWidth, templeLength);

  if (
    lensWidth == null ||
    bridgeWidth == null ||
    templeLength == null
  ) {
    return null;
  }

  const stroke = "#475569";
  const textFill = "#334155";
  const dashArray = "4 2";
  const frameStroke = "#334155";

  return (
    <svg
      viewBox="0 0 320 280"
      className="w-full h-auto rounded-lg justify-self-center align-middle"
      aria-hidden
    >
      {/* Front view: eyeglasses */}
      <g transform="translate(55, 25)">
        {/* Frame width dimension line (top) */}
        <line
          x1={0}
          y1={0}
          x2={210}
          y2={0}
          stroke={stroke}
          strokeDasharray={dashArray}
          strokeWidth={1}
        />
        <text
          x={105}
          y={-8}
          textAnchor="middle"
          fill={textFill}
          fontSize={11}
          className="font-medium"
        >
          {t("productDetail.frameWidth")}: {frameWidth} mm
        </text>

        {/* Frame + lenses (more realistic silhouette) */}
        <g>
          {/* Outer rims */}
          <path
            d="M 22 46
               C 22 32, 34 22, 54 22
               L 66 22
               C 86 22, 98 32, 98 46
               L 98 54
               C 98 69, 85 80, 64 80
               L 56 80
               C 35 80, 22 69, 22 54
               Z"
            fill="none"
            stroke={frameStroke}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <g transform="translate(1.5, 0)">
            <path
              d="M 125 46
                 C 125 32, 137 22, 157 22
                 L 169 22
                 C 189 22, 201 32, 201 46
                 L 201 54
                 C 201 69, 188 80, 167 80
                 L 159 80
                 C 138 80, 125 69, 125 54
                 Z"
              fill="none"
              stroke={frameStroke}
              strokeWidth={2.2}
              strokeLinejoin="round"
            />
          </g>

          {/* Bridge (centered between lenses) */}
          <path
            d="M 98 52
               C 103 44, 108 40, 112 40
               C 116 40, 121 44, 126 52"
            fill="none"
            stroke={frameStroke}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Endpieces + tiny temple hints */}
          <path
            d="M 22 50 L 14 50 L 8 54"
            fill="none"
            stroke={frameStroke}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g transform="translate(1.5, 0)">
            <path
              d="M 201 50 L 209 50 L 215 54"
              fill="none"
              stroke={frameStroke}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* Bridge width dimension */}
        <line
          x1={86}
          y1={20}
          x2={122}
          y2={20}
          stroke={stroke}
          strokeDasharray={dashArray}
          strokeWidth={1}
        />
        <text
          x={104}
          y={12}
          textAnchor="middle"
          fill={textFill}
          fontSize={11}
          className="font-medium"
        >
          {bridgeWidth} mm
        </text>

        {/* Lens width dimension (inside right lens) */}
        <line
          x1={132}
          y1={52}
          x2={200}
          y2={52}
          stroke={stroke}
          strokeDasharray={dashArray}
          strokeWidth={1}
        />
        <text
          x={166}
          y={66}
          textAnchor="middle"
          fill={textFill}
          fontSize={11}
          className="font-medium"
        >
          {lensWidth} mm
        </text>
      </g>

      {/* Side view: temple (arm) */}
      <g transform="translate(55, 155)">
        {/* Temple: hinge, then cleaner arm shape (no oval) */}
        <path
          d="M 0 16
             L 0 40
             L 12 40
             L 20 34
             L 150 34
             L 170 40
             L 178 50
             L 170 60
             L 40 60
             L 18 56"
          fill="none"
          stroke={frameStroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dimension line along temple length */}
        <line
          x1={0}
          y1={72}
          x2={135}
          y2={72}
          stroke={stroke}
          strokeDasharray={dashArray}
          strokeWidth={1}
        />
        <text
          x={67}
          y={90}
          textAnchor="middle"
          fill={textFill}
          fontSize={11}
          className="font-medium"
        >
          {templeLength} mm
        </text>
        {/* Size code on temple */}
        <text
          x={68}
          y={48}
          textAnchor="middle"
          fill={textFill}
          fontSize={12}
          className="font-semibold"
        >
          {sizeCode}
        </text>
      </g>
    </svg>
  );
};

export default SizeGuideDiagram;
