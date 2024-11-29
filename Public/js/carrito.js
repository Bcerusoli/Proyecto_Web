


import { getToken, estaAutenticado } from './clientAuth.js';


function addToCart(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function clearCart() {
    localStorage.removeItem('cart');
}


document.addEventListener('DOMContentLoaded', () => {
    const carritoContainer = document.getElementById('cart-container');
    const totalMontoElement = document.getElementById('total-amount');
    const completarPedidoButton = document.getElementById('checkout-button');
    const cartCountElement = document.getElementById('cart-count');

    
    const cartId = localStorage.getItem('cartId');

 
    const actualizarConteoCarrito = async () => {
        if (!cartId) {
            cartCountElement.textContent = '0';
            return;
        }

        try {
            const response = await fetch(`/api/carrito/detalles/${cartId}`);
            if (response.ok) {
                const detalles = await response.json();
                const totalItems = detalles.reduce((acc, detalle) => acc + detalle.cantidad, 0);
                cartCountElement.textContent = totalItems.toString();
            } else {
                cartCountElement.textContent = '0';
            }
        } catch (error) {
            console.error('Error al actualizar el conteo del carrito:', error);
            cartCountElement.textContent = '0';
        }
    };

    actualizarConteoCarrito();

    if (!cartId) {
        carritoContainer.innerHTML = '<p>No tienes productos en el carrito.</p>';
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }

    
    const obtenerDetallesCarrito = async () => {
        try {
            const response = await fetch(`/api/carrito/detalles/${cartId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    carritoContainer.innerHTML = '<p>No tienes productos en el carrito.</p>';
                    document.getElementById('cart-summary').style.display = 'none';
                } else {
                    throw new Error('Error al obtener los detalles del carrito.');
                }
                return;
            }
            const detalles = await response.json();
            renderizarCarrito(detalles);
        } catch (error) {
            console.error('Error:', error);
            carritoContainer.innerHTML = '<p>Ocurrió un error al cargar el carrito.</p>';
        }
    };

    
    const renderizarCarrito = (detalles) => {
        if (detalles.length === 0) {
            carritoContainer.innerHTML = '<p>No tienes productos en el carrito.</p>';
            document.getElementById('cart-summary').style.display = 'none';
            return;
        }
    
        carritoContainer.innerHTML = '';
    
        let total = 0;
    
        detalles.forEach(detalle => {
            const { id, id_producto, imagen, nombre, precio, cantidad, subtotal } = detalle;
            total += parseFloat(subtotal);
    
            
            const productBlock = document.createElement('div');
            productBlock.classList.add('cart-item');
            
            productBlock.setAttribute('data-id', id_producto); 
    
            productBlock.innerHTML = `
                <img src="${imagen}" alt="${nombre}" class="product-image">
                <div class="product-details">
                    <h3>${nombre}</h3>
                    <p>Precio: $${parseFloat(precio).toFixed(2)}</p>
                    <div class="quantity-control">
                        <button class="decrease-quantity">-</button>
                        <input type="number" value="${cantidad}" min="1" class="quantity-input">
                        <button class="increase-quantity">+</button>
                    </div>
                    <p>Subtotal: $${parseFloat(subtotal).toFixed(2)}</p>
                    <button class="remove-item">Eliminar</button>
                </div>
            `;
    
            carritoContainer.appendChild(productBlock);
        });
    
        
        totalMontoElement.textContent = total.toFixed(2);
    
        
        añadirEventListeners();
    };

    const añadirEventListeners = () => {
        const botonesAumentar = document.querySelectorAll('.increase-quantity');
        botonesAumentar.forEach(boton => {
            boton.addEventListener('click', async (e) => {
                const productBlock = e.target.closest('.cart-item');
                const productoId = productBlock.getAttribute('data-id'); 
                const cantidadInput = productBlock.querySelector('.quantity-input');
                let cantidad = parseInt(cantidadInput.value, 10);
                cantidad += 1;
                cantidadInput.value = cantidad;

                await actualizarCantidad(productoId, cantidad);
            });
        });

        
        const botonesDisminuir = document.querySelectorAll('.decrease-quantity');
        botonesDisminuir.forEach(boton => {
            boton.addEventListener('click', async (e) => {
                const productBlock = e.target.closest('.cart-item');
                const productoId = productBlock.getAttribute('data-id'); 
                const cantidadInput = productBlock.querySelector('.quantity-input');
                let cantidad = parseInt(cantidadInput.value, 10);
                if (cantidad > 1) {
                    cantidad -= 1;
                    cantidadInput.value = cantidad;
                    await actualizarCantidad(productoId, cantidad);
                }
            });
        });

        
        const botonesEliminar = document.querySelectorAll('.remove-item');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', async (e) => {
                const productBlock = e.target.closest('.cart-item');
                const productoId = productBlock.getAttribute('data-id'); 
                if (confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
                    await eliminarProducto(productoId);
                }
            });
        });

        
        const inputsCantidad = document.querySelectorAll('.quantity-input');
        inputsCantidad.forEach(input => {
            input.addEventListener('change', async (e) => {
                const productBlock = e.target.closest('.cart-item');
                const productoId = productBlock.getAttribute('data-id'); 
                let cantidad = parseInt(e.target.value, 10);
                if (isNaN(cantidad) || cantidad < 1) {
                    cantidad = 1;
                    e.target.value = cantidad;
                }
                await actualizarCantidad(productoId, cantidad);
            });
        });
    };

    const actualizarCantidad = async (productoId, cantidad) => {
        try {
            const response = await fetch('/api/carrito/actualizar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartId, productoId: productoId, cantidad }),
            });

            if (response.ok) {
                await obtenerDetallesCarrito();
                actualizarConteoCarrito();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            alert('Ocurrió un error al actualizar la cantidad.');
        }
    };

    
    const eliminarProducto = async (productoId) => {
        try {
            const response = await fetch('/api/carrito/eliminar', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartId, productoId: productoId }),
            });

            if (response.ok) {
                await obtenerDetallesCarrito();
                actualizarConteoCarrito();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Ocurrió un error al eliminar el producto.');
        }
    };

    
    const completarPedido = async () => {
        if (!confirm('¿Estás seguro de que deseas completar el pedido?')) {
            return;
        }
    
        if (!estaAutenticado()) {
            window.location.href = 'login.html';
            return;
        }
    
        const token = getToken();
    
      
        const cartId = localStorage.getItem('cartId');
        const cartIdParsed = parseInt(cartId, 10);
    
        if (!cartIdParsed) {
            alert('No se encontró el carrito. Por favor, agrega productos al carrito.');
            return;
        }
    
        try {
            const response = await fetch('/api/pedidos/completar', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({ cartId: cartIdParsed }),
            });
    
            if (response.ok) {
                const data = await response.json();
                alert('Pedido completado exitosamente.');
                
                localStorage.removeItem('cartId');
                carritoContainer.innerHTML = '<p>Tu pedido ha sido completado.</p>';
                document.getElementById('cart-summary').style.display = 'none';
                cartCountElement.textContent = '0';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al completar el pedido:', error);
            alert('Ocurrió un error al completar el pedido.');
        }
    };
   
    completarPedidoButton.addEventListener('click', completarPedido);

    
    obtenerDetallesCarrito();
});
   const btnCerrarSesion = document.querySelector("#btn-cerrar-sesion");
   if (btnCerrarSesion) {
       btnCerrarSesion.addEventListener('click', () => {
           localStorage.clear();
           console.log("Sesión cerrada");
           window.location.href = 'login.html'; 
       });
   }