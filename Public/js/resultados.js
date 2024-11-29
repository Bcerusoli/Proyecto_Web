

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        cargarResultadosBusqueda(query);
    } else {
        alert('No se proporcionó un término de búsqueda.');
    }

    
    async function cargarResultadosBusqueda(searchTerm) {
        try {
            const response = await fetch(`/api/producto/buscar?search=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error('Error al obtener los resultados de búsqueda');
            }
            const productos = await response.json();
            renderizarResultados(productos, searchTerm);
        } catch (error) {
            console.error('Error al cargar los resultados de búsqueda:', error);
            alert('Ocurrió un error al cargar los resultados de búsqueda.');
        }
    }

    
    function renderizarResultados(productos, searchTerm) {
        const contenedorResultados = document.querySelector('.resultados-contenedor');
        contenedorResultados.innerHTML = ''; 

        if (productos.length === 0) {
            contenedorResultados.innerHTML = `<p>No se encontraron productos que contengan "${searchTerm}".</p>`;
            return;
        }

        productos.forEach((producto) => {
            const productoHTML = `
                <div class="producto" data-id="${producto.id}">
                    <a href="detalle.html?id=${producto.id}">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </a>
                    <h2>${producto.nombre}</h2>
                    <p class="precio">$${producto.precio}</p>
                    <button class="btn-carrito">Añadir al carrito</button>
                </div>
            `;
            contenedorResultados.innerHTML += productoHTML;
        });

        
        const botonesCarrito = document.querySelectorAll('.btn-carrito');
        botonesCarrito.forEach((boton) => {
            boton.addEventListener('click', (e) => {
                const productoDiv = e.target.closest('.producto');
                const productoId = productoDiv.getAttribute('data-id');
                agregarAlCarrito(productoId);
            });
        });
    }

    function agregarAlCarrito(productoId) {
        
        const productoElemento = document.querySelector(`.prodducto[data-id="${productoId}"]`);
        if (!productoElemento) {
            alert('Producto no encontrado.');
            return;
        }

        const nombre = productoElemento.querySelector('h2').textContent;
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
    }

    
    function actualizarContadorCarrito() {
        const cartCountElement = document.getElementById('cart-count');
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalCantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
        cartCountElement.textContent = totalCantidad;
    }
   
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

    
    actualizarContadorCarrito();
});
 
 const btnCerrarSesion = document.querySelector("#btn-cerrar-sesion");
 if (btnCerrarSesion) {
     btnCerrarSesion.addEventListener('click', () => {
         localStorage.clear();
         console.log("Sesión cerrada");
         window.location.href = 'login.html'; 
     });
 }
