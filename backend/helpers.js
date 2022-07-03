const fs = require('fs/promises');
const path = require('path');

const generateError = (message, status) => {
    const error = new Error(message);
    error.statusCode = status;
    return error;
};

// Función que crea una ruta en caso de no existir
const createPathIfNotExists = async (path) => {
    try {
        await fs.mkdir(path);
    } catch (err) {
        // Si no es posible acceder al directorio en el "try" se
        // lanzaría un error.
        throw generateError('Ese nombre ya está en uso', 409);
    }
};

// Función que crea la carpeta Uploads si no existe
const createIfNotExists = async (path) => {
    try {
        // Creamos una ruta absoluta al directorio
        await fs.access(path);
    } catch {
        await fs.mkdir(path);
    }
};

function randomString(length) {
    return Math.round(
        Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
    )
        .toString(36)
        .slice(1);
}

module.exports = {
    generateError,
    createPathIfNotExists,
    createIfNotExists,
    randomString,
};
