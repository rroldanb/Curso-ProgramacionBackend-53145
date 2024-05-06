# Rubén Roldán - Desafío Complementario #1
Curso CoderHouse Programación Backend, Comisión 53145

## Descripción de la entrega

### Consigna
- Continuar sobre el proyecto que has trabajado para tu ecommerce y configurar los siguientes elementos:

### Aspectos a incluir

- Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto.
- Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.
- Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta “dao”. Dentro de dao, agregar también una carpeta “models” donde vivirán los esquemas de MongoDB. La estructura deberá ser igual a la vista en esta clase
- Contener todos los Managers (FileSystem y DB) en una carpeta llamada “Dao”
Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem
- NO ELIMINAR FileSystem de tu proyecto.
- Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase. Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). El formato es: {user:correoDelUsuario, message: mensaje del usuario}
- Corroborar la integridad del proyecto para que todo funcione como lo ha hecho hasta ahora.

## Instalación y ejecución
- Para descargar el código se recomienda clonar el repositorio desde una linea de comandos ejecutando: `git clone https://github.com/rroldanb/Curso-ProgramacionBakend-53145.git `
- Ingresar a la carpeta generada al clonar el repositorio mediante `cd Curso-ProgramacionBakend-53145`
- Instalar la dependencias mediante `npm i`
- Verificar que el puerto 8080 no esté en uso con el comando `lsof -i :8080`
- Ejecutar el código mediante el uso de alguno de los scripts:
    - `npm start` Este script inicia la aplicación ejecutando el archivo src/app.js con Node.js. Es útil para iniciar la aplicación en un entorno de producción.
    - `npm run dev` Este script utiliza Nodemon para iniciar la aplicación con la capacidad de reiniciarse automáticamente cada vez que detecta cambios en los archivos.
    - `npm run start:dev` Este script inicia la aplicación en un entorno de desarrollo, similar al script "dev", pero utilizando directamente Node.js con la opción --watch para observar cambios en el archivo src/app.js. Aunque proporciona funcionalidad similar a la anterior, algunos desarrolladores pueden preferir esta opción si no quieren depender de Nodemon.
- Para detener la ejecución de la aplicacion presinonar juntas las teclas: Ctrl + C


## Vistas disponibles
- Una vez iniciado el servidor se podrá usar el navegador para llegar a la página raiz del proyecto:
- En la url: http://localhost:8080/ en el cual se dispuso de un enlace para ingresar al Real Time Products
- http://localhost:8080/realtimeproducts despliega en tiempo real los prouctos almacenados y permite la edicion y eliminación de productos existentes asi como la posibilidad de agregar nuevos, reflejandose estos cambios tan proto se ejecutan a cualquier otro cliente conectado
- http://localhost:8080/chat/ donde se puede ingresar al chat en tiempo real.

## Acceso al servidor
- Desde el navegador se recibirá una respuesta en las siguientes url
## Métodos HTTP disponibles
- En el cliente de HTTP se recibirá una respuesta en los siguientes enpoints:

    - Método GET de productos:
        - http://localhost:8080/api/products sin query, eso devolverá todos los productos con que se inicializó el proyecto.
        - http://localhost:8080/api/products?limit=n , eso devolverà los primeros n productos. El número del límite n puede ser un entero entre el 1 y el 10
        - http://localhost:8080/api/products/:pid, eso devolverà sólo el producto con id=:pid (product id). El :pid es un identificador único, se dan algunos ejemplos mas abajo.
        - http://localhost:8080/api/products/663836fe95f9e8c1519dc0f0, al no existir el id del producto, devolverà un objeto con un error indicando que el producto no existe.

    - Método POST de productos:
        - http://localhost:8080/api/products incluyendo todos los campos obligatorio en el body del request creará un nuevo producto, se valida que el código del producto no exista.

    - Método PUT de productos:
        - http://localhost:8080/api/products/:pid permite modificar el producto con el :pid indicado con los nuevos valores indicados en el body del request, se valida que el código del producto no exista.

    - Método DELETE de productos:
        - http://localhost:8080/api/products/:pid eliminara el producto con el :pid indicado

    - Método GET del carrito:
        - http://localhost:8080/api/cart:cid devolverá los productos que pertenezcan al carrito con el parámetro cid proporcionados.

    - Método POST del carrito:
        - http://localhost:8080/api/cart iniicializará un nuevo carrito y devolverá el cid (cart id)
        - http://localhost:8080/api/cart/:cid/product/:pid agregará o incrementará la cantidad de productos con el :pid indicado en el :cid indicado


    - Algunos pid al momento de la entrega:
        - 663836fe95f9e8c1519dcef6
        - 663836fe95f9e8c1519dcef7
        - 663836fe95f9e8c1519dcef8
        - 663836fe95f9e8c1519dcef9
        - 663836fe95f9e8c1519dcefa
        - 663836fe95f9e8c1519dcefb
        - 663836fe95f9e8c1519dcefc
        - 663836fe95f9e8c1519dcefd
        - 663836fe95f9e8c1519dcefe
        - 6638377195f9e8c1519dcf00
    
    - Cart id disponible al momento de la entrega: 6636dcea0b25ff793d4e29da



- Para ejecutar las pruebas de los endpoints se incluye el archivo `thunder-collection_ecommerce.json` dentro de la carpeta `/src/utils` que puede ser importado al cliente HTTP "Thunder Client", que funciona como una extencion de VSCode




<div style="text-align: end;">
<span  style="font-size: 0.7em; "> RR 05/24 </span>
</div>