document.addEventListener("DOMContentLoaded", function() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener("click", function() {
        const productId = thumbnail.closest(".card").id;
        const mainImage = document.querySelector(`#${productId} .main-image`);
        mainImage.src = thumbnail.src;
      });
    });

    const statusSpans = document.querySelectorAll(".status-span");
    statusSpans.forEach(span => {
      const status = span.textContent.trim();
      if (status === "Disponible") {
        span.style.color = "green";
      } else {
        span.style.color = "red";
      }
    });

  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const cartId = event.target.getAttribute('data-cart-id');
            const productId = event.target.getAttribute('data-product-id');
            
            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Producto agregado al carrito:', result);
                    Swal.fire('Éxito', 'Producto agregado al carrito', 'success');
                } else {
                    console.error('Error al agregar el producto al carrito');
                    Swal.fire('Error', 'No se pudo agregar el producto al carrito', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'Ocurrió un error al agregar el producto al carrito', 'error');
            }
        });
    });
});
