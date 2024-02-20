const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { customerError } = require('../utils/errors-processing')
const { removeExpiredTokens } = require('../utils/tokenUtils');

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },
  customerId: {
    type: Number,
    unique:true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true
})

customerSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

customerSchema.methods.generateAuthToken = async function () {
  const customer = this
  const expiresIn = process.env.CUSTOMER_JWT_EXPIRES_IN || 3600
  const token = jwt.sign({ _id: customer._id.toString()}, process.env.JWT_SECRET, { expiresIn: expiresIn*1000 })
  const expireDateTime = new Date(Date.now() + expiresIn * 1000)
  const tokenWithExpiration = {
    token,
    expiresAt: expireDateTime
  }

  customer.tokens = removeExpiredTokens(customer.tokens)
  customer.tokens = customer.tokens.concat(tokenWithExpiration)
  await customer.save()

  return tokenWithExpiration
}

customerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne({ email })

  if (!customer) {
    const error = new Error('Unable to login')
    error.name = 'AuthenticationError'
    throw error
  }
  
  const isMatch = await bcrypt.compare(password, customer.password)

  if (!isMatch) {
    const error = new Error('Invalid email or password')
    error.name = 'AuthenticationError'
    throw error
  }

  return customer
}

customerSchema.static('generateNextCustomerId', async function () {
  // Find the customer with the highest product ID
  const highestIdCustomer = await this.findOne({}, { customerId: 1 })
    .sort({ customerId: -1 })
    .exec()
  
  if (highestIdCustomer && highestIdCustomer.customerId) {
    return highestIdCustomer.customerId + 1
  } else {
    return 1
  }
})

// Hash the plain text password before saving
customerSchema.pre('save', async function (next) {
  const customer = this

  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8)
  }

  next()
})

customerSchema.post('save', function(error, doc, next) {
  error ? next(customerError(error)) : next()
})

// Delete user tasks when user is removed
customerSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const customer = this
  await Task.deleteMany({ owner: customer._id })
  next()
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer