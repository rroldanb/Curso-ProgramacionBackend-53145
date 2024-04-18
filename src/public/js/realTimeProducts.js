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
const newProdImage = document.getElementById("newProdImage");
const newProdFileNames = document.getElementById("newProdFileNames");
const productsArea = document.getElementById('realTimeProductsArea');

productForm.addEventListener("submit", (e) => {
  e.preventDefault();


  const files = newProdImage.files;

  const imageUrls = [];

  for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      imageUrls.push(imageUrl);
  }

  const newProduct = {
    title: newProdTitle.value,
    description: newProdDescription.value,
    code: newProdCode.value,
    price: newProdPrice.value,
    active: newProdActive.checked,
    stock: newProdStock.value,
    category: newProdCategory.value,
    thumbnails: imageUrls
  };
  
  if (newProduct.id) {
    // updateProduct(product.id, newProduct);
    // socket.emit('updateProduct', { id:product.id, product:newProduct})
  } else {
    console.log('enviando producto ',newProduct)




fetch('/api/products',{
  method:'POST',
  headers:{
    "Content-Type":"application/json"
  },
  body: JSON.stringify(newProduct)
})
.then(response =>{
  if (!response.ok) {
    throw new Error('Error agregando el producto');
  }
  socket.emit('addProduct',  newProduct)
  return response.json()
})
.then(data =>{
  console.log(data)
})
.catch(error=>{
  console.error("Error:", error)
})
}



cleanProductsForm ()
newProdTitle.focus(); 
});


function cleanProductsForm () {
  newProdTitle.value = "";
  newProdDescription.value = "";
  newProdCode.value = "";
  newProdPrice.value = "";
  newProdActive.checked = false; 
  newProdStock.value = "";
  newProdCategory.value = "";
  newProdImage.value="";
  newProdFileNames.value=""
}



socket.on('server_product', data => {
  appendProduct(data)
})
socket.on('load_server_products', data=>{
renderProducts(data)
})


const renderProductUI = (product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('card');
    productCard.style.minWidth = '250px';
    productCard.id = `product-${product.id}`; 

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
    productsArea.innerHTML = ""; 
    products.forEach((product) => {
        const productUI = renderProductUI(product); 
        productsArea.appendChild(productUI); 
    });
};

let rrcont=0
const appendProduct = (product) => {
    const productUI = renderProductUI(product); 
    productsArea.appendChild(productUI); 
};


