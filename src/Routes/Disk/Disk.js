import {
    IconButton,
    Fab,
    Breadcrumbs,
    Modal,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    Add,
    Delete,
    Download,
    Cancel,
} from '@mui/icons-material';
import { useToken } from '../../TokenContext';
import { Navigate } from 'react-router-dom';
import './Disk.css';
import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/system';

function Disk() {
    const [token] = useToken();
    const [disk, setDisk] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(false);

    const [selectedFolderId, setSelectedFolderId] = useState('');
    const [selectedFolderName, setSelectedFolderName] = useState('');
    const [selectedFileId, setSelectedFileId] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [modalAddFolder, setModalAddFolder] = useState(false);
    const [modalAddFile, setModalAddFile] = useState(false);
    const [modalViewFile, setModalViewFile] = useState(false);

    const getUserDiskInfo = async () => {
        try {
            const res = await fetch('http://localhost:4000/disk', {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            });

            const body = await res.json();

            const disk = body.data.space;

            if (body.status === 'error') {
                setError(body.message);
            }

            setDisk(disk);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const addFile = async (e) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        if (selectedFolderId) {
            try {
                const uploadedFile = document.querySelector('#uploadedFile');
                const data = new FormData();
                data.append('uploadedFile', uploadedFile.files[0]);

                const res = await fetch(
                    `http://localhost:4000/upload/${selectedFolderId}`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: token,
                        },
                        body: data,
                    }
                );

                const body = await res.json();

                if (body.status === 'error') {
                    setError(body.message);
                } else {
                    setMessage(body.message);
                    setUpdate(!update);
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
                setOpen(true);
                setModalAddFile(false);
            }
        } else {
            try {
                const uploadedFile = document.querySelector('#uploadedFile');
                const data = new FormData();
                data.append('uploadedFile', uploadedFile.files[0]);

                const res = await fetch('http://localhost:4000/upload', {
                    method: 'POST',
                    headers: {
                        Authorization: token,
                    },
                    body: data,
                });

                const body = await res.json();

                if (body.status === 'error') {
                    setError(body.message);
                } else {
                    setMessage(body.message);
                    setUpdate(!update);
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
                setOpen(true);
                setModalAddFile(false);
            }
        }
    };

    const addFolder = async (e) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:4000/folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    folder: document.getElementById('folder').value,
                }),
            });

            const body = await res.json();

            if (body.status === 'error') {
                setError(body.message);
            } else {
                setMessage(body.message);
                setUpdate(!update);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
            setOpen(true);
            setModalAddFolder(false);
            setUpdate(!update);
        }
    };

    const downloadFolder = async () => {
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost:4000/download/folder/${selectedFolderId}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            const body = await res.blob();
            const url = window.URL.createObjectURL(body);
            const link = document.createElement('a');
            link.href = url;
            link.download = selectedFolderName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log(body);

            if (body.status === 'error') {
                setError(body.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
            setOpen(true);
        }
    };

    const deleteFolder = async () => {
        setError(null);
        setLoading(true);

        if (window.confirm('¿Deseas eliminar la carpeta?')) {
            try {
                const res = await fetch(
                    `http://localhost:4000/folder/${selectedFolderId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                const body = await res.json();

                if (body.status === 'error') {
                    setError(body.message);
                } else {
                    setMessage(body.message);
                    setUpdate(!update);
                    setSelectedFolderId('');
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setOpen(true);
                setLoading(false);
            }
        }
    };

    const downloadFile = async () => {
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost:4000/download/file/${selectedFileId}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            const body = await res.blob();
            const url = window.URL.createObjectURL(body);
            const link = document.createElement('a');
            link.href = url;
            link.download = selectedFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            if (body.status === 'error') {
                setError(body.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
            setOpen(true);
        }
    };

    const deleteFile = async () => {
        setError(null);
        setLoading(true);

        if (window.confirm('¿Deseas eliminar el archivo?')) {
            try {
                const res = await fetch(
                    `http://localhost:4000/file/${selectedFileId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                const body = await res.json();

                if (body.status === 'error') {
                    setError(body.message);
                } else {
                    setMessage(body.message);
                    setUpdate(!update);
                    setSelectedFileId('');
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
                setOpen(true);
                setModalViewFile(false);
            }
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const ref = useRef(null);
    const scroll = (scrollOffset) => {
        ref.current.scrollLeft += scrollOffset;
    };

    useEffect(() => {
        getUserDiskInfo();
    }, [update]);

    if (!token) {
        return <Navigate to="/" />;
    } else {
        return (
            <div className="Disk">
                <div className="folderSearch">
                    <IconButton
                        aria-label="arrowBack"
                        size="large"
                        className="btnBackScroll"
                        onClick={() => scroll(-5000)}
                    >
                        <ArrowBack fontSize="inherit" />
                    </IconButton>
                    <div className="folderScroll" ref={ref}>
                        <div
                            className="divFolderAdd"
                            onClick={() => {
                                setModalAddFolder(true);
                            }}
                        >
                            <button className="btnFolderAdd">+</button>
                        </div>
                        {/* Aquí habrá que hacer bucle en base a los datos que recibamos de la query que selecciona carpetas del usuario */}
                        {disk &&
                            disk.folders.map((folder) => {
                                return (
                                    <a
                                        key={folder.id}
                                        onClick={() => {
                                            setSelectedFolderId(folder.id);
                                            setSelectedFolderName(folder.name);
                                        }}
                                    >
                                        {folder.name}
                                    </a>
                                );
                            })}
                    </div>
                    <IconButton
                        aria-label="arrowForward"
                        size="large"
                        className="btnForwardScroll"
                        onClick={() => scroll(5000)}
                    >
                        <ArrowForward fontSize="inherit" />
                    </IconButton>
                </div>
                <Modal
                    open={modalAddFolder}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '2vh',
                            padding: '5vh',
                            position: 'relative',
                            backgroundColor: 'white',
                            borderRadius: '1vh',
                        }}
                    >
                        <Fab
                            aria-label="close"
                            className="btnClose"
                            onClick={() => {
                                setModalAddFolder(false);
                            }}
                        >
                            <Cancel sx={{ color: 'red' }} />
                        </Fab>
                        <form className="addForm" onSubmit={addFolder}>
                            <label htmlFor="folder">Nombre de carpeta</label>
                            <input
                                id="folder"
                                name="folder"
                                type="text"
                                placeholder="Mi-Carpeta"
                                required
                            />
                            <button>
                                {loading ? 'Añadiendo...' : 'Añadir'}
                            </button>
                        </form>
                    </Box>
                </Modal>
                <div className="directory">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography
                            sx={{ color: 'black', cursor: 'pointer' }}
                            onClick={() => {
                                setSelectedFolderId('');
                            }}
                        >
                            Disk
                        </Typography>
                        {selectedFolderId && (
                            <Typography sx={{ color: 'black' }}>
                                {selectedFolderName}
                            </Typography>
                        )}
                    </Breadcrumbs>
                    {selectedFolderId && (
                        <>
                            <IconButton
                                aria-label="download"
                                size="large"
                                className="btnDownloadFolder"
                                onClick={downloadFolder}
                            >
                                <Download fontSize="inherit" />
                            </IconButton>
                            <IconButton
                                aria-label="delete"
                                size="large"
                                className="btnDeleteFolder"
                                onClick={deleteFolder}
                            >
                                <Delete fontSize="inherit" />
                            </IconButton>
                        </>
                    )}
                </div>
                <Fab color="primary" aria-label="add" className="btnFileAdd">
                    <Add />
                </Fab>
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

                    <Modal
                        open={modalViewFile}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                margin: '2vh',
                                padding: '5vh',
                                position: 'relative',
                                backgroundColor: 'white',
                                borderRadius: '1vh',
                            }}
                        >
                            <Fab
                                aria-label="close"
                                className="btnClose"
                                onClick={() => {
                                    setModalViewFile(false);
                                }}
                            >
                                <Cancel sx={{ color: 'red' }} />
                            </Fab>
                            <label className="fileData">
                                File Name: {selectedFileName}{' '}
                            </label>
                            <div className="divBtnFile">
                                <IconButton
                                    aria-label="delete"
                                    size="large"
                                    className="btnDownloadFile"
                                    onClick={downloadFile}
                                >
                                    <Download fontSize="inherit" />
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    size="large"
                                    className="btnDeleteFile"
                                    onClick={deleteFile}
                                >
                                    <Delete fontSize="inherit" />
                                </IconButton>
                            </div>
                        </Box>
                    </Modal>

                    <Fab
                        color="primary"
                        aria-label="add"
                        className="btnFileAdd"
                        onClick={() => {
                            setModalAddFile(true);
                        }}
                    >
                        <Add />
                    </Fab>

                    <Modal
                        open={modalAddFile}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                margin: '2vh',
                                padding: '5vh',
                                position: 'relative',
                                backgroundColor: 'white',
                                borderRadius: '1vh',
                            }}
                        >
                            <Fab
                                aria-label="close"
                                className="btnClose"
                                onClick={() => {
                                    setModalAddFile(false);
                                }}
                            >
                                <Cancel sx={{ color: 'red' }} />
                            </Fab>
                            <h6>
                                ./Disk
                                {selectedFolderId && `/${selectedFolderName}`}
                            </h6>
                            <form className="addForm" onSubmit={addFile}>
                                <input
                                    id="uploadedFile"
                                    name="uploadedFile"
                                    type="file"
                                    required
                                />
                                <button>
                                    {loading ? 'Añadiendo...' : 'Añadir'}
                                </button>
                            </form>
                        </Box>
                    </Modal>
                </div>
                {error && (
                    <Snackbar
                        open={open}
                        onClose={handleClose}
                        autoHideDuration={4000}
                    >
                        <Alert severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )}
                {message && (
                    <Snackbar
                        open={open}
                        autoHideDuration={4000}
                        onClose={handleClose}
                    >
                        <Alert severity="info" sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                )}
            </div>
        );
    }
}
export default Disk;
