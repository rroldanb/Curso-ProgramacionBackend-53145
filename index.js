const express = require('express');
const { ProductsManager } = require("./ProductManager");
const path = "./productos.json";
const app = express();
const productManager = new ProductsManager(path);

app.get('/', (_, res) => {
    res.json( 'Servidor activo y funcional' );
});

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        if (limit && (!Number.isInteger(limit) || limit <= 0)) {
            return res.status(400).json({ error: 'El parámetro "limit" debe ser un número entero positivo' });
        }
        let productos = await productManager.getProducts();
        if (limit !== undefined) {
            productos = productos.slice(0, limit);
        }
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const producto = await productManager.getProductById(parseInt(pid));
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
