const path = require('path')
const express = require('express')
const hbs = require('hbs')
require('./db/mongoose')
const productRouter = require('./routers/product')
const categoryRouter = require('./routers/category')
const cors = require('cors')

// Create an Express application
const app = express()

// Middleware to parse JSON requests
app.use(express.json())

// Create a custom CORS middleware that allows requests only from localhost
const allowedOrigins = ['http://localhost:8080','https://app.notec.store/']
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
app.use(cors(corsOptions)) // Apply the custom CORS middleware

// Register routers for handling different routes
app.use(productRouter)
app.use(categoryRouter)

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