const mongoose = require('mongoose')

// Create a schema for the 'Category' model
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: Number,
    unique:true
  },
  url: {
    type: String,
    unique: true,
    required: true
  },
  products: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
})

// Define a static method for generating the next category ID
categorySchema.static('generateNextCategoryId', async function () {
  // Find the highest category ID
  const highestIdCategory = await this.findOne({}, { categoryId: 1 })
    .sort({ categoryId: -1 })
    .exec()
  
  // Calculate the next category ID
  if (highestIdCategory && highestIdCategory.categoryId) {
    return highestIdCategory.categoryId + 1
  } else {
    return 1
  }
})

// Define a pre-validation middleware to create the category URL based on the name
categorySchema.pre('validate', async function (next) {
  const category = this
  const normalizedName = category.name.toLowerCase().replaceAll(' ', '-')
  category.url = category.url || normalizedName

  next()
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category