# Rubén Roldán - Desafio complementario #3 
Curso CoderHouse Programación Backend, Comisión 53145

## Descripción de la entrega

### Consigna
- Con base en el proyecto que venimos desarrollando, toca solidificar algunos procesos

### Aspectos a incluir:
- Realizar un sistema de recuperación de contraseña, la cual envíe por medio de un correo un botón que redireccione a una página para restablecer la contraseña (no recuperarla).
    - link del correo debe expirar después de 1 hora de enviado.
    - Si se trata de restablecer la contraseña con la misma contraseña del usuario, debe impedirlo e indicarle que no se puede colocar la misma contraseña
    - Si el link expiró, debe redirigir a una vista que le permita generar nuevamente el correo de restablecimiento, el cual contará con una nueva duración de 1 hora.
- Establecer un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos
- Modificar el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto
    - Si un producto se crea sin owner, se debe colocar por defecto “admin”.
    - El campo owner deberá guardar sólo el correo electrónico (o _id, lo dejamos a tu conveniencia) del usuario que lo haya creado (Sólo podrá recibir usuarios premium)
- Modificar los permisos de modificación y eliminación de productos para que:
    - Un usuario premium sólo pueda borrar los productos que le pertenecen.
    - El admin pueda borrar cualquier producto, aún si es de un owner.

- Además, modificar la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece
- Implementar una nueva ruta en el router de api/users, la cual será
/api/users/premium/:uid la cual permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.


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