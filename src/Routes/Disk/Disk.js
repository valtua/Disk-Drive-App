import { IconButton, Tooltip } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useToken } from '../../TokenContext';
import { Navigate } from 'react-router-dom';

import './Disk.css';

import { useEffect, useState, useRef } from 'react';

import AlertDialog from '../../Components/AlertDialog/AlertDialog';
import ModalAddFolder from '../../Components/Modals/ModalAddFolder';
import ModalAddFile from '../../Components/Modals/ModalAddFile';
import ModalViewFile from '../../Components/Modals/ModalViewFile';
import Directory from '../../Components/Directory/Directory';
import AddFileButton from '../../Components/AddFileButton/AddFileButton';
import ErrorMessage from '../../Components/PopUpMessages/ErrorMessage';
import SuccessMessage from '../../Components/PopUpMessages/SuccessMessage';

function Disk() {
    // Declaraciones de useToken y useState
    const [token] = useToken();
    const [disk, setDisk] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(false);

    // Declaración de un estado update para utilizar localmente useEffect
    const [update, setUpdate] = useState(false);

    // Declaración de useState que usaremos para manejar nombre/id de carpetas y archivos, además de la visualización de los Modales y el mensaje al eliminar carpetas/archivos
    const [selectedFolderId, setSelectedFolderId] = useState('');
    const [selectedFolderName, setSelectedFolderName] = useState('');
    const [selectedFileId, setSelectedFileId] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [modalAddFolder, setModalAddFolder] = useState(false);
    const [modalAddFile, setModalAddFile] = useState(false);
    const [modalViewFile, setModalViewFile] = useState(false);
    const [alertMessage, setAlertMessage] = useState(false);

    // Función que recoge la información de usuario, sus archivos y carpetas
    const getUserDiskInfo = async () => {
        try {
            // Fetch al disco del usuario utilizando token como medida de seguridad y autentificación
            const res = await fetch('http://localhost:4000/disk', {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            });

            // Almacenamos los datos json
            const body = await res.json();

            // Almacenamos los datos del disco para manejarlos en el resto de la aplicación
            const disk = body.data.space;

            // Lanzamos un error en caso de que no recibamos los datos
            if (body.status === 'error') {
                setError(body.message);
            }
            setDisk(disk);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    // Declaramos useRef para el manejo del Scroll de carpetas
    const ref = useRef(null);
    // Función que el comportamiento del scroll
    const scroll = (scrollOffset) => {
        ref.current.scrollLeft += scrollOffset;
    };

    // Utilización del hook useEffect que hará uso, cada vez que cambie el valor del estado 'update', de la función getUserDiskInfo
    useEffect(() => {
        getUserDiskInfo();
    }, [update]);

    if (!token) {
        return <Navigate to="/" />;
    } else {
        return (
            <div className="Disk">
                {/* Mensajes de confirmación al usuario para eliminar carpetas/archivos */}
                <AlertDialog
                    alert={{ alertMessage, setAlertMessage }}
                    setError={setError}
                    setMessage={setMessage}
                    setLoading={setLoading}
                    setOpen={setOpen}
                    update={{ update, setUpdate }}
                    selectedFolder={{ selectedFolderId, setSelectedFolderId }}
                    selectedFile={{ selectedFileId, setSelectedFileId }}
                    modalFile={{ setModalViewFile }}
                />

                {/* Modal para agregar carpeta (se abre con btnFolderAdd) */}
                <ModalAddFolder
                    setError={setError}
                    setMessage={setMessage}
                    loading={{ loading, setLoading }}
                    setOpen={setOpen}
                    update={{ update, setUpdate }}
                    addFolder={{ modalAddFolder, setModalAddFolder }}
                />

                {/* Modal para agregar archivo (se abre con btnFileAdd) */}
                <ModalAddFile
                    setError={setError}
                    setMessage={setMessage}
                    loading={{ loading, setLoading }}
                    setOpen={setOpen}
                    update={{ update, setUpdate }}
                    addFile={{ modalAddFile, setModalAddFile }}
                    selectedFolder={{ selectedFolderId, setSelectedFolderId }}
                    folderName={{ selectedFolderName, setSelectedFolderName }}
                />

                {/* Modal para visualizar el archivo (se abre pinchando el archivo (li) situado en fileGallery) */}
                <ModalViewFile
                    setOpenAlert={setAlertMessage}
                    setError={setError}
                    setMessage={setMessage}
                    loading={{ loading, setLoading }}
                    setOpen={setOpen}
                    update={{ update, setUpdate }}
                    viewFile={{ modalViewFile, setModalViewFile }}
                    selectedFile={{ selectedFileId, setSelectedFileId }}
                    fileName={{ selectedFileName, setSelectedFileName }}
                />

                <div className="folderSearch">
                    <IconButton
                        aria-label="arrowBack"
                        size="large"
                        className="btnBackScroll"
                        onClick={() => scroll(-150)}
                    >
                        <ArrowBackIos fontSize="inherit" />
                    </IconButton>

                    <div className="folderScroll" ref={ref}>
                        <div
                            className="divFolderAdd"
                            onClick={() => {
                                setModalAddFolder(true);
                            }}
                        >
                            <Tooltip title="Añadir carpeta">
                                <button className="btnFolderAdd">+</button>
                            </Tooltip>
                        </div>

                        {/* Map de los datos que recibimos de las carpetas del usuario */}
                        {disk &&
                            disk.folders.map((folder) => {
                                return (
                                    <p
                                        key={folder.id}
                                        onClick={() => {
                                            setSelectedFolderId(folder.id);
                                            setSelectedFolderName(folder.name);
                                        }}
                                    >
                                        {folder.name}
                                    </p>
                                );
                            })}
                    </div>

                    <IconButton
                        aria-label="arrowForward"
                        size="large"
                        className="btnForwardScroll"
                        onClick={() => scroll(150)}
                    >
                        <ArrowForwardIos fontSize="inherit" />
                    </IconButton>
                </div>

                <Directory
                    folder={{
                        selectedFolderId,
                        setSelectedFolderId,
                        selectedFolderName,
                    }}
                    setAlertMessage={setAlertMessage}
                    setters={{ setError, setLoading, setOpen }}
                />

                <div className="fileGallery">
                    {/* Aquí se mostrarán todos los archivos de la carpeta seleccionada */}
                    <ul className="fileList">
                        {selectedFolderId
                            ? disk &&
                              disk.folders
                                  .filter((folder) => {
                                      return folder.id === selectedFolderId;
                                  })[0]
                                  .files.map((file) => {
                                      return (
                                          <li
                                              key={file.id}
                                              onClick={() => {
                                                  setSelectedFileId(file.id);
                                                  setSelectedFileName(
                                                      file.name
                                                  );
                                                  setModalViewFile(true);
                                              }}
                                          >
                                              {file.name}
                                          </li>
                                      );
                                  })
                            : disk &&
                              disk.files.map((file) => {
                                  return (
                                      <li
                                          key={file.id}
                                          onClick={() => {
                                              setSelectedFileId(file.id);
                                              setSelectedFileName(file.name);
                                              setModalViewFile(true);
                                          }}
                                      >
                                          {file.name}
                                      </li>
                                  );
                              })}
                    </ul>

                    <AddFileButton setModalAddFile={setModalAddFile} />
                </div>

                {error && (
                    <ErrorMessage
                        open={{ open, setOpen }}
                        error={{ error, setError }}
                        setMessage={setMessage}
                    />
                )}

                {message && (
                    <SuccessMessage
                        open={{ open, setOpen }}
                        message={{ message, setMessage }}
                        setError={setError}
                    />
                )}
            </div>
        );
    }
}
export default Disk;
