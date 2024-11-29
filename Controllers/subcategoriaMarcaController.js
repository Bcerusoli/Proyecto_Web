const subcategoriaMarcaRepository = require('../repositories/subcategoriaMarca');

exports.getSubcategoriaMarcaById = async (req, res) => {
    const { id } = req.params;
    try {
        const subcategoriaMarca = await subcategoriaMarcaRepository.getSubcategoriaMarcaById(id);
        res.status(200).json(subcategoriaMarca);
    } catch (error) {
        console.error('Error al obtener la subcategoría de marca:', error);
        res.status(500).json({ message: 'Error al obtener la subcategoría de marca', error: error.message });
    }
};

exports.getAllSubcategoriaMarcas = async (req, res) => {
    try {
        const subcategoriaMarcas = await subcategoriaMarcaRepository.getAllSubcategoriaMarcas();
        res.status(200).json(subcategoriaMarcas);
    } catch (error) {
        console.error('Error al obtener las subcategorías de marca:', error);
        res.status(500).json({ message: 'Error al obtener las subcategorías de marca', error: error.message });
    }
};

exports.createSubcategoriaMarca = async (req, res) => {
    const { nombre, id_categoria, imagenMarca } = req.body;
    try {
        const nuevaSubcategoriaMarca = await subcategoriaMarcaRepository.createSubcategoriaMarca({ nombre, id_categoria, imagenMarca });
        res.status(201).json(nuevaSubcategoriaMarca);
    } catch (error) {
        console.error('Error al crear la subcategoría de marca:', error);
        res.status(500).json({ message: 'Error al crear la subcategoría de marca', error: error.message });
    }
};

exports.updateSubcategoriaMarca = async (req, res) => {
    const { id } = req.params;
    const { nombre, id_categoria, imagenMarca } = req.body;
    try {
        const subcategoriaMarcaActualizada = await subcategoriaMarcaRepository.updateSubcategoriaMarca(id, { nombre, id_categoria, imagenMarca });
        res.status(200).json(subcategoriaMarcaActualizada);
    } catch (error) {
        console.error('Error al actualizar la subcategoría de marca:', error);
        res.status(500).json({ message: 'Error al actualizar la subcategoría de marca', error: error.message });
    }
};

exports.deleteSubcategoriaMarca = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await subcategoriaMarcaRepository.deleteSubcategoriaMarca(id);
        if (result) {
            res.status(200).json({ message: 'Subcategoría de marca eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Subcategoría de marca no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la subcategoría de marca:', error);
        res.status(500).json({ message: 'Error al eliminar la subcategoría de marca', error: error.message });
    }
};