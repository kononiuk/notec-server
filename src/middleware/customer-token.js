const Customer = require('../models/customer')
const jwt = require('jsonwebtoken')

const customerToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new Error('Invalid Authorization header')
    }

    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const customer = await Customer.findOne({ _id: decoded._id, 'tokens.token': token })

    if (!customer) {
      throw new Error('notAuthenticated')
    }

    res.send(customer)
  } catch (e) {
    res.status(200).send({ error: e.message})
  }
}

module.exports = customerToken