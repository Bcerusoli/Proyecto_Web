const dbConnection = require('../dbConnection/postgresConnection');
let connection = null;

const getConnection = async () => {
    connection = connection || await dbConnection.connect();
    return connection;
};

const getProductos = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Producto');
    return result.rows;
};
const getUltimosProductos = async (limit = 5) => {
    const client = await getConnection();
    const result = await client.query(
        'SELECT * FROM Producto ORDER BY id DESC LIMIT $1',
        [limit]
    );
    return result.rows;
};
const buscarProductos = async (termino) => {
    const client = await getConnection();
    const query = `
        SELECT * FROM Producto
        WHERE nombre ILIKE $1
        ORDER BY nombre ASC
    `;
    const values = [`%${termino}%`];
    const result = await client.query(query, values);
    return result.rows;
};

const  getProductoById = async (id) => {
    const client = await getConnection();
    const resultProducto = await client.query('SELECT * FROM Producto WHERE id = $1', [id]);
    const producto = resultProducto.rows[0];

    if (producto) {
        const resultImagenes = await client.query('SELECT ruta_imagen FROM Imagenes WHERE id_producto = $1', [id]);
        producto.imagenes = resultImagenes.rows.map(row => row.ruta_imagen);
    }

    return producto;
};

const getProductosPopulares = async () => {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM Producto WHERE id IN (1, 2, 3, 8, 5)'); 
    return result.rows;
};

const getProductosRelacionados = async (id) => {
    const client = await getConnection();
    const query = `
        SELECT p.*
        FROM Producto p
        WHERE p.id_subcategoria_marca = (
            SELECT id_subcategoria_marca FROM Producto WHERE id = $1
        )
        AND p.id != $1
        LIMIT 5
    `;
    const { rows } = await client.query(query, [id]);
    return rows;
};
const getProductosPorSubcategoria = async (subcategoria) => {
    const client = await getConnection();
    const query = `
        SELECT p.*
        FROM Producto p
        JOIN SubcategoriaPerfume sp ON p.id_subcategoria_perfume = sp.id
        WHERE sp.nombre = $1
    `;
    const { rows } = await client.query(query, [subcategoria]);
    return rows;
};
const createProductoAdmin = async (data) => {
    const { nombre, descripcion, precio, imagen, stock, id_subcategoria_marca, id_subcategoria_perfume } = data;
    const client = await getConnection();
    const query = `
        INSERT INTO Producto 
            (nombre, descripcion, precio, imagen, stock, id_subcategoria_marca, id_subcategoria_perfume)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [
        nombre,
        descripcion,
        precio,
        imagen,
        stock,
        id_subcategoria_marca,
        id_subcategoria_perfume
    ];
    const res = await client.query(query, values);
    return res.rows[0];
};

const updateProducto = async (id, data) => {
    const { nombre, descripcion, precio, stock, id_subcategoria_marca, id_subcategoria_perfume } = data;
    const client = await getConnection();

    let query = `UPDATE Producto SET `;
    const updates = [];

    if (nombre) {
        updates.push(`nombre = '${nombre}'`);
    }
    if (descripcion) {
        updates.push(`descripcion = '${descripcion}'`);
    }
    if (precio) {
        updates.push(`precio = ${precio}`);
    }
    if (stock) {
        updates.push(`stock = ${stock}`);
    }
    if (id_subcategoria_marca) {
        updates.push(`id_subcategoria_marca = ${id_subcategoria_marca}`);
    }
    if (id_subcategoria_perfume) {
        updates.push(`id_subcategoria_perfume = ${id_subcategoria_perfume}`);
    }

    if (updates.length === 0) {
        throw new Error('No se proporcionaron campos para actualizar.');
    }

    query += updates.join(', ');
    query += ` WHERE id = ${id} RETURNING *;`;

    const res = await client.query(query);
    return res.rows[0];
};

const getCategorias = async () => {
    const client = await getConnection();
    const query = `SELECT * FROM Categoria ORDER BY nombre ASC;`;
    const res = await client.query(query);
    return res.rows;
};


const getSubcategorias = async (id_categoria) => {
    const client = await getConnection();

    const queryMarca = `SELECT * FROM SubcategoriaMarca WHERE id_categoria = $1 ORDER BY nombre ASC;`;
    const resMarca = await client.query(queryMarca, [id_categoria]);
    
   
    const queryPerfume = `SELECT * FROM SubcategoriaPerfume WHERE id_categoria = $1 ORDER BY nombre ASC;`;
    const resPerfume = await client.query(queryPerfume, [id_categoria]);
    
    return {
        marcas: resMarca.rows,
        perfumes: resPerfume.rows
    };
};
const getProductosByMarca = async (marcaId) => {
    const client = await getConnection();
    const result = await client.query(
        'SELECT * FROM Producto WHERE id_subcategoria_marca = $1',
        [marcaId]
    );
    return result.rows;
};
const getSubcategoriasMarca = async () => {
    const client = await getConnection();
    const query = `SELECT id, nombre FROM SubcategoriaMarca ORDER BY nombre ASC;`;
    const res = await client.query(query);
    return res.rows;
};


const getSubcategoriasPerfume = async () => {
    const client = await getConnection();
    const query = `SELECT id, nombre FROM SubcategoriaPerfume ORDER BY nombre ASC;`;
    const res = await client.query(query);
    return res.rows;
};
const deleteProducto = async (id) => {
    const client = await getConnection();
    const res = await client.query('DELETE FROM Producto WHERE id = $1 RETURNING *;', [id]);
    return res.rows[0];
};


module.exports = {
    getProductos,
    getProductoById,
    getProductosPopulares,
    getProductosRelacionados,
    getProductosPorSubcategoria,
    buscarProductos,
    createProductoAdmin,
    getCategorias,
    getSubcategorias,
    getProductosByMarca,
    getUltimosProductos,
    getSubcategoriasMarca,
    getSubcategoriasPerfume,
    updateProducto,
    deleteProducto
};