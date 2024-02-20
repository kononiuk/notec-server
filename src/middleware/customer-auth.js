const Customer = require('../models/customer')
const bcrypt = require('bcryptjs')

/**
 * Middleware for authenticating customer users using Basic Authentication.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const customerAuth = async (req, res, next) => {
  try{
    // Extract and decode the Base64 encoded Authorization header
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      throw new Error('Invalid Authorization header')
    }

    // Extract the username and password from the decoded Authorization header
    const authData = Buffer.from(authorizationHeader.replace('Basic ', ''), 'base64').toString('utf-8')
    const [email, password] = authData.split(':')

    // Find the customer user by email in the database
    const customer = await Customer.findOne({ email })
    if (!customer) {
      throw new Error()
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, customer.password)
    if (!passwordMatch) {
      throw new Error()
    }

    // Attach the authenticated customer user to the request object
    req.customer = customer
    next()
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.'})
  }
}

module.exports = customerAuth