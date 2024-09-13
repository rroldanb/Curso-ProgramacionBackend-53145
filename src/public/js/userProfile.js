function handleImageUpload(inputId, imgId, fileNameId, deleteBtnId, default_text, default_img, document_type) {
  const uploadButton = document.getElementById(inputId);
  const imageElement = document.getElementById(imgId);
  const fileNameElement = document.getElementById(fileNameId);
  const deleteButton = document.getElementById(deleteBtnId);

  if (!uploadButton || !imageElement || !deleteButton) return;

  uploadButton.onchange = () => {
    const file = uploadButton.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imageElement.src = reader.result;
        fileNameElement.textContent = file.name;
        fileNameElement.style.display = "none";
        deleteButton.style.display = "inline";

      };
      reader.readAsDataURL(file);
    }
  };

  deleteButton.onclick = () => {
    imageElement.attributes.removeNamedItem("src")
const keepAttributes = ['id'];
const attributes = Array.from(imageElement.attributes);
attributes.forEach(attr => {
    if (!keepAttributes.includes(attr.name)) {
        imageElement.removeAttribute(attr.name);
    }
});
    // imageElement.src = default_img;
    fileNameElement.textContent = default_text;
    uploadButton.value = "";
    deleteButton.style.display = "none";
    fileNameElement.style.display = "inline";
    deleteDocument(document_type)
  };
}

const dni_default_text ="Pulsa el botón para subir tu imágen de tu documento de identidad";
const domicilio_default_text ="Pulsa el botón para subir tu imágen de comprobante de domicilio";
const cuenta_default_text ="Pulsa el botón para subir tu imágen de un estado de cuenta";
const profile_default_img = "/noprofil.jpg";

document.addEventListener("DOMContentLoaded", () => {
  handleImageUpload("profile-upload", "profile-preview", "profile-file-name", "profile-delete", "", profile_default_img ,'profile' );
  handleImageUpload("dni-upload", "dni-image", "dni-file-name", "dni-delete", dni_default_text, ""  , 'dni');
  handleImageUpload( "domicilio-upload", "domicilio-image", "domicilio-file-name", "domicilio-delete", domicilio_default_text, "", 'domicilio');
  handleImageUpload( "cuenta-upload", "cuenta-image", "cuenta-file-name", "cuenta-delete", cuenta_default_text, "",'cuenta' );
});

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.clickable-image');
    const modalImage = document.getElementById('modalImage');

    images.forEach(image => {
        image.addEventListener('click', function() {
            const src = image.getAttribute('src');
            modalImage.setAttribute('src', src);
        });
    });
});

function goBackAndReload() {

    window.location.reload(history.back());
    window.history.back();

}


const documentsToDelete = [];

function deleteDocument(documentName) {
    documentsToDelete.push(documentName);
    console.log(`Documento marcado para eliminar: ${documentName}`);
}


document.getElementById("profile-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData();

    // Append user information
    formData.append("first_name", form.first_name.value);
    formData.append("last_name", form.last_name.value);
    formData.append("birthDate", form.birthDate.value);
    // formData.append("age", form.age.value);
    formData.append("email", form.email.value);
    const userId = document.getElementById("userId");
    const uid = userId.value;

    // Append files
    const profilePic = document.getElementById("profile-upload").files[0];
    const dniPic = document.getElementById("dni-upload").files[0];
    const domicilioPic = document.getElementById("domicilio-upload").files[0];
    const cuentaPic = document.getElementById("cuenta-upload").files[0];

    if (profilePic) {
        const profileExtension = profilePic.name.split('.').pop();
        formData.append("documents", profilePic, `profile.${profileExtension}`);
    }
    if (dniPic) {
        const dniExtension = dniPic.name.split('.').pop();
        formData.append("documents", dniPic, `dni.${dniExtension}`);
    }
    if (domicilioPic) {
        const domicilioExtension = domicilioPic.name.split('.').pop();
        formData.append("documents", domicilioPic, `domicilio.${domicilioExtension}`);
    }
    if (cuentaPic) {
        const cuentaExtension = cuentaPic.name.split('.').pop();
        formData.append("documents", cuentaPic, `cuenta.${cuentaExtension}`);
    }

    // Append documents to delete
    if (documentsToDelete.length > 0) {
        formData.append("documentsToDelete", JSON.stringify(documentsToDelete));
    }

    try {
        const response = await fetch(`/api/users/${uid}/documents`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                text: `Perfil actualizado correctamente`,
                position: "top",
                icon: "success",
                title: "Éxito",
                timer: 2000,
              });
        } else {
            console.error("Error al subir los documentos:", result.message);
            Swal.fire({
                text: `Hubo un error actualizando los datos de tu perfil: ${result.message}`,
                title: "Error",
                position: "top",
                icon: "error",
                timer: 2500,
              });
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        Swal.fire({
            text: `Hubo un error actualizando los datos de tu perfil`,
            title: "Error",
            position: "top",
            icon: "error",
            timer: 2500,
          });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const promoterBtn = document.getElementById("promoter-btn");
    const deleteUserBtn = document.getElementById("deleteUser-btn");
    if (promoterBtn) {
        promoterBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const uid = promoterBtn.getAttribute('data-uid');
            try {
                const response = await fetch(`/api/users/premium/${uid}`, { method: 'POST' });
                const result = await response.json();

                if  (result.status === "success") {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        position: "top",
                        text: result.message,
                        timer: 3000, 
                    })
                    .then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        position: "top",
                        text: result.message,
                        timer: 3000, 
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    position: "top",
                    text: 'Hubo un problema al intentar cambiar el rol del usuario.',
                    timer: 3000, 
                });
            }
        });
    }
    if (deleteUserBtn){
        deleteUserBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const uid = deleteUserBtn.getAttribute('data-uid');
            try {
                const response = await fetch(`/api/users/${uid}`, { method: 'DELETE' });
                const result = await response.json();

                if (result.status === "success") {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: result.message,
                        position: "top",
                        timer: 3000, 
                    }).then(() => {
                        window.location.href = `${window.location.origin}/users`;
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.message,
                        position: "top",
                        timer: 3000, 
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    position: "top",
                    text: 'Hubo un problema al intentar eliminar el usuario.',
                    timer: 3000, 
                });
            }
        });
    }
});

const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    let monthDiff = today.getMonth() - birth.getMonth();
    let dayDiff = today.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
        monthDiff += 12; 
    }
    if (dayDiff < 0) {
        monthDiff--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        dayDiff += lastMonth.getDate(); 
    }

    return `${age} años ${monthDiff} meses ${dayDiff-1} días`;
};

document.getElementById("birthDate").addEventListener("change", function() {
    const birthDateValue = this.value;
    
    if (birthDateValue) {
        const age = calculateAge(birthDateValue);
        document.getElementById("age").value = age;
    } else {
        document.getElementById("age").value = "";
    }
});
