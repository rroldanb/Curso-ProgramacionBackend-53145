const { testingSync } = require("./testingSync");
const { testingAsync } = require("./testingAsync");
const eliminarArchivo = require("./eliminarArchivo");
const confirmarEliminacion = require("./confirmarEliminacion");

(async () => {
  await testingSync();
  await testingAsync();

  console.log(
    "***************** ELIMINAR ARCHIVOS DE PRUEBA *********************"
  );
  console.log(
    "***************** ELIMINAR ARCHIVOS DE PRUEBA *********************"
  );
  console.log(
    "***************** ELIMINAR ARCHIVOS DE PRUEBA *********************"
  );
  try {
    const archivo = "productosSync.json";
    const confirmacion = await confirmarEliminacion(archivo);
    if (confirmacion) {
      await eliminarArchivo(archivo);
      console.log(`Archivo ${archivo} eliminado correctamente.`);
    } else {
      console.log("Eliminación cancelada por el usuario.");
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
    } else {
      console.log("Eliminación cancelada por el usuario.");
    }
  } catch (error) {
    console.error(error);
  }
})();
