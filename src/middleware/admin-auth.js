const Admin = require('../models/admin');

module.exports = async function (req, res, next) {
  if (req.session && req.session.adminId) {
    try {
      const admin = await Admin.findById(req.session.adminId);
      if (!admin) {
        next(new Error('AuthenticationError'));
      } else {
        req.admin = admin;
        next();
      }
    } catch (err) {
      req.session.isLogin = false;
      next();
    }
  } else {
    req.session.isLogin = false;
    next();
  }
};