// Script para la Pizzería La Bella Napoli

document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const orderForm = document.querySelector('.order-form');
    
    // Carrito de compras
    let cart = [];
    
    // Cambio de categorías en el menú
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase activa al botón clickeado
            button.classList.add('active');
            
            // Obtener la categoría seleccionada
            const category = button.getAttribute('data-category');
            
            // Ocultar todas las categorías
            menuCategories.forEach(menuCat => menuCat.classList.remove('active'));
            
            // Mostrar la categoría seleccionada
            document.getElementById(category)?.classList.add('active');
        });
    });
    
    // Funcionalidad para añadir productos al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtener información del producto
            const menuItem = button.closest('.menu-item');
            const name = menuItem.querySelector('h3').textContent.split('<')[0].trim();
            const price = parseFloat(menuItem.querySelector('.item-price').textContent.replace('$', ''));
            const image = menuItem.querySelector('img').getAttribute('src');
            
            // Verificar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                // Incrementar cantidad si ya existe
                existingItem.quantity += 1;
            } else {
                // Añadir nuevo producto al carrito
                cart.push({
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            
            // Actualizar la visualización del carrito
            updateCart();
            
            // Mostrar notificación
            showNotification(`${name} añadido al carrito`);
        });
    });
    
    // Función para actualizar el carrito
    function updateCart() {
        // Limpiar el contenido actual del carrito
        cartItems.innerHTML = '';
        
        // Si el carrito está vacío
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío. Añade productos desde nuestro menú.</p>';
            totalAmount.textContent = '$0.00';
            return;
        }
        
        // Calcular el total
        let total = 0;
        
        // Añadir cada producto al carrito
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-total">
                    $${itemTotal.toFixed(2)}
                </div>
                <button class="remove-item" data-index="${index}">×</button>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // Actualizar el total
        totalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
    
    // Función para eliminar productos del carrito
    function removeFromCart(index) {
        const removedItem = cart[index];
        
        if (removedItem.quantity > 1) {
            // Reducir la cantidad si hay más de uno
            removedItem.quantity -= 1;
        } else {
            // Eliminar el producto si solo hay uno
            cart.splice(index, 1);
        }
        
        // Actualizar la visualización del carrito
        updateCart();
        
        // Mostrar notificación
        showNotification(`${removedItem.name} eliminado del carrito`);
    }
    
    // Función para mostrar notificaciones
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Mostrar la notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Ocultar y eliminar la notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Validación del formulario de pedido
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar si el carrito está vacío
            if (cart.length === 0) {
                showNotification('Por favor, añade productos a tu pedido');
                return;
            }
            
            // Obtener los datos del formulario
            const formData = new FormData(orderForm);
            const orderData = {
                customer: {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    address: formData.get('address')
                },
                deliveryMethod: formData.get('delivery-method'),
                deliveryTime: formData.get('time'),
                notes: formData.get('notes'),
                items: cart,
                total: parseFloat(totalAmount.textContent.replace('$', ''))
            };
            
            // Aquí se enviaría el pedido al servidor
            console.log('Pedido enviado:', orderData);
            
            // Mostrar mensaje de confirmación
            showOrderConfirmation(orderData);
            
            // Limpiar el formulario y el carrito
            orderForm.reset();
            cart = [];
            updateCart();
        });
    }
    
    // Función para mostrar confirmación de pedido
    function showOrderConfirmation(orderData) {
        // Crear el modal de confirmación
        const modal = document.createElement('div');
        modal.classList.add('order-confirmation-modal');
        
        // Contenido del modal
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>¡Pedido Confirmado!</h2>
                <p>Gracias ${orderData.customer.name} por tu pedido.</p>
                <p>Hemos recibido tu pedido y estamos trabajando en él.</p>
                <p>Te enviaremos una confirmación a ${orderData.customer.email || orderData.customer.phone}.</p>
                <div class="order-details">
                    <h3>Detalles del Pedido:</h3>
                    <p><strong>Método de entrega:</strong> ${orderData.deliveryMethod === 'delivery' ? 'Entrega a domicilio' : 'Recoger en local'}</p>
                    <p><strong>Hora:</strong> ${orderData.deliveryTime === 'asap' ? 'Lo antes posible' : orderData.deliveryTime}</p>
                    <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
                </div>
                <button class="btn-close-modal">Cerrar</button>
            </div>
        `;
        
        // Añadir el modal al DOM
        document.body.appendChild(modal);
        
        // Mostrar el modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Cerrar el modal
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };
        
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('.btn-close-modal').addEventListener('click', closeModal);
    }
    
    // Efecto de desplazamiento suave para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Añadir estilos para las notificaciones y el modal de confirmación
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--color-primary);
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-info h4 {
            margin: 0 0 5px;
            font-size: 1rem;
        }
        
        .cart-item-info p {
            margin: 0;
            color: var(--color-gray);
            font-size: 0.9rem;
        }
        
        .cart-item-total {
            font-weight: 700;
            margin: 0 15px;
        }
        
        .remove-item {
            background: none;
            border: none;
            color: var(--color-primary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0 5px;
        }
        
        .order-confirmation-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .order-confirmation-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            position: relative;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .order-confirmation-modal.show .modal-content {
            transform: translateY(0);
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-gray);
        }
        
        .order-details {
            margin: 20px 0;
            padding: 15px;
            background-color: var(--color-light-gray);
            border-radius: 4px;
        }
        
        .btn-close-modal {
            background-color: var(--color-primary);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            display: block;
            margin: 20px auto 0;
            transition: background-color 0.3s ease;
        }
        
        .btn-close-modal:hover {
            background-color: #b71c1c;
        }
    `;
    
    document.head.appendChild(style);
});