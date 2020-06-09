const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated,jwtAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.send('welcome'));

router.get('/dashboard', jwtAuthenticated, (req, res) =>
  res.json(req.user)
);

module.exports = router;
