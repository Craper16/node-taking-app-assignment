const { validationResult } = require('express-validator');

const Category = require('../models/category');
const Note = require('../models/note');
const User = require('../models/user');

const PER_PAGE = 2;

const errorFormatter = ({ msg, param, value }) => {
  return {
    message: msg,
    param,
    value,
  };
};

exports.getCategories = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  try {
    const totalItems = await Category.find().countDocuments();
    const categories = await Category.find()
      .sort({ updatedAt: -1 })
      .skip((currentPage - 1) * PER_PAGE)
      .limit(PER_PAGE);

    res.status(200).json({
      categories: categories,
      length: categories.length,
      totalCategories: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  try {
    if (!category) {
      const error = new Error('Could not find category');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ category: category });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { title } = req.body;
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      const error = new Error({ errors: errors.array() });
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let category = await Category.findOne({ title: title });
    if (category) {
      const error = new Error('Category with this title already exists');
      error.statusCode = 409;
      throw error;
    }

    category = new Category({
      title: title,
    });
    await category.save();
    res.status(201).json({
      message: 'Category created successfuly',
      data: { category: category },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      const error = new Error({ errors: errors.array() });
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { title } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Category could not be fetched');
      error.statusCode = 403;
      throw error;
    }
    category.title = title;
    const result = await category.save();
    res
      .status(200)
      .json({ message: 'Category Updated', category: result.title });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const pullFromUser = async (user, notesIds) => {
  return await user.notes.pull(notesIds);
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      const error = new Error('Category could not be fetched');
      error.statusCode = 404;
      throw error;
    }

    const notes = await Note.find({ category: categoryId });

    const notesIds = await notes.map((note) => {
      return note._id;
    });

    await User.updateMany({}, { $pullAll: { notes: notesIds } });
    await Note.deleteMany({ category: category._id });
    const categoryDeleted = await Category.findByIdAndRemove(categoryId);
    res.status(200).json({
      message: 'Category deleted successfuly',
      category: categoryDeleted.title,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
