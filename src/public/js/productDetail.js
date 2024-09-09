    const thumbnails = document.querySelectorAll('.thumbnail-row img');
    const mainImage = document.querySelector('.detail-main-image img');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            mainImage.src = thumbnail.src;
        });
    });


    document.addEventListener("DOMContentLoaded", () => {
        const addToCartButton = document.querySelector(".add-to-cart-btn");
    
        addToCartButton.addEventListener("click", (event) => {
            event.preventDefault();
    
            checkAuthStatus().then((isAuthenticated) => {
                if (!isAuthenticated) {
                    let loginModalLabel = document.getElementById("loginModalLabel");
                    loginModalLabel.innerHTML = "Debes loguearte para utilizar el carrito";
    
                    document.getElementById("btn-login").click();
                    return;
                }
    
                const cartIdElement = document.getElementById("cart_id");
                const cartId = cartIdElement ? cartIdElement.textContent.split(" ")[2] : null;
    
                const productId = event.target.getAttribute("data-product-id");
    
                // Enviar la solicitud para agregar el producto al carrito
                fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Error al agregar el producto al carrito");
                        }
                    })
                    .then((result) => {
                        Swal.fire({
                            text: "Producto agregado al carrito",
                            position: "top",
                            icon: "success",
                            title: "Éxito",
                            timer: 1500,
                        });
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        Swal.fire({
                            text: `No se pudo agregar el producto al carrito`,
                            title: "Error",
                            position: "top",
                            icon: "error",
                            timer: 1500,
                        });
                    });
            });
        });
    });
    

    function checkAuthStatus() {
        return fetch("/sessions/status", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            const addToCartButton = document.getElementById("add-to-cart-btn");
            const owner = document.getElementById("owner").innerText.trim();
            const username = document.getElementById("username").innerText.trim();
            // const  = data.username;
    console.log(addToCartButton.innerText)
    console.log(username)
            if (data.isAuthenticated) {
                // Si el usuario es un administrador, oculta el botón "Agregar al carrito"
                if (data.isAdmin) {
                        addToCartButton.classList.add("d-none");
                } else {
                    // Si es premium, valida si es dueño del producto
                    if (owner === username) {
                        
                                addToCartButton.innerText = "No puedes agregar tus propios productos al carrito";
                                addToCartButton.disabled = true;
                                addToCartButton.classList.remove("btn-warning");
                                addToCartButton.classList.add("btn-danger");
                        
                    } else {
                        // Usuarios regulares
                            addToCartButton.classList.remove("d-none");
                    }
                }
                return true;
            } else {
                // Si no está autenticado
                    addToCartButton.classList.add("d-none");
                return false;
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            return false;
        });
    }
    

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