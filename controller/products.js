const productModel = require('../models/Product')

exports.createProduct = async (req, res, next) => {
  try {
    const createdProduct = await productModel.create(req.body)
    res.status(201).json(createdProduct)
  } catch (error) {
    next(error)
  }
}

exports.getProducts = async (req, res, next) => {
  try {
    const ALL = {}
    const products = await productModel.find(ALL)

    if (!products || !products.length) {
      return res.status(400).json({ message: 'products is not found'})
    }

    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}
