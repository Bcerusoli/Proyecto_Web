

const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const auth = require('../middleware/auth');

router.get('/', auth, pedidoController.getPedidosCompletos);
router.get('/:id', auth, pedidoController.getPedidoById);
router.post('/', auth, pedidoController.completarPedido);

module.exports = router;