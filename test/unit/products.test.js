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
const httpMocks = require('node-mocks-http')

productModel.create = jest.fn()

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
