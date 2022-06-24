const { generateError } = require('../../helpers');
const fs = require('fs/promises');
const path = require('path');
const selectOneFileQuery = require('../../db/filesQueries/selectOneFileQuery');
const selectUserOneFolderQuery = require('../../db/foldersQueries/selectUserOneFolderQuery');

// Función para descargar un archivo
const downloadFile = async (req, res, next) => {
    try {
        
        // Recogemos la id del archivo
        const { fileId } = req.params;

        // Lanzamos un error en caso de que no se encuentre el archivo
        if (!fileId) {
            throw generateError('No se encuentra un archivo', 400);
        }

        // Localizamos el archivo en la base de datos
        const [file] = await selectOneFileQuery(req.idUser, fileId);

        // Variable que utilizamos para determinar la ruta del archivos
        let filePath;

         // Si tiene idDir, es necesario localizar la carpeta en la que está (raíz/usuario/carpeta/archivo)
         if(file.idDir != null){
            
            // Localizamos la carpeta en la base de datos
            const [folder] = await selectUserOneFolderQuery(req.idUser, file.idDir);

            // Lanzamos un error en caso de que no se encuentre la carpeta
            if (!folder) {
                throw generateError('No se encuentra la carpeta', 400);
            }
            
            // Variable que contiene la ruta del archivo, dentro de una carpeta
            filePath = path.join(
                __dirname,
                '..',
                '..',
                'uploads',
                `${req.idUser}`,
                `${folder.name}`,
                `${file.name}`
            );
                
            
            
        // Si no tiene idDir, solo localizamos el archivo (raiz/usuario/archivo)
        }else{

            // Variable que contiene la ruta del archivo, que no está en una carpeta
            filePath = path.join(
                __dirname,
                '..',
                '..',
                'uploads',
                `${req.idUser}`,
                `${file.name}`
            );
        }

        // Descargamos el archivo
        res.download(filePath);    
        
    } catch (err) {
        next(err);
    }
};

module.exports = downloadFile;
