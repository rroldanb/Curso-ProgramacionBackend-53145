# Rubén Roldán - Segunda pre-entrega Proyecto final
Curso CoderHouse Programación Backend, Comisión 53145

## Descripción de la entrega

### Consigna
- Deberás entregar el proyecto que has venido armando, cambiando persistencia en base de datos, además de agregar algunos endpoints nuevos a tu ecommerce

### Objetivos generales
- Contarás con Mongo como sistema de persistencia principal
- Tendrás definidos todos los endpoints para poder trabajar con productos y carritos.

### Objetivos específicos
- Profesionalizar las consultas de productos con filtros, paginación y ordenamientos
- Profesionalizar la gestión de carrito para implementar los últimos conceptos vistos.

### Aspectos a incluir

Con base en nuestra implementación actual de productos, modificar el método GET / para que cumpla con los siguientes puntos:
- Deberá poder recibir por query params un limit (opcional), una page (opcional), un sort (opcional) y un query (opcional)
    - limit permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.
    - page permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1
    - query, el tipo de elemento que quiero buscar (es decir, qué filtro aplicar), en caso de no recibir query,realizar la búsqueda general
    - sort: asc/desc, para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento

- El método GET deberá devolver un objeto con el siguiente formato:
{
    status:success/error
    payload: Resultado de los productos solicitados totalPages: Total de páginas
    prevPage: Página anterior
    nextPage: Página siguiente
    page: Página actual
    hasPrevPage: Indicador para saber si la página previa existe
    hasNextPage: Indicador para saber si la página siguiente existe.
    prevLink: Link directo a la página previa (null si hasPrevPage=false)
    nextLink: Link directo a la página siguiente (null si hasNextPage=false)
}

- Se deberá poder buscar productos por categoría o por disponibilidad, y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio.

- Además, agregar al router de carts los siguientes endpoints:
    - DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
    - PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
    - PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
    - DELETE api/carts/:cid deberá eliminar todos los productos del carrito
    - Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.

- Crear una vista en el router de views ‘/products’ para visualizar todos los productos con su respectiva paginación. Cada producto mostrado puede resolverse de dos formas:
    - Llevar a una nueva vista con el producto seleccionado con su descripción completa, detalles de precio, categoría, etc. Además de un botón para agregar al carrito.
    - Contar con el botón de “agregar al carrito” directamente, sin necesidad de abrir una página adicional con los detalles del producto.

- Además, agregar una vista en ‘/carts/:cid (cartId) para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito.

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

    - http://localhost:8080
    - http://localhost:8080/products
    - http://localhost:8080/realtimeproducts
    - http://localhost:8080/chat 
    - http://localhost:8080/carts/664006dadff1d46a8cdb49c4 (vista del único carrito disponible)

## Métodos HTTP disponibles
- En el cliente de HTTP se recibirá una respuesta en los siguientes enpoints:

    - Métodos GET de productos:
        - http://localhost:8080/api/products sin query, eso devolverá todos los productos con que se inicializó el proyecto.
        - http://localhost:8080/api/products?limit=n , eso devolverà los primeros n productos. El número del límite n puede ser un entero entre el 1 y el 10
        - http://localhost:8080/api/products/:pid, eso devolverà sólo el producto con id=:pid (product id). El :pid es un identificador único, se dan algunos ejemplos mas abajo.
        - http://localhost:8080/api/products/663836fe95f9e8c1519dc0f0, al no existir el id del producto, devolverà un objeto con un error indicando que el producto no existe.

    - Parámetros disponibles para el método GET:
        - numPage: valor por defecto: 1, para poder mostrar los resultados de una página específica.
        - limit: valor por defecto: 10, para indicar cuantos productos se mostrarán por página.
        - category: valor por defecto: null, permite filtrar en base a alguna categoría.
        - availableOnly: valor por defecto: null, permite filtrar productos en base a su status, valores permitidos: true, false, null.
        - orderByPrice: valor por defecto: null, permite ordenar los productos en base a su precio, valores permitidos: asc, desc, null.


    - Método POST de productos:
        - http://localhost:8080/api/products incluyendo todos los campos obligatorio en el body del request creará un nuevo producto, se valida que el código del producto no exista.

    - Método PUT de productos:
        - http://localhost:8080/api/products/:pid permite modificar el producto con el :pid indicado con los nuevos valores indicados en el body del request, se valida que el código del producto no exista.

    - Método DELETE de productos:
        - http://localhost:8080/api/products/:pid eliminara el producto con el :pid indicado

    - Método GET del carrito:
        - http://localhost:8080/api/cart:cid devolverá los productos que pertenezcan al carrito con el parámetro cid proporcionados.

    - Métodos POST del carrito:
        - http://localhost:8080/api/cart iniicializará un nuevo carrito y devolverá el cid (cart id)
        - http://localhost:8080/api/cart/:cid/product/:pid agregará o incrementará la cantidad de productos con el :pid indicado en el :cid indicado

    - Métodos PUT del carrito
        - http://localhost:8080/api/carts/:cid actualiza el carrito con un arreglo de productos con el formato especificado arriba.
        - http://localhost:8080/api/carts/:cid/products/:pid actualiza SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

    - Métodos DELETE del carrito
        - http://localhost:8080/api/carts/:cid/products/:pid elimina del carrito el producto seleccionado. 
        - http://localhost:8080/api/carts/:cid elimina todos los productos del carrito

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
    
- Cart id disponible al momento de la entrega: 664006dadff1d46a8cdb49c4



- Para ejecutar las pruebas de los endpoints se incluye el archivo `thunder-collection_ecommerce.json` dentro de la carpeta `/src/utils` que puede ser importado al cliente HTTP "Thunder Client", que funciona como una extencion de VSCode




<div style="text-align: end;">
<span  style="font-size: 0.7em; "> RR 05/24 </span>
</div>