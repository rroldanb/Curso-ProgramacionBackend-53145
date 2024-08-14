# Rubén Roldán - Desafio complementario #4 Módulos de testing para proyecto final
Curso CoderHouse Programación Backend, Comisión 53145

## Descripción de la entrega

### Consigna
- Realizar módulos de testing para tu proyecto principal, utilizando los módulos de mocha + chai + supertest

### Aspectos a incluir:
- Se deben incluir por lo menos 3 tests desarrollados para
    - Router de products.
    - Router de carts.
    - Router de sessions.
- NO desarrollar únicamente tests de status, la idea es trabajar lo mejor desarrollado posible las validaciones de testing


## Instalación y ejecución desde la terminal
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
<span  style="font-size: 0.7em; "> RR 08/24 </span>
</div>