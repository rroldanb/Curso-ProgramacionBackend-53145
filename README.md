# Rubén Roldán - Desafio entregable #9 Implementación de logger
Curso CoderHouse Programación Backend, Comisión 53145

## Descripción de la entrega

### Consigna
- Basado en nuestro proyecto principal, implementar un logger

### Aspectos a incluir:
- Primero, definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor):
`debug, http, info, warning, error, fatal`
- Después implementar un logger para desarrollo y un logger para producción, el logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola
- Sin embargo, el logger del entorno productivo debería loggear sólo a partir de nivel info.
- Además, el logger deberá enviar en un transporte de archivos a partir del nivel de error en un nombre “errors.log”
- Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston.
- Crear un endpoint /loggerTest que permita probar todos los logs



## Instalación y ejecución
- Para descargar el código se recomienda clonar el repositorio desde una linea de comandos ejecutando: `git clone https://github.com/rroldanb/Curso-ProgramacionBakend-53145.git `
- Ingresar a la carpeta generada al clonar el repositorio mediante `cd Curso-ProgramacionBakend-53145`
- Instalar la dependencias mediante `npm i`
- Verificar que el puerto 8080 no esté en uso con el comando `lsof -i :8080`
- Ejecutar el código mediante el uso de alguno de los scripts:
    - `npm start` Este script inicia la aplicación ejecutando el archivo src/app.js con Node.js. Es útil para iniciar la aplicación en un entorno de producción, en el puero 3000.
    - `npm run dev` Este script utiliza Nodemon para iniciar la aplicación en el puerto 8080, con la capacidad de reiniciarse automáticamente cada vez que detecta cambios en los archivos.
    - `npm run start:dev` Este script inicia la aplicación en el puerto 8080, en un entorno de desarrollo, similar al script "dev", pero utilizando directamente Node.js con la opción --watch para observar cambios en el archivo src/app.js. Aunque proporciona funcionalidad similar a la anterior, algunos desarrolladores pueden preferir esta opción si no quieren depender de Nodemon.
- Para detener la ejecución de la aplicacion presinonar juntas las teclas: Ctrl + C




<div style="text-align: end;">
<span  style="font-size: 0.7em; "> RR 07/24 </span>
</div>