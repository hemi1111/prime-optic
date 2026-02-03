import { useEffect, useState } from "react";

import type { ProductType, Product } from "../types/product";

import {
  fetchProductsByType,
  fetchProductsByBrand,
  fetchProductBySlug,
} from "../services/productService";

export function useProducts(type: ProductType) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const firestoreProducts = await fetchProductsByType(type);
        setProducts(firestoreProducts);
      } catch (err) {
        console.error("Error loading products:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load products. Please try again later.";
        setError(errorMessage);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [type]);

  return { products, isLoading, error };
}

export function useProductsByBrand(brandSlug: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(!!brandSlug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brandSlug) {
      setProducts([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const firestoreProducts = await fetchProductsByBrand(brandSlug);
        setProducts(firestoreProducts);
      } catch (err) {
        console.error("Error loading products by brand:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load products. Please try again later.";
        setError(errorMessage);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [brandSlug]);

  return { products, isLoading, error };
}

export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const firestoreProduct = await fetchProductBySlug(slug);

        if (firestoreProduct) {
          setProduct(firestoreProduct);
        } else {
          setProduct(null);
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load product. Please try again later.";
        setError(errorMessage);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  return { product, isLoading, error };
}
