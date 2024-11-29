const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    connection = connection || await dbConnection.connect();
    return connection;
};

const getDetalles = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Detalle');
    return result.rows;
};

const getDetalleById = async (id) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Detalle WHERE id = $1', [id]);
    return result.rows[0];
};

const createDetalle = async (detalle) => {
    const client = await getConnection();
    const result = await client.query(
        'INSERT INTO Detalle (cantidad, tamaño, subtotal, id_producto, id_carrito) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [detalle.cantidad, detalle.tamaño, detalle.subtotal, detalle.id_producto, detalle.id_carrito]
    );
    return result.rows[0];
};

const updateDetalle = async (id, detalle) => {
    const client = await getConnection();
    const result = await client.query(
        'UPDATE Detalle SET cantidad = $1, tamaño = $2, subtotal = $3, id_producto = $4, id_carrito = $5 WHERE id = $6 RETURNING *',
        [detalle.cantidad, detalle.tamaño, detalle.subtotal, detalle.id_producto, detalle.id_carrito, id]
    );
    return result.rows[0];
};

const deleteDetalle = async (id) => {
    const client = await getConnection();
    const result = await client.query('DELETE FROM Detalle WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
};

module.exports = {
    getDetalles,
    getDetalleById,
    createDetalle,
    updateDetalle,
    deleteDetalle
};