const express = require('express')
const Product = require('../models/product')
const router = new express.Router()
const auth = require('../middleware/auth')

/**
 * @route   POST /products
 * @desc    Create a new product
 * @access  Private (requires authentication)
 */
router.post('/products', auth, async (req, res) => {
  try {
    // Generate a new product ID
    req.body.productId = await Product.generateNextProductId()

    // Create a new product instance based on the request body and save the product to the database
    const product = new Product(req.body)
    await product.save()

    res.status(200).send({ product })
  } catch (e) {
    res.status(400).send()
  }
})

/**
 * @route   GET /products
 * @desc    Retrieve all products
 * @access  Public
 */
router.get('/products', async (req,res) => {
  try {
    const requestParams = req.query || {}
    const products = await Product.find(requestParams)

    res.send(products)
  } catch (e) {
    res.status(404).send()
  }
})

/**
 * @route   PATCH /products/:id
 * @desc    Update a product by ID
 * @access  Private (requires authentication)
 */
router.patch('/products/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'price', 'stock', 'sku', 'url']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
  // Check if the requested updates are allowed
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates'})
  }

  try {
    // Find the product by its ID
    const product = await Product.findOne({ productId: req.params.id })

    if (!product) {
      return res.status(404).send()
    }

    // Apply updates to the product
    updates.forEach((update) => product[update] = req.body[update])
    product.save()
    
    res.send(product)
  } catch (e) {
    res.status(400).send(e)
  }
})

/**
 * @route   DELETE /products/:id
 * @desc    Delete a product by ID
 * @access  Private (requires authentication)
 */
router.delete('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productId: req.params.id })

    // If the product is not found, send a not found response
    if (!product) {
      return res.status(404).send()
    }

    res.send(product)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router