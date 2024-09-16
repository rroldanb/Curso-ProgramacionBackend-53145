document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = window.location.origin;
  
    const imagePath = "img/warriorRR.png";
  console.log("direccion imagen", baseUrl + imagePath)
    document.querySelectorAll('.hero-image').forEach(function(img) {
      img.src = baseUrl + imagePath;
    });
  });
  