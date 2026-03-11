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
      className="w-full h-auto rounded-lg"
      aria-hidden
    >
      {/* Front view: eyeglasses with rectangular lenses */}
      <g transform="translate(35, 25)">
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

        {/* Left lens (rounded rectangle) */}
        <rect
          x={18}
          y={28}
          width={68}
          height={40}
          rx={12}
          fill="none"
          stroke={frameStroke}
          strokeWidth={2}
        />
        {/* Left endpiece + short temple hint */}
        <path
          d="M 86 38 L 94 38 L 100 42"
          fill="none"
          stroke={frameStroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bridge with subtle nose curve */}
        <path
          d="M 86 40 C 96 34, 104 34, 114 40 C 104 46, 96 46, 86 40 Z"
          fill="none"
          stroke={frameStroke}
          strokeWidth={1.6}
        />

        {/* Nose pads */}
        <path
          d="M 94 44 C 92 48, 92 52, 94 56"
          fill="none"
          stroke={frameStroke}
          strokeWidth={1}
          strokeLinecap="round"
        />
        <path
          d="M 106 44 C 108 48, 108 52, 106 56"
          fill="none"
          stroke={frameStroke}
          strokeWidth={1}
          strokeLinecap="round"
        />

        {/* Right endpiece + short temple hint */}
        <path
          d="M 122 42 L 128 38 L 136 38"
          fill="none"
          stroke={frameStroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right lens (rounded rectangle) */}
        <rect
          x={128}
          y={28}
          width={68}
          height={40}
          rx={12}
          fill="none"
          stroke={frameStroke}
          strokeWidth={2}
        />

        {/* Lens highlight for more "glassy" feel */}
        <path
          d="M 132 32 C 148 26, 164 26, 190 32"
          fill="none"
          stroke="#cbd5f5"
          strokeWidth={1}
          strokeLinecap="round"
        />

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
          x1={128}
          y1={52}
          x2={196}
          y2={52}
          stroke={stroke}
          strokeDasharray={dashArray}
          strokeWidth={1}
        />
        <text
          x={162}
          y={66}
          textAnchor="middle"
          fill={textFill}
          fontSize={11}
          className="font-medium"
        >
          {lensWidth} mm
        </text>
      </g>

      {/* Side view: temple (arm) with smoother curve */}
      <g transform="translate(35, 155)">
        {/* Temple: hinge, then gently curved arm */}
        <path
          d="M 0 18 L 0 34 L 6 34 L 10 40 Q 80 26, 150 40 Q 170 46, 172 54 Q 174 62, 164 66 L 20 66 Q 4 64, 0 58"
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
