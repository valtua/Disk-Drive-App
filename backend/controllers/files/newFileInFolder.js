const { generateError, createPathIfNotExists } = require('../../helpers');
const path = require('path');
const insertUserFilesQuery = require('../../db/filesQueries/insertUserFilesQuery');
const selectUserOneFolderQuery = require('../../db/foldersQueries/selectUserOneFolderQuery');

// Función para insertar el archivo de forma local (dentro de una carpeta) y en la base de datos
const newFileInFolder = async (req, res, next) => {
    try {
        
        // Recogemos el archivo
        const file = req.files.uploadedFile;

        // Recogemos el id del archivo
        const { folderId } = req.params;

        // Lanzamos un error en caso de que no se encuentre el archivo
        if (!file) {
            throw generateError('No se encuentra un archivo', 400);
        }

        // Localizamos en la base de datos la carpeta donde queremos crear el archivo
        const [folderData] = await selectUserOneFolderQuery(req.idUser, folderId);

        // Variable que contiene la ruta dónde se creará el archivo (raíz/usuario/carpeta)
        const uploadsDir = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            `${req.idUser}`,
            `${folderData.name}`
        );

        // Creamos el directorio si no existe.
        await createPathIfNotExists(uploadsDir);
        
        // Movemos el archivo a la ruta
        file.mv(`${uploadsDir}/${file.name}`);

        // Insertamos el archivo en la base de datos
        await insertUserFilesQuery(req.idUser, file.name, folderId);

        res.send({
            status: 'ok',
            message: 'Archivo subido correctamente',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newFileInFolder;
