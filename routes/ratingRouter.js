const { addRating, getRating } = require("../controllers/ratingController");
const router = require("express").Router();

const authController = require('../controllers/authController')

router.post('/rateDoctor',authController.protectAU,addRating);
router.get('/rateDoctor/:DoctorsId',getRating);

module.exports=router