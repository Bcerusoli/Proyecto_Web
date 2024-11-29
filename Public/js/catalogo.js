

document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productos-container');

    
    const urlParams = new URLSearchParams(window.location.search);
    const subcategoria = urlParams.get('subcategoria');
    const marcaId = urlParams.get('marcaId');

    
    const cargarProductos = async () => {
        let url = '/api/producto';
        if (marcaId) {
            url += `/marca/${encodeURIComponent(marcaId)}`;
        } else if (subcategoria && subcategoria !== 'Todos') {
            url += `/filtrar/${encodeURIComponent(subcategoria)}`;
        }

        
        productosContainer.innerHTML = '<p>Cargando productos...</p>';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const productos = await response.json();
            renderizarProductos(productos);
        } catch (error) {
            console.error('Error:', error);
            productosContainer.innerHTML = '<p>Error al cargar los productos.</p>';
        }
    };

    
    const formatPrecio = (precio) => {
        const numero = parseFloat(precio);
        if (isNaN(numero)) {
            return '$0.00'; 
        }
        return `$${numero.toFixed(2)}`;
    };

    const renderizarProductos = (productos) => {
        if (productos.length === 0) {
            productosContainer.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        productosContainer.innerHTML = '';
        productos.forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto');

            productoCard.innerHTML = `
                <a href="detalle.html?id=${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>${producto.nombre}</p>
                </a>
                <p class="precio">${formatPrecio(producto.precio)}</p>
                <button class="btn-carrito" data-idProducto="${producto.id}">Añadir al carrito</button>
            `;
            productosContainer.appendChild(productoCard);
        });

        
        const botonesCarrito = document.querySelectorAll('.btn-carrito');
        botonesCarrito.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const productoId = e.target.dataset.idproducto;
                agregarAlCarrito(productoId);
            });
        });
    };

    
    const agregarAlCarrito = (productoId) => {
        
        const productoElemento = document.querySelector(`.btn-carrito[data-idProducto="${productoId}"]`).parentElement;
        const nombre = productoElemento.querySelector('a p').textContent;
        const precioTexto = productoElemento.querySelector('.precio').textContent;
        const precio = parseFloat(precioTexto.replace('$', ''));

        if (isNaN(precio)) {
            console.error('Precio inválido para el producto:', nombre);
            alert('Error al agregar el producto al carrito.');
            return;
        }

        const producto = {
            id: productoId,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        };

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let existeProducto = false;

        carrito.forEach(item => {
            if (item.id === producto.id) {
                item.cantidad += producto.cantidad;
                existeProducto = true;
            }
        });

        if (!existeProducto) {
            carrito.push(producto);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContadorCarrito();
        alert("Producto agregado al carrito");
    };

    
    const redirigirBusqueda = (query) => {
        window.location.href = `resultados.html?query=${encodeURIComponent(query)}`;
    };

    
    const searchButton = document.querySelector('#search-button');
    const searchBar = document.querySelector('#search-bar');

    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchBar.value.trim();
        if (query) {
            redirigirBusqueda(query);
        }
    });

    
    const actualizarContadorCarrito = () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        document.getElementById('cart-count').textContent = totalCantidad;
    };

    
    actualizarContadorCarrito();

    
    cargarProductos();
});


const btnCerrarSesion = document.querySelector("#btn-cerrar-sesion");
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
        localStorage.clear();
        console.log("Sesión cerrada");
        window.location.href = 'login.html'; 
    });
}