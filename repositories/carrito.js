
const pool = require('../dbConnection/postgresConnection');

const getCarritos = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM Carrito');
        return result.rows;
    } catch (error) {
        console.error('Error en getCarritos:', error);
        throw error;
    } finally {
        client.release();
    }
};


const getCarritoById = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM Carrito WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en getCarritoById:', error);
        throw error;
    } finally {
        client.release();
    }
};



const createCarrito = async (id_cliente = null) => {
    try {
        const result = await pool.query(
            'INSERT INTO Carrito (id_cliente) VALUES ($1) RETURNING *',
            [id_cliente]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error en createCarrito:', error);
        throw error;
    }
};


const updateCarrito = async (id, carrito) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'UPDATE Carrito SET id_cliente = $1 WHERE id = $2 RETURNING *',
            [carrito.id_cliente, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error en updateCarrito:', error);
        throw error;
    } finally {
        client.release();
    }
};


const deleteCarrito = async (id) => {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM Carrito WHERE id = $1 RETURNING *', [id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error en deleteCarrito:', error);
        throw error;
    } finally {
        client.release();
    }
};


const getCarritoPorCliente = async (id_cliente) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM Carrito WHERE id_cliente = $1', [id_cliente]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en getCarritoPorCliente:', error);
        throw error;
    } finally {
        client.release();
    }
};

const getDetallesPorCarrito = async (carritoId) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT Detalle.*, Producto.nombre, Producto.precio, Producto.imagen
            FROM Detalle
            JOIN Producto ON Detalle.id_producto = Producto.id
            WHERE Detalle.id_carrito = $1
        `;
        const { rows } = await client.query(query, [carritoId]);
        return rows;
    } catch (error) {
        console.error('Error en getDetallesPorCarrito:', error);
        throw error;
    } finally {
        client.release();
    }
};

const obtenerDetalleEnCarrito = async (carritoId, productoId, tamaño) => {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM Detalle WHERE id_carrito = $1 AND id_producto = $2 AND tamaño = $3';
        const { rows } = await client.query(query, [carritoId, productoId, tamaño]);
        return rows[0];
    } catch (error) {
        console.error('Error en obtenerDetalleEnCarrito:', error);
        throw error;
    } finally {
        client.release();
    }
};


const agregarDetalle = async (carritoId, productoId, cantidad, subtotal) => {
    const client = await pool.connect();
    try {
       
        const check = await client.query(
            'SELECT * FROM Detalle WHERE id_carrito = $1 AND id_producto = $2',
            [carritoId, productoId]
        );

        if (check.rows.length > 0) {
            
            const existingCantidad = parseInt(check.rows[0].cantidad, 10);
            const existingSubtotal = parseFloat(check.rows[0].subtotal);

            const newCantidad = existingCantidad + parseInt(cantidad, 10);
            const newSubtotal = existingSubtotal + parseFloat(subtotal);

            await client.query(
                'UPDATE Detalle SET cantidad = $1, subtotal = $2 WHERE id_carrito = $3 AND id_producto = $4',
                [newCantidad, newSubtotal, carritoId, productoId]
            );
        } else {
           
            await client.query(
                'INSERT INTO Detalle (id_carrito, id_producto, cantidad, subtotal) VALUES ($1, $2, $3, $4)',
                [carritoId, productoId, cantidad, subtotal]
            );
        }
    } catch (error) {
        console.error('Error en agregarDetalle:', error);
        throw error;
    } finally {
        client.release();
    }
};

const vaciarCarrito = async (carritoId) => {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM Detalle WHERE id_carrito = $1', [carritoId]);
    } catch (error) {
        console.error('Error en vaciarCarrito:', error);
        throw error;
    } finally {
        client.release();
    }
};


const actualizarCantidad = async (carritoId, productoId, cantidad) => {
    const client = await pool.connect();
    try {
       
        const detalle = await client.query(
            'SELECT * FROM Detalle WHERE id_carrito = $1 AND id_producto = $2',
            [carritoId, productoId]
        );

        if (detalle.rows.length === 0) {
            throw new Error('Producto no encontrado en el carrito.');
        }

        
        const precio = detalle.rows[0].subtotal / detalle.rows[0].cantidad;
        const nuevoSubtotal = precio * cantidad;

        
        await client.query(
            'UPDATE Detalle SET cantidad = $1, subtotal = $2 WHERE id_carrito = $3 AND id_producto = $4',
            [cantidad, nuevoSubtotal, carritoId, productoId]
        );
    } catch (error) {
        console.error('Error en actualizarCantidad:', error);
        throw error;
    } finally {
        client.release();
    }
};
const eliminarProducto = async (carritoId, productoId) => {
    const client = await pool.connect();
    try {
        console.log(`Eliminando producto ID: ${productoId} del carrito ID: ${carritoId}`);

        const result = await client.query(
            'DELETE FROM Detalle WHERE id_carrito = $1 AND id_producto = $2 RETURNING *',
            [carritoId, productoId]
        );

        console.log(`Filas afectadas: ${result.rowCount}`);

        if (result.rowCount === 0) {
            throw new Error('Producto no encontrado en el carrito.');
        }

        console.log('Producto eliminado exitosamente.');
    } catch (error) {
        console.error('Error en eliminarProducto:', error.message);
        throw error;
    } finally {
        client.release();
    }
};
const actualizarIdCliente = async (cartId, clientId) => {
    try {
        const result = await pool.query(
            'UPDATE Carrito SET id_cliente = $1 WHERE id = $2 RETURNING *',
            [clientId, cartId]
        );
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error en actualizarIdCliente:', error);
        throw error;
    }
};

module.exports = {
    getCarritos,
    getCarritoById,
    createCarrito,
    updateCarrito,
    deleteCarrito,
    getCarritoPorCliente,
    obtenerDetalleEnCarrito,
    agregarDetalle,
    getDetallesPorCarrito,
    vaciarCarrito,
    actualizarIdCliente,
    actualizarCantidad,
    eliminarProducto
};