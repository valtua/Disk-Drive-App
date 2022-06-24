// Tecnologia para hacer disponibles las variables de entorno
require('dotenv').config();

// ---------------------- IMPORTS ----------------------

// Requerimos las tecnologías necesarias
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

// Requerimos la autentificación del usuario
const authUser = require('./middleware/authUser');

// Almacenamos en esta variable los datos que contiene el archivo .env (base de datos)
const { PORT } = process.env;

// ---------------------- CONTROLLERS ----------------------

// Requerimos los controladores para los archivos, carpetas y usuarios
const {
    deleteFile,
    downloadFile,
    newFile,
    newFileInFolder,
} = require('./controllers/files/filesExports');
const {
    deleteFolder,
    downloadFolder,
    newFolder,
} = require('./controllers/folders/foldersExports');
const {
    newUser,
    loginUser,
    modifyUser,
    getUserSpace,
} = require('./controllers/users/usersExports');

// Declaramos una variable que contiene la tecnología express, para el manejo de endpoints
const app = express();

// ---------------------- MIDDLEWARE ----------------------
app.use(morgan(`dev`));
app.use(express.json());
app.use(fileUpload());
app.use(cors());

// ---------------------- ENDPOINTS ----------------------

// Registrar un nuevo usuario
app.post('/register', newUser);

// Login
app.post('/login', loginUser);

// Modificar un usuario
app.post('/user', authUser, modifyUser);

// Ver archivos y carpetas
app.get('/disk', authUser, getUserSpace);

// Subir un nuevo archivo
app.post('/upload', authUser, newFile);

// Subir un archivo dentro de una carpeta
app.post('/upload/:folderId', authUser, newFileInFolder);

// Descargar un archivo
app.get('/download/file/:fileId', authUser, downloadFile);

// Borrar un archivo
app.delete('/delete/file/:fileId', authUser, deleteFile);

// Crear una nueva carpeta
app.post('/folder', authUser, newFolder);

// Descargar una carpeta
app.get('/download/folder/:folderId', authUser, downloadFolder);

// Borrar una carpeta
app.delete('/delete/folder/:folderId', authUser, deleteFolder);

// --------------------------------------------------------

// MIDDLEWARE ERROR

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).send({
        status: 'error',
        message: err.message,
    });
});

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
