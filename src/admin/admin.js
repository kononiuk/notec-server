const prompt = require('prompt-sync')({ sigint: true })
const adminHelper = require('../helpers/admin')
const mongoose = require('mongoose')

// Connect to the MongoDB database using the MONGODB_URL from environment variables
mongoose.connect(process.env.MONGODB_URL)

// Check if the script is run as an admin user creation event
if (process.env.npm_lifecycle_event === 'admin:user:create') {
  // Prompt the user for email and password
  console.log('Create a new admin user')
  const email = prompt('Enter email: ')
  const password = prompt('Enter password: ', {echo: '*'})

  // Use the adminHelper to create an admin user
  adminHelper
    .createAdmin(email, password)
    .then((admin) => {
      console.log('Admin created:', admin.email)
    })
    .catch((error) => {
      console.error('Error creating admin:', error)
    })
    .finally(() => {
      // Close the database connection and exit the script
      mongoose.connection.close()
      process.exit()
  })
} else {
  // If not an admin user creation event, proceed to remove an existing admin user
  console.log('Remove an existing admin user')
  const email = prompt('Enter email: ')
  const password = prompt('Enter password: ', {echo: '*'})

  // Define an asynchronous function to delete the admin user
  async function deleteAdmin() {
    try {
      const deletedAdmin = await adminHelper.deleteAdmin(email, password)
      
      if (deletedAdmin) {
        console.log('Admin deleted:', deletedAdmin.email)
      } else {
        console.log('Your email and password combination do not match any admin user')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      // Close the database connection and exit the script
      mongoose.connection.close()
      process.exit()
    }  
  }

  deleteAdmin()
}