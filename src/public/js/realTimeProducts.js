const socket = io(); 

let savedId = "";
const productForm = document.getElementById("productForm");
const newProdTitle = document.getElementById("newProdTitle");
const newProdDescription = document.getElementById("newProdDescription");
const newProdCode = document.getElementById("newProdCode");
const newProdPrice = document.getElementById("newProdPrice");
const newProdActive = document.getElementById("btn-switch");
const newProdStock = document.getElementById("newProdStock");
const newProdCategory = document.getElementById("newProdCategory");

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newProduct = {
    title: newProdTitle.value,
    description: newProdDescription.value,
    code: newProdCode.value,
    price: newProdPrice.value,
    active: newProdActive.checked,
    stock: newProdStock.value,
    category: newProdCategory.value
  };

  if (savedId) {
    updateProduct(savedId, newProduct);
  } else {
    saveProduct(newProduct);
  }

  // Limpiamos los campos después de enviar el formulario
  newProdTitle.value = "";
  newProdDescription.value = "";
  newProdCode.value = "";
  newProdPrice.value = "";
  newProdActive.checked = false; 
  newProdStock.value = "";
  newProdCategory.value = "";

  newProdTitle.focus(); // Damos foco al primer campo después de enviar el formulario
});


const productsArea = document.getElementById('realTimeProductsArea');

const renderProductUI = (product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('card');
    productCard.style.minWidth = '250px';
    productCard.id = `product-${product.id}`; // Modificado para usar el ID del producto

    const thumbnailDisplayArea = document.createElement('div');
    thumbnailDisplayArea.classList.add('thumbnail-display-area');
    const mainImage = document.createElement('img');
    mainImage.classList.add('main-image');
    mainImage.src = product.thumbnails[0];
    mainImage.alt = 'Imagen principal del producto';
    thumbnailDisplayArea.appendChild(mainImage);
    productCard.appendChild(thumbnailDisplayArea);

    const thumbnailsDiv = document.createElement('div');
    thumbnailsDiv.classList.add('thumbnails');
    product.thumbnails.forEach(thumbnailUrl => {
        const thumbnailImg = document.createElement('img');
        thumbnailImg.classList.add('thumbnail');
        thumbnailImg.src = thumbnailUrl;
        thumbnailImg.alt = 'Thumbnail del producto';
        thumbnailsDiv.appendChild(thumbnailImg);
    });
    productCard.appendChild(thumbnailsDiv);

    const details = document.createElement('div');
    details.innerHTML = `
      <h3>${product.title}</h3>
      <p><strong>Descripción:</strong> ${product.description}</p>
      <p><strong>Código:</strong> ${product.code}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Estado:</strong> ${product.status ? 'Disponible' : 'No disponible'}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Categoría:</strong> ${product.category}</p>
      <div class="container-fluid d-flex justify-content-evenly">
        <button class="btn btn-danger delete" data-id="${product.id}">Eliminar</button>
        <button class="btn btn-secondary update" data-id="${product.id}">Editar</button>
      </div>
    `;
    productCard.appendChild(details);

    return productCard; // Devuelve el elemento del producto creado
}

const renderProducts = (products) => {
    productsArea.innerHTML = ""; // Limpia el área de productos
    products.forEach((product) => {
        const productUI = renderProductUI(product); // Crea la interfaz de usuario para cada producto
        productsArea.appendChild(productUI); // Agrega la interfaz de usuario del producto al área de productos
    });
};

const appendProduct = (product) => {
    const productUI = renderProductUI(product); // Crea la interfaz de usuario para el nuevo producto
    productsArea.appendChild(productUI); // Agrega la interfaz de usuario del nuevo producto al área de productos
};
