

const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    connection = connection || await dbConnection.connect();
    return connection;
};

const getImagenesByProductoId = async (id_producto) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Imagenes WHERE id_producto = $1', [id_producto]);
    return result.rows;
};

const getBannerImage = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Imagenes WHERE id = $1', [1]); 
    return result.rows[0];
};

const getImagenesDestacadas = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Imagenes WHERE id IN (2, 3, 4)'); 
    return result.rows;
};

const createImagen = async (imagen) => {
    const client = await getConnection();
    const result = await client.query(
        'INSERT INTO Imagenes (ruta_imagen, id_producto) VALUES ($1, $2) RETURNING *',
        [imagen.ruta_imagen, imagen.id_producto]
    );
    return result.rows[0];
};

const deleteImagen = async (id) => {
    const client = await getConnection();
    const result = await client.query('DELETE FROM Imagenes WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
};

module.exports = {
    getImagenesByProductoId,
    getBannerImage,
    getImagenesDestacadas,
    createImagen,
    deleteImagen
};