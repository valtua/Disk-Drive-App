import { Alert, Snackbar } from '@mui/material';

function ErrorMessage(props) {
    // Función que gestiona la acción de cerrar de los mensajes emergentes
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        // Tras finalizar, todo pasa al valor inicial para que no se muestre
        props.open.setOpen(false);
        props.setMessage(null);
        props.error.setError(null);
    };
    return (
        <Snackbar
            open={props.open.open}
            onClose={handleClose}
            autoHideDuration={4000}
        >
            <Alert severity="error" sx={{ width: '100%' }}>
                {props.error.error}
            </Alert>
        </Snackbar>
    );
}
export default ErrorMessage;
