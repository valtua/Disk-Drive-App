import {
    Button,
    IconButton,
    Fab,
    Breadcrumbs,
    Link,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
// import { useState } from 'react';
// import { useToken } from '../../TokenContext';
import './Disk.css';

function Disk() {
    return (
        <div className="Disk">
            <div className="folderScroll">
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
            </div>
            <button className="folderAdd" />
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/Disk">
                    Disk
                </Link>
                <Link underline="hover" color="inherit" href="">
                    Core
                </Link>
                <Typography color="text.primary">Breadcrumbs</Typography>
            </Breadcrumbs>
            <Button variant="contained">Download Folder</Button>
            <IconButton aria-label="delete" size="large">
                <DeleteIcon fontSize="inherit" />
            </IconButton>
            <div className="fileShow">
                {/* Aquí se mostrarán todos los archivos de la carpeta seleccionada */}
            </div>
            <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    );
}

export default Disk;
