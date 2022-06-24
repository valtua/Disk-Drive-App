const getConnection = require('../getConnection');

// Función con query para seleccionar carpetas de un usuario
const selectUserFoldersQuery = async (idUser) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query
        const [folders] = await connection.query(
            `SELECT id, name FROM folders WHERE idUser = ?`,
            [idUser]
        );

        // Retornamos las carpetas
        return folders;
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = selectUserFoldersQuery;
