const express = require('express');
const { body } = require('express-validator');

const categoryController = require('../services/category');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/all',isAuth, categoryController.getCategories);

router.get('/:categoryId', isAuth, categoryController.getCategory);

router.post('/',isAuth, categoryController.createCategory);

router.put('/:categoryId',  isAuth, categoryController.updateCategory); //update

router.delete('/:categoryId',isAuth, categoryController.deleteCategory); //delete


module.exports = router;


