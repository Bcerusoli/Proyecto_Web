const usuarioRepository = require('../repositories/usuario');
const clienteRepository = require('../repositories/cliente');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioRepository.getUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
};

exports.getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await usuarioRepository.getUsuarioById(id);
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario', error });
    }
};

exports.createUsuario = async (req, res) => {
    const { full_name, username, email, contraseña, esadmin } = req.body;

    
    console.log('Datos recibidos para crear usuario:', req.body);

    
    if (!full_name) {
        return res.status(400).json({ message: 'El nombre es requerido.' });
    }
    if (!username) {
        return res.status(400).json({ message: 'El username es requerido.' });
    }
    if (!email) {
        return res.status(400).json({ message: 'El email es requerido.' });
    }
    
    if (!contraseña || contraseña.length < 8) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    try {
        
        const existingUsername = await usuarioRepository.getUsuarioByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
        }

        const existingEmail = await usuarioRepository.getUsuarioByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'El correo electrónico ya existe.' });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);

        const esAdminValue = esadmin || false;

        const nuevoUsuario = await usuarioRepository.createUsuario({
            nombre: full_name,
            username,
            email,
            contraseña: hashedPassword,
            esadmin: esAdminValue
        });
        

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
};



exports.login = async (req, res) => {
    const { identifier, contraseña } = req.body;
    try {
        let usuario;
        if (identifier.includes('@')) {
            usuario = await usuarioRepository.getUsuarioByEmail(identifier);
        } else {
            usuario = await usuarioRepository.getUsuarioByUsername(identifier);
        }

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        
        const token = jwt.sign(
            { id: usuario.id, esadmin: usuario.esadmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, esadmin: usuario.esadmin });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const usuarios = await usuarioRepository.getAllUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
};