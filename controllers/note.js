const { validationResult } = require('express-validator');

const Category = require('../models/category');
const User = require('../models/user');
const Note = require('../models/note');

const PER_PAGE = 2;

const errorFormatter = ({ msg, param, value }) => {
  return {
    message: msg,
    param,
    value,
  };
};

exports.getNotes = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;

    const totalItems = await Note.find({
      creator: req.userId,
    }).countDocuments();

    const notes = await Note.find({ creator: req.userId })
      .populate()
      .sort({ updatedAt: -1 })
      .skip((currentPage - 1) * PER_PAGE)
      .limit(PER_PAGE);

    res.status(200).json({
      notes: notes,
      length: notes.length,
      totalNotes: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      const error = new Error('Could not find note');
      error.statusCode = 404;
      throw error;
    }

    if (note.creator.toString() !== req.userId) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ note: note });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNotesByCategory = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;

    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      const error = new Error('Could not find category');
      error.statusCode = 404;
      throw error;
    }

    const totalItems = await Note.find({
      category: categoryId,
      creator: req.userId,
    }).countDocuments();

    const notes = await Note.find({ category: categoryId, creator: req.userId })
      .populate()
      .sort({ updatedAt: -1 })
      .skip((currentPage - 1) * PER_PAGE)
      .limit(PER_PAGE);

    res.status(200).json({
      notes,
      length: notes.length,
      totalNotes: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getByTag = async (req, res, next) => {
  try {
    const { tag } = req.query;

    const currentPage = req.query.page || 1;

    const totalNotes = await Note.find({
      tags: tag,
      creator: req.userId,
    }).countDocuments();
    const notes = await Note.find({ tags: tag })
      .populate()
      .sort({ updatedAt: -1 })
      .skip((currentPage - 1) * PER_PAGE)
      .limit(PER_PAGE);

    console.log(tag, currentPage);
    res.status(200).json({ notes, totalNotes, length: notes.length });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      const error = new Error({ errors: errors.array() });
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { title, content, tags, categoryTitle } = req.body;
    const category = await Category.findOne({
      title: categoryTitle,
    });
    let note = await Note.findOne({ title: title });
    if (note) {
      const error = new Error('A note with this title already exists');
      error.statusCode = 409;
      throw error;
    }

    if (!category) {
      const error = new Error('Cannot find note with this category title');
      error.statusCode = 409;
      throw error;
    }

    note = new Note({
      title: title,
      content: content,
      tags: tags,
      category: category._id,
      creator: req.userId,
    });

    await note.save();
    const user = await User.findById(req.userId);
    user.notes.push(note);
    await user.save();
    res.status(201).json({
      note: note,
      creator: req.userId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { title, content, tags } = req.body;

    const note = await Note.findById(noteId);
    if (!note) {
      const error = new Error('Could not fetch note');
      error.statusCode = 404;
      throw error;
    }

    if (note.creator.toString() !== req.userId) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error;
    }

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      const error = new Error({ errors: errors.array() });
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    note.title = title;
    note.tags = tags;
    note.content = content;

    const result = await note.save();

    res.status(201).json({ note: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      const error = new Error('Could not find note');
      error.statusCode = 404;
      throw error;
    }

    if (note.creator.toString() !== req.userId) {
      const error = new Error('Not Authorized');
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findById(req.userId);
    user.notes.pull(noteId);
    await user.save();
    await Note.findByIdAndRemove(noteId);
    res
      .status(200)
      .json({ message: 'Successfully deleted note', noteId: noteId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
