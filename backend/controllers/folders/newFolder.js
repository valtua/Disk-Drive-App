const { generateError, createPathIfNotExists } = require('../../helpers');
const path = require('path');
const insertUserFoldersQuery = require('../../db/foldersQueries/insertUserFoldersQuery');

// Función para crear una nueva carpeta
const newFolder = async (req, res, next) => {
    try {

        // Recogemos la carpeta en el body
        const { folder } = req.body;

        // Lanzamos un error en caso de que no encuentre la carpeta
        if (!folder) {
            throw generateError(
                'No se encuentra un nombre para la carpeta',
                400
            );
        }

        // Variable que contiene la ruta de la carpeta
        const newDir = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            `${req.idUser}`,
            `${folder}`
        );
        // Creamos la carpeta si no existe.
        await createPathIfNotExists(newDir);

        // Insertamos la carpeta en la base de datos
        await insertUserFoldersQuery(req.idUser, folder);

        res.send({
            status: 'ok',
            message: 'Carpeta creada correctamente',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newFolder;
