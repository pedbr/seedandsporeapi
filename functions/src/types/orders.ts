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
  userName: string
  userId: string
  totalPrice: number
  orderWeight: number
  deliveryAddress: string
  expeditedAt: string
  deliveredAt: string
  returned: boolean
  returnId: string
}
