function redirectToCart() {
    const cartIdElement = document.getElementById("cart_id");
  const cid = cartIdElement ? cartIdElement.textContent.split(" ")[2] : null;

console.log(cid)
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
  