function redirectToCart() {
    const cartIdElement = document.getElementById("cart_id");
  const cid = cartIdElement ? cartIdElement.textContent.split : null;

   window.location.href =`/carts/${cid}`
  }


  document.addEventListener("DOMContentLoaded", () => {
    const priceElements = document.getElementsByClassName('price');
  
    Array.from(priceElements).forEach(element => {
      const value = parseFloat(element.innerText.replace(/[^0-9,-]+/g, ""));
      if (!isNaN(value)) {
        element.innerText = value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
      }
    });
  });
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const ticketCodeElement = document.getElementById("ticketCode");
    const tCode = ticketCodeElement ? ticketCodeElement.textContent : null;
  
    async function handleCancel(cartId, redirectUrl) {
      try {
        const response = await fetch(`/carts/${cartId}/cancel/${tCode}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const result = await response.json();
          window.location.href = redirectUrl;
        } else {
          const result = await response.json();
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    const cancelButton = document.getElementById("cancel-purchase");
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        const cartId = cancelButton.getAttribute("data-cart-id");
        handleCancel(cartId, "/carts/" + cartId);
      });
    }
  
    const cartButton = document.getElementById("btn-cart");
    if (cartButton) {
      cartButton.addEventListener("click", () => {
        const cartId = cartButton.getAttribute("data-cart-id");
        handleCancel(cartId, "/carts/" + cartId);
      });
    }
  
    const storeButton = document.getElementById("btn-store");
    if (storeButton) {
      storeButton.addEventListener("click", (event) => {
        event.preventDefault();
        const cartId = storeButton.getAttribute("data-cart-id");
        handleCancel(cartId, "/products");
      });
    }
  });
  

document.addEventListener("DOMContentLoaded", () => {
    const purchaseForm = document.getElementById("purchase-form");
    const ticketCodeElement = document.getElementById("ticketCode");
    const tCode = ticketCodeElement ? ticketCodeElement.textContent : null;
    if (purchaseForm) {
      purchaseForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        Swal.fire({
          title: '¡Gracias por tu compra!',
          text: `El Código de tu ticket es: ${tCode}.`,
          icon: 'success',
          confirmButtonText: 'Ok',
          position: "top",
          timer: 3000,

        }).then(() => {
          window.location.href = "/products";
        });
      });
    }
  });
  