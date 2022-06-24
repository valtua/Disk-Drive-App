const { generateError, createPathIfNotExists } = require('../../helpers');
const path = require('path');
const insertUserFilesQuery = require('../../db/filesQueries/insertUserFilesQuery');

// Función para insertar el archivo de forma local (sin carpeta) y en la base de datos
const newFile = async (req, res, next) => {
    try {
        const file = req.files.uploadedFile;

        // Lanzamos un error en caso de que no se encuentre el archivo
        if (!file) {
            throw generateError('No se encuentra un archivo', 400);
        }

        // Variable que contiene la ruta dónde se creará el archivo (raíz/usuario)
        const uploadsDir = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            `${req.idUser}`
        );

        // Creamos el directorio si no existe.
        await createPathIfNotExists(uploadsDir);

        // Movemos el archivo a la ruta
        file.mv(`${uploadsDir}/${file.name}`);

        // Insertamos el archivo en la base de datos
        await insertUserFilesQuery(req.idUser, file.name)

        res.send({
            status: 'ok',
            message: 'Archivo subido correctamente',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newFile;
