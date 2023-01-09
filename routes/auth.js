const express = require('express');

const {
  signupValidation,
  loginValidation,
} = require('../validations/authValidations');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signupValidation, authController.signup);

router.post('/login', loginValidation, authController.login);

module.exports = router;
