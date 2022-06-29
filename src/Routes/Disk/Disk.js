import { Button, IconButton, Breadcrumbs, Link, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useToken } from '../../TokenContext';
import './Disk.css';

function Disk() {

    return (
        <div className="Disk">
        <div className="folderSelector" />
        // Aquí habrá que hacer bucle en base a los datos que recibamos de la query que selecciona carpetas del usuario
        <div className="folderScroll"></div>
        <button className="folderAdd" />
        <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/Disk">
                Disk
            </Link>
            <Link
                underline="hover"
                color="inherit"
                href=""
            >
                Core
            </Link>
            <Typography color="text.primary">Breadcrumbs</Typography>
        </Breadcrumbs>
    <Button variant="contained">Download Folder</Button>
    <IconButton aria-label="delete" size="large">
        <DeleteIcon fontSize="inherit" />
    </IconButton>
        </div>
    );
}

export default Disk;