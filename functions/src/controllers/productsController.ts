/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'
import { db } from '../config/firebase'
import { ProductType } from '../types/products'

type Request = {
  body: ProductType
  params: { productId: string }
}

const addProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, weight, imageUrl } = req.body
  try {
    const product = db.collection('products').doc()
    const productObject = {
      id: product.id,
      createdAt: new Date().toISOString(),
      active: false,
      name,
      stock,
      price,
      imageUrl,
      description,
      weight,
    }

    product.set(productObject)

    res.status(200).send({
      status: 'success',
      message: 'entry added successfully',
      data: productObject,
    })
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const allProducts: ProductType[] = []
    const querySnapshot = await db
      .collection('products')
      .orderBy('createdAt', 'desc')
      .get()
    querySnapshot.forEach((doc: any) => allProducts.push(doc.data()))
    return res.status(200).json(allProducts)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

const getProductById = async (req: Request, res: Response) => {
  try {
    const productRef = db.collection('products').doc(req.params.productId)
    const product = await productRef.get()
    return res.status(200).json(product.data())
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

const editProduct = async (req: Request, res: Response) => {
  const {
    body,
    params: { productId },
  } = req

  try {
    const productRef = db.collection('products').doc(productId)

    await productRef.update(body).catch((error) => {
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

const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params

  try {
    const product = db.collection('products').doc(productId)

    await product.delete().catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

export {
  addProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
}
