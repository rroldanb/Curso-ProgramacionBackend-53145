# Rubén Roldán - Desafío entregable 3
Curso CoderHouse Programación Backend, Comisión 53145

## Descripción de la entrega

### Consigna
Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

### Aspectos a incluir
- Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos.
- Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.
- El servidor debe contar con los siguientes endpoints:
    - ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
        - Si no se recibe query de límite, se devolverán todos los productos
        - Si se recibe un límite, sólo devolver el número de productos solicitados
    - ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos.

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


## Acceso al servidor
- Desde el navegador se recibirá una respuesta en las siguientes url

    - http://localhost:8080/products sin query, eso devolverà todos los 10 productos.
    - http://localhost:8080/products?limit=5 , eso devolverà sólo los primeros 5 de los 10 productos. El número del límite puede ser un entero entre el 1 y el 10
    - http://localhost:8080/products/2, eso devolverà sólo el producto con id=2. El número del id puede ser un entero entre el 1 y el 10
    - http://localhost:8080/products/34123123, al no existir el id del producto, devolverà un objeto con un error indicando que el producto no existe.
    
<div style="text-align: end;">
<span  style="font-size: 0.7em; "> RR 03/24 </span>
</div>