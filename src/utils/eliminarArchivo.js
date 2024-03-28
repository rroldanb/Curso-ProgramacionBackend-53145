const fs = require("fs");

function eliminarArchivo(archivo) {
    fs.unlink(archivo, (err) => {
        if (err) {
            console.error(`Error al eliminar ${archivo}:`, err);
        } 
    });
}

module.exports = eliminarArchivo;
