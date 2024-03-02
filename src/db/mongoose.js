const mongoose = require('mongoose')

// Connect to the MongoDB database using the MONGODB_URL from environment variables
const connection = mongoose.connect(process.env.MONGODB_URL)