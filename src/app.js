const express = require('express');
const app = express();
const { router: productsRouter } = require ('./routes/products.router.js')
const { router: cartsRouter } = require ('./routes/carts.router.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (_, res) => {
    res.json( 'Servidor activo y funcional' );
});
app.get('/api', (_, res) => {
    res.json( 'API activo y funcional' );
});

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


app.use((req, res, next) => {
    res.status(404).send(`La ruta ${req.url} no está definida para este método`);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Error 500 en el server');
});

app.listen(8080, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})
