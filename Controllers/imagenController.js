const imagenRepository = require('../repositories/imagenRepository');

exports.getImagenesByProductoId = async (req, res) => {
    const { id_producto } = req.params;
    try {
        const imagenes = await imagenRepository.getImagenesByProductoId(id_producto);
        res.status(200).json(imagenes);
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
        res.status(500).json({ message: 'Error al obtener imágenes', error: error.message });
    }
};

exports.getBannerImage = async (req, res) => {
    try {
        const banner = await imagenRepository.getBannerImage();
        if (!banner) {
            return res.status(404).json({ message: 'Banner no encontrado' });
        }
        res.status(200).json(banner);
    } catch (error) {
        console.error('Error al obtener el banner:', error);
        res.status(500).json({ message: 'Error al obtener el banner', error });
    }
};

exports.getImagenesDestacadas = async (req, res) => {
    try {
        const imagenesDestacadas = await imagenRepository.getImagenesDestacadas();
        res.status(200).json(imagenesDestacadas);
    } catch (error) {
        console.error('Error al obtener las imágenes destacadas:', error);
        res.status(500).json({ message: 'Error al obtener las imágenes destacadas', error: error.message });
    }
};

exports.createImagen = async (req, res) => {
    const { ruta_imagen, id_producto } = req.body;
    try {
        const nuevaImagen = await imagenRepository.createImagen({ ruta_imagen, id_producto });
        res.status(201).json(nuevaImagen);
    } catch (error) {
        console.error('Error al crear imagen:', error);
        res.status(500).json({ message: 'Error al crear imagen', error: error.message });
    }
};

exports.deleteImagen = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await imagenRepository.deleteImagen(id);
        if (result) {
            res.status(200).json({ message: 'Imagen eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Imagen no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).json({ message: 'Error al eliminar imagen', error: error.message });
    }
};
