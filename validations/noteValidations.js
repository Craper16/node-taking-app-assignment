const { check } = require('express-validator');

const Category = require('../models/category');
const Note = require('../models/note');

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
    .toLowerCase()
    .custom((value) => {
      return Note.findOne({ title: value }).then((note) => {
        if (note) {
          return Promise.reject('A note with this title already exists');
        }
      });
    }),
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
    .withMessage('Tags must not be empty')
    .custom((values) => {
      if (values.length > 10) {
        throw new Error('Cannot enter more than 10 tags');
      }
      return true;
    })
    .custom((values) => {
      values.map((value) => {
        if (value.length > 30) {
          throw new Error(`${value} has more than 30 characters`);
        }
      });
      return true;
    }),
  check('categoryTitle')
    .isString()
    .withMessage('Category title must be a string')
    .not()
    .isEmpty()
    .withMessage('Category title must not be empty')
    .trim()
    .toLowerCase()
    .custom((value) => {
      return Category.findOne({ title: value }).then((category) => {
        if (!category) {
          return Promise.reject('Could not find a category with this title');
        }
      });
    }),
];
