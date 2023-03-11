const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController')
const router = express.Router();
router
  .route('/')
  .get(authController.protectA, userController.getAllUsers)

router
  .patch('/updateMe', authController.protectU, userController.updateMe);

router
  .get('/getMe', authController.protectU, userController.getMe);

router
  .patch('/booking', authController.protectU, userController.Booking);

router
  .patch('/cancel', authController.protectAU, userController.CancelBook);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
  .route('/:id')
  .get(authController.protectAD, userController.getUser)
  .patch(authController.protectAD, userController.updateUser)
  .delete(authController.protectA, userController.deleteUser);
module.exports = router;