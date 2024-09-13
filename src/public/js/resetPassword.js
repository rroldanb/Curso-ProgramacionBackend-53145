document.querySelectorAll(".toggle-password-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const input = this.previousElementSibling;
    const icon = this.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    }
  });
});
document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden. Por favor, intente nuevamente.",
        position: "top",
        timer:2500,
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: result.message,
          position: "top",
          timer:2500,
          confirmButtonText: "Aceptar",
        }).then(() => {
          window.location.href = "/";
        });

        form.reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
          position: "top",
          timer:2500,
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al intentar restablecer la contraseña. Por favor, intenta de nuevo más tarde.",
        confirmButtonText: "Aceptar",
        position: "top",
        timer:2500,
      });
    }
  });
