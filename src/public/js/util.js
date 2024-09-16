document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = window.location.origin;
  
    const imagePath = "/img/logo.png";
    document.querySelectorAll('.hero-image').forEach(function(img) {
      img.src = baseUrl + imagePath;
    });
  });
  

  function redirectToCart() {
    const cartIdElement = document.getElementById("cart_id");
    const cartId = cartIdElement ? cartIdElement.textContent.split(" ")[2] : null;
  
    fetch("/carts", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const cid = cartId;
        window.location.href = `/carts/${cid}`;
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  }
  

  function logout() {
    fetch("/sessions/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/";
        } else {
          alert("Error logging out");
        }
      })
      .catch((error) => console.error("Error:", error));
  }
  