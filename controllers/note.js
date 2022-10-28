const express = require('express');
const { body } = require('express-validator');

const noteController = require('../services/note');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/all',isAuth, noteController.getNotes);

router.get('/:noteId', isAuth, noteController.getNote);

router.post('/', isAuth, noteController.createNote);

router.put('/:noteId',isAuth, noteController.updateNote);

router.delete('/:noteId', isAuth, noteController.deleteNote);

module.exports = router;