interface TranslationString {
  en: string
  pt: string
}
export interface ProductType {
  id: string
  createdAt: string
  active: boolean
  name: TranslationString
  stock: number
  price: number
  imageUrl: string
  description: TranslationString
  weight: number
  discount?: number
  categoryId?: string
  campaignId?: string
  quantity: number
}
