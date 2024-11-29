// routes/productoRouter.js

const express = require('express');
const router = express.Router();
const productoController = require('../Controllers/productoController');


const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');



router.get('/subcategorias-marca', auth, isAdmin, productoController.getSubcategoriasMarca);
router.get('/subcategorias-perfume', auth, isAdmin, productoController.getSubcategoriasPerfume);

router.post('/admin', auth, isAdmin, productoController.createProductoAdmin);
router.put('/:id', auth, isAdmin, productoController.updateProducto);
router.delete('/:id', auth, isAdmin, productoController.deleteProducto);

// Rutas públicas
router.get('/populares', productoController.getProductosPopulares);
router.get('/ultimos', productoController.getUltimosProductos);
router.get('/filtrar/:subcategoria', productoController.getProductosPorSubcategoria);
router.get('/buscar', productoController.buscarProductos);
router.get('/marca/:marcaId', productoController.getProductosByMarca); 
router.get('/:id/relacionados', productoController.getProductosRelacionados);
router.get('/:id', productoController.getProductoById);
router.get('/', productoController.getProductos);

module.exports = router;