const subcategoriaPerfumeRepository = require('../repositories/subcategoriaPerfume');

exports.getSubcategoriasPerfume = async (req, res) => {
    try {
        const subcategoriasPerfume = await subcategoriaPerfumeRepository.getSubcategoriasPerfume();
        res.status(200).json(subcategoriasPerfume);
    } catch (error) {
        console.error('Error al obtener subcategorías de perfume:', error);
        res.status(500).json({ message: 'Error al obtener subcategorías de perfume', error });
    }
};

exports.getSubcategoriaPerfumeById = async (req, res) => {
    const { id } = req.params;
    try {
        const subcategoriaPerfume = await subcategoriaPerfumeRepository.getSubcategoriaPerfumeById(id);
        if (subcategoriaPerfume) {
            res.status(200).json(subcategoriaPerfume);
        } else {
            res.status(404).json({ message: 'Subcategoría de perfume no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener subcategoría de perfume:', error);
        res.status(500).json({ message: 'Error al obtener subcategoría de perfume', error });
    }
};

exports.createSubcategoriaPerfume = async (req, res) => {
    try {
        const nuevaSubcategoriaPerfume = await subcategoriaPerfumeRepository.createSubcategoriaPerfume(req.body);
        res.status(201).json(nuevaSubcategoriaPerfume);
    } catch (error) {
        console.error('Error al crear subcategoría de perfume:', error);
        res.status(500).json({ message: 'Error al crear subcategoría de perfume', error });
    }
};

exports.updateSubcategoriaPerfume = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSubcategoriaPerfume = await subcategoriaPerfumeRepository.updateSubcategoriaPerfume(id, req.body);
        if (updatedSubcategoriaPerfume) {
            res.status(200).json(updatedSubcategoriaPerfume);
        } else {
            res.status(404).json({ message: 'Subcategoría de perfume no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar subcategoría de perfume:', error);
        res.status(500).json({ message: 'Error al actualizar subcategoría de perfume', error });
    }
};

exports.deleteSubcategoriaPerfume = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await subcategoriaPerfumeRepository.deleteSubcategoriaPerfume(id);
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Subcategoría de perfume no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar subcategoría de perfume:', error);
        res.status(500).json({ message: 'Error al eliminar subcategoría de perfume', error });
    }
};
exports.getProductosPorSubcategoria = async (req, res) => {
    const { subcategoria } = req.params;
    try {
        const productos = await productoRepository.getProductosPorSubcategoria(subcategoria);
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos por subcategoría:', error);
        res.status(500).json({ message: 'Error al obtener productos por subcategoría', error });
    }
};