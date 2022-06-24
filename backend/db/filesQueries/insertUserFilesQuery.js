const getConnection = require('../getConnection');

// Función con query para insertar un archivo
const insertUserFilesQuery = async (idUser, name, idDir) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query
        await connection.query(
            `
                INSERT INTO files (idUser, name, idDir)
                VALUES (?, ?, ?)
            `,
            [idUser, name, idDir]
        );
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = insertUserFilesQuery;
