const express = require('express');
const router = express.Router();
const imagenController = require('../Controllers/imagenController');


router.get('/producto/:id_producto', imagenController.getImagenesByProductoId);
router.get('/banner', imagenController.getBannerImage);
router.get('/destacadas', imagenController.getImagenesDestacadas);
router.post('/', imagenController.createImagen);
router.delete('/:id', imagenController.deleteImagen);

module.exports = router;