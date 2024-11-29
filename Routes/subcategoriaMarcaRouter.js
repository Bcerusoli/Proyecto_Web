const express = require('express');
const router = express.Router();
const subcategoriaMarcaController = require('../Controllers/subcategoriaMarcaController');


router.get('/:id', subcategoriaMarcaController.getSubcategoriaMarcaById);
router.get('/', subcategoriaMarcaController.getAllSubcategoriaMarcas);
router.post('/', subcategoriaMarcaController.createSubcategoriaMarca);
router.put('/:id', subcategoriaMarcaController.updateSubcategoriaMarca);
router.delete('/:id', subcategoriaMarcaController.deleteSubcategoriaMarca);

module.exports = router;