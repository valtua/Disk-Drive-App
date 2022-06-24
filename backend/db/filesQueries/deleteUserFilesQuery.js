const getConnection = require('../getConnection');

// Función con query para eliminar un archivo
const deleteFilesQuery = async (idUser, id) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query
        await connection.query(`DELETE FROM files WHERE idUser = ? AND id = ?`, [idUser,id]);

    }
     finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = deleteFilesQuery;
