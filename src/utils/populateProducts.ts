import { createProduct } from "../services/productService";
import { mockProducts } from "../data/mockProducts";

export const populateSampleProducts = async (count = 10) => {
  try {
    const sampleProducts = mockProducts.slice(0, count);

    for (let i = 0; i < sampleProducts.length; i++) {
      const product = sampleProducts[i];

      const { id, ...productData } = product;

      await createProduct(productData);
    }
  } catch (error) {
    console.error("Error populating products:", error);
    throw error;
  }
};
