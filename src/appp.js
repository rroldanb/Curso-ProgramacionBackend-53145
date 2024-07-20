const cluster = require ('node:cluster')
const {cpus} = require ('node:os')

console.log(cluster.isPrimary)
const nomProc = cpus().length
console.log('num proc', nomProc)


if (cluster.isPrimary) {
    console.log('proceso primario, creando un hijo')
    for (let i = 0; i < nomProc; ){
        cluster.fork()
    }
    cluster.on('message', worker=>{
     console.log(`worker ${worker.process.pid} recibió un mensage`)

    }) 
}else {
    console.log(`al ser un proceso forkeado, no cuento como primario, por lo tanto isprimary is false, soy un worker`)
    console.log(`soy un proceso hijo con el pid: ${process.pid}`)
}