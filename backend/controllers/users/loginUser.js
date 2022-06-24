const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const selectUserByEmailQuery = require('../../db/userQueries/selectUserByEmailQuery');

// Función para loguear a un usuario
const loginUser = async (req, res, next) => {
    try {
        // Recogemos el email y la pass del usuario
        const { email, password } = req.body;

        // Lanzamos un error en caso de que falte alguno de los datos
        if (!email || !password) {
            throw generateError('Faltan campos', 400);
        }

        // Obtenemos al usuario con el email del body.
        const user = await selectUserByEmailQuery(email);

        // Comprobamos si las contraseñas coinciden.
        const validPassword = await bcrypt.compare(password, user.password);

        // Lanzamos un error en caso de que la contraseña no coincide
        if (!validPassword) {
            throw generateError('Contraseña incorrecta', 401);
        }

        // Información que queremos guardar en el token.
        const payload = {
            id: user.id,
        };

        // Firmamos el token.
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '30d',
        });

        res.send({
            status: 'ok',
            data: {
                token,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = loginUser;
