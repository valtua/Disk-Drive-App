const getConnection = require('./getConnection');

async function main() {
    // Variable que almacenará una conexión libre de la base de datos.
    let connection;

    try {
        // Obtenemos una conexión libre.
        connection = await getConnection();

        console.log('Borrando tablas existentes...');

        // Eliminamos las tablas en caso de que ya existan
        await connection.query('DROP TABLE IF EXISTS files');
        await connection.query('DROP TABLE IF EXISTS folders');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        // Creamos la tabla usuarios
        await connection.query(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(20) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                biography VARCHAR(255),
                photo VARCHAR(100),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP

            )
        `);

        // Creamos la tabla carpetas
        await connection.query(`
            CREATE TABLE folders (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                idUser INTEGER NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                name VARCHAR(50) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

            )
        `);

        // Creamos la tabla archivos
        await connection.query(`
            CREATE TABLE files (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                idUser INTEGER NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                idDir INTEGER,
                FOREIGN KEY (idDir) REFERENCES folders(id),
                name VARCHAR(50) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('¡Tablas creadas!');
    } catch (err) {
        console.error(err);
    } finally {
        // Si existe una conexión la liberamos.
        if (connection) connection.release();

        // Cerramos el proceso actual.
        process.exit();
    }
}

// Llamamos a la función principal.
main();
