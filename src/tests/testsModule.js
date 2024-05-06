const { testingSync } = require("./testingSync");
const { testingAsync } = require("./testingAsync");
const eliminarArchivo = require("../utils/devUtils/eliminarArchivo");
const confirmarEliminacion = require("../utils/devUtils/confirmarEliminacion");
const confirmarPregunta = require("../utils/devUtils/confirmarPregunta");

const testsModule = async () => {
  try {
    const pregunta = "¿Deseas procesar el testingSync";
    const confirmacion = await confirmarPregunta(pregunta);
    if (confirmacion) {
      await testingSync();
    } else {
      console.log("Ejecución de testingSync cancelada por el usuario.");
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const pregunta = "¿Deseas procesar el testingAsync";
    const confirmacion = await confirmarPregunta(pregunta);
    if (confirmacion) {
      await testingAsync();
    } else {
      console.log("Ejecución de testingAsync cancelada por el usuario.");
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const archivo = "productosSync.json";
    const confirmacion = await confirmarEliminacion(archivo);
    if (confirmacion) {
      await eliminarArchivo(archivo);
      console.log(`Archivo ${archivo} eliminado correctamente.`);
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const archivo = "productosAsync.json";
    const confirmacion = await confirmarEliminacion(archivo);
    if (confirmacion) {
      eliminarArchivo(archivo);
      console.log(`Archivo ${archivo} eliminado correctamente.`);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = testsModule;
