type TFunction = (key: string) => string;

export function getGenderLabel(t: TFunction, gender?: string): string {
  switch (gender) {
    case "men":
      return t("common.men");
    case "women":
      return t("common.women");
    case "unisex":
      return t("common.unisex");
    case "kids":
      return t("common.kids");
    default:
      return t("productDetail.notAvailable");
  }
}

export function getMaterialLabel(t: TFunction, material?: string): string {
  switch (material) {
    case "metal":
      return t("productDetail.materials.metal");
    case "plastic":
      return t("productDetail.materials.plastic");
    case "acetate":
      return t("productDetail.materials.acetate");
    case "titanium":
      return t("productDetail.materials.titanium");
    case "mixed":
      return t("productDetail.materials.mixed");
    default:
      return t("productDetail.notAvailable");
  }
}

export function getShapeLabel(t: TFunction, shape?: string): string {
  switch (shape) {
    case "round":
      return t("productDetail.shapes.round");
    case "square":
      return t("productDetail.shapes.square");
    case "cat-eye":
      return t("productDetail.shapes.catEye");
    case "oval":
      return t("productDetail.shapes.oval");
    case "aviator":
      return t("productDetail.shapes.aviator");
    case "rectangular":
      return t("productDetail.shapes.rectangular");
    default:
      return t("productDetail.notAvailable");
  }
}

export function formatDimensions(
  t: TFunction,
  lensWidth?: number,
  bridgeWidth?: number,
  templeLength?: number
): string {
  const dimensions = [lensWidth, bridgeWidth, templeLength].filter(Boolean);
  return dimensions.length > 0
    ? dimensions.join("-")
    : t("productDetail.notAvailable");
}
