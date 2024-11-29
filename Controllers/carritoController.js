
const carritoRepository = require('../repositories/carrito');
const productoRepository = require('../repositories/producto');

exports.getCarritos = async (req, res) => {
    try {
        const carritos = await carritoRepository.getCarritos();
        res.status(200).json(carritos);
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ message: 'Error al obtener carritos', error });
    }
};

exports.getCarritoById = async (req, res) => {
    const { id } = req.params;
    try {
        const carrito = await carritoRepository.getCarritoById(id);
        if (carrito) {
            res.status(200).json(carrito);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ message: 'Error al obtener carrito', error });
    }
};

exports.createCarrito = async (req, res) => {
    try {
        const nuevoCarrito = await carritoRepository.createCarrito();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ message: 'Error al crear carrito', error: error.message });
    }
};
exports.updateCarrito = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCarrito = await carritoRepository.updateCarrito(id, req.body);
        if (updatedCarrito) {
            res.status(200).json(updatedCarrito);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({ message: 'Error al actualizar carrito', error });
    }
};

exports.deleteCarrito = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await carritoRepository.deleteCarrito(id);
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar carrito:', error);
        res.status(500).json({ message: 'Error al eliminar carrito', error });
    }
};

exports.agregarAlCarrito = async (req, res) => {
    const { productoId, cantidad } = req.body;
    let { cartId } = req.body; 

    if (!productoId) {
        return res.status(400).json({ message: 'productoId es requerido.' });
    }
    if (!cantidad || cantidad < 1) {
        return res.status(400).json({ message: 'cantidad debe ser al menos 1.' });
    }

    try {
        let carrito;

        if (req.user && req.user.id) {//si hay un usuario logueado, se intenta obtener el carrito por el ID del usuario
            carrito = await carritoRepository.getCarritoPorUserId(req.user.id);
            if (!carrito) {
                carrito = await carritoRepository.createCarrito(req.user.id);
            }
        } else if (cartId) {

            carrito = await carritoRepository.getCarritoById(cartId);//recupero el carrito id
            if (!carrito) {
                carrito = await carritoRepository.createCarrito();
            }
        } else {
            carrito = await carritoRepository.createCarrito();//añado los detalles
        }

        const producto = await productoRepository.getProductoById(productoId);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        
        const precio = parseFloat(producto.precio);
        if (isNaN(precio)) {
            return res.status(400).json({ message: 'Precio del producto inválido.' });
        }

       
        const subtotal = precio * cantidad;

        
        await carritoRepository.agregarDetalle(carrito.id, productoId, cantidad, subtotal);

        res.status(200).json({ message: 'Producto agregado al carrito.', cartId: carrito.id });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


exports.getMyCarrito = async (req, res) => {
    try {
        const userId = req.user.id;//obtenemos el id del usuario logueado
        const carrito = await carritoRepository.getCarritoPorUserId(userId); 

        if (!carrito) {
            return res.status(400).json({ message: 'Carrito no encontrado.' });
        }

        res.status(200).json(carrito);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.getDetallesCarrito = async (req, res) => {
    const { carritoId } = req.params;
    try {
        const detalles = await carritoRepository.getDetallesPorCarrito(carritoId);
        if (detalles.length > 0) {
            res.status(200).json(detalles);
        } else {
            res.status(404).json({ message: 'No se encontraron detalles para este carrito.' });
        }
    } catch (error) {
        console.error('Error al obtener detalles del carrito:', error);
        res.status(500).json({ message: 'Error al obtener detalles del carrito.', error });
    }
};
exports.actualizarCantidad = async (req, res) => {
    const { cartId, productoId, cantidad } = req.body;

    if (!cartId || !productoId || !cantidad) {
        return res.status(400).json({ message: 'Datos incompletos.' });
    }

    console.log(`Actualizando cantidad del producto ${productoId} en el carrito ${cartId} a cantidad ${cantidad}.`);

    try {
        await carritoRepository.actualizarCantidad(cartId, productoId, cantidad);
        res.status(200).json({ message: 'Cantidad actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar la cantidad:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


exports.eliminarProducto = async (req, res) => {
    const { cartId, productoId } = req.body;

    const parsedCartId = parseInt(cartId, 10);
    const parsedProductoId = parseInt(productoId, 10);

    if (isNaN(parsedCartId) || isNaN(parsedProductoId)) {
        return res.status(400).json({ message: 'IDs inválidos.' });
    }

    console.log(`Intentando eliminar el producto ${parsedProductoId} del carrito ${parsedCartId}.`);

    try {
        await carritoRepository.eliminarProducto(parsedCartId, parsedProductoId);
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        
        if (error.message === 'Producto no encontrado en el carrito.') {
            res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
        } else {
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
};
exports.completarPedido = async (req, res) => {
    const { cartId } = req.body;
    const userId = req.user.id;

    if (!cartId) {
        return res.status(400).json({ message: 'cartId es requerido.' });
    }

    try {
        
        const detalles = await carritoRepository.getDetallesPorCarrito(cartId);//obtenemos los detalles del carrito

        if (!detalles || detalles.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío.' });
        }

        
        const total = detalles.reduce((acc, detalle) => acc + parseFloat(detalle.subtotal), 0);

        
        const pedido = {
            id_cliente: userId,
            id_carrito: cartId,
            total,
            detalles,
        };

        
        const nuevoPedido = await pedidoRepository.crearPedido(pedido);

        
        await carritoRepository.vaciarCarrito(cartId);

        res.status(201).json({ message: 'Pedido completado exitosamente.', pedido: nuevoPedido });
    } catch (error) {
        console.error('Error al completar el pedido:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};