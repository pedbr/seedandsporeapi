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
  userEmail: string
  userId: string
  totalPrice: number
  orderWeight: number
  orderEmail: string
  deliveryAddress: string
  expeditedAt: string
  deliveredAt: string
  returned: boolean
  returnId: string
}
