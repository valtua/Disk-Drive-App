require('dotenv').config();
const mysql = require('mysql2/promise');
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

// Variable que almacenará un pool de conexiones
let pool;

const getConnection = async () => {
    try {

        // Si no hay conexiones creamos un grupo
        if (!pool) {
            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DB,
                timezone: 'Z',
            });
        }
        
        // Retornamos una conexion libre
        return await pool.getConnection();
    } catch (err) {
        console.error(err);
    }
};

module.exports = getConnection;
