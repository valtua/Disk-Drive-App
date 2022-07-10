const { generateError } = require('../../helpers');
const getConnection = require('../getConnection');

// Función con query para modificar un usuario
const modifyUserQuery = async (name, email, biography, photo, id) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query
        const [users] = await connection.query(
            `SELECT id FROM users WHERE email = ?`,
            [email]
        );

        // Lanzamos un error cuando la longitud de 'users' es mayor que 0
        if (users.length > 0 && users[0].id != id) {
            throw generateError(
                'Ya existe un usuario asociado a ese email',
                409
            );
        }

        // Realizamos la query, modificar usuario
        const user = await connection.query(
            `UPDATE users SET 
            name = COALESCE(?, name), 
            email = COALESCE(?, email), 
            biography = COALESCE(?, biography), 
            photo = COALESCE(?, photo) WHERE id = ?; `,
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
