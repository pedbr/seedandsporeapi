import * as cors from 'cors'
import * as express from 'express'
import * as functions from 'firebase-functions'

import {
  addProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProductById,
} from './controllers/productsController'

import { sendContactEmail } from './controllers/emailsController'
import {
  addOrder,
  addUserInfo,
  confirmOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from './controllers/ordersController'
import { createPayment } from './controllers/paymentsController'

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
app.patch('/orders/userInfo/:orderId', addUserInfo)
app.patch('/orders/:orderId', updateOrderStatus)

// EMAILS
app.post('/emails/contact', sendContactEmail)

exports.app = functions.https.onRequest(app)
