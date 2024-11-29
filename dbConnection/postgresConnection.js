const { Pool } = require('pg');

const dbConnection = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DATABASE || 'PerfumeriaWeb',
    port: process.env.POSTGRES_PORT || 5432,
});


dbConnection.on('error', (err, client) => {
    console.error('Error en la conexión a la base de datos:', err);
    process.exit(-1);
});


dbConnection.connect((err, client, release) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
    } else {
        console.log('Conexión exitosa a la base de datos');
        release();
    }
});

module.exports = dbConnection;