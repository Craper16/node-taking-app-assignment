const { check } = require('express-validator');

exports.createNoteValidations = [
  check('title')
    .isString()
    .withMessage('Note title must be a string')
    .not()
    .isEmpty()
    .withMessage('Note title must not be empty')
    .isLength({ min: 5, max: 50 })
    .withMessage('Note title must be between 5 and 50 characters')
    .trim()
    .toLowerCase(),
  check('content')
    .isString()
    .withMessage('Note content must be a string')
    .not()
    .isEmpty()
    .withMessage('Note content must not be empty')
    .isLength({ min: 5, max: 500 })
    .withMessage('Note content must be between 5 and 500 characters')
    .trim()
    .toLowerCase(),
  check('tags')
    .isArray()
    .withMessage('Tags must be an Array')
    .not()
    .isEmpty()
    .withMessage('Must add at least 1 tag')
    .custom((values) => {
      if (values.length > 10) {
        return Promise.reject('Cannot enter more than 10 tags');
      }
      return true;
    }),
  check('tags.*')
    .isString()
    .withMessage('A tag must be a string')
    .not()
    .isEmpty()
    .withMessage('A tag must not be empty')
    .toLowerCase()
    .isLength({ min: 3, max: 15 })
    .withMessage('A tag must be between 3 to 15 characters long')
    .not()
    .contains(' ')
    .withMessage('A tag must be a single word'),
  check('categoryTitle')
    .isString()
    .withMessage('Category title must be a string')
    .not()
    .isEmpty()
    .withMessage('Category title must not be empty')
    .trim()
    .toLowerCase(),
];

exports.updateNoteValidation = [
  check('title')
    .isString()
    .withMessage('Note title must be a string')
    .not()
    .isEmpty()
    .withMessage('Note title must not be empty')
    .isLength({ min: 5, max: 50 })
    .withMessage('Note title must be between 5 and 50 characters')
    .trim()
    .toLowerCase(),
  check('content')
    .isString()
    .withMessage('Note content must be a string')
    .not()
    .isEmpty()
    .withMessage('Note content must not be empty')
    .isLength({ min: 5, max: 500 })
    .withMessage('Note content must be between 5 and 500 characters')
    .trim()
    .toLowerCase(),
  check('tags')
    .isArray()
    .withMessage('Tags must be an Array')
    .not()
    .isEmpty()
    .withMessage('Must add at least 1 tag')
    .custom((values) => {
      if (values.length > 10) {
        return Promise.reject('Cannot enter more than 10 tags');
      }
      return true;
    }),
  check('tags.*')
    .isString()
    .withMessage('A tag must be a string')
    .not()
    .isEmpty()
    .withMessage('A tag must not be empty')
    .toLowerCase()
    .isLength({ min: 3, max: 15 })
    .withMessage('A tag must be between 3 to 15 characters long')
    .not()
    .contains(' ')
    .withMessage('A tag must be a single word'),
];
