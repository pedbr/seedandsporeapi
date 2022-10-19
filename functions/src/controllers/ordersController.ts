/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'
import { db } from '../config/firebase'
import { OrderType } from '../types/orders'

type Request = {
  body: OrderType
  params: { orderId: string }
}

const addOrder = async (req: Request, res: Response) => {
  const {
    status,
    products,
    userId,
    totalPrice,
    deliveryAddress,
    expeditedAt,
    deliveredAt,
    returned,
    returnId,
  } = req.body
  try {
    const order = db.collection('orders').doc()
    const orderObject = {
      id: order.id,
      createdAt: new Date().toISOString(),
      status,
      products,
      userId,
      totalPrice,
      deliveryAddress,
      expeditedAt,
      deliveredAt,
      returned,
      returnId,
    }

    order.set(orderObject)

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
    const querySnapshot = await db.collection('orders').get()
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

const editOrder = async (req: Request, res: Response) => {
  const {
    body: {
      status,
      products,
      userId,
      totalPrice,
      deliveryAddress,
      expeditedAt,
      deliveredAt,
      returned,
      returnId,
    },
    params: { orderId },
  } = req

  try {
    const order = db.collection('orders').doc(orderId)
    const currentData = (await order.get()).data() || {}
    const orderObject = {
      id: currentData.id,
      status: status || currentData.status,
      products: products || currentData.products,
      createdAt: currentData.createdAt,
      userId: userId || currentData.userId,
      totalPrice: totalPrice || currentData.totalPrice,
      deliveryAddress: deliveryAddress || currentData.deliveryAddress,
      expeditedAt: expeditedAt || currentData.expeditedAt,
      deliveredAt: deliveredAt || currentData.deliveredAt,
      returned: returned || currentData.returned,
      returnId: returnId || currentData.returnId,
    }

    await order.set(orderObject).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Order updated successfully',
      data: orderObject,
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

const deleteOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params

  try {
    const order = db.collection('orders').doc(orderId)

    await order.delete().catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully',
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

export { addOrder, getAllOrders, getOrderById, editOrder, deleteOrder }
