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
  }
})

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