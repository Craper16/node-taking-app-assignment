const express = require('express');

const {
  createCategoryValidations,
  updateCategoryValidations,
} = require('../validations/categoryValidations');

const categoryController = require('../controllers/category');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/categories', isAuth, categoryController.getCategories);

router.get('/:categoryId', isAuth, categoryController.getCategory);

router.post(
  '/create-category',
  isAuth,
  createCategoryValidations,
  categoryController.createCategory
);

router.put(
  '/update-category/:categoryId',
  isAuth,
  updateCategoryValidations,
  categoryController.updateCategory
); //update

router.delete('/delete-category/:categoryId', isAuth, categoryController.deleteCategory); //delete

module.exports = router;
