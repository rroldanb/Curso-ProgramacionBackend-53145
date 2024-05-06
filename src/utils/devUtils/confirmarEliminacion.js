const fs = require("fs");
const readline = require("readline");

function confirmarEliminacion(archivo) {
  let existeArchivo = false;
  return new Promise((resolve, reject) => {
    fs.access(archivo, fs.constants.F_OK, (err) => {
      if (err) {
        existeArchivo = false;
        resolve(false);
      } else {
        console.log(
            "***************** ELIMINAR ARCHIVOS DE PRUEBA *********************"
          );
          console.log(
            "***************** ELIMINAR ARCHIVOS DE PRUEBA *********************"
          );
          console.log(
            "***************** ELIMINAR ARCHIVOS DE PRUEBA *********************"
          );
        existeArchivo = true;

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
          rl.question(
            `¿Deseas eliminar el archivo ${archivo}? (s/n): `,
            (respuesta) => {
              rl.close();
              if (respuesta.toLowerCase() === "s") {
                resolve(true);
              } else {
        if (existeArchivo) {
            console.log("Eliminación cancelada por el usuario.");
        }
                resolve(false);
              }
            }
          );
        
      }
    });
  });
}

module.exports = confirmarEliminacion;
