const express = require('express');
const authController = require("../controllers/auth");

const router=express.Router();

router.post('/signup',authController.signup);
router.post('/validate',authController.validate);
router.post('/validate_email',authController.validate_email);
router.post('/create_acc_1',authController.createacc1);
router.get('/create_acc2',authController.createacc2);
module.exports = router;