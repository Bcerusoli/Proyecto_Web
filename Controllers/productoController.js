

const productoRepository = require('../repositories/producto');
const path = require('path');



exports.getProductos = async (req, res) => {
    try {
        const productos = await productoRepository.getProductos();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
};


exports.buscarProductos = async (req, res) => {
    try {
        const { search } = req.query;
        
        if (!search) {
            return res.status(400).json({ message: "El parámetro 'search' es requerido." });
        }

        const productos = await productoRepository.buscarProductos(search);
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ message: 'Error al buscar productos', error });
    }
};


exports.getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await productoRepository.getProductoById(id);
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Error al obtener producto', error });
    }
};


exports.getSubcategoriasMarca = async (req, res) => {
    try {
        const subcategoriasMarca = await productoRepository.getSubcategoriasMarca();
        res.status(200).json(subcategoriasMarca);
    } catch (error) {
        console.error('Error al obtener subcategorías de marca:', error);
        res.status(500).json({ message: 'Error al obtener subcategorías de marca', error });
    }
};


exports.getSubcategoriasPerfume = async (req, res) => {
    try {
        const subcategoriasPerfume = await productoRepository.getSubcategoriasPerfume();
        res.status(200).json(subcategoriasPerfume);
    } catch (error) {
        console.error('Error al obtener subcategorías de perfume:', error);
        res.status(500).json({ message: 'Error al obtener subcategorías de perfume', error });
    }
};


exports.createProductoAdmin = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, id_subcategoria_marca, id_subcategoria_perfume } = req.body;

       
        let imagenPath = '';
        if (req.file) {
            imagenPath = `/imagenes/${req.file.filename}`; 
        }

        const nuevoProducto = await productoRepository.createProductoAdmin({
            nombre,
            descripcion,
            precio,
            imagen: imagenPath,
            stock,
            id_subcategoria_marca,
            id_subcategoria_perfume
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear producto (admin):', error);
        res.status(500).json({ message: 'Error al crear producto (admin)', error: error.message });
    }
};

// (para administradores)
exports.updateProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const { nombre, descripcion, precio, stock, id_subcategoria_marca, id_subcategoria_perfume } = req.body;

        // Verificar que todos los campos necesarios estén presentes
        if (!nombre || !descripcion || isNaN(precio) || isNaN(stock) || !id_subcategoria_marca || !id_subcategoria_perfume) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        
        const updatedProducto = await productoRepository.updateProducto(id, {
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria_marca,
            id_subcategoria_perfume
        });

        if (updatedProducto) {
            res.status(200).json(updatedProducto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

// (para administradores)
exports.deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProducto = await productoRepository.deleteProducto(id);

        if (deletedProducto) {
            res.status(200).json({ message: 'Producto eliminado exitosamente.' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};
exports.getSubcategorias = async (req, res) => {
    const { id_categoria } = req.params;
    try {
        const subcategorias = await productoRepository.getSubcategorias(id_categoria);
        res.status(200).json(subcategorias);
    } catch (error) {
        console.error('Error al obtener subcategorías:', error);
        res.status(500).json({ message: 'Error al obtener subcategorías', error });
    }
};


exports.getProductosPopulares = async (req, res) => {
    try {
        const productosPopulares = await productoRepository.getProductosPopulares();
        res.status(200).json(productosPopulares);
    } catch (error) {
        console.error('Error al obtener los productos populares:', error);
        res.status(500).json({ message: 'Error al obtener los productos populares', error: error.message });
    }
};


exports.updateProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProducto = await productoRepository.updateProducto(id, req.body);
        if (updatedProducto) {
            res.status(200).json(updatedProducto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto', error });
    }
};


exports.deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await productoRepository.deleteProducto(id);
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar producto', error });
    }
};


exports.getProductosRelacionados = async (req, res) => {
    const { id } = req.params;
    try {
        const relacionados = await productoRepository.getProductosRelacionados(id);
        res.status(200).json(relacionados);
    } catch (error) {
        console.error('Error al obtener productos relacionados:', error);
        res.status(500).json({ message: 'Error al obtener productos relacionados', error });
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
exports.getProductosByMarca = async (req, res) => {
    const { marcaId } = req.params;
    try {
        const productos = await productoRepository.getProductosByMarca(marcaId);
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos por marca:', error);
        res.status(500).json({ message: 'Error al obtener productos por marca', error: error.message });
    }
};
exports.getUltimosProductos = async (req, res) => {
    try {
        const productos = await productoRepository.getUltimosProductos(5);
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los últimos productos:', error);
        res.status(500).json({ message: 'Error al obtener los últimos productos', error: error.message });
    }
};

