import { Delete, Download } from '@mui/icons-material';
import { Breadcrumbs, IconButton, Typography } from '@mui/material';
import { useToken } from '../../TokenContext';

function Directory(props) {
    const [token] = useToken();
    // Función para descargar una carpeta y su contenido
    const downloadFolder = async () => {
        props.setters.setError(null);
        props.setters.setLoading(true);

        try {
            // Realizamos la petición, con el token de seguridad. Utilizamos la id de la carpeta a descargar
            const res = await fetch(
                `http://localhost:4000/download/folder/${props.folder.selectedFolderId}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            // Tranformamos la respuesta en un objeto de tipo
            const body = await res.blob();
            // Creamos la url de descarga de archivo
            const url = window.URL.createObjectURL(body);
            // Creamos el elemento para contener la url
            const link = document.createElement('a');
            // Le asignamos a link la referencia de la url
            link.href = url;
            // Le damos nombre a la propiedad de descarga del link
            link.download = props.folder.selectedFolderName;
            // Insertamos el link en el body
            document.body.appendChild(link);
            // Accionamos el link
            link.click();
            // Retiramos el link del body
            document.body.removeChild(link);
            // Eliminamos la url
            window.URL.revokeObjectURL(url);

            // Lanzamos un error en caso de que no recibamos los datos
            if (body.status === 'error') {
                props.setters.setError(body.message);
            }
        } catch (err) {
            console.error(err);
            props.setters.setError(err.message);
        } finally {
            // Tras finalizar todo, la carga termina, el icono de descarga aparece (setOpen)
            props.setters.setLoading(false);
            props.setters.setOpen(true);
        }
    };
    return (
        <div className="directory">
            <Breadcrumbs aria-label="breadcrumb">
                <Typography
                    sx={{ color: 'black', cursor: 'pointer' }}
                    onClick={() => {
                        props.folder.setSelectedFolderId('');
                    }}
                >
                    Disco
                </Typography>
                {props.folder.selectedFolderId && (
                    <Typography sx={{ color: 'black' }}>
                        {props.folder.selectedFolderName}
                    </Typography>
                )}
            </Breadcrumbs>
            {props.folder.selectedFolderId && (
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
                        onClick={() => props.setAlertMessage(true)}
                    >
                        <Delete fontSize="inherit" />
                    </IconButton>
                </>
            )}
        </div>
    );
}

export default Directory;
