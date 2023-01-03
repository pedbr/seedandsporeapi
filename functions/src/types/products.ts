interface TranslationString {
  en: string
  pt: string
}
export interface ProductType {
  id: string
  createdAt: string
  name: TranslationString
  stock: number
  price: number
  imageUrl: string
  description: TranslationString
  weight: number
  categoryId?: string
  campaignId?: string
  quantity: number
}
