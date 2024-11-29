

import { getToken, estaAutenticado } from './clientAuth.js';

document.addEventListener('DOMContentLoaded', () => {
    const createProductButton = document.getElementById('create-product-button');
    const viewOrdersButton = document.getElementById('view-orders-button'); // Nuevo botón
    const createProductFormSection = document.getElementById('create-product-form');
    const cancelButton = document.getElementById('cancel-button');
    const productForm = document.getElementById('product-form');
    const formError = document.getElementById('form-error');
    const productTableBody = document.getElementById('product-table-body');
    const listError = document.getElementById('list-error');

    
    const ordersListSection = document.getElementById('orders-list-section');
    const ordersTableBody = document.getElementById('orders-table-body');
    const ordersListError = document.getElementById('orders-list-error');

    
    const subcategoriaMarcaSelect = document.getElementById('product-subcategoria-marca');
    const subcategoriaPerfumeSelect = document.getElementById('product-subcategoria-perfume');

    
    createProductButton.addEventListener('click', async () => {
        createProductFormSection.classList.toggle('hidden');
        
        productForm.reset();
        formError.textContent = '';

        
        if (subcategoriaMarcaSelect.options.length <= 1 && subcategoriaPerfumeSelect.options.length <= 1) {
            await cargarSubcategorias();
        }
    });

    
    viewOrdersButton.addEventListener('click', () => {
        ordersListSection.classList.toggle('hidden');
        
        if (!ordersListSection.classList.contains('hidden')) {
            cargarOrdenes();
        }
    });

    
    cancelButton.addEventListener('click', () => {
        createProductFormSection.classList.add('hidden');
        formError.textContent = '';
        productForm.removeAttribute('data-editing');
    });

   
    const cargarSubcategorias = async () => {
        try {
            const token = getToken();

            
            if (!estaAutenticado()) {
                window.location.href = 'login.html';
                return;
            }

           
            const responseMarca = await fetch('/api/producto/subcategorias-marca', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (responseMarca.ok) {
                const marcas = await responseMarca.json();
                marcas.forEach(marca => {
                    const option = document.createElement('option');
                    option.value = marca.id;
                    option.textContent = marca.nombre;
                    subcategoriaMarcaSelect.appendChild(option);
                });
            } else {
                throw new Error('No se pudieron cargar las subcategorías de marca');
            }

            
            const responsePerfume = await fetch('/api/producto/subcategorias-perfume', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (responsePerfume.ok) {
                const perfumes = await responsePerfume.json();
                perfumes.forEach(perfume => {
                    const option = document.createElement('option');
                    option.value = perfume.id;
                    option.textContent = perfume.nombre;
                    subcategoriaPerfumeSelect.appendChild(option);
                });
            } else {
                throw new Error('No se pudieron cargar las subcategorías de perfume');
            }

        } catch (error) {
            console.error('Error al cargar las subcategorías:', error);
            formError.textContent = 'Error al cargar las subcategorías.';
        }
    };

    
    const cargarProductos = async () => {
        try {
            const token = getToken();

            const response = await fetch('/api/producto', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const productos = await response.json();
                renderizarProductos(productos);
            } else {
                throw new Error('No se pudieron cargar los productos');
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            listError.textContent = 'Error al cargar los productos.';
        }
    };


    const cargarOrdenes = async () => {
        try {
            const token = getToken();

            const response = await fetch('/api/pedidos', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const ordenes = await response.json();
                renderizarOrdenes(ordenes);
            } else {
                throw new Error('No se pudieron cargar las órdenes');
            }
        } catch (error) {
            console.error('Error al cargar las órdenes:', error);
            ordersListError.textContent = 'Error al cargar las órdenes.';
        }
    };

    
    const renderizarProductos = (productos) => {
        productTableBody.innerHTML = ''; 

        productos.forEach(producto => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>
                    <button data-id="${producto.id}" class="edit-btn">Editar</button>
                    <button data-id="${producto.id}" class="delete-btn">Eliminar</button>
                </td>
            `;

            productTableBody.appendChild(fila);
        });

        
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        editButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const productoId = btn.getAttribute('data-id');
                abrirFormularioEditar(productoId);
            });
        });

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const productoId = btn.getAttribute('data-id');
                eliminarProducto(productoId);
            });
        });
    };

    
    const renderizarOrdenes = (ordenes) => {
        ordersTableBody.innerHTML = ''; 
        ordenes.forEach(orden => {
            const fila = document.createElement('tr');

            
            const fechaFormateada = new Date(orden.fecha).toLocaleString('es-ES');

            
            let productosHTML = '<ul>';
            orden.productos.forEach(prod => {
                productosHTML += `<li>${prod.nombre} - Cantidad: ${prod.cantidad} - Subtotal: $${prod.subtotal}</li>`;
            });
            productosHTML += '</ul>';

            fila.innerHTML = `
                <td>${orden.id}</td>
                <td>${fechaFormateada}</td>
                <td>${orden.cliente.nombre}</td>
                <td>${orden.cliente.email}</td>
                <td>$${orden.total}</td>
                <td>${productosHTML}</td>
            `;

            ordersTableBody.appendChild(fila);
        });
    };

    
    const abrirFormularioEditar = async (id) => {
        try {
            const token = getToken();

            const response = await fetch(`/api/producto/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const producto = await response.json();

                
                createProductFormSection.classList.remove('hidden');

                
                document.getElementById('product-name').value = producto.nombre;
                document.getElementById('product-description').value = producto.descripcion;
                document.getElementById('product-price').value = producto.precio;
                document.getElementById('product-stock').value = producto.stock;
                subcategoriaMarcaSelect.value = producto.id_subcategoria_marca;
                subcategoriaPerfumeSelect.value = producto.id_subcategoria_perfume;

                
                productForm.setAttribute('data-editing', id);
            } else {
                throw new Error('No se pudo obtener los datos del producto');
            }
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            formError.textContent = 'Error al obtener los datos del producto.';
        }
    };

    
    const eliminarProducto = async (id) => {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este producto?');
        if (!confirmacion) return;

        try {
            const token = getToken();

            const response = await fetch(`/api/producto/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Producto eliminado exitosamente.');
                cargarProductos(); // Actualizar la lista de productos
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudo eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            listError.textContent = 'Error al eliminar el producto.';
        }
    };

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.textContent = '';

       
        const nombre = document.getElementById('product-name').value.trim();
        const descripcion = document.getElementById('product-description').value.trim();
        const precio = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value, 10);
        const id_subcategoria_marca = parseInt(subcategoriaMarcaSelect.value, 10);
        const id_subcategoria_perfume = parseInt(subcategoriaPerfumeSelect.value, 10);

        
        if (!nombre || isNaN(precio) || isNaN(stock) || isNaN(id_subcategoria_marca) || isNaN(id_subcategoria_perfume)) {
            formError.textContent = 'Por favor, completa todos los campos requeridos.';
            return;
        }

        const productoData = {
            nombre,
            descripcion,
            precio,
            stock,
            id_subcategoria_marca,
            id_subcategoria_perfume
        };

        
        const editingId = productForm.getAttribute('data-editing');

        try {
            const token = getToken();
            let response;

            if (editingId) {
               
                response = await fetch(`/api/producto/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(productoData),
                });
            } else {
                
                response = await fetch('/api/producto/admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(productoData),
                });
            }

            if (response.ok) {
                const resultado = await response.json();
                alert(`Producto ${editingId ? 'actualizado' : 'creado'} exitosamente.`);
                
                createProductFormSection.classList.add('hidden');
                productForm.reset();
                formError.textContent = '';
                productForm.removeAttribute('data-editing');
                cargarProductos(); 
            } else {
                const errorData = await response.json();
                formError.textContent = `Error: ${errorData.message}`;
            }
        } catch (error) {
            console.error(`Error al ${editingId ? 'actualizar' : 'crear'} el producto:`, error);
            formError.textContent = `Ocurrió un error al ${editingId ? 'actualizar' : 'crear'} el producto.`;
        }
    });

    
    cargarProductos();

    
    const btnCerrarSesion = document.querySelector("#logout-button");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            localStorage.clear();
            console.log("Sesión cerrada");
            window.location.href = 'login.html'; 
        });
    }
});