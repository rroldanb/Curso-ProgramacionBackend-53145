const sharp = require('sharp');
const fs = require('fs').promises;

// Función para generar una imagen cuadrada con texto
async function generateImage(text, color, outputPath) {
    const size = 200; // Tamaño de la imagen (200x200 píxeles)
    
    const image = sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: color // Color de fondo
        }
    });

    // Agregar texto centrado en la imagen
    await image
        .png() // Formato de imagen PNG
        .composite([{
            input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="15" fill="white">${text}</text></svg>`),
            left: 0,
            top: 0
        }])
        .toFile(outputPath); // Guardar la imagen en el archivo de salida
}

// Función para generar imágenes para cada producto
async function generateProductImages(productIndex) {
    const colors = ['#ff0000', '#1d5d18', '#0000ff']; // Colores para las imágenes
    const productImagesDir = 'product_images';
    await fs.mkdir(productImagesDir, { recursive: true });

    // Generar 3 imágenes para el producto
    for (let i = 0; i < 3; i++) {
        const text = `Imagen ${i + 1} del producto ${productIndex}`;
        const color = colors[i % colors.length];
        const imageName = `producto-prueba_${String(productIndex).padStart(2, '0')}_imagen_${i + 1}.jpg`;
        const outputPath = `${productImagesDir}/${imageName}`;
        await generateImage(text, color, outputPath);
        console.log(`Imagen ${i + 1} del producto ${productIndex} creada.`);
    }
}

// Generar imágenes para cada uno de los 10 productos
async function generateImagesForProducts() {
    for (let i = 1; i <= 10; i++) {
        await generateProductImages(i);
    }
}

// Llamar a la función para generar imágenes para cada producto
generateImagesForProducts()
    .then(() => console.log('¡Imágenes generadas exitosamente!'))
    .catch(err => console.error('Error al generar imágenes:', err));
