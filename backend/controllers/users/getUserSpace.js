const { generateError } = require('../../helpers');
const selectFilesInFolderQuery = require('../../db/filesQueries/selectFilesInFolderQuery');
const selectUserFilesQuery = require('../../db/filesQueries/selectUserFilesQuery');
const selectUserFoldersQuery = require('../../db/foldersQueries/selectUserFoldersQuery');

// Función para mostrar el disco duro del usuario (carpetas, archivos)
const getUserSpace = async (req, res, next) => {
    try {

        // Lanzamos un error en caso de que el usuario no tenga permisos (esté registrado en la base de datos)
        if (!req.idUser) {
            throw generateError(
                'No tienes permisos para acceder a este espacio',
                401
            );
        }

        // Localizamos las carpetas del usuario
        const folders = await selectUserFoldersQuery(req.idUser);

        // Array que almacenará los archivos que estén localizados dentro carpetas
        let filesInFoldersId = [];

        // Localizamos cada archivo dentro de una carpeta
        for (const folder of folders) {
            folder.files = await selectFilesInFolderQuery(
                req.idUser,
                folder.id
            );

            // Pusheamos en el array todas las id de los archivos localizados en el bucle anterior
            for (const file of folder.files) {
                filesInFoldersId.push(file.id);
            }
        }

        // Localizamos todos los archivos que no pertenecen a una carpeta
        const allFiles = await selectUserFilesQuery(req.idUser);

        // Array que contendrá los archivos que no pertenezcan a una carpeta
        const aloneFiles = [];

        // Función pushea en el array los archivos que no pertenezcan a una carpeta
        const aloneFileDetector = () => {
            for (let i = 0; i < allFiles.length; i++) {
                if (filesInFoldersId.includes(allFiles[i].id)) continue;
                aloneFiles.push(allFiles[i]);
            }
            return;
        };

        // Llamamos a la función
        aloneFileDetector();
        
        // Variable que contiene los archivos que no pertenecen a una carpeta
        const files = aloneFiles;

        res.send({
            status: 'ok',
            data: {
                space: {
                    folders,
                    files,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getUserSpace;
