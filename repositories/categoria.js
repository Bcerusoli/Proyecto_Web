const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    connection = connection || await dbConnection.connect();
    return connection;
};

const getCategorias = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Categoria');
    return result.rows;
};

const getCategoriaById = async (id) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Categoria WHERE id = $1', [id]);
    return result.rows[0];
};

const createCategoria = async (categoria) => {
    const client = await getConnection();
    const result = await client.query(
        'INSERT INTO Categoria (nombre) VALUES ($1) RETURNING *',
        [categoria.nombre]
    );
    return result.rows[0];
};

const updateCategoria = async (id, categoria) => {
    const client = await getConnection();
    const result = await client.query(
        'UPDATE Categoria SET nombre = $1 WHERE id = $2 RETURNING *',
        [categoria.nombre, id]
    );
    return result.rows[0];
};

const deleteCategoria = async (id) => {
    const client = await getConnection();
    const result = await client.query('DELETE FROM Categoria WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
};

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
};