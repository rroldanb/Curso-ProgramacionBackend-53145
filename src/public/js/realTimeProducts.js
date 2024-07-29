// const { logger } = require("../../utils/loggers");

let savedId = "";
const productForm = document.getElementById("productForm");
const newProdTitle = document.getElementById("newProdTitle");
const newProdDescription = document.getElementById("newProdDescription");
const newProdCode = document.getElementById("newProdCode");
const newProdPrice = document.getElementById("newProdPrice");
const newProdStatus = document.getElementById("btn-switch");
const newProdStock = document.getElementById("newProdStock");
const newProdCategory = document.getElementById("newProdCategory");
const newProdOwner = document.getElementById("newProdOwner");
const newProdFileNames = document.getElementById("newProdFileNames");
const productsArea = document.getElementById("realTimeProductsArea");
const h3 = document.querySelector("#newProdDetails h3");
const prodDetails = document.querySelector("#newProdDetails");
const username = document.getElementById("username").innerText
const isPremium = document.getElementById("isPremium").innerText

const saveButton = document.querySelector(".btn-save");
saveButton.disabled = true;
const cancelButton = document.querySelector(".btn-cancel");

const formFields = document.querySelectorAll(
  "#productForm input, #productForm textarea"
);
formFields.forEach((field) => {
  field.addEventListener("input", () => {
    cancelButton.style.display = "block";
    saveButton.disabled = false;
  });
});

cancelButton.addEventListener("click", () => {
  h3.textContent = "Agregar nuevo producto";
  prodDetails.style.backgroundColor = "rgb(143, 167, 191)";
  productForm.reset();
  cancelButton.style.display = "none";
  saveButton.disabled = true;
  newProdTitle.focus();
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  function isValidImageUrl(url) {
    const regex = /\.(jpg|jpeg|png|gif|webp)$/i;
    return regex.test(url);
  }

  const filesText = newProdFileNames.value;
  let imagesOK = true;
  const imageUrls = filesText.split(",");
  imageUrls.forEach((imageUrl, index) => {
    imageUrls[index] = imageUrl.trim();
    imagesOK = imagesOK && isValidImageUrl(imageUrls[index]);
  });


  const newProduct = {
    title: newProdTitle.value,
    description: newProdDescription.value,
    code: newProdCode.value,
    price: parseInt(newProdPrice.value) ,
    status: newProdStatus.checked,
    stock: parseInt(newProdStock.value),
    category: newProdCategory.value,
    owner: newProdOwner.value,
    thumbnails: imageUrls,
  };
  if (isPremium) newProduct.owner = username.trim()

  if (h3.textContent === "Editar producto") {
    updateProduct(savedId, newProduct);
    h3.textContent = "Agregar nuevo producto";
    prodDetails.style.backgroundColor = "rgb(143, 167, 191)";
  } else {
    saveNewProduct(newProduct);
  }

  cancelButton.style.display = "none";
  saveButton.disabled = true;

  cleanProductsForm();
  newProdTitle.focus();
});

function saveNewProduct(newProduct) {
  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error agregando el producto");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function updateProduct(pid, product) {
  try {
    const response = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el producto");
    }

    const data = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

function cleanProductsForm() {
  newProdTitle.value = "";
  newProdDescription.value = "";
  newProdCode.value = "";
  newProdPrice.value = "";
  newProdStatus.checked = false;
  newProdStock.value = "";
  newProdCategory.value = "";
  newProdOwner.value = "";
  newProdFileNames.value = "";
}

function formateaProducto(product) {
  product.price = toPesos(product.price);
  product.title = toCapital(product.title);
  product.category = toCapital(product.category);
}

function getProductCardById(productId) {
  return document.getElementById(`product-${productId}`);
}

function updateProductCard(productId, updatedProduct) {
  formateaProducto(updatedProduct);
  const productCard = getProductCardById(productId);
  if (productCard) {
    productCard.querySelector("h3").innerHTML = `${updatedProduct.title}`;
    const descriptionLine = productCard.querySelector("p:nth-of-type(1)");
    descriptionLine.innerHTML = ` ${updatedProduct.description}`;

    const codeLine = productCard.querySelector("p:nth-of-type(2)");
    codeLine.innerHTML = `<strong>Código:</strong> ${updatedProduct.code}`;

    const priceLine = productCard.querySelector("p:nth-of-type(3)");
    priceLine.innerHTML = `<strong>Precio:</strong> ${updatedProduct.price}`;

    const statusLine = productCard.querySelector("p:nth-of-type(4)");
    statusLine.innerHTML = `<strong>Estado:</strong> 
      <span style="color: ${updatedProduct.status ? 'green' : 'red'}">
        ${updatedProduct.status ? 'Disponible' : 'No disponible'}
      </span>
    `;
    

    const stockLine = productCard.querySelector("p:nth-of-type(5)");
    stockLine.innerHTML = `<strong>Stock:</strong> ${updatedProduct.stock}`;

    const categoryLine = productCard.querySelector("p:nth-of-type(6)");
    categoryLine.innerHTML = `<strong>Categoría:</strong> ${updatedProduct.category}`;
   
    const ownerLine = productCard.querySelector("p:nth-of-type(7)");
    ownerLine.innerHTML = `<strong>Propietario:</strong> ${updatedProduct.owner}`;

    const thumbnailsDiv = productCard.querySelector(".thumbnails");
    thumbnailsDiv.innerHTML = ""; 
    updatedProduct.thumbnails.forEach((thumbnailUrl) => {
      const thumbnailImg = document.createElement("img");
      thumbnailImg.classList.add("thumbnail");
      thumbnailImg.src = thumbnailUrl;
      thumbnailImg.alt = "Thumbnail del producto";
      thumbnailsDiv.appendChild(thumbnailImg);

    });
  }
}

const renderProductUI = (product) => {
  const productCard = document.createElement("div");
  productCard.classList.add("card");
  productCard.style.minWidth = "250px";
  productCard.id = `product-${product._id}`;

  const thumbnailDisplayArea = document.createElement("div");
  thumbnailDisplayArea.classList.add("thumbnail-display-area");
  const mainImage = document.createElement("img");
  mainImage.classList.add("main-image");
  mainImage.src = product.thumbnails[0];
  mainImage.alt = "Imagen principal del producto";
  thumbnailDisplayArea.appendChild(mainImage);
  productCard.appendChild(thumbnailDisplayArea);

  const thumbnailsDiv = document.createElement("div");
  thumbnailsDiv.classList.add("thumbnails");
  product.thumbnails.forEach((thumbnailUrl) => {
    const thumbnailImg = document.createElement("img");
    thumbnailImg.classList.add("thumbnail");
    thumbnailImg.src = thumbnailUrl;
    thumbnailImg.alt = "Thumbnail del producto";
    thumbnailsDiv.appendChild(thumbnailImg);

    thumbnailImg.addEventListener("click", function () {
      const productCard = thumbnailImg.closest(".card");
      const mainImage = productCard.querySelector(".main-image");
      mainImage.src = thumbnailImg.src;
    });
  });

  productCard.appendChild(thumbnailsDiv);

  const details = document.createElement("div");
  details.innerHTML = `
      <h3 class="text-center">${product.title}</h3>
      <span><strong>Descripción:</strong> </span>
      <p> ${product.description}</p>
      <p><strong>Código:</strong> ${product.code}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <p>
      <strong>Estado:</strong> 

        <span style="color: ${product.status ? "green" : "red"}">
        ${product.status ? "Disponible" : "No disponible"}</span>
      </p>

      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Categoría:</strong> ${product.category}</p>
        <p><strong>Propietario:</strong> ${product.owner}</p>

      <div class="container-fluid d-flex justify-content-evenly">
        <button class="btn btn-danger delete" data-id="${
          product._id
        }">Eliminar</button>
        <button class="btn btn-secondary update" data-id="${
          product._id
        }">Editar</button>
      </div>
    `;
  const btnDelete = details.querySelector(".delete");
  const btnUpdate = details.querySelector(".update");
  btnDelete.addEventListener("click", () =>
    deleteProduct(btnDelete.dataset.id)
  );
  btnUpdate.addEventListener("click", () =>
    getProductToEdit(btnUpdate.dataset.id)
  );

  productCard.appendChild(details);

  return productCard; 
};

function deleteProduct(pid) {
  fetch(`/api/products/${pid}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }
      return response.json();
    })
    .then((data) => {
  console.log(`Producto eliminado: ${data}`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getProductToEdit(pid) {
  obtenerProductoPorId(pid).then((productoObtenido) => {
    renderProductsForm(productoObtenido);
  });
}

function renderProductsForm(product) {
  newProdTitle.value = product.title;
  newProdDescription.value = product.description;
  newProdCode.value = product.code;
  newProdPrice.value = product.price;
  newProdStatus.checked = product.status;
  newProdStock.value = product.stock;
  newProdCategory.value = product.category;
  newProdOwner.value = product.owner;
  const fileNamesString = product.thumbnails.join(", ");
  newProdFileNames.value = fileNamesString;
  savedId = product._id;
  h3.textContent = "Editar producto";
  prodDetails.style.backgroundColor = "bisque";
  newProdTitle.focus();
  cancelButton.style.display = "block";
}

let obtenerProductoPorId = (pid) => {
  return fetch(`/api/products/${pid}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener el producto");
      }
      return response.json();
    })
    .then((producto) => {
      return producto;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const renderProducts = (products) => {
  productsArea.innerHTML = "";
  products.forEach((product) => {
    const productUI = renderProductUI(product);
    productsArea.appendChild(productUI);
  });
};

const appendProduct = (product) => {
  const productUI = renderProductUI(product);
  productsArea.appendChild(productUI);
};


///Socket
const socket = io({
  auth: {
    username,
    serverOffset: 0,
  },
});


socket.on("Server:addProduct", (data) => {
  console.log(`recibiendo datos del nuevo producto: ${data}`);
  appendProduct(data);
});
socket.on("Server:loadProducts", (data) => {
  renderProducts(data);
});

socket.on("Server:productUpdate", (data) => {
  updateProductCard(data._id, data);
});

function logout() {
  fetch('/sessions/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/'; 
    } else {
      throw new Error('Error logging out');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert(error.message);
  });
}
