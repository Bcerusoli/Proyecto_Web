const express = require('express');
const router = express.Router();
const subcategoriaPerfumeController = require('../controllers/subcategoriaPerfumeController');

router.get('/', subcategoriaPerfumeController.getSubcategoriasPerfume);
router.get('/:id', subcategoriaPerfumeController.getSubcategoriaPerfumeById);
router.post('/', subcategoriaPerfumeController.createSubcategoriaPerfume);
router.put('/:id', subcategoriaPerfumeController.updateSubcategoriaPerfume);
router.delete('/:id', subcategoriaPerfumeController.deleteSubcategoriaPerfume);

module.exports = router;