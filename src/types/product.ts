export type ProductType = 'glasses' | 'sunglasses'

export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  type: ProductType
  price: number
  oldPrice?: number
  gender?: 'men' | 'women' | 'unisex' | 'kids'
  imageUrl?: string
}


