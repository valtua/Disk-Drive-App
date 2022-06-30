import { IconButton, Fab, Breadcrumbs, Link } from '@mui/material';
import { Add, Delete, Download } from '@mui/icons-material';
import { useToken } from '../../TokenContext';
import { Navigate } from 'react-router-dom';
import './Disk.css';
import { useEffect, useState } from 'react';

function Disk() {
    const [token] = useToken();
    const [disk, setDisk] = useState(null);
    const [, setError] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState('');

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

    useEffect(() => {
        getUserDiskInfo();
    }, []);

    if (!token) {
        return <Navigate to="/" />;
    } else {
        return (
            <div className="Disk">
                <div className="folderScroll">
                    <div>
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
                <div className="directory">
                    <Breadcrumbs aria-label="breadcrumb">
                        {/* El contenido será según la carpeta que se seleccione*/}
                        <Link underline="hover" color="black" href="/Disk">
                            Disk
                        </Link>
                        <Link underline="hover" color="black" href="">
                            Core
                        </Link>
                    </Breadcrumbs>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        className="btnDownloadFolder"
                    >
                        <Download fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        className="btnDeleteFolder"
                    >
                        <Delete fontSize="inherit" />
                    </IconButton>
                </div>

                <Fab color="primary" aria-label="add" className="btnFileAdd">
                    <Add />
                </Fab>
                <div className="fileShow">
                    {/* Aquí se mostrarán todos los archivos de la carpeta seleccionada */}
                    {selectedFolder && (
                        <ul>
                            {disk.folders
                                .filter((folder) => {
                                    return folder.name === selectedFolder;
                                })[0]
                                .files.map((file) => {
                                    return <li key={file.id}>{file.name}</li>;
                                })}
                        </ul>
                    )}
                    {disk && (
                        <ul>
                            {disk.files.map((file) => {
                                return <li key={file.id}>{file.name}</li>;
                            })}
                        </ul>
                    )}

                    <Fab
                        color="primary"
                        aria-label="add"
                        className="btnFileAdd"
                    >
                        <Add />
                    </Fab>
                </div>
            </div>
        );
    }
}
export default Disk;
