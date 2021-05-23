// test('2 + 2 = 4', () => {
//   expect(2 + 2).toBe(4)
//   expect(2 + 2).not.toBe(5)
// })
//
// const mockFunction = jest.fn()
//
// mockFunction()
// mockFunction('hello')
//
// test('test', () => {
//   expect(mockFunction).toBeCalledTimes(2)
//   expect(mockFunction).toBeCalledWith('hello')
// })

const productController = require('../../controller/products')
const productModel = require('../../models/Product')
const newProduct = require('../data/new-product.json')
const allProducts = require('../data/all-products.json')
const httpMocks = require('node-mocks-http')

productModel.create = jest.fn()
productModel.find = jest.fn()

describe('Product Controller Create', () => {
  let req, res, next
  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
    req.body = newProduct
  })
  it('should have a createProduct function', async() => {
    expect(typeof productController.createProduct).toBe('function')
  })
  it('should call ProductModel.create', async () => {
    await productController.createProduct(req, res, next)
    expect(productModel.create).toBeCalled()
    expect(productModel.create).toBeCalledWith(newProduct)
  })
  it('should return 201 response code', async () => {
    await productController.createProduct(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
  })
  it('should return json body in response', async () => {
    productModel.create.mockReturnValue(newProduct)
    await productController.createProduct(req, res, next)
    expect(res._getJSONData()).toStrictEqual(newProduct)
  })
  it('should handle errors', async () => {
    const errorMessage = { message: 'description property missing' }
    const rejectedPromise = Promise.reject(errorMessage)
    productModel.create.mockReturnValue(rejectedPromise)
    await productController.createProduct(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
})

describe('Product Controller Read', () => {
  let req, res, next
  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
    req.body = allProducts
  })
  it('should have a getProducts function', async() => {
    expect(typeof productController.getProducts).toBe('function')
  })
  it('should call getProducts', async () => {
    await productController.getProducts(req, res, next)
    expect(productModel.find).toBeCalled()
  })
  it("should call ProductModel.find({})", async () => {
    await productController.getProducts(req, res, next);
    expect(productModel.find).toHaveBeenCalledWith({})
  })
  it('should return 200 response code', async () => {
    productModel.find.mockReturnValue(allProducts)
    await productController.getProducts(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
  })
  it('should return products', async () => {
    productModel.find.mockReturnValue(allProducts)
    await productController.getProducts(req, res, next)
    expect(res._getJSONData()).toStrictEqual(allProducts)
  })
  it('should return 400 response code', async () => {
    productModel.find.mockReturnValue([])
    await productController.getProducts(req, res, next)
    expect(res.statusCode).toBe(400)
    expect(res._getJSONData()).toStrictEqual({ message: 'products is not found' })
  })
  it('should handle errors', async () => {
    const errorMessage = { message: "Error finding product data" }
    const rejectedPromise = Promise.reject(errorMessage)
    productModel.find.mockReturnValue(rejectedPromise);
    await productController.getProducts(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage)
    expect(next).toBeCalledWith(errorMessage)
  })
})
