const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')

/**
 * Creates a new admin user with the provided email and password.
 * @param {string} email - The email of the new admin.
 * @param {string} password - The password of the new admin.
 * @returns {Promise<Admin>} A promise that resolves to the created admin or rejects with an error message.
 */
function createAdmin(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if an admin with the same email already exists
      const existingAdmin = await Admin.findOne({ email })
      if (existingAdmin) {
        reject('Admin with this email already exists')
        return;
      }

      // Create a new admin instance
      const newAdmin = new Admin({ email, password })

      // Save the new admin to the database
      newAdmin.save()
        .then(admin => {
          resolve(admin)
        })
        .catch(error => {
          reject(error)
        });
    } catch (error) {
      reject(error)
    }
  });
}

/**
 * Deletes an admin user with the provided email and password.
 * @param {string} email - The email of the admin to delete.
 * @param {string} password - The password of the admin for verification.
 * @returns {Promise<Admin>} A promise that resolves to the deleted admin or rejects with an error message.
 */
async function deleteAdmin(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      // Find the admin with the provided email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return reject('Your email and password combination do not match any admin user')
      }

      // Compare the provided password with the stored password hash
      const passwordMatch = await bcrypt.compare(password, admin.password)

      if (passwordMatch) {
        // Delete the admin from the database
        await Admin.deleteOne({ _id: admin._id })
        resolve(admin)
      } else {
        reject('Your email and password combination do not match any admin user')
      }
    } catch (error) {
      console.error('Error verifying and deleting admin:', error)
      reject(error)
    }
  });
}

module.exports = {
  createAdmin,
  deleteAdmin
}