const { check } = require('express-validator');

exports.createCategoryValidations = [
  check('title')
    .isString()
    .withMessage('Category title must be a string')
    .not()
    .isEmpty()
    .withMessage('Category title is required')
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 10 })
    .withMessage('Category title must be between 3 to 10 characters')
    .not()
    .contains(' ')
    .withMessage('Category must be 1 word'),
];

exports.updateCategoryValidations = [
  check('title')
    .isString()
    .withMessage('Category title must be a string')
    .not()
    .isEmpty()
    .trim()
    .toLowerCase()
    .withMessage('Category title is required')
    .isLength({ min: 3, max: 10 })
    .withMessage('Category title must be between 3 to 10 characters')
    .not()
    .contains(' ')
    .withMessage('Category must be 1 word'),
];
