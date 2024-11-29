const clienteRepository = require('../repositories/cliente');

exports.getClientes = async (req, res) => {
    try {
        const clientes = await clienteRepository.getClientes();
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error al obtener clientes', error });
    }
};

exports.getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await clienteRepository.getClienteById(id);
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ message: 'Error al obtener cliente', error });
    }
};

exports.createCliente = async (req, res) => {
    try {
        const nuevoCliente = await clienteRepository.createCliente(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error al crear cliente', error });
    }
};

exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCliente = await clienteRepository.updateCliente(id, req.body);
        if (updatedCliente) {
            res.status(200).json(updatedCliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar cliente', error });
    }
};

exports.deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await clienteRepository.deleteCliente(id);
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error al eliminar cliente', error });
    }
};