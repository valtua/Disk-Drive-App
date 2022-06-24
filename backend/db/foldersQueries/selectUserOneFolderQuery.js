const { generateError } = require('../../helpers');
const getConnection = require('../getConnection');

// Función con query para seleccionar una carpeta
const selectUserOneFolderQuery = async (idUser, id) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query
        const [folder] = await connection.query(
            `SELECT id, name FROM folders WHERE idUser = ? AND id = ?`,
            [idUser, id]
        );

        // Lanzamos un error cuando la longitud de 'folder' es menor a 1
        if (folder.length < 1) {
            throw generateError('Carpeta no encontrada', 404);
        }

        // Retornamos la carpeta
        return folder;
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = selectUserOneFolderQuery;
