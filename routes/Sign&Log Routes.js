const express = require('express');
const authController = require('../controllers/authController')

const router = express.Router();
router
  .route('/signup')
  .post(authController.SignUp);
router
  .route('/login')
  .post(authController.Login);

module.exports = router;