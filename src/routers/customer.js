const express = require('express')
const Customer = require('../models/customer')
const customerAuth = require('../middleware/customer-auth')
const customerToken = require('../middleware/customer-token')
const router = new express.Router()

router.post('/customers', async (req, res) => {
  // Generate a new customer ID
  req.body.customerId = await Customer.generateNextCustomerId()

  const customer = new Customer(req.body)

  try {
    await customer.save()
    const token = await customer.generateAuthToken()

    res.status(201).send({ customer, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/customers/login', async (req, res) => {
  try {
    const customer = await Customer.findByCredentials(req.body.email, req.body.password)
    const token = await customer.generateAuthToken()

    res.send({ customer, token })
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      res.status(401).send({ error: 'Invalid email or password' })
    } else {
      res.status(500).send({ error: 'Unable to login' })
    }
  }
})

router.post('/customers/logout', customerToken, async (req, res) => {
  try {
    req.customer.tokens = req.customer.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.customer.save()

    res.send()
  } catch (e) {
    res.status(500).send('Error during logout:', e)
  }
})

router.post('/customers/logoutAll', customerToken, async (req, res) => {
  try {
    req.customer.tokens = []

    await req.customer.save()

    res.send()
  } catch (e) {
    res.status(500).send('Error during logout:', e)
  }
})

router.get('/customers/me', customerToken, async (req, res) => {
  res.send(req.customer)
})

router.patch('/customers/me', customerAuth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['email', 'password', 'firstname', 'lastname']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    updates.forEach((update) => req.customer[update] = req.body[update])
    await req.customer.save()

    res.send(req.customer)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/customers/me', customerAuth, async (req, res) => {
  try {
    await req.customer.deleteOne()
    res.send(req.customer)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router