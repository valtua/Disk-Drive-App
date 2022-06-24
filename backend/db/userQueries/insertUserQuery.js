const { generateError } = require('../../helpers');
const getConnection = require('../getConnection');
const bcrypt = require('bcrypt');

// Función con query para insertar un usuario en la DB
const insertUserQuery = async (name, email, password, biography, photo) => {
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
        if (users.length > 0) {
            throw generateError(
                'Ya existe un usuario asociado a ese email',
                409
            );
        }

        // Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Realizamos la query
        const [newUser] = await connection.query(
            `INSERT INTO users (name, email, password, biography, photo) VALUES(?, ?, ?, ?, ?)`, [name, email, hashedPassword, biography, photo]
        );

        // Retornamos el id del nuevo usuario
        return newUser.insertId;
    } finally {
        // Liberamos la conexion
        if (connection) connection.release();
    }
};

module.exports = insertUserQuery;
