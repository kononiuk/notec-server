require('./db/mongoose')
const path = require('path')
const express = require('express')
const cors = require('cors')
const { sessionAdmin, sessionGuest } = require('./db/session'); // Import the sessions
const hbs = require('hbs')
const productRouter = require('./routers/product')
const categoryRouter = require('./routers/category')
const customerRouter = require('./routers/customer')
const adminUserRouter = require('./routers/admin/admin-user')

// Create an Express application
const app = express()

// Middleware to parse JSON requests
app.use(express.json())

// Create a custom CORS middleware that allows requests only from allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions)) // Apply the custom CORS middleware

app.use('/admin', sessionAdmin) // Use the admin session middleware

// Register routers for handling different routes
app.use(productRouter)
app.use(categoryRouter)
app.use(customerRouter)
app.use(adminUserRouter)

// Define paths for various configuration settings
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Configure Handlebars view engine and specify the location of views and partials
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

module.exports = app