const { generateError } = require('../../helpers');
const getConnection = require('../getConnection');

// Función con query para modificar un usuario
const modifyUserQuery = async (name, email, biography, photo, id) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query, modificar usuario
        const user = await connection.query(
            `UPDATE users SET name = ?, email = ?, biography = ?, photo = ? WHERE id = ?; `,
            [name, email, biography, photo, id]
        );

        // Retornamos el usuario
        return user;
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = modifyUserQuery;
