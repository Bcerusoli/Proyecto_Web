require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));


app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

const usuarioRouter = require('./Routes/usuarioRouter');
const clienteRouter = require('./Routes/clienteRouter');

const detalleRouter = require('./Routes/detalleRouter');
const PedidoRouter = require('./Routes/pedidoRouter');
const carritoRouter = require('./Routes/carritoRouter');
const productoRouter = require('./Routes/productoRouter');
const subcategoriaPerfumeRouter = require('./Routes/subcategoriaPerfumeRouter');
const subcategoriaMarcaRouter = require('./Routes/subcategoriaMarcaRouter');
const categoriaRouter = require('./Routes/categoriaRouter');
const imagenRouter = require('./Routes/imagenRouter'); 

app.use('/api/usuario', usuarioRouter);
app.use('/api/cliente', clienteRouter);

app.use('/api/detalle', detalleRouter);
app.use('/api/pedidos', PedidoRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/producto', productoRouter); 
app.use('/api/subcategoriaPerfume', subcategoriaPerfumeRouter);
app.use('/api/subcategoriaMarca', subcategoriaMarcaRouter);
app.use('/api/categoria', categoriaRouter);
app.use('/api/imagen', imagenRouter); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});