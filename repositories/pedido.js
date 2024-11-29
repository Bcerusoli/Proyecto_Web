

const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    if (!connection) {
        connection = await dbConnection.connect();
    }
    return connection;
};

const getPedidos = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Pedido');
    return result.rows;
};

const getPedidoById = async (id) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Pedido WHERE id = $1', [id]);
    return result.rows[0];
};

const crearPedido = async (pedido) => {
    const client = await getConnection(); 
    try {
        await client.query('BEGIN');

        
        const pedidoResult = await client.query(
            'INSERT INTO Pedido (id_cliente, total, fecha, id_carrito) VALUES ($1, $2, NOW(), $3) RETURNING *',
            [pedido.id_cliente, pedido.total, pedido.id_carrito]
        );
        const nuevoPedido = pedidoResult.rows[0];

        
        const detallePromises = pedido.detalles.map(detalle => {
            return client.query(
                'INSERT INTO Detalle (cantidad, subtotal, id_producto, id_carrito) VALUES ($1, $2, $3, $4)',
                [
                    detalle.cantidad,
                    detalle.subtotal,
                    detalle.id_producto,
                    pedido.id_carrito
                ]
            );
        });

        await Promise.all(detallePromises);

        await client.query('COMMIT');

        return nuevoPedido;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en crearPedido:', error);
        throw error;
    }
};


const getPedidosCompletos = async () => {
    const client = await getConnection();
    const query = `
        SELECT 
            p.id AS pedido_id,
            p.fecha,
            p.total,
            c.id AS cliente_id,
            u.nombre AS cliente_nombre,
            u.email AS cliente_email,
            d.cantidad,
            d.subtotal,
            pr.nombre AS producto_nombre,
            pr.precio AS producto_precio
        FROM Pedido p
        LEFT JOIN Cliente c ON p.id_cliente = c.id
        LEFT JOIN Usuario u ON c.id = u.id
        LEFT JOIN Detalle d ON p.id_carrito = d.id_carrito
        LEFT JOIN Producto pr ON d.id_producto = pr.id
        ORDER BY p.fecha DESC, p.id;
    `;
    const res = await client.query(query);
    
   
    const pedidosMap = new Map();

    res.rows.forEach(row => {
        const pedidoId = row.pedido_id;
        if (!pedidosMap.has(pedidoId)) {
            pedidosMap.set(pedidoId, {
                id: pedidoId,
                fecha: row.fecha,
                total: row.total,
                cliente: {
                    id: row.cliente_id,
                    nombre: row.cliente_nombre,
                    email: row.cliente_email
                },
                productos: []
            });
        }
        if (row.producto_nombre) { 
            pedidosMap.get(pedidoId).productos.push({
                nombre: row.producto_nombre,
                precio: row.producto_precio,
                cantidad: row.cantidad,
                subtotal: row.subtotal
            });
        }
    });

    return Array.from(pedidosMap.values());
};

module.exports = {
    getPedidos,
    getPedidoById,  
    crearPedido,
    getPedidosCompletos
};