const detalleRepository = require('../repositories/detalle');

exports.getDetalles = async (req, res) => {
    try {
        const detalles = await detalleRepository.getDetalles();
        res.status(200).json(detalles);
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        res.status(500).json({ message: 'Error al obtener detalles', error });
    }
};

exports.getDetalleById = async (req, res) => {
    const { id } = req.params;
    try {
        const detalle = await detalleRepository.getDetalleById(id);
        if (detalle) {
            res.status(200).json(detalle);
        } else {
            res.status(404).json({ message: 'Detalle no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener detalle:', error);
        res.status(500).json({ message: 'Error al obtener detalle', error });
    }
};

exports.createDetalle = async (req, res) => {
    try {
        const nuevoDetalle = await detalleRepository.createDetalle(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        console.error('Error al crear detalle:', error);
        res.status(500).json({ message: 'Error al crear detalle', error });
    }
};

exports.updateDetalle = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDetalle = await detalleRepository.updateDetalle(id, req.body);
        if (updatedDetalle) {
            res.status(200).json(updatedDetalle);
        } else {
            res.status(404).json({ message: 'Detalle no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar detalle:', error);
        res.status(500).json({ message: 'Error al actualizar detalle', error });
    }
};

exports.deleteDetalle = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await detalleRepository.deleteDetalle(id);
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Detalle no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar detalle:', error);
        res.status(500).json({ message: 'Error al eliminar detalle', error });
    }
};