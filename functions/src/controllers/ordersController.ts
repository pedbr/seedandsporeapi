import { ProductType } from './../types/products'
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as mailClient from '@sendgrid/mail'
import { Response } from 'express'
import { db } from '../config/firebase'
import { MY_EMAIL, SENDGRID_API_KEY } from '../config/secrets'
import { OrderType } from '../types/orders'

mailClient.setApiKey(SENDGRID_API_KEY)

type Request = {
  body: OrderType
  params: { orderId: string }
}

const calculateTotalOrderWeight = (products: ProductType[]) => {
  return products.reduce((acc, curr) => acc + curr.weight * curr.quantity, 0)
}

const addOrder = async (req: Request, res: Response) => {
  const { products, totalPrice, productsPrice, shippingCost } = req.body
  try {
    const order = db.collection('orders').doc()
    const orderObject = {
      id: order.id,
      createdAt: new Date().toISOString(),
      status: 'processing',
      products,
      productsPrice,
      shippingCost,
      totalPrice,
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
    body,
    params: { orderId },
  } = req

  try {
    const orderRef = db.collection('orders').doc(orderId)

    const orderData = (await orderRef.get()).data()

    if (orderData?.status !== 'processing') {
      return
    }

    await orderRef.update({ status: 'pending' }).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

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
    await mailClient.send({
      to: {
        email: body.orderEmail,
        name: orderData?.orderFullName || 'client',
      },
      from: {
        email: MY_EMAIL,
        name: 'Wiebke - Seed and Spore Team',
      },
      templateId: 'd-d7af74a0a37d4863abe875b5c1d27472',
      dynamicTemplateData: {
        orderId: orderData.id,
        clientName: orderData.orderFullName,
        createdAt: orderData.createdAt,
        orderPrice: orderData.totalPrice,
        productsCost: orderData.productsPrice,
        shippingCost: orderData.shippingCost,
        shippingType: orderData.shippingType,
        deliveryAddress: orderData.orderDeliveryAddress,
        deliveryPostCode: orderData.orderDeliveryPostCode,
        deliveryLocation: orderData.orderDeliveryLocation,
        items: orderData.products.map((product: ProductType) => ({
          productName: product.name,
          price: product.price,
          quantity: product.quantity,
          totalPrice: product.price * product.quantity,
        })),
      },
    })

    return res.status(200).json({
      status: 'success',
      message: 'Order confirmed successfully',
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

const addUserInfo = async (req: Request, res: Response) => {
  const {
    body,
    params: { orderId },
  } = req

  try {
    const orderRef = db.collection('orders').doc(orderId)

    await orderRef.update(body).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
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

    const orderData = (await orderRef.get()).data()

    if (status === 'expedited' && orderData) {
      await mailClient.send({
        to: {
          email: orderData.orderEmail,
          name: orderData.orderFullName || 'Client',
        },
        from: {
          email: MY_EMAIL,
          name: 'Seed and Spore Team',
        },
        dynamicTemplateData: {
          orderId: orderData.id,
          clientName: orderData.orderFullName || 'Client',
        },
        templateId: 'd-71be446831f644d1a3a39ddac63bc3f8',
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

export {
  addOrder,
  getAllOrders,
  getOrderById,
  confirmOrder,
  updateOrderStatus,
  addUserInfo,
}
