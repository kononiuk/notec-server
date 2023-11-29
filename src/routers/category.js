const express = require('express')
const Category = require('../models/category')
const router = new express.Router()
const auth = require('../middleware/admin-auth')

/**
 * @route   POST /categories
 * @desc    Create a new category
 * @access  Private (requires authentication)
 */
router.post('/categories', auth, async (req, res) => {
  try {
    // Generate a new category ID
    req.body.categoryId = await Category.generateNextCategoryId()

    // Create a new category instance and save the category to the database
    const category = new Category(req.body)
    await category.save()

    res.status(200).send({ category })
  } catch (e) { 
    res.status(400).send(e)
  }
})

/**
 * @route   GET /categories
 * @desc    Get a list of all categories
 * @access  Public
 */
router.get('/categories', async (req,res) => {
  try {
    const requestParams = req.query || {}
    const categories = await Category.find(requestParams)

    res.send(categories)
  } catch (e) {
    res.status(404).send()
  }
})

/**
 * @route   PATCH /categories/:id
 * @desc    Update a category by ID
 * @access  Private (requires authentication)
 */
router.patch('/categories/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'products', 'stock', 'url']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
  // Check if the updates are allowed
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates'})
  }

  try {
    // Find the category by its unique ID
    const category = await Category.findOne({ categoryId: req.params.id })

    if (!category) {
      return res.status(404).send()
    }

    // Apply updates to the category
    updates.forEach((update) => category[update] = req.body[update])
    category.save()

    res.send(category)
  } catch (e) {
    res.status(400).send(e)
  }
})

/**
 * @route   DELETE /categories/:id
 * @desc    Delete a category by ID
 * @access  Private (requires authentication)
 */
router.delete('/categories/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ categoryId: req.params.id })

    // If the category is not found, send a not found response
    if (!category) {
      return res.status(404).send()
    }

    res.send(category)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router