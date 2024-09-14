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
            Swal.fire({ text: `${productName} eliminado del carrito`,
              position: 'top',
              icon: 'success',
              title: 'Éxito',
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
              timer: 1500
            });
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire({text: `Ocurrió un error al eliminar el producto del carrito`,
            title:'Error',
            position: 'top',
            icon: 'error',
            timer: 1500
          });
        }
      });
    });
  
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
          Swal.fire({text: `Carrito vaciado`,
            title:'Éxito',
            position: 'top',
            icon: 'success',
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
            timer: 1500
          });
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({text: `Ocurrió un error al eliminar el producto del carrito`,
          title:'Error',
          position: 'top',
          icon: 'error',
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

    fetch(`/api/carts/${cid}/product/${pid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newQuantity: nuevaCantidad })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const precioElement = productContainer.querySelector('.carrito-producto-precio h4');
        const productName = productContainer.querySelector('.carrito-producto-titulo h3').innerText;
        const precio = parseFloat(precioElement.innerText.replace('$', '').replace('.',''));
        const subtotalElement = productContainer.querySelector('.carrito-producto-subtotal h4');
        const nuevoSubtotal = precio * nuevaCantidad;
        subtotalElement.innerText = nuevoSubtotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

        actualizarTotal();

        Swal.fire({text: `Cantidad de ${productName} actualizada a ${nuevaCantidad}`,
          title: 'Éxito',
          position: 'top',
          icon: 'success',
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
    let cantidadCalculado = 0

    cartProducts.forEach((product) => {
      const cantidad = parseInt(product.querySelector('.carrito-producto-cantidad-input').value);
      const precio = parseFloat(product.querySelector('.carrito-producto-precio h4').innerText.replace('$', '').replace('.',''));
      totalCalculado += cantidad * precio;
      cantidadCalculado += cantidad
    });

    const totalElement = document.getElementById('total');
    const cantidadElement = document.getElementById('cantidad-total');
    totalElement.innerText = totalCalculado.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    cantidadElement.innerText = cantidadCalculado;
  }
  toggleEmptyCartButton();
});



document.addEventListener("DOMContentLoaded", () => {

  const purchaseButtons = document.querySelectorAll(".carrito-acciones-comprar");

purchaseButtons.forEach(button => {
  button.addEventListener("click", async () => {
    const cartId = button.getAttribute("data-cart-id");
    try {
      window.location.href = `/carts/${cartId}/purchase`;
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
});


const checkoutbuttons = document.querySelectorAll('.checkout-button');
checkoutbuttons.forEach(button =>{

  button.addEventListener('click', async () => {
      const res = await fetch('/api/payments/create-checkout-session', {
          method: 'POST',
          // headers: {
          //     'Content-Type': 'application/json'
          // },
          // body: JSON.stringify({
          //     amount: 1000,
          //     currency: 'usd',
          //     paymentMethodType: 'card',
          //     paymentMethod: 'pm_card_visa',
          //     confirm: true
          // })
      })
      const data = await res.json();
      console.log('data recibida de session', data)
      window.location.href = data.url;
  })
})