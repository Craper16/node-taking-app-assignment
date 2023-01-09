const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signupValidation = [
  check('username')
    .isString()
    .withMessage('Username must be a string')
    .not()
    .isEmpty()
    .withMessage('Username must not be empty')
    .isLength({ min: 5, max: 12 })
    .withMessage('Username must be between 5 and 12 characters long')
    .custom((value) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject('Username already taken');
        }
      });
    }),
  check('password')
    .isString()
    .withMessage('Password must be a string')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
    )
    .withMessage(
      'Password must contain 6 or more characters, with 1 upper case, 1 lower case and a special character'
    )
    .not()
    .isEmpty()
    .withMessage('Password must not be empty'),
];

exports.loginValidation = [
  check('username')
    .isString()
    .withMessage('Username must be a string')
    .not()
    .isEmpty()
    .custom(async (value, { req }) => {
      return await User.findOne({ username: value }).then(async (user) => {
        if (!user) {
          return Promise.reject('Please check your login credentials');
        }
        const isEqual = await bcrypt.compare(req.body.password, user.password);
        if (!isEqual) {
          return Promise.reject('Please check your login credentials');
        }
      });
    }),
  check('password')
    .isString()
    .withMessage('Password must be a string')
    .not()
    .isEmpty()
    .withMessage('Password must not be empty'),
];
