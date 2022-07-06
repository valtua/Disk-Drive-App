import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function AlertDialog() {
  const [deleteMessage, setDeleteMessage] = React.useState(false);

  const handleClickOpenDeleteMessage = () => {
    setDeleteMessage(true);
  };

  const handleClickCloseDeleteMessage = () => {
    setDeleteMessage(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpenDeleteMessage}>
        Open alert dialog
      </Button>
      <Dialog
        open={deleteMessage}
        onClose={handleClickCloseDeleteMessage}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que quieres eliminar esta carpeta?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseDeleteMessage}>Cancelar</Button>
          <Button onClick={handleClickCloseDeleteMessage} autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;
