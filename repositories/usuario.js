const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    if (!connection) {
        connection = await dbConnection.connect();
    }
    return connection;
};

const getUsuarios = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Usuario');
    return result.rows;
};

const getUsuarioById = async (id) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Usuario WHERE id = $1', [id]);
    return result.rows[0];
};

const getUsuarioByEmail = async (email) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Usuario WHERE email = $1', [email]);
    return result.rows[0];
};

const getUsuarioByUsername = async (username) => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Usuario WHERE username = $1', [username]);
    return result.rows[0];
};

const createUsuario = async (usuario) => {
    const client = await getConnection();

   
    console.log('Creando usuario en el repositorio:', usuario);

  
    if (!usuario.nombre) {
        throw new Error('El nombre es requerido.');
    }

    const esAdminValue = (typeof usuario.esadmin === 'boolean') ? usuario.esadmin : false;

    const result = await client.query(
        'INSERT INTO Usuario (nombre, username, email, contraseña, esadmin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [usuario.nombre, usuario.username, usuario.email, usuario.contraseña, esAdminValue]
    );
    return result.rows[0];
};



module.exports = {
    getUsuarios,
    getUsuarioById,
    getUsuarioByEmail,
    getUsuarioByUsername,
    createUsuario
    
};