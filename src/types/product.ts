export type ProductType = "glasses" | "sunglasses";

export type ColorOption = {
  name: string;
  hex: string;
  imageUrl?: string;
};

export type LensOption = {
  id: string;
  name: string;
  description?: string;
  priceAdjustment?: number; // Additional cost lens type
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  type: ProductType;
  price: number;
  oldPrice?: number;
  gender?: "men" | "women" | "unisex" | "kids";
  imageUrl?: string;
  blueLightFilter?: boolean;
  blueLightFilterPrice?: number;
  // Enhanced product features
  rating?: number; // 0-5 stars
  reviewCount?: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  colorOptions?: ColorOption[];
  lensOptions?: LensOption[];
  images?: string[];
  // Detailed specifications
  frameMaterial?:
    | "metal"
    | "plastic"
    | "acetate"
    | "titanium"
    | "mixed"
    | "nylon"
    | "carbon fiber"
    | "TR90"
    | "recycled acetate"
    | "acetate/metal";
  frameColor?: string;
  frameShape?:
    | "round"
    | "square"
    | "cat-eye"
    | "oval"
    | "aviator"
    | "rectangular"
    | "oversized"
    | "pilot"
    | "rounded square"
    | "wrapped"
    | "sport"
    | "browline";
  lensColor?: string;
  lensWidth?: number; // in mm
  bridgeWidth?: number; // in mm
  templeLength?: number; // in mm
  lensHeight?: number; // in mm
  sku?: string;
  upc?: string;
  description?: string;
  features?: string[];
  lenseTechnology?: string;
  weight?: number; // in grams
  origin?: string;
  warranty?: string;
};

export type CartItem = Product & {
  quantity: number;
  addBlueLightFilter?: boolean;
  variant?: string;
};

export type DeliveryOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
};

export type Order = {
  id?: string;
  userId?: string;
  items: CartItem[];
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  deliveryInfo: {
    option: DeliveryOption;
    address?: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };
  subtotal: number;
  deliveryFee: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: any;
  updatedAt?: any;
};
