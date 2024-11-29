const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    connection = connection || await dbConnection.connect();
    return connection;
};

const getClientes = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Cliente');
    return result.rows;
};

const getClienteById = async (id) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Cliente WHERE id = $1', [id]);
    return result.rows[0];
};

const createCliente = async (cliente) => {
    const client = await getConnection();
    const result = await client.query(
        'INSERT INTO Cliente (id, nit, direccion_entrega) VALUES ($1, $2, $3) RETURNING *',
        [cliente.id, cliente.nit, cliente.direccion_entrega]
    );
    return result.rows[0];
};

const updateCliente = async (id, cliente) => {
    const client = await getConnection();
    const result = await client.query(
        'UPDATE Cliente SET nit = $1, direccion_entrega = $2 WHERE id = $3 RETURNING *',
        [cliente.nit, cliente.direccion_entrega, id]
    );
    return result.rows[0];
};

const deleteCliente = async (id) => {
    const client = await getConnection();
    const result = await client.query('DELETE FROM Cliente WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
};

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};