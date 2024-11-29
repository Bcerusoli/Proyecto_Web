

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.esadmin) {
        return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador.' });
    }
    next();
};

module.exports = isAdmin;