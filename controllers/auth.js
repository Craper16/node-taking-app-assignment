const express = require('express');

const { body } = require('express-validator');

const authController = require('../services/auth');
const User = require('../models/user');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email').trim()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email already taken');
          }
        })
      }),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .not().isEmpty(),
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
