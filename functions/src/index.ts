import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'

import {
  addProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
} from './controllers/productsController'
import { createPayment } from './controllers/paymentsController'

const app = express()

app.use(cors())

app.post('/payment', createPayment)

app.post('/products', addProduct)
app.get('/products', getAllProducts)
app.get('/products/:productId', getProductById)
app.patch('/products/:productId', editProduct)
app.delete('/products/:productId', deleteProduct)

exports.app = functions.https.onRequest(app)
