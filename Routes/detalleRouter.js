const express = require('express');
const router = express.Router();
const detalleController = require('../controllers/detalleController');
const auth = require('../middleware/auth');

router.get('/', auth, detalleController.getDetalles);
router.get('/:id', auth, detalleController.getDetalleById);
router.post('/', auth, detalleController.createDetalle);
router.put('/:id', auth, detalleController.updateDetalle);
router.delete('/:id', auth, detalleController.deleteDetalle);

module.exports = router;