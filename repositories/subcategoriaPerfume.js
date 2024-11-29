const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    connection = connection || await dbConnection.connect();
    return connection;
};

const getSubcategoriasPerfume = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM SubcategoriaPerfume');
    return result.rows;
};

const getSubcategoriaPerfumeById = async (id) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM SubcategoriaPerfume WHERE id = $1', [id]);
    return result.rows[0];
};

const createSubcategoriaPerfume = async (subcategoriaPerfume) => {
    const client = await getConnection();
    const result = await client.query(
        'INSERT INTO SubcategoriaPerfume (nombre, id_categoria) VALUES ($1, $2) RETURNING *',
        [subcategoriaPerfume.nombre, subcategoriaPerfume.id_categoria]
    );
    return result.rows[0];
};

const updateSubcategoriaPerfume = async (id, subcategoriaPerfume) => {
    const client = await getConnection();
    const result = await client.query(
        'UPDATE SubcategoriaPerfume SET nombre = $1, id_categoria = $2 WHERE id = $3 RETURNING *',
        [subcategoriaPerfume.nombre, subcategoriaPerfume.id_categoria, id]
    );
    return result.rows[0];
};

const deleteSubcategoriaPerfume = async (id) => {
    const client = await getConnection();
    const result = await client.query('DELETE FROM SubcategoriaPerfume WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
};

module.exports = {
    getSubcategoriasPerfume,
    getSubcategoriaPerfumeById,
    createSubcategoriaPerfume,
    updateSubcategoriaPerfume,
    deleteSubcategoriaPerfume
};