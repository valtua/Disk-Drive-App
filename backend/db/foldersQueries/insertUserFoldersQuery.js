const getConnection = require('../getConnection');

// Función con query para insertar carpetas en la BD
const insertUserFoldersQuery = async (idUser, name) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query
        await connection.query(
            `
                INSERT INTO folders (idUser, name)
                VALUES (?, ?)
            `,
            [idUser, name]
        );
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = insertUserFoldersQuery;
