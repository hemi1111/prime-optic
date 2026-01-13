import { useEffect, useState } from 'react'
import type { ProductType, Product } from '../types/product'
import { fetchProductsByType, fetchProductBySlug } from '../services/productService'

export function useProducts(type: ProductType) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchProductsByType(type)
      .then((items) => {
        if (!cancelled) {
          setProducts(items)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err)
          setError('Unable to load products right now.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [type])

  return { products, isLoading, error }
}

export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(!!slug)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchProductBySlug(slug)
      .then((item) => {
        if (!cancelled) {
          setProduct(item)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err)
          setError('Unable to load product details right now.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { product, isLoading, error }
}


