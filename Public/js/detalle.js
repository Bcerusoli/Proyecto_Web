

document.addEventListener('DOMContentLoaded', () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');

   
    const cargarDetalleProducto = async (id) => {
        try {
            const response = await fetch(`/api/producto/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del producto');
            }
            const producto = await response.json();
            renderizarDetalleProducto(producto);
            cargarProductosRelacionados(producto);
        } catch (error) {
            console.error('Error al cargar los detalles del producto:', error);
            alert('No se pudieron cargar los detalles del producto.');
        }
    };

   
    const renderizarDetalleProducto = (producto) => {
        const imagenPrincipal = document.querySelector('.product-image img');
        imagenPrincipal.src = producto.imagen;
        imagenPrincipal.alt = producto.nombre;

        document.querySelector('.product-details h1').textContent = producto.nombre;
        document.querySelector('.product-type').textContent = producto.tipo;
        document.querySelector('.product-price').textContent = `$${producto.precio}`;
        document.querySelector('.product-description p').textContent = producto.descripcion;

        console.log('Datos del producto:', producto);

        
        const thumbnailsContainer = document.querySelector('.product-thumbnails');
        thumbnailsContainer.innerHTML = '';
        producto.imagenes.forEach((imagen) => {
            const imgElement = document.createElement('img');
            imgElement.src = imagen;
            imgElement.alt = `${producto.nombre} Thumbnail`;
            imgElement.addEventListener('click', () => {
                imagenPrincipal.src = imagen;
                imagenPrincipal.alt = `${producto.nombre} Thumbnail`;
            });
            thumbnailsContainer.appendChild(imgElement);
        });

        document.querySelector('.add-to-cart').dataset.idProducto = producto.id;
    };

    const agregarAlCarrito = async (productoId) => {
        const cantidadInput = document.getElementById('quantity');
        const tamañoSelect = document.getElementById('sizes');
    
       
        let cantidad = 1; 
        if (cantidadInput) {
            cantidad = parseInt(cantidadInput.value, 10);
            if (isNaN(cantidad) || cantidad < 1) {
                cantidad = 1;
                cantidadInput.value = 1;
            }
        }
    
        
        let tamaño = 100;
        if (tamañoSelect) {
            const tamañoValue = tamañoSelect.value;
           
            const parsedTamaño = parseInt(tamañoValue.replace('ml', ''), 10);
            if (!isNaN(parsedTamaño)) {
                tamaño = parsedTamaño;
            } else {
                tamaño = 100; 
                tamañoSelect.value = '100ml';
            }
        }
    
        try {
            let cartId = localStorage.getItem('cartId');
    
            const response = await fetch('/api/carrito/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cartId, productoId, cantidad, tamaño }),
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.cartId) {
                    localStorage.setItem('cartId', data.cartId); 
                }
                alert('Producto agregado al carrito');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            alert('Ocurrió un error al agregar el producto al carrito.');
        }
    };
 
    const botonAgregarCarrito = document.querySelector('.add-to-cart');
    if (botonAgregarCarrito) {
        botonAgregarCarrito.addEventListener('click', async () => {
            const productoId = botonAgregarCarrito.dataset.idProducto;
            await agregarAlCarrito(productoId);
        });
    }


    const cargarProductosRelacionados = async (productoActual) => {
        try {
            const response = await fetch(`/api/producto/${productoActual.id}/relacionados`);
            if (!response.ok) {
                throw new Error('Error al obtener productos relacionados');
            }
            const productosRelacionados = await response.json();
            renderizarProductosRelacionados(productosRelacionados);
        } catch (error) {
            console.error('Error al cargar productos relacionados:', error);
        }
    };


    const renderizarProductosRelacionados = (productos) => {
        const contenedorRelacionados = document.querySelector('.productos-relacionados');
        contenedorRelacionados.innerHTML = '';

        if (productos.length === 0) {
            contenedorRelacionados.innerHTML = '<p>No hay productos relacionados disponibles.</p>';
            return;
        }

        productos.forEach((producto) => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto-relacionado');

            productoCard.innerHTML = `
                <a href="detalle.html?id=${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="producto-info">
                        <p>${producto.nombre}</p>
                        <p class="precio">$${producto.precio}</p>
                        <button class="btn-carrito" data-idProducto="${producto.id}">Añadir al carrito</button>
                    </div>
                </a>
            `;

            contenedorRelacionados.appendChild(productoCard);
        });

       
        const botonesCarrito = document.querySelectorAll('.productos-relacionados .btn-carrito');
        botonesCarrito.forEach((boton) => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                const productoId = e.target.dataset.idProducto;
                agregarAlCarrito(productoId);
            });
        });
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

   
    if (productoId) {
        cargarDetalleProducto(productoId);
    } else {
        alert('No se encontró el ID del producto.');
    }
});
   
   const btnCerrarSesion = document.querySelector("#btn-cerrar-sesion");
   if (btnCerrarSesion) {
       btnCerrarSesion.addEventListener('click', () => {
           localStorage.clear();
           console.log("Sesión cerrada");
           window.location.href = 'login.html'; 
       });
   }