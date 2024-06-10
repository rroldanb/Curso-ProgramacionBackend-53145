document.addEventListener('DOMContentLoaded', () => {
    // Botón para quitar producto del carrito
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
    removeFromCartButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const cartId = event.target.getAttribute('data-cart-id');
        const productId = event.target.getAttribute('data-product-id');

        const productContainer = event.target.closest('.carrito-producto');
        const productNameElement = productContainer.querySelector('.carrito-producto-titulo h3');
        const productName = productNameElement ? productNameElement.innerText : 'Producto desconocido';



        try {
          const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (response.ok) {
            const result = await response.json();
            // console.log('Producto eliminado del carrito:', result);
            Swal.fire({ text: `${productName} eliminado del carrito`,
              position: 'top',
              icon: 'success',
              title: 'Éxito',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              location.reload();
            });
          } else {
            console.error('Error al eliminar el producto del carrito');
            Swal.fire({ text: `No se pudo eliminar el producto del carrito`,
              title:'Error',
              position: 'top',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire({text: `Ocurrió un error al eliminar el producto del carrito`,
            title:'Error',
            position: 'top',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    });
  
    // Botón para vaciar el carrito
    const emptyCartButton = document.querySelector('.empty-cart-btn');
    emptyCartButton.addEventListener('click', async (event) => {
      const cartId = event.target.getAttribute('data-cart-id');
  
      try {
        const response = await fetch(`/api/carts/${cartId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          const result = await response.json();
          // console.log('Carrito vaciado:', result);
          Swal.fire({text: `Carrito vaciado`,
            title:'Éxito',
            position: 'top',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            location.reload();
          });
        } else {
          console.error('Error al vaciar el carrito');
          Swal.fire({text: `No se pudo vaciar el carrito`,
            title:'Error',
            position: 'top',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({text: `Ocurrió un error al eliminar el producto del carrito`,
          title:'Error',
          position: 'top',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });

    

  const cartProducts = document.querySelectorAll('.carrito-producto');

  cartProducts.forEach((product) => {
    const inputCantidad = product.querySelector('.carrito-producto-cantidad-input');
    inputCantidad.addEventListener('change', nuevaCantidad);
  });



  function toggleEmptyCartButton() {
    const cartProducts = document.querySelectorAll('.carrito-producto');
    if (cartProducts.length === 0) {
      emptyCartButton.setAttribute('disabled', 'disabled');
    } else {
      emptyCartButton.removeAttribute('disabled');
    }
  }

  function nuevaCantidad(event) {
    const input = event.target;
    const productContainer = input.closest('.carrito-producto');
    const pid = productContainer.querySelector('.remove-from-cart-btn').getAttribute('data-product-id');
    const cid = productContainer.querySelector('.remove-from-cart-btn').getAttribute('data-cart-id');
    const nuevaCantidad = parseInt(input.value);

    const stockDisponible = parseInt(productContainer.querySelector('.carrito-producto-stock h4').innerText);

    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      input.value = 1;
      return;
    }

    if (nuevaCantidad > stockDisponible) {
      input.value = stockDisponible;
      return;
    }


    

    // Llamada al backend para actualizar la cantidad en la base de datos
    fetch(`/api/carts/${cid}/product/${pid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newQuantity: nuevaCantidad })
    })
    .then(response => response.json())
    .then(data => {
      // console.log('data', data)
      if (data.status === 200) {
        // Actualizar el subtotal en el frontend
        const precioElement = productContainer.querySelector('.carrito-producto-precio h4');
        const productName = productContainer.querySelector('.carrito-producto-titulo h3').innerText;
        const precio = parseFloat(precioElement.innerText.replace('$', ''));
        const subtotalElement = productContainer.querySelector('.carrito-producto-subtotal h4');
        const nuevoSubtotal = precio * nuevaCantidad;
        subtotalElement.innerText = nuevoSubtotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

        // Actualizar el total en el frontend
        actualizarTotal();

        Swal.fire({title: `Cantidad de ${productName} actualizada a ${nuevaCantidad}`,
          position: 'top',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        console.error('Error al actualizar la cantidad en la base de datos');
      }
    })
    .catch(error => console.error('Error:', error));
  }



  

  function actualizarTotal() {
    const cartProducts = document.querySelectorAll('.carrito-producto');
    let totalCalculado = 0;

    cartProducts.forEach((product) => {
      const cantidad = parseInt(product.querySelector('.carrito-producto-cantidad-input').value);
      const precio = parseFloat(product.querySelector('.carrito-producto-precio h4').innerText.replace('$', ''));
      totalCalculado += cantidad * precio;
    });

    const totalElement = document.getElementById('total');
    totalElement.innerText = totalCalculado.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
  toggleEmptyCartButton();
});
