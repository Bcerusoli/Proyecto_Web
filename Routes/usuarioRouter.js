

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');


router.post('/register', usuarioController.createUsuario);
router.post('/login', usuarioController.login);

// Rutas protegidas para usuarios autenticados
router.get('/', auth, usuarioController.getUsuarios);
router.get('/:id', auth, usuarioController.getUsuarioById);



router.get('/admin/users', auth, isAdmin, usuarioController.getAllUsers);


module.exports = router;