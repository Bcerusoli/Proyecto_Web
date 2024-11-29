const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    connection = connection || await dbConnection.connect();
    return connection;
};

const getSubcategoriaMarcaById = async (id) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM SubcategoriaMarca WHERE id = $1', [id]);
    return result.rows[0];
};

const getAllSubcategoriaMarcas = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM SubcategoriaMarca');
    return result.rows;
};

const createSubcategoriaMarca = async (subcategoriaMarca) => {
    const client = await getConnection();
    const result = await client.query(
        'INSERT INTO SubcategoriaMarca (nombre, id_categoria, imagenMarca) VALUES ($1, $2, $3) RETURNING *',
        [subcategoriaMarca.nombre, subcategoriaMarca.id_categoria, subcategoriaMarca.imagenMarca]
    );
    return result.rows[0];
};

const updateSubcategoriaMarca = async (id, subcategoriaMarca) => {
    const client = await getConnection();
    const result = await client.query(
        'UPDATE SubcategoriaMarca SET nombre = $1, id_categoria = $2, imagenMarca = $3 WHERE id = $4 RETURNING *',
        [subcategoriaMarca.nombre, subcategoriaMarca.id_categoria, subcategoriaMarca.imagenMarca, id]
    );
    return result.rows[0];
};

const deleteSubcategoriaMarca = async (id) => {
    const client = await getConnection();
    const result = await client.query('DELETE FROM SubcategoriaMarca WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
};

module.exports = {
    getSubcategoriaMarcaById,
    getAllSubcategoriaMarcas,
    createSubcategoriaMarca,
    updateSubcategoriaMarca,
    deleteSubcategoriaMarca
};