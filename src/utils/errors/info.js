const generateUserErrorInfo = (user) => {
    return `Hay una de las propiedades del usuario incompleta o no valida.
    Listado de propiedades requeridos: 
    * first_name: necesita ser un string, pero se recibió ${user.first_name}
    * last_name: necesita ser un string, pero se recibió ${user.last_name}
    * email: necesita ser un string, pero se recibió ${user.email}`;
}

const generateProductsErrorInfo = (product) => {
    return `Hay una de las propiedades del producto incompleta o no válida.
    Listado de propiedades requeridas: 
    * title: necesita ser un string, pero se recibió ${product.title}
    * description: necesita ser un string, pero se recibió ${product.description}
    * code: necesita ser un string, pero se recibió ${product.code}
    * price: necesita ser un número, pero se recibió ${product.price}
    * stock: necesita ser un número, pero se recibió ${product.stock}
    * category: necesita ser un string, pero se recibió ${product.category}`;
}

module.exports = { generateUserErrorInfo, generateProductsErrorInfo };

