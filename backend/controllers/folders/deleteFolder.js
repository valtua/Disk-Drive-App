const { generateError } = require('../../helpers');
const fs = require('fs/promises');
const path = require('path');
const selectUserOneFolderQuery = require('../../db/foldersQueries/selectUserOneFolderQuery');
const deleteUserFoldersQuery = require('../../db/foldersQueries/deleteUserFoldersQuery');

// Función para eliminar la carpeta y sus archivos
const deleteFolder = async (req, res, next) => {
    try {

        // Recogemos el id de la carpeta
        const { folderId }= req.params;

        // Lanzamos un error en caso de que no se encuentre la carpeta
        if (!folderId) {
            throw generateError('No se encuentra la carpeta', 400);
        }

        // Localizamos en la base de datos la carpeta que queremos eliminar
        const [folder] = await selectUserOneFolderQuery(req.idUser, folderId);
        
        // Variable que contiene la ruta de la carpeta
        const deleteDir = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            `${req.idUser}`,
            `${folder.name}`
        );

        // Eliminamos la carpeta y sus archivos
        await fs.rmdir(deleteDir, {recursive: true});

        // Eliminamos la carpeta en la base de datos
        await deleteUserFoldersQuery(req.idUser, folder.id)

        res.send({
            status: 'ok',
            message: 'Archivos eliminados correctamente',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = deleteFolder;
