const readline = require("readline");

function confirmarPregunta(pregunta) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rl.question(`${pregunta} (s/n): `, (respuesta) => {
            rl.close();
            if (respuesta.toLowerCase() === "s") {
                resolve(true); 
            } else {
                resolve(false); 
            }
        });
    });
}

module.exports = confirmarPregunta;
