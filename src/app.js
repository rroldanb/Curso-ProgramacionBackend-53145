const express = require('express');
const { router: productsRouter } = require ('./routes/products.router.js')
const { router: cartsRouter } = require ('./routes/carts.router.js')
const { router: viewsRouter } = require ('./routes/views.router.js')
const handlebars = require ('express-handlebars')
const {Server} = require ('socket.io')

const app = express();
const httpServer = app.listen(8080, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})


const socketServer = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')


app.use('/', viewsRouter)


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

// socket.on('message', data=>{
//     console.log(data)
// })


// socket.emit('socket_individual', 'mensaje para el cliente de este socket')
// socket.broadcast.emit('para_todos_menos_uno', 'mensaje para todos menos el cliente de este socket')

// socketServer.emit('evento_para_todos', 'mensaje para todos')
const messages = []
socketServer.on('connection', socket=>{
    // console.log('cliente conectado', socket.id)
    socketServer.emit('load_server_messages', messages)

    socket.on('client_message', data =>{
        const message = {id: socket.id, messge: data}
        messages.push(message)
        socketServer.emit('server_message', message)
    })

})
