document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = window.location.origin;
  
    const imagePath = "/img/logo.png";
  console.log("direccion imagen", baseUrl + imagePath)
    document.querySelectorAll('.hero-image').forEach(function(img) {
      img.src = baseUrl + imagePath;
    });
  });
  