const mongoose = require('mongoose')

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  productId: {
    type: Number,
    unique:true
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Price must be a positive number')
      }
    }
  },
  stock: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Stock must be a positive number')
      }
    }
  },
  inStock: {
    type: Boolean,
    default:false
  },
  url: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
})

// Create a virtual property for displaying the price
productSchema.virtual('displayPrice').get(function() {
  return this.price === 0 ? "Free" : this.price;
});

// Define a static method to generate the next unique product ID
productSchema.static('generateNextProductId', async function () {
  // Find the product with the highest product ID
  const highestIdProduct = await this.findOne({}, { productId: 1 })
    .sort({ productId: -1 })
    .exec()
  
  if (highestIdProduct && highestIdProduct.productId) {
    return highestIdProduct.productId + 1
  } else {
    return 1
  }
})

// Define a pre-validation hook for product data
productSchema.pre('validate', async function (next) {
  const product = this
  const normalizedName = product.name.toLowerCase().replaceAll(' ', '-')

  // Set SKU and URL to normalized name if not provided
  product.sku = product.sku || normalizedName
  product.url = product.url || normalizedName

  // Determine inStock based on stock quantity
  product.inStock = product.inStock || product.stock > 0

  next()
})

productSchema.set('toJSON', { virtuals: true });

// Create the Product model using the product schema
const Product = mongoose.model('Product', productSchema)

module.exports = Product