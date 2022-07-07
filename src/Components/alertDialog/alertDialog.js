import * as React from "react";
import { useToken } from "../../TokenContext";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function AlertDialog(props) {
  const [token] = useToken();

  // Función para eliminar una carpeta
  const deleteFolder = async () => {
    props.setError(null);
    props.setLoading(true);

    // Abrimos una ventana para que el usuario confirme la eliminación
    if (props.openAlert) {
      try {
        // Realizamos la petición, con el token de seguridad. Utilizamos la id de la carpeta a eliminar
        const res = await fetch(
          `http://localhost:4000/folder/${props.selectedFolder.selectedFolderId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
            },
          }
        );

        const body = await res.json();
        // Lanzamos un error en caso de que no recibamos los datos
        if (body.status === "error") {
          props.setError(body.message);
        } else {
          // Se muestra el mensaje, se lanza update para ver los cambios reflejados y como no existe ya esa carpeta, el valor pasa a ser vacío
          props.setMessage(body.message);
          props.update.setUpdate(!props.update.update);
          props.selectedFolder.setSelectedFolderId("");
        }
      } catch (err) {
        console.error(err);
        props.setError(err.message);
      } finally {
        // Tras finalizar todo, la carga termina, el mensaje aparece (setOpen)
        props.setLoading(false);
        props.setOpen(true);
      }
    }
  };

  // Función que elimina un archivo
  const deleteFile = async () => {
    props.setError(null);
    props.setLoading(true);

    // Abrimos una ventana para que el usuario confirme la eliminación
    if (props.openAlert) {
      try {
        // Realizamos la petición, con el token de seguridad. Utilizamos la id del archivo a eliminar
        const res = await fetch(
          `http://localhost:4000/file/${props.selectedFile.selectedFileId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
            },
          }
        );

        const body = await res.json();
        // Lanzamos un error en caso de que no recibamos los datos
        if (body.status === "error") {
          props.setError(body.message);
        } else {
          // Se muestra el mensaje, se lanza update para ver los cambios reflejados y como no existe ya ese archivo, el valor pasa a ser vacío
          props.setMessage(body.message);
          props.update.setUpdate(!props.update.update);
          props.selectedFile.setSelectedFileId("");
        }
      } catch (err) {
        console.error(err);
        props.setError(err.message);
      } finally {
        // Tras finalizar todo, la carga termina, el mensaje aparece (setOpen) y el Modal que visualiza el archivo seleccionado se cierra
        props.setLoading(false);
        props.setOpen(true);
        props.modalFile(false);
      }
    }
  };

  return (
    <div>
      <Dialog
        open={props.openAlert}
        onClose={() => props.setOpenAlert(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Eliminar permanentemente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setOpenAlert(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              props.setOpenAlert(false);
              props.selectedFolder.selectedFolderId
                ? deleteFolder()
                : deleteFile();
            }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default AlertDialog;
