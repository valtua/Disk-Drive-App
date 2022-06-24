const { generateError } = require('../../helpers');
const getConnection = require('../getConnection');

// Función con query para seleccionar todos los archivos de un usuario
const selectUserFilesQuery = async (idUser) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query
        const [files] = await connection.query(
            `SELECT id, name FROM files WHERE idUser = ?`,
            [idUser]
        );

        // Lanzamos un error cuando la longitud de 'file' es menor a 1
        if (files.length < 1) {
            throw generateError('Archivos no encontrados', 404);
        }

        // Retornamos el archivo
        return files;
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = selectUserFilesQuery;
