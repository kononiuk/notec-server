const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// Create a schema for the Admin model
const adminSchema = new mongoose.Schema({
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
  sessions: [String]
})

adminSchema.methods.toJSON = function () {
  const admin = this
  const adminObject = admin.toObject()

  delete adminObject.password

  return adminObject
}

adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Admin.findOne({ email })

  if (!admin) {
    const error = new Error('Unable to login')
    error.name = 'AuthenticationError'
    throw error
  }
  
  const isMatch = await bcrypt.compare(password, admin.password)

  if (!isMatch) {
    const error = new Error('Invalid email or password')
    error.name = 'AuthenticationError'
    throw error
  }

  return admin
}

// Middleware: Hash the password before saving
adminSchema.pre('save', async function (next) {
  const admin = this

  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 8)
  }

  next()
})

// Create a Mongoose model for the Admin using the defined schema
const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin