type TFunction = (key: string) => string;

/** Thumbnail is always imageUrl (images array is for the detail slider only). */
export function getProductThumbnail(product: {
  imageUrl?: string;
}): string | undefined {
  return product.imageUrl;
}

/** All images for the detail slider: imageUrl first, then images array. */
export function getProductImages(product: {
  images?: string[];
  imageUrl?: string;
}): string[] {
  const first = product.imageUrl ? [product.imageUrl] : [];
  const rest = product.images ?? [];
  return [...first, ...rest].filter(Boolean);
}

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
    case "nylon":
      return t("productDetail.materials.nylon");
    case "carbon fiber":
      return t("productDetail.materials.carbonFiber");
    case "TR90":
      return t("productDetail.materials.TR90");
    case "recycled acetate":
      return t("productDetail.materials.recycledAcetate");
    case "acetate/metal":
      return t("productDetail.materials.acetateMetal");
    default:
      return material || t("productDetail.notAvailable");
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
    case "oversized":
      return t("productDetail.shapes.oversized");
    case "pilot":
      return t("productDetail.shapes.pilot");
    case "rounded square":
      return t("productDetail.shapes.roundedSquare");
    case "wrapped":
      return t("productDetail.shapes.wrapped");
    case "sport":
      return t("productDetail.shapes.sport");
    case "browline":
      return t("productDetail.shapes.browline");
    default:
      return shape || t("productDetail.notAvailable");
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

/** Total frame width in mm: 2× lens width + bridge width. */
export function getFrameWidth(
  lensWidth?: number,
  bridgeWidth?: number
): number | undefined {
  if (lensWidth == null || bridgeWidth == null) return undefined;
  return 2 * lensWidth + bridgeWidth;
}
