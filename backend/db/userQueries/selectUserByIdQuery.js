const { generateError } = require('../../helpers');
const getConnection = require('../getConnection');

// Función con query para seleccionar un usuario por su id
const selectUserByIdQuery = async (idUser) => {
    let connection;

    try {
        // Conectamos a la base de datos
        connection = await getConnection();

        // Realizamos la query
        const [users] = await connection.query(
            `SELECT * FROM users WHERE id = ?`,
            [idUser]
        );

        // Lanzamos un error cuando la longitud de 'users' es menor a 1
        if (users.length < 1) {
            throw generateError('Usuario no encontrado', 404);
        }

        // Retornamos el usuario
        return users[0];
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = selectUserByIdQuery;
