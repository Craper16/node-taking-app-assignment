const { check } = require('express-validator');

const Category = require('../models/category');

exports.createCategoryValidations = [
  check('title')
    .isString()
    .withMessage('Category title must be a string')
    .not()
    .isEmpty()
    .withMessage('Category title is required')
    .trim()
    .toLowerCase()
    .custom((value) => {
      return Category.findOne({ title: value }).then((category) => {
        if (category) {
          return Promise.reject('Category already exists');
        }
      });
    })
    .isLength({ min: 3, max: 10 })
    .withMessage('Category title must be between 3 to 10 characters'),
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
    .withMessage('Category title must be between 3 to 10 characters'),
];
