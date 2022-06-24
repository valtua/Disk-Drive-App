const { generateError, createPathIfNotExists } = require('../../helpers');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const modifyUserQuery = require('../../db/userQueries/modifyUserQuery');

// Función para modificar el usuario en la base de datos
const modifyUser = async (req, res, next) => {
    try {
        // Recogemos la id del usuario que vamos a modificar, y las modificaciones

        const { name, email, biography } = req.body;

        // Lanzamos un error en caso de que no se encuentre el usuario
        if (!req.idUser) {
            throw generateError('No se encuentra el usuario', 400);
        }

        // Variable donde almacenaremos el nombre con el que guardaremos la nueva imagen en el disco.
        let photoName;

        // Si la imagen existe la guardamos.
        if (req.files && req.files.photo) {
            // Creamos una ruta absoluta al directorio de descargas.
            const uploadsDir = path.join(
                __dirname,
                '..',
                '..',
                'uploads',
                'photos'
            );

            // Creamos el directorio si no existe.
            await createPathIfNotExists(uploadsDir);

            // Procesamos la imagen y la convertimos en un objeto de tipo "Sharp".
            const sharpPhoto = sharp(req.files.photo.data);

            // Redimensionamos la imagen para evitar que sean demasiado grandes, le asignamos 500px de ancho.
            sharpPhoto.resize(500);

            // Generamos un nombre único para la imagen.
            photoName = `${nanoid(24)}.jpg`;

            // Generamos la ruta absoluta a la imagen.
            const photoPath = path.join(uploadsDir, photoName);

            // Guardamos la imagen en el directorio de descargas.
            await sharpPhoto.toFile(photoPath);
        }

        // Modificamos al usuario en la base de datos
        await modifyUserQuery(name, email, biography, photoName, req.idUser);

        res.send({
            status: 'ok',
            message: 'Usuario modificado correctamente',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = modifyUser;
