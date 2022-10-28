const { validationResult } = require('express-validator');

const Category = require('../models/category');
const User = require('../models/user');
const Note = require('../models/note');

exports.getNotes = async (req, res, next) => {
  try {
    const noteCategory = req.body.noteCategory;
    const tags = req.body.tags;
    const FilterByUpdateDate = req.body.FilterByUpdateDate;
    
    if (noteCategory) {
      if (FilterByUpdateDate !== true) {
        const catNoteCategory = await Category.findOne({ title: noteCategory })
        const searchByCategory = await Note.find({noteCategory: catNoteCategory});
        res.status(200).json({ message: 'Notes fetched', searchByCategory: searchByCategory });
        res.end();
      }
      const catNoteCategory = await Category.findOne({ title: noteCategory })
      const searchByCategory = await Note.find({noteCategory: catNoteCategory}).sort({ updatedAt: -1 });
      res.status(200).json({ message: 'Notes fetched', searchByCategory: searchByCategory });
      res.end();
    } else if (tags) {
      if (FilterByUpdateDate !== true) {
        const searchByTags = await Note.find({tags: tags});
        res.status(200).json({ message: 'Notes fetched', searchByTags: searchByTags });
        res.end();
      }
      const searchByTags = await Note.find({tags: tags}).sort({ updatedAt: -1 });
      res.status(200).json({ message: 'Notes fetched', searchByTags: searchByTags });
      res.end();
    } else if (!noteCategory && !tags) {
      if (FilterByUpdateDate !== true) {
        const notes = await Note.find();
        res.status(200).json({ message: 'Notes fetched', notes:notes });
        res.end();
      }
      const notes = await Note.find().sort({ updatedAt: -1});
      res.status(200).json({ message: 'Notes fetched', notes:notes });
      res.end();
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  const note = await Note.findById(noteId);
  try {
    if (!note) {
      const error = new Error('Could not find note');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Note fetched', note:note });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  } 
};


exports.createNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('failed to create note');
    error.statusCode = 422;
    throw error;
  }
  try {
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const noteCategoryId = await Category.findOne({title: req.body.noteCategory});
    if (!noteCategoryId) {
      const error = new Error('Invald category');
      error.statusCode = 404;
      throw error;
    }
    const noteCategory = noteCategoryId._id;
    const note = new Note({
      title: title,
      content: content,
      tags: tags,
      noteCategory: noteCategory,
      creator: req.userId
    });
    await note.save();
    const user = await User.findById(req.userId);
    user.notes.push(note);
    await user.save();
    noteCategoryId.notes.push(note);
    await noteCategoryId.save();
    res.status(201).json({
      message: 'Note created successfully',
      note: note,
      creator: req.userId
    });
  } catch (err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Failed to update note');
        error.statusCode = 422;
        throw error;
      }
      const title = req.body.title;
      const content = req.body.content;
      const tags = req.body.tags;
      const noteCategoryId = await Category.findOne({title: req.body.noteCategory});
      if(!noteCategoryId) {
        const error = new Error('Invalid Category');
        error.statusCode = 404;
        throw error;
      }
      const noteCategory = noteCategoryId._id;

      const note = await Note.findById(noteId);
      if(!note) {
        const error = new Error('Note not found');
        error.statusCode = 404;
        throw error;
      }
      if (note.creator.toString() !== req.userId) {
        const error = new Error('Not Authorized');
        error.statusCode = 403;
        throw error;
      }
      if(note.noteCategory === noteCategory) {
        note.title = title;
        note.content = content;
        note.tags = tags;
        const result = await note.save();
        res.status(200).json({ message: 'Note updated', note:result });
        } else if (note.noteCategory !== noteCategory) {      
          const remNote = await Category.findById(note.noteCategory);
          console.log(remNote);
          remNote.notes.pull(noteId);
          await remNote.save();
          note.title = title;
          note.content = content;
          note.tags = tags;
          note.noteCategory = noteCategory;
          await note.save();
          noteCategoryId.notes.push(noteId);
          await noteCategoryId.save();
          res.status(200).json({ message: 'Note Updated', note: note, category: noteCategoryId });
        }     
    } catch (err) {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};

exports.deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  try {
    const note = await Note.findById(noteId);
    if (!note) {
      const error = new Error('note not found');
      error.statusCode = 404;
      throw error;
    }
    if (note.creator.toString() !== req.userId) {
      const error = new Error('Not Authorized');
      error.statusCode = 403;
      throw error;
    }
    const category = await Category.findOne(note.noteCategory);
    category.notes.pull(noteId);
    await category.save();
    const user = await User.findById(req.userId);
    user.notes.pull(noteId);
    await user.save();
    await Note.findByIdAndRemove(noteId);
    res.status(200).json({ message: 'Deleted note' });
  } catch (err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
