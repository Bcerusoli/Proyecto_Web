

document.addEventListener('DOMContentLoaded', () => {
    
    const menuToggle = document.querySelector("#menu-toggle");
    const menu = document.querySelector(".menu");

    menuToggle.addEventListener('change', () => {
        if (menuToggle.checked) {
            menu.classList.add("open");
        } else {
            menu.classList.remove("open");
        }
    });

    
    const cargarMarcas = async () => {
        try {
            const response = await fetch('/api/subcategoriaMarca');
            if (!response.ok) {
                throw new Error('Error al obtener las marcas');
            }
            const marcas = await response.json();
            renderizarMarcas(marcas);
        } catch (error) {
            console.error('Error al cargar las marcas:', error);
        }
    };

    
    const renderizarMarcas = (marcas) => {
        const contenedorMarcas = document.querySelector('.marcas-contenedor');
        contenedorMarcas.innerHTML = ''; // Limpiar el contenedor de marcas
    
        marcas.forEach((marca) => {
            if (marca.imagenmarca) { // Verificar si la imagen no es null
                const marcaHTML = `
                    <div class="marca">
                        <a href="catalogo.html?marcaId=${encodeURIComponent(marca.id)}">
                            <img src="${marca.imagenmarca}" alt="${marca.nombre}">
                        </a>
                    </div>
                `;
                contenedorMarcas.innerHTML += marcaHTML;
            }
        });
    };
    

    
    const cargarBanner = async () => {
        try {
            const response = await fetch('/api/imagen/banner');
            if (!response.ok) {
                throw new Error('Error al obtener el banner');
            }
            const banner = await response.json();
            renderizarBanner(banner);
        } catch (error) {
            console.error('Error al cargar el banner:', error);
        }
    };

  
    const renderizarBanner = (banner) => {
        const bannerImg = document.querySelector('.banner img');
        bannerImg.src = banner.ruta_imagen;
        bannerImg.alt = 'Banner Image';
        bannerImg.setAttribute('data-id', banner.id_producto); 
        
        bannerImg.addEventListener('click', () => {
            const productoId = bannerImg.getAttribute('data-id');
            if (productoId) {
                window.location.href = `detalle.html?id=${productoId}`;
            }
        });
    };

    
    const cargarImagenesDestacadas = async () => {
        try {
            const response = await fetch('/api/imagen/destacadas');
            if (!response.ok) {
                throw new Error('Error al obtener las imágenes destacadas');
            }
            const imagenesDestacadas = await response.json();
            renderizarImagenesDestacadas(imagenesDestacadas);
        } catch (error) {
            console.error('Error al cargar las imágenes destacadas:', error);
        }
    };

    
    const renderizarImagenesDestacadas = (imagenesDestacadas) => {
        const contenedorDestacadas = document.querySelector('.imagenes-destacadas');
        contenedorDestacadas.innerHTML = '';

        imagenesDestacadas.forEach((imagen) => {
            const imagenHTML = `
                <div class="imagen-destacada">
                    <img src="${imagen.ruta_imagen}" alt="Destacada" data-id="${imagen.id_producto}">
                </div>
            `;
            contenedorDestacadas.innerHTML += imagenHTML;
        });

        
        const imagenes = document.querySelectorAll('.imagenes-destacadas img');
        imagenes.forEach((imagen) => {
            imagen.addEventListener('click', () => {
                const productoId = imagen.getAttribute('data-id');
                if (productoId) {
                    window.location.href = `detalle.html?id=${productoId}`;
                }
            });
        });
    };


    

    // Función para cargar los últimos productos desde la API
    const cargarUltimosProductos = async () => {
        try {
            const response = await fetch('/api/producto/ultimos');
            if (!response.ok) {
                throw new Error('Error al obtener los últimos productos');
            }
            const ultimosProductos = await response.json();
            renderizarUltimosProductos(ultimosProductos);
        } catch (error) {
            console.error('Error al cargar los últimos productos:', error);
            const contenedorProductos = document.querySelector('.lanzamientos .productos');
            contenedorProductos.innerHTML = '<p>Error al cargar los lanzamientos.</p>';
        }
    };

    const renderizarUltimosProductos = (productos) => {
        const contenedorUltimos = document.querySelector('.lanzamientos .productos');
        contenedorUltimos.innerHTML = ''; 
    
        productos.forEach((producto) => {
            const productoHTML = `
                <div class="producto" data-id="${producto.id}">
                    <input type="hidden" class="id-producto" value="${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>${producto.nombre}</p>
                    <p class="precio">$${producto.precio}</p>
                    <button class="btn-carrito" data-idProducto="${producto.id}">Añadir al carrito</button>
                </div>
            `;
            contenedorUltimos.innerHTML += productoHTML;
        });
    
        
        const productosElementos = document.querySelectorAll('.lanzamientos .producto');
        productosElementos.forEach((producto) => {
            producto.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-carrito')) return;
                const productoId = producto.dataset.id;
                window.location.href = `detalle.html?id=${productoId}`;
            });
        });

        
        const botonesCarrito = document.querySelectorAll(".btn-carrito");
        botonesCarrito.forEach((boton) => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const producto = e.target.closest(".producto");
                const idProducto = producto.querySelector(".id-producto").value;
                const nombreProducto = producto.querySelector("p").textContent;
                const precioProducto = producto.querySelector(".precio").textContent.replace("$", "");

                const productoCarrito = {
                    id: idProducto,
                    nombre: nombreProducto,
                    precio: parseFloat(precioProducto),
                    cantidad: 1
                };

                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                let existeProducto = false;

                carrito.forEach((producto) => {
                    if (producto.id === productoCarrito.id) {
                        producto.cantidad++;
                        existeProducto = true;
                    }
                });

                if (!existeProducto) {
                    carrito.push(productoCarrito);
                }

                localStorage.setItem("carrito", JSON.stringify(carrito));
                alert("Producto agregado al carrito");
            });
        });
    };

    
    const cargarProductosPopulares = async () => {
        try {
            const response = await fetch('/api/producto/populares');
            if (!response.ok) {
                throw new Error('Error al obtener productos populares');
            }
            const productosPopulares = await response.json();
            renderizarProductosPopulares(productosPopulares);
        } catch (error) {
            console.error('Error al cargar productos populares:', error);
        }
    };

   
    const renderizarProductosPopulares = (productosPopulares) => {
        const contenedorProductosPopulares = document.querySelector('.productos-populares .productos');
        contenedorProductosPopulares.innerHTML = ''; 

        productosPopulares.forEach((producto) => {
            const productoHTML = `
                <div class="producto-popular" data-id="${producto.id}">
                    <input type="hidden" class="id-producto" value="${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>${producto.nombre}</p>
                    <p class="precio">$${producto.precio}</p>
                    <button class="btn-carrito">Añadir al carrito</button>
                </div>
            `;
            contenedorProductosPopulares.innerHTML += productoHTML;
        });


        const productosPopularesElementos = document.querySelectorAll('.productos-populares .producto-popular');
        productosPopularesElementos.forEach((producto) => {
            producto.addEventListener('click', (e) => {
                
                if (e.target.classList.contains('btn-carrito')) return;
                const productoId = producto.dataset.id;
                window.location.href = `detalle.html?id=${productoId}`;
            });
        });

        
        const botonesCarritoPopulares = document.querySelectorAll(".productos-populares .btn-carrito");
        botonesCarritoPopulares.forEach((boton) => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const producto = e.target.closest(".producto-popular");
                const idProducto = producto.querySelector(".id-producto").value;
                const nombreProducto = producto.querySelector("p").textContent;
                const precioProducto = producto.querySelector(".precio").textContent.replace("$", "");

                const productoCarrito = {
                    id: idProducto,
                    nombre: nombreProducto,
                    precio: parseFloat(precioProducto),
                    cantidad: 1
                };

                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                let existeProducto = false;

                carrito.forEach((producto) => {
                    if (producto.id === productoCarrito.id) {
                        producto.cantidad++;
                        existeProducto = true;
                    }
                });

                if (!existeProducto) {
                    carrito.push(productoCarrito);
                }

                localStorage.setItem("carrito", JSON.stringify(carrito));
                alert("Producto agregado al carrito");
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

    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchBar.value.trim();
            if (query) {
                redirigirBusqueda(query);
            }
        }
    });

    
    cargarBanner();
    cargarImagenesDestacadas();
    
    cargarMarcas();
    cargarProductosPopulares();
    cargarUltimosProductos();

    
    const btnCerrarSesion = document.querySelector("#btn-cerrar-sesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            localStorage.clear();
            console.log("Sesión cerrada");
            window.location.href = 'login.html'; 
        });
    }
});
