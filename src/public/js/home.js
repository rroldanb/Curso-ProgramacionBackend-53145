document.addEventListener("DOMContentLoaded", function() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener("click", function() {
        const productId = thumbnail.closest(".card").id;
        const mainImage = document.querySelector(`#${productId} .main-image`);
        mainImage.src = thumbnail.src;
      });
    });

    const statusSpans = document.querySelectorAll(".status-span");
    statusSpans.forEach(span => {
      const status = span.textContent.trim();
      if (status === "Disponible") {
        span.style.color = "green";
      } else {
        span.style.color = "red";
      }
    });

  });
  
