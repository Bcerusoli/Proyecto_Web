const categoriaRepository = require('../repositories/categoria');

exports.getCategorias = async (req, res) => {
    try {
        const categorias = await categoriaRepository.getCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error al obtener categorías', error });
    }
};

exports.getCategoriaById = async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await categoriaRepository.getCategoriaById(id);
        if (categoria) {
            res.status(200).json(categoria);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({ message: 'Error al obtener categoría', error });
    }
};

exports.createCategoria = async (req, res) => {
    try {
        const nuevaCategoria = await categoriaRepository.createCategoria(req.body);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ message: 'Error al crear categoría', error });
    }
};

exports.updateCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCategoria = await categoriaRepository.updateCategoria(id, req.body);
        if (updatedCategoria) {
            res.status(200).json(updatedCategoria);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ message: 'Error al actualizar categoría', error });
    }
};

exports.deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await categoriaRepository.deleteCategoria(id);
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ message: 'Error al eliminar categoría', error });
    }
};