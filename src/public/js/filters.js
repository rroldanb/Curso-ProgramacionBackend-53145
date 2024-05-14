// Importar Axios
// const axios = require ('axios');

// Obtener referencias a los elementos select
const categorySelect = document.getElementById('category');
const disponibilidadSelect = document.getElementById('disponibilidad');
const ordenSelect = document.getElementById('orden');
const productsPPageSelect = document.getElementById('productsPPage');

applyFiltersBtn.addEventListener('click', function() {
    // Obtener los valores seleccionados de los elementos select
    const category = (categorySelect.value === "todas") ? null : categorySelect.value;
    const disponibilidad = (disponibilidadSelect.value === "todas") ? null : disponibilidadSelect.value;
    const orden = (ordenSelect.value === "todas") ? null : ordenSelect.value;
    const productsPPage = productsPPageSelect.value;

    console.log('Categoría seleccionada:', category);
    console.log('Disponibilidad seleccionada:', disponibilidad);
    console.log('Orden seleccionada:', orden);
    console.log('Productos por página seleccionados:', productsPPage);

    // Construir la URL con los parámetros
    let url = '/?';
    url += 'numPage=1'; // Ejemplo, aquí podrías pasar el número de página deseado
    url += '&limitParam=' + productsPPage;
    if (category) {
        url += '&categoryParam=' + category;
    }
    if (disponibilidad) {
        url += '&availableOnly=' + disponibilidad;
    }
    if (orden) {
        url += '&orderBy=' + orden;
    }

    // Redirigir al usuario a la nueva página con los parámetros en la URL
    window.location.href = url;
});
