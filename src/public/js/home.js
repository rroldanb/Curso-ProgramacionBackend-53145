document.addEventListener("DOMContentLoaded", function() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener("click", function() {
        const productId = thumbnail.closest(".card").id;
        const mainImage = document.querySelector(`#${productId} .main-image`);
        mainImage.src = thumbnail.src;
      });
    });
  });
  
