const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')

/**
 * Middleware for authenticating admin users using Basic Authentication.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const adminAuth = async (req, res, next) => {
  try{
    // Extract and decode the Base64 encoded Authorization header
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      throw new Error('Invalid Authorization header');
    }

    // Extract the username and password from the decoded Authorization header
    const authData = Buffer.from(authorizationHeader.replace('Basic ', ''), 'base64').toString('utf-8');
    const [email, password] = authData.split(':');

    // Find the admin user by email in the database
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error();
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new Error();
    }

    // Attach the authenticated admin user to the request object
    req.admin = admin
    next()
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.'})
  }
}

module.exports = adminAuth