const express = require('express');

const {
  createNoteValidations,
  updateNoteValidation,
} = require('../validations/noteValidations');

const noteController = require('../controllers/note');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/notes', isAuth, noteController.getNotes);

router.get('/:noteId', isAuth, noteController.getNote);

router.get('/category/:categoryId', isAuth, noteController.getNotesByCategory);

router.get('/search/searchbytag', isAuth, noteController.getByTag);

router.post(
  '/create-note',
  isAuth,
  createNoteValidations,
  noteController.createNote
);

router.put(
  '/update-note/:noteId',
  isAuth,
  updateNoteValidation,
  noteController.updateNote
);

router.delete('/delete-note/:noteId', isAuth, noteController.deleteNote);

module.exports = router;
