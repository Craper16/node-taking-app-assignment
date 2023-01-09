const express = require('express');

const { createNoteValidations } = require('../validations/noteValidations');

const noteController = require('../controllers/note');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/all', isAuth, noteController.getNotes);

router.get('/:noteId', isAuth, noteController.getNote);

router.post(
  '/create-note',
  isAuth,
  createNoteValidations,
  noteController.createNote
);

router.put(
  '/update-note/:categoryId/:noteId',
  isAuth,
  noteController.updateNote
);

router.delete('/:noteId', isAuth, noteController.deleteNote);

module.exports = router;
