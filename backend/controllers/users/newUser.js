const { generateError, createUploadsIfNotExists, createPathIfNotExists } = require('../../helpers');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const insertUserQuery = require('../../db/userQueries/insertUserQuery');

// Función para crear un nuevo usuario
const newUser = async (req, res, next) => {
    try {

        // Obtenemos los campos del body.
        const { name, email, password, biography } = req.body;

        // Si faltan campos lanzamos un error.
        if (!name || !email || !password) {
            throw generateError('Faltan campos', 400);
        }

        // Creamos la carpeta upload si no existe
        await createUploadsIfNotExists();

        // Variable donde almacenaremos el nombre con el que guardaremos la imagen en el disco.
        let photoName;

        // Si la imagen existe la guardamos.
        if (req.files && req.files.photo) {

            // Creamos una ruta absoluta al directorio de descargas.
            const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'photos');

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

        // Creamos un usuario en la base de datos y obtenemos el id.
        const idUser = await insertUserQuery(name, email, password, biography, photoName);

        // Variable que contiene la ruta de la carpeta del usuario
        const newUserSpace = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            `${idUser}`
        );

        // Creamos la carpeta si no existe.
        await createPathIfNotExists(newUserSpace);

        res.send({
            status: 'ok',
            message: `Usuario con id ${idUser} creado`,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = newUser;
