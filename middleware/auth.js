const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado. Token faltante.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token faltante.' });
    }

    console.log('Token recibido:', token); 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded); 
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(400).json({ message: 'Token inválido.' });
    }
};

module.exports = auth;