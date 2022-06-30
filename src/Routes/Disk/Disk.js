import { IconButton, Fab, Breadcrumbs, Link } from '@mui/material';
import { Add, Delete, Download } from '@mui/icons-material';
import { useToken } from '../../TokenContext';
import { Navigate } from 'react-router-dom';
import './Disk.css';

function Disk() {
    const [token] = useToken();

    if (!token) {
        return <Navigate to="/" />;
    } else {
        return (
                <div className="Disk">
                    <div className="folderScroll">
                        <div><button className="btnFolderAdd">+</button></div>
                        {/* Aquí habrá que hacer bucle en base a los datos que recibamos de la query que selecciona carpetas del usuario */}
                        <a href="#home">Home</a>
                        <a href="#news">News</a>
                        <a href="#contact">Contact</a>
                        <a href="#about">About</a>
                        <a href="#support">Support</a>
                        <a href="#blog">Blog</a>
                        <a href="#tools">Tools</a>
                        <a href="#base">Base</a>
                        <a href="#custom">Custom</a>
                        <a href="#more">More</a>
                        <a href="#logo">Logo</a>
                        <a href="#friends">Friends</a>
                        <a href="#partners">Partners</a>
                        <a href="#people">People</a>
                        <a href="#work">Work</a>
                        <a href="#arre">Arre</a>
                        <a href="#porr">Porr</a>
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
                        <IconButton aria-label="delete" size="large" className="btnDownloadFolder">
                            <Download fontSize="inherit" />
                        </IconButton>
                        <IconButton aria-label="delete" size="large" className="btnDeleteFolder">
                            <Delete fontSize="inherit" />
                        </IconButton>
                    </div>
                    <div className="fileShow">
                        {/* Aquí se mostrarán todos los archivos de la carpeta seleccionada */}
                        <Fab color="primary" aria-label="add" className="btnFileAdd">
                            <Add />
                        </Fab>
                    </div>
                </div>
                );
            }
    }
export default Disk;
