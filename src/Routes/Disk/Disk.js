import { IconButton, Fab, Breadcrumbs, Link, Modal } from '@mui/material';
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
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';

function Disk() {
    const [token] = useToken();
    const [disk, setDisk] = useState(null);
    const [, setError] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [modalAddFolder, setModalAddFolder] = useState(false);
    const [modalAddFile, setModalAddFile] = useState(false);
    const [modalViewFile, setModalViewFile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);

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

    const selectFolder = (e) => {
        setSelectedFolder(e.target.innerHTML);
    };

    const addFile = async (e) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        if (selectedFolder) {
            try {
                const folder = disk.folders.filter((folder) => {
                    return folder.name === selectedFolder;
                });
<<<<<<< HEAD

=======
>>>>>>> f18d889f07501d64b744faf5af8bd77a726837d9
                const uploadedFile = document.querySelector('#uploadedFile');
                const data = new FormData();
                data.append('uploadedFile', uploadedFile.files[0]);

                const res = await fetch(
                    `http://localhost:4000/upload/${folder[0].id}`,
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
                    setUpdate(!update);
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
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
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
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
                setUpdate(!update);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
            setModalAddFolder(false);
            setUpdate(!update);
        }
    };

    const downloadFolder = async () => {
        setError(null);
        setLoading(true);

        try {
            const folder = disk.folders.filter((folder) => {
                return folder.name === selectedFolder;
            });
            const res = await fetch(
                `http://localhost:4000/download/folder/${folder[0].id}`,
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
            link.download = selectedFolder;
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
        }
    };

    const deleteFolder = async () => {
        setError(null);
        setLoading(true);

        if (window.confirm('¿Deseas eliminar la carpeta?')) {
            try {
                const folder = disk.folders.filter((folder) => {
                    return folder.name === selectedFolder;
                });

                const res = await fetch(
                    `http://localhost:4000/folder/${folder[0].id}`,
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
                    setUpdate(!update);
                    setSelectedFolder('');
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFolderModal = () => {
        setModalAddFolder(true);
    };

    const handleFileModal = () => {
        setModalAddFile(true);
    };

    const handleViewFileModal = () => {
        setModalViewFile(true);
    };

    const handleFolderModalClose = () => {
        setModalAddFolder(false);
    };
    const handleFileModalClose = () => {
        setModalAddFile(false);
    };

    const handleViewFileModalClose = () => {
        setModalViewFile(false);
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
                    >
                        <ArrowBack fontSize="inherit" />
                    </IconButton>
                    <div className="folderScroll">
                        <div
                            className="divFolderAdd"
                            onClick={handleFolderModal}
                        >
                            <button className="btnFolderAdd">+</button>
                        </div>
                        {/* Aquí habrá que hacer bucle en base a los datos que recibamos de la query que selecciona carpetas del usuario */}
                        {disk &&
                            disk.folders.map((folder) => {
                                return (
                                    <a key={folder.id} onClick={selectFolder}>
                                        {folder.name}
                                    </a>
                                );
                            })}
                    </div>
                    <IconButton
                        aria-label="arrowForward"
                        size="large"
                        className="btnForwardScroll"
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
                            width: 400,
                            height: 'fit-content',
                            backgroundColor: 'white',
                            borderRadius: '1vh',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                        }}
                    >
                        <Fab
                            aria-label="close"
                            className="btnClose"
                            onClick={handleFolderModalClose}
                        >
                            <Cancel sx={{ color: 'red' }} />
                        </Fab>
                        <form className="addForm" onSubmit={addFolder}>
                            <label htmlFor="folder">Nombre de carpeta</label>
                            <input
                                type="text"
                                name="folder"
                                id="folder"
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
                        {/* El contenido será según la carpeta que se seleccione*/}
                        <Link underline="hover" color="black" href="/Disk">
                            Disk
                        </Link>
                        {selectedFolder && (
                            <Link underline="hover" color="black" href="">
                                {selectedFolder}
                            </Link>
                        )}
                    </Breadcrumbs>
                    {selectedFolder && (
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
                        {selectedFolder
                            ? disk &&
                              disk.folders
                                  .filter((folder) => {
                                      return folder.name === selectedFolder;
                                  })[0]
                                  .files.map((file) => {
                                      return <li key={file.id}>{file.name}</li>;
                                      
                                  })
                            : disk &&
                              disk.files.map((file) => {
                                  return <li key={file.id} onClick={handleViewFileModal}>{file.name}</li>;
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
                                width: 400,
                                height: 'fit-content',
                                backgroundColor: 'white',
                                borderRadius: '1vh',
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <img
                                style={{
                                objectFit: "contain",
                                width: "100%",
                                height: "100%",
                                borderRadius: "3px 3px 1px 1px",
                                }}
                                src={``}
                                alt={``}
                                loading="lazy"
                            />
                            <p>File Name: </p>
                            <p>Upload Date:</p>
                            <p>Size:</p>
                            <div className="divBtnFile">
                                <IconButton aria-label="delete" size="large" className="btnDownloadFile">
                                        <Download fontSize="inherit" />
                                </IconButton>
                                <IconButton aria-label="delete" size="large" className="btnDeleteFile">
                                    <Delete fontSize="inherit" />
                                </IconButton>
                            </div>
                            <Fab
                                aria-label="close"
                                className="btnClose"
                                onClick={handleViewFileModalClose}
                            >
                                <Cancel sx={{ color: 'red' }} />
                            </Fab>
                        </Box>
                    </Modal>

                    <Fab
                        color="primary"
                        aria-label="add"
                        className="btnFileAdd"
                        onClick={handleFileModal}
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
                                width: 400,
                                height: 'fit-content',
                                backgroundColor: 'white',
                                borderRadius: '1vh',
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <Fab
                                aria-label="close"
                                className="btnClose"
                                onClick={handleFileModalClose}
                            >
                                <Cancel sx={{ color: 'red' }} />
                            </Fab>
                            <h6>
                                ./Disk{selectedFolder && `/${selectedFolder}`}
                            </h6>
                            <form className="addForm" onSubmit={addFile}>
                                <input
                                    type="file"
                                    name="uploadedFile"
                                    id="uploadedFile"
                                    required
                                />
                                <button>
                                    {loading ? 'Añadiendo...' : 'Añadir'}
                                </button>
                            </form>
                        </Box>
                    </Modal>
                </div>
            </div>
        );
    }
}
export default Disk;
