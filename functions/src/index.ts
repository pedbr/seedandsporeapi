import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import * as dotenv from 'dotenv'

import {
  addProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
} from './controllers/productsController'

import {
  addOrder,
  getAllOrders,
  getOrderById,
  confirmOrder,
  updateOrderStatus,
} from './controllers/ordersController'
import { createPayment } from './controllers/paymentsController'

dotenv.config()

const app = express()

app.use(cors())

// PAYMENT
app.post('/payment', createPayment)

// PRODUCTS
app.post('/products', addProduct)
app.get('/products', getAllProducts)
app.get('/products/:productId', getProductById)
app.patch('/products/:productId', editProduct)
app.delete('/products/:productId', deleteProduct)

// ORDERS
app.post('/orders', addOrder)
app.get('/orders', getAllOrders)
app.get('/orders/:orderId', getOrderById)
app.post('/orders/confirm/:orderId', confirmOrder)
app.patch('/orders/:orderId', updateOrderStatus)

exports.app = functions.https.onRequest(app)
