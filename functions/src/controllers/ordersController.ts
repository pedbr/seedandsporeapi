/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'
import { db } from '../config/firebase'
import { OrderType } from '../types/orders'
import { ProductType } from '../types/products'

type Request = {
  body: OrderType
  params: { orderId: string }
}

const calculateTotalOrderWeight = (products: ProductType[]) => {
  return products.reduce((acc, curr) => acc + curr.weight * curr.quantity, 0)
}

const addOrder = async (req: Request, res: Response) => {
  const { products, userName, totalPrice, deliveryAddress } = req.body
  try {
    const order = db.collection('orders').doc()
    const orderObject = {
      id: order.id,
      createdAt: new Date().toISOString(),
      status: 'processing',
      products,
      userName,
      totalPrice,
      deliveryAddress,
      orderWeight: calculateTotalOrderWeight(products),
    }

    await order.set(orderObject)

    res.status(200).send({
      status: 'success',
      message: 'entry added successfully',
      data: orderObject,
    })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const allOrders: OrderType[] = []
    const querySnapshot = await db
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .get()
    querySnapshot.forEach((doc: any) => allOrders.push(doc.data()))
    return res.status(200).json(allOrders)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderRef = db.collection('orders').doc(req.params.orderId)
    const order = await orderRef.get()
    return res.status(200).json(order.data())
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

const confirmOrder = async (req: Request, res: Response) => {
  const {
    params: { orderId },
  } = req

  try {
    const orderRef = db.collection('orders').doc(orderId)

    await orderRef.update({ status: 'pending' }).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    const orderData = (await orderRef.get()).data()

    if (orderData) {
      orderData.products.forEach(async (product: ProductType) => {
        const productRef = db.collection('products').doc(product.id)
        const productData = (await productRef.get()).data()
        if (product.quantity && productData?.stock) {
          await productRef.update({
            stock: productData.stock - product.quantity,
          })
        }
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Order confirmed successfully',
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

const updateOrderStatus = async (req: Request, res: Response) => {
  const {
    body: { status },
    params: { orderId },
  } = req

  try {
    const orderRef = db.collection('orders').doc(orderId)

    await orderRef.update({ status }).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

export { addOrder, getAllOrders, getOrderById, confirmOrder, updateOrderStatus }
