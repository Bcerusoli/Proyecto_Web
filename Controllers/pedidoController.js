const pedidoRepository = require('../repositories/pedido');
const carritoRepository = require('../repositories/carrito');



exports.getPedidoById = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await pedidoRepository.getPedidoById(id);
        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener pedido:', error);
        res.status(500).json({ message: 'Error al obtener pedido', error });
    }
};
exports.getPedidosCompletos = async (req, res) => {
    try {
        const pedidos = await pedidoRepository.getPedidosCompletos();
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos completos:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
};

exports.completarPedido = async (req, res) => {
    const { cartId } = req.body;
    const userId = req.user.id; 

    if (!cartId) {
        return res.status(400).json({ message: 'cartId es requerido.' });
    }

    try {
        
        const actualizo = await carritoRepository.actualizarIdCliente(cartId, userId);
        if (!actualizo) {
            return res.status(404).json({ message: 'Carrito no encontrado o no se pudo actualizar.' });
        }

        
        const detalles = await carritoRepository.getDetallesPorCarrito(cartId);
        if (!detalles || detalles.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío.' });
        }

       
        const total = detalles.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

        
        const pedido = {
            id_cliente: userId,
            id_carrito: cartId,
            total,
            detalles
        };

        
        const nuevoPedido = await pedidoRepository.crearPedido(pedido);

       
        await carritoRepository.vaciarCarrito(cartId);

        res.status(201).json({ message: 'Pedido completado exitosamente.', pedido: nuevoPedido });
    } catch (error) {
        console.error('Error al completar el pedido:', error);
        res.status(500).json({ message: 'Error al completar el pedido.', error: error.message });
    }
};

exports.getPedidoById = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await pedidoRepository.getPedidoById(id);
        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener pedido:', error);
        res.status(500).json({ message: 'Error al obtener pedido', error });
    }
};