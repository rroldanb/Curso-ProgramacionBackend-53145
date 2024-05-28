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

// home.js

// document.addEventListener('DOMContentLoaded', () => {
//   const loginForm = document.getElementById('loginForm');
//   if (loginForm) {
//     loginForm.addEventListener('submit', login);
//   }

//   const registerButton = document.querySelector('.btn-secondary');
//   if (registerButton) {
//     registerButton.addEventListener('click', showRegister);
//   }

//   const registerModal = document.getElementById('registerModal');
//   if (registerModal) {
//     registerModal.addEventListener('hidden.bs.modal', showLogin);
//   }

//   checkAuthStatus();
// });

function login(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/sessions/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      console.log("login exitoso")
      window.location.reload();
    } else {
      alert(data.error);
    }
  })
  .catch(error => console.error('Error:', error));
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

// function showRegister() {
//   const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
//   const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

//   loginModal.hide();
//   registerModal.show();
// }

// function showLogin() {
//   const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
//   loginModal.show();
// }

function register(event) {
  event.preventDefault();
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
    console.log('data status', data.status)
    if (data.status === 'success') {

      console.log('Usuario agregado correctamente:', result);
      Swal.fire('Éxito', 'Usuario agregado correctamente', 'success');
      // const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
      // registerModal.hide();
      // registerModal.hidden = true;
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
      console.log(data)
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



