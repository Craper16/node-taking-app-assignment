const { validationResult } = require('express-validator');

const Category = require('../models/category');
const Note = require('../models/note');
const User = require('../models/user');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: 'Categories fetched',
      categories: categories
    })
  } catch (err){ 
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findById(categoryId);
  try {
    if(!category) {
      const error = new Error('Could not find category');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Category Fetched', category: category });
  } catch (err){
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
try {
const errors = validationResult(req);
if(!errors.isEmpty()) {
  const error = new Error('Category creation failed');
  error.statusCode = 422;
  throw error;
}

const title = req.body.title;

  let category = await Category.findOne({ title: title });
  if (category) {
    const error = new Error('Category already exists');
    error.statusCode = 401;
    throw error;
  }
  category = new Category({
    title: title,
    creator: req.userId
  });
  await category.save();
  res.status(201).json({
    message: 'Category Created',
    category: category,
    creator: req.userId
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
    const categoryId = req.params.categoryId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Failed to update post');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Failed to fetch category');
      error.statusCode = 403;
      throw error;
    }
    if (category.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    category.title = title;
    const result = await category.save();
    res.status(200).json({ message: 'Category Updated', category: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      const error = new Error('Could not find category');
      error.statusCode = 404;
      throw error;
    }
    if (category.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    const notesToDelete = Note.find({noteCategory: categoryId});
    const notesToDeleteIds = [];
    (await notesToDelete).forEach(note => {
      notesToDeleteIds.push(note._id);
    });
    await User.updateOne({_id: category.creator}, {$pull: {notes: {$in: notesToDeleteIds}}});
    await Note.deleteMany({noteCategory: category._id});
    await Category.findByIdAndRemove(categoryId);
    res.status(200).json({message: 'Category Deleted'});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
