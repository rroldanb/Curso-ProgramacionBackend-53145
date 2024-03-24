const readline = require("readline");

function confirmarEliminacion(archivo) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rl.question(`¿Estás seguro que deseas eliminar ${archivo}? (s/n): `, (respuesta) => {
            rl.close();
            if (respuesta.toLowerCase() === "s") {
                resolve(true); 
            } else {
                resolve(false); 
            }
        });
    });
}

module.exports = confirmarEliminacion;
