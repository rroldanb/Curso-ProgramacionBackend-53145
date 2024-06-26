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
            // const cartId = document.getElementById('cart_id');
            const cartIdElement = document.getElementById('cart_id');
            const cartId = cartIdElement ? cartIdElement.textContent.split(' ')[2] : null; 

            const productContainer = event.target.closest('.card');
            const productNameElement = productContainer.querySelector('.prodName');
            const productName = productNameElement ? productNameElement.innerText : 'Producto desconocido';
    
    
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
                    // console.log('Producto agregado al carrito:', result);
                    Swal.fire({ text: `${productName} agregado al carrito`,
                      position: 'top',
                      icon: 'success',
                      title: 'Éxito',
                      showConfirmButton: false,
                      timer: 1500
                    });
                } else {
                    console.error('Error al agregar el producto al carrito');
                    Swal.fire({ text: `No se pudo agregar el producto al carrito`,
                      title:'Error',
                      position: 'top',
                      icon: 'error',
                      showConfirmButton: false,
                      timer: 1500
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({ text: `Ocurrió un error al agregar el producto al carrito`,
                  title:'Error',
                  position: 'top',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500
                });
            }
        });
    });
});



function login(event) {
  event.preventDefault();
  const email = document.getElementById('emailLogin').value;
  const password = document.getElementById('passwordLogin').value;

  if (!email || !password) {
    alert("Email y contraseña son necesarios");
    return;
  }

  fetch('/sessions/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.status === 'success') {
      console.log("Login exitoso");
      window.location.reload();
    } else {
      alert(data.error || 'Error desconocido');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  });
}


function logout() {
  fetch('/sessions/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      window.location.reload();
    } else {
      alert('Error logging out');
    }
  })
  .catch(error => console.error('Error:', error));
}



function register(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  fetch('/sessions/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {

      Swal.fire({ text: `Usuario agregado correctamente`,
        position: 'top',
        icon: 'success',
        title: 'Éxito',
        showConfirmButton: false,
        timer: 1500
      });
      form.reset();
    } else {
      alert(data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}

function checkAuthStatus() {
  fetch('/sessions/status', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const btnCart = document.getElementById('btn-cart');
    const btnChat = document.getElementById('btn-chat');
    const btnRTP = document.getElementById('btn-rtp');
    if (btnLogin && btnLogout && btnCart && btnChat && btnRTP) {
    if (data.isAuthenticated) {
      btnLogin.classList.add('d-none');
      btnLogout.classList.remove('d-none');
      btnCart.classList.remove('d-none');
      btnChat.classList.remove('d-none');
      if (data.isAdmin) {
        btnRTP.classList.remove('d-none');
      } else {
        btnRTP.classList.add('d-none');
      }
    } else {
      btnLogin.classList.remove('d-none');
      btnLogout.classList.add('d-none');
      btnCart.classList.add('d-none');
      btnChat.classList.add('d-none');
    }}
  })
  .catch(error => console.error('Error:', error));
}


function redirectToCart() {
  fetch("/carts", {
    method: "GET",
    credentials: "same-origin", 
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    const cid = data.cartId;
    window.location.href = `/carts/${cid}`;
  })
  .catch(error => {
    console.error("Error en la solicitud:", error);
  });
}



document.querySelectorAll('.toggle-password-btn').forEach(button => {
  button.addEventListener('click', function () {
    const input = this.previousElementSibling;
    const icon = this.querySelector('i');

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('bi-eye');
      icon.classList.add('bi-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('bi-eye-slash');
      icon.classList.add('bi-eye');
    }
  });
});
