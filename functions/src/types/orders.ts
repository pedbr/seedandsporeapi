import { ProductType } from './products'

type Status =
  | 'processing'
  | 'pending'
  | 'preparing'
  | 'expedited'
  | 'delivered'
  | 'closed'

export interface OrderType {
  id: string
  createdAt: string
  status: Status
  products: ProductType[]
  orderFullName: string
  userId: string
  productsPrice: number
  shippingCost: number
  totalPrice: number
  orderWeight: number
  orderEmail: string
  orderDeliveryAddress: string
  orderDeliveryLocation: string
  orderDeliveryPostCode: string
  expeditedAt: string
  deliveredAt: string
  returned: boolean
  returnId: string
}
