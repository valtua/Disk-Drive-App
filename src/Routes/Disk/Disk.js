import { IconButton, Fab, Breadcrumbs, Link } from '@mui/material';
import { Add, Delete, Download } from '@mui/icons-material';
import { useToken } from '../../TokenContext';
import { Navigate } from 'react-router-dom';
import './Disk.css';
import { useEffect, useState } from 'react';

function Disk() {
    const [token] = useToken();
    const [disk, setDisk] = useState(null);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        getUserDiskInfo();
    });

    if (!token) {
        return <Navigate to="/" />;
    } else {
        return (
                <div className="Disk">
                    <div className="folderScroll">
                        <div className="divFolderAdd"><button className="btnFolderAdd">+</button></div>
                        {/* Aquí habrá que hacer bucle en base a los datos que recibamos de la query que selecciona carpetas del usuario */}
                        <a href="#home">Home</a>
                        {disk &&
                        disk.folders.map((folder) => {
                            return <a key={folder.id}>{folder.name}</a>;
                        })}
                    </div>
                    <div className="directory">
                        <Breadcrumbs aria-label="breadcrumb">
                            {/* El contenido será según la carpeta que se seleccione*/}
                            <Link underline="hover" color="black" href="/Disk">
                                Disk
                            </Link>
                            <Link
                                underline="hover"
                                color="black"
                                href=""
                            >
                                Core
                            </Link>
                        </Breadcrumbs>
                        <IconButton aria-label="download" size="large" className="btnDownloadFolder">
                            <Download fontSize="inherit" />
                        </IconButton>
                        <IconButton aria-label="delete" size="large" className="btnDeleteFolder">
                            <Delete fontSize="inherit" />
                        </IconButton>
                    </div>
                    <div className="fileShow">
                        {/* Aquí se mostrarán todos los archivos de la carpeta seleccionada */}  
                       
                    </div>
                    <Fab color="primary" aria-label="add" className="btnFileAdd">
                        <Add />
                    </Fab>
                </div>
                );
    }
} 
export default Disk;
