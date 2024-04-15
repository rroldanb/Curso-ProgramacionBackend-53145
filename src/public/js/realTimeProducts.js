// const socket = io()

const productsArea = document.getElementById('realTimeProductsArea')


const productForm = document.querySelector("#productForm");
const newProdTitle = document.querySelector("#newProdTitle");
const newProdDescription = document.querySelector("#newProdDescription");
const newProdCode = document.querySelector("#newProdCode");
const newProdPrice = document.querySelector("#newProdPrice");
const newProdActive = document.querySelector("#btn-switch");
const newProdStock = document.querySelector("#newProdStock");
const newProdCategory = document.querySelector("#newProdCategory");
// const newProdImage = document.querySelector("#newProdImage");

let savedId = null; 

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
    // image: newProdImage.value 
  };

  if (savedId) {
    updateProduct(savedId, newProduct);
  } else {
    saveProduct(newProduct);
  }

  newProdTitle.value = "";
  newProdDescription.value = "";
  newProdCode.value = "";
  newProdPrice.value = "";
  newProdActive.checked = false; 
  newProdStock.value = "";
  newProdCategory.value = "";
//   newProdImage.value = "";

  newProdTitle.focus();
});

function saveProduct(product) {
  console.log("Guardando nuevo producto:", product);
}

function updateProduct(id, product) {
  console.log("Actualizando producto con ID", id, ":", product);
}




