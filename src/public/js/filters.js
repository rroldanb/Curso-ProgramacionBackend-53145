const categorySelect = document.getElementById('category');
const disponibilidadSelect = document.getElementById('disponibilidad');
const ordenSelect = document.getElementById('orden');
const productsPPageSelect = document.getElementById('productsPPage');




const applyFiltersBtn = document.getElementById('applyFiltersBtn');

// Función para obtener el valor de un parámetro de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Establecer los valores de los select cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    const categoryParam = getQueryParam('categoryParam');
    const availableOnly = getQueryParam('availableOnly');
    const orderBy = getQueryParam('orderBy');
    const limitParam = getQueryParam('limitParam');

    if (categoryParam) {
        categorySelect.value = categoryParam;
    }
    if (availableOnly) {
        disponibilidadSelect.value = availableOnly;
    }
    if (orderBy) {
        ordenSelect.value = orderBy;
    }
    if (limitParam) {
        productsPPageSelect.value = limitParam;
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const urlBase = window.urlBase;
});

applyFiltersBtn.addEventListener('click', function() {
    const category = (categorySelect.value === "todas") ? null : categorySelect.value;
    const disponibilidad = (disponibilidadSelect.value === "todas") ? null : disponibilidadSelect.value;
    const orden = (ordenSelect.value === "todas") ? null : ordenSelect.value;
    const productsPPage = productsPPageSelect.value;

    let url = urlBase+'?';
    url += 'numPage=1'; 
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

    window.location.href = url;
});
