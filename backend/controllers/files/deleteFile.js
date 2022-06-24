const { generateError } = require('../../helpers');
const fs = require('fs/promises');
const path = require('path');
const selectOneFileQuery = require('../../db/filesQueries/selectOneFileQuery');
const deleteUserFilesQuery = require('../../db/filesQueries/deleteUserFilesQuery');
const selectUserOneFolderQuery = require('../../db/foldersQueries/selectUserOneFolderQuery');

// Función para eliminar un archivo, de forma local y en la base de datos
const deleteFile = async (req, res, next) => {
    try {

        // Recogemos el id del archivo
        const { fileId } = req.params;

        // Localizamos el archivo en la base de datos
        const [file] = await selectOneFileQuery(req.idUser, fileId);
        
        // Si tiene idDir, es necesario localizar la carpeta en la que está (raíz/usuario/carpeta/archivo)
        if(file.idDir != null){
            
            // Localizamos la carpeta en la base de datos
            const [folder] = await selectUserOneFolderQuery(req.idUser, file.idDir);

            // Lanzamos un error en caso de que no se encuentre la carpeta
            if (!folder) {
                throw generateError('No se encuentra la carpeta', 400);
            }
            
            // Variable que contiene la ruta del archivo, dentro de una carpeta
            const deleteFileInFolder = path.join(
                __dirname,
                '..',
                '..',
                'uploads',
                `${req.idUser}`,
                `${folder.name}`,
                `${file.name}`
            );
                
            // Eliminamos el archivo dentro de la carpeta
            await fs.unlink(deleteFileInFolder);
            
            // Eliminamos el archivo en la base de datos
            await deleteUserFilesQuery(req.idUser, fileId);
            
        // Si no tiene idDir, solo localizamos el archivo (raiz/usuario/archivo)
        }else{

            // Variable que contiene la ruta del archivo, que no está en una carpeta
            const deleteFileNoFolder = path.join(
                __dirname,
                '..',
                '..',
                'uploads',
                `${req.idUser}`,
                `${file.name}`
            );
            
            // Eliminamos el archivo, que no está en una carpeta
            await fs.unlink(deleteFileNoFolder);

            // Eliminamos el archivo en la base de datos
            await deleteUserFilesQuery(req.idUser, fileId);
        }

        res.send({
            status: 'ok',
            message: 'Archivos eliminados correctamente',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = deleteFile;
