const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const pedidoController = require('../controllers/pedidoController');
const auth = require('../middleware/auth');

router.get('/', auth, carritoController.getCarritos);
router.get('/mine', auth, carritoController.getMyCarrito);
router.get('/:id', auth, carritoController.getCarritoById);
router.get('/detalles/:carritoId', carritoController.getDetallesCarrito);

router.post('/', carritoController.createCarrito);
router.post('/agregar', carritoController.agregarAlCarrito);
router.post('/completar', auth, pedidoController.completarPedido);
// routes/carritoRouter.js

router.put('/actualizar', carritoController.actualizarCantidad);
router.put('/:id', auth, carritoController.updateCarrito);
// routes/carritoRouter.js

router.delete('/eliminar', carritoController.eliminarProducto);
router.delete('/:id', auth, carritoController.deleteCarrito);


module.exports = router;