const getConnection = require('../getConnection');

// Funcion con query para eliminar una carpeta
const deleteFoldersQuery = async (idUser, idDir) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query para borrar archivos asociados a la carpeta
        await connection.query(
            `DELETE FROM files WHERE idDir = ? AND idUser = ?`,
            [idDir, idUser]
        );
        // Realizamos la query para borrar la carpeta
        await connection.query(
            `DELETE FROM folders WHERE id = ? AND idUser = ?`,
            [idDir, idUser]
        );
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = deleteFoldersQuery;
