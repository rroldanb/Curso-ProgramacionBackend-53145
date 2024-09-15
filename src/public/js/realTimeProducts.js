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
const username = document.getElementById("username").innerText;
const isPremiumText = document.getElementById("isPremium").innerText.trim();
const isPremium = isPremiumText === "true"; 
const isAdminTextRR = document.getElementById("isAdminText").innerText.trim();
const isAdmin= isAdminTextRR === "true"; 

const formContainer = document.getElementById('form-container');
const btnNewProduct = document.getElementById('btn-new-product')
const saveButton = document.querySelector(".btn-save");
saveButton.disabled = true;
const cancelButton = document.getElementById("btn-cancel");

btnNewProduct.addEventListener('click', toggleFormVisibility);

const formFields = document.querySelectorAll(
  "#productForm input, #productForm textarea"
);
formFields.forEach((field) => {
  field.addEventListener("input", () => {
    // cancelButton.style.display = "block";
    saveButton.disabled = false;
  });
});

function toggleFormVisibility() {
  const formContainer = document.getElementById('form-container');
  const requiredFields = document.querySelectorAll('#form-container [required]');
  
  if (formContainer.classList.contains('d-none')) {
    formContainer.classList.remove('d-none');

  } else {
    // Limpiar el formulario antes de ocultarlo
    cleanProductsForm();
    // Eliminar el atributo required de los campos antes de ocultarlos
    requiredFields.forEach(field => field.removeAttribute('required'));
    formContainer.classList.add('d-none');
  }
}

function toggleFormVisibilityRR() {

  
  if (formContainer.classList.contains('d-none')) {
      formContainer.classList.remove('d-none');
  } else {
    formContainer.classList.add('d-none');
  }
}



cancelButton.addEventListener("click", (event) => {
  event.preventDefault()
  h3.textContent = "Agregar nuevo producto";
  prodDetails.style.backgroundColor = "rgb(143, 167, 191)";
  productForm.reset();
  // cancelButton.style.display = "none";
  saveButton.disabled = true;
  productsArea.focus();
  cleanProductsForm()
  toggleFormVisibility()
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


  const newProduct={
    title: newProdTitle.value,
    description: newProdDescription.value,
    code: newProdCode.value,
    price: parseInt(newProdPrice.value) ,
    status: newProdStatus.checked,
    stock: parseInt(newProdStock.value),
    category: newProdCategory.value,
    owner: newProdOwner.value.trim(),
    thumbnails: imageUrls,
  };


  if (h3.textContent === "Editar producto") {

    updateProduct(savedId, newProduct);
    h3.textContent = "Agregar nuevo producto";
    prodDetails.style.backgroundColor = "rgb(143, 167, 191)";

  } else {
  
    saveNewProduct(newProduct);

  }

  saveButton.disabled = true;

  cleanProductsForm();
  // newProdTitle.focus();
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

      toggleFormVisibility()


      return response.json();
    })
    .then((data) => {
      console.log(data);
    
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function updateProduct(pid, newProduct) {
  try {
    const response = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el producto");
    }

  toggleFormVisibility()

    const data = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

function cleanProductsForm() {
  // document.getElementById('productForm').reset();
  newProdTitle.value = "";
  newProdDescription.value = "";
  newProdCode.value = "";
  newProdPrice.value = "";
  newProdStatus.checked = false;
  newProdStock.value = "";
  newProdCategory.value = "";
  if (!isPremium) {
    newProdOwner.value = "";
  }
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

// crea Card
  const productCard = document.createElement("div");
  productCard.classList.add("card");
  productCard.classList.add("adminProdCard");
  productCard.style.minWidth = "300px";
  productCard.id = `product-${product._id}`;

// Imagen principal contenedor  
  const thumbnailDisplayArea = document.createElement("div");
  thumbnailDisplayArea.classList.add("thumbnail-display-area");
  thumbnailDisplayArea.classList.add("bg-secondary");
  thumbnailDisplayArea.classList.add("rounded-top-3");

// Imagen principal imagen  
  const mainImage = document.createElement("img");
  mainImage.classList.add("main-image");
  mainImage.src = product.thumbnails[0];
  mainImage.alt = "Imagen principal del producto";
//Anida imagen principal
  thumbnailDisplayArea.appendChild(mainImage);
  productCard.appendChild(thumbnailDisplayArea);


// Miniaturas  
  const thumbnailsDiv = document.createElement("div");
  thumbnailsDiv.classList.add("thumbnails");
  
  product.thumbnails.forEach((thumbnailUrl) => {
// miniaturas contenedor    
    const thumnailContainer = document.createElement("div")
    thumnailContainer.classList.add('bg-info')
    thumnailContainer.classList.add('rounded-4')

// miniaturas imagen    
    const thumbnailImg = document.createElement("img");
    thumbnailImg.classList.add("thumbnail");
    thumbnailImg.src = thumbnailUrl;
    thumbnailImg.alt = "Thumbnail del producto";
//anida miniaturas    
    thumnailContainer.appendChild(thumbnailImg);
    thumbnailsDiv.appendChild(thumnailContainer);

//magia desplegar miniatura en principal
    thumbnailImg.addEventListener("click", function () {
      const productCard = thumbnailImg.closest(".card");
      const mainImage = productCard.querySelector(".main-image");
      mainImage.src = thumbnailImg.src;
    });
  });
// inserta imagen a card
  productCard.appendChild(thumbnailsDiv);

// detalles producto
  const details = document.createElement("div");

    details.innerHTML = `
        <h3 class="text-center text-primary edit-detail-title">${product.title}</h3>

        <span><strong>Descripción:</strong> </span>
        <textarea name="newProdDescription" id="newProdDescription" disabled class="w-100" rows="4" >${product.description}</textarea>
       
        <p><strong>Código:</strong> ${product.code}</p>
        <p><strong>Precio:</strong> ${product.price}</p>

        <p><strong>Estado:</strong> 
          <span style="color: ${product.status ? "green" : "red"}">
          ${product.status ? "Disponible" : "No disponible"}</span>
        </p>
  
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p><strong>Categoría:</strong> ${product.category}</p>
        
        <p class="justify-content-center mb-0"><strong class"mb-0">Vendido por:</strong> 
        </p>
        <p class="justify-content-center mt-0 text-center"> ${product.owner} </p>
        <div class=" d-flex justify-content-between mb-0 mt-4">
          <button class="btn btn-danger delete" data-id="${
            product._id
          }"><i class="bi bi-trash3 me-2"></i>Eliminar</button>
          <button class="btn btn-secondary update" data-id="${
            product._id
          }"><i class="bi bi-pencil me-2"></i>Editar</button>
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

async function deleteProduct(pid) {
  try {
    const response = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el producto");
    }

    const result = await response.json(); 

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: result.message, 
      position: "top",
      timer: 4000,
    });

  } catch (error) {
    console.error("Error:", error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Hubo un problema al intentar eliminar el producto: ${error}`,
      position: "top",
      timer: 4000,
    });
  }
}




function getProductToEdit(pid) {
  obtenerProductoPorId(pid).then((productoObtenido) => {
    toggleFormVisibility()
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
  const isOwner = product.owner.trim() === username.trim()
  // console.log('socket auth', socket.auth.username)
    if (isAdmin || (isPremium && isOwner)) {
      const productUI = renderProductUI(product);
      productsArea.appendChild(productUI);
    }
   
  });
};

const appendProduct = (product) => {
  const productUI = renderProductUI(product);
  productsArea.appendChild(productUI);
};

const removeProduct = (pid) => {
  const productCard = getProductCardById(pid);
  if (productCard) {
  productsArea.removeChild(productCard)}
};

///Socket
const socket = io({
  auth: {
    username,
    serverOffset: 0,
  },
});


socket.on("Server:addProduct", (data) => {
  // console.log(`recibiendo datos del nuevo producto: ${data}`);
  appendProduct(data);
});
socket.on("Server:removeProduct", (pid) => {
  // console.log(`Eliminando el producto: ${pid}`);
  removeProduct(pid);
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
