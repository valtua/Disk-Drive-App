//Exports de las diferentes funciones para los archivos
const deleteFile = require('./deleteFile');
const downloadFile = require('./downloadFile');
const newFile = require('./newFile');
const newFileInFolder = require('./newFileInFolder');

module.exports = {
    deleteFile,
    downloadFile,
    newFile,
    newFileInFolder
}