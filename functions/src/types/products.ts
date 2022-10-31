export interface ProductType {
  id: string
  createdAt: string
  name: string
  stock: number
  price: number
  imageUrl: string
  description: string
  weight: number
  categoryId?: string
  campaignId?: string
  quantity: number
}
