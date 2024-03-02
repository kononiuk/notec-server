const express = require('express');
const adminAuth = require('../../middleware/admin-auth');
const Customer = require('../../models/customer');

const router = new express.Router();

router.get('/admin/customers', adminAuth, async (req, res) => {
  const customers = await Customer.find({});
  res.send(customers);
});

module.exports = router;