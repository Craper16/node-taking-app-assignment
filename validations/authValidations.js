const { check } = require('express-validator');

exports.signupValidation = [
  check('username')
    .isString()
    .withMessage('Username must be a string')
    .not()
    .isEmpty()
    .withMessage('Username must not be empty')
    .isLength({ min: 5, max: 12 })
    .withMessage('Username must be between 5 and 12 characters long'),
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
    .isEmpty(),
  check('password')
    .isString()
    .withMessage('Password must be a string')
    .not()
    .isEmpty()
    .withMessage('Password must not be empty'),
];
