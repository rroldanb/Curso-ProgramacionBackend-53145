document.addEventListener('DOMContentLoaded', () => {
    // Botón para quitar producto del carrito
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
    removeFromCartButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const cartId = event.target.getAttribute('data-cart-id');
        const productId = event.target.getAttribute('data-product-id');
  
        try {
          const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (response.ok) {
            const result = await response.json();
            console.log('Producto eliminado del carrito:', result);
            Swal.fire('Éxito', 'Producto eliminado del carrito', 'success').then(() => {
              location.reload();
            });
          } else {
            console.error('Error al eliminar el producto del carrito');
            Swal.fire('Error', 'No se pudo eliminar el producto del carrito', 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error', 'Ocurrió un error al eliminar el producto del carrito', 'error');
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
          console.log('Carrito vaciado:', result);
          Swal.fire('Éxito', 'Carrito vaciado', 'success').then(() => {
            location.reload();
          });
        } else {
          console.error('Error al vaciar el carrito');
          Swal.fire('Error', 'No se pudo vaciar el carrito', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Ocurrió un error al vaciar el carrito', 'error');
      }
    });
  });
  