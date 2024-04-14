document.addEventListener("DOMContentLoaded", function() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener("click", function() {
        const productId = thumbnail.closest(".card").id;
        const mainImage = document.querySelector(`#${productId} .main-image`);
        const imagePath = document.querySelector(`#${productId} .main-image-path`);
        
        const url = new URL(thumbnail.src);
        const relativePath = url.pathname;
  
        mainImage.src = thumbnail.src;
        imagePath.value = relativePath; 
      });
    });
  });
  