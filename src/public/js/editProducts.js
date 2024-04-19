
  function toCapital(str) {
    return str.split(' ').map(word => {
        const lowerCaseWord = word.toLowerCase();
        return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
      }).join(' ');
}

 function toPesos(precio) {
  precio = parseFloat(precio) 
  if (typeof precio !== 'number') {
    throw new Error('El precio debe ser un número');
  }

  const formattedPrecio = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP' 
  }).format(precio);

  return formattedPrecio;
}