const express = require('express');
const doctorController = require('../controllers/doctorController');
const authController = require('../controllers/authController')
const router = express.Router();
router
  .route('/admindoc')
  .get(authController.protectA,doctorController.getAllDoctorsAdmin)//////////////////////////

  router
  .route('/')
  .get(doctorController.getAllDoctorsUsers)

router
  .patch('/updateMe', authController.protectD, doctorController.updateMe);
router
  .get('/getMe', authController.protectD, doctorController.getMe);
router
  .patch('/booking', authController.protectD, doctorController.BookingAgain);
router
  .route('/:id')
  .get(authController.protectAD,doctorController.getDoctor)
  .patch(authController.protectA,doctorController.updateDoctor)
  .delete(authController.protectA,doctorController.deleteDoctor);///////////////////
  
module.exports = router;
