const express = require('express');
const router = new express.Router();
const Admin = require('../../models/admin');
const auth = require('../../middleware/admin-auth')

router.get('/admin/me', auth, async (req, res) => {
  try {
    if (req.session && req.session.adminId) {
      res.send({isLogin: true, error: 'Unable to get admin', adminEmail: req.admin.email});
    } else {
      throw new Error('NotLoggedIn');
    }
  } catch (error) {
    if(error.message === 'NotLoggedIn') {
      res.send({isLogin: false, adminEmail: null, error: error.message});
    } else {
      res.status(500).send({isLogin: false, error: 'Unable to get admin', adminEmail: null});
    }
  }
})

router.post('/admin/login', async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(req.body.email, req.body.password)
    req.session.adminId = admin._id
    // Delete old sessions for this admin user
    admin.sessions.forEach((sessionId) => {
      if (sessionId !== req.sessionID) {
        req.sessionStore.destroy(sessionId, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }
    });

    // Add the new session ID to the sessions field
    admin.sessions = [req.sessionID];
    await admin.save();

    res.send({ email: admin.email })
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      res.status(401).send({ error: 'Invalid email or password' })
    } else {
      res.status(500).send({ error: 'Unable to login' })
    }
  }
});

module.exports = router