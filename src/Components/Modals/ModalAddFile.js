import { useToken } from "../../TokenContext";
import { Box, Fab, Modal } from "@mui/material";
import { Cancel, UploadFile } from "@mui/icons-material";

// Función que contiene el modal de añadir archivos y su función de añadir
function ModalAddFile(props) {
  const [token] = useToken();

  // Función para agregar un archivo, dentro de una carpeta, o en la raíz
  const addFile = async (e) => {
    e.preventDefault();

    props.setError(null);
    props.loading.setLoading(true);

    // Si tenemos seleccionada una carpeta, el archivo se subirá ahí
    if (props.selectedFolder.selectedFolderId) {
      try {
        const uploadedFile = document.querySelector("#uploadedFile");
        const data = new FormData();
        data.append("uploadedFile", uploadedFile.files[0]);

        // Realizamos el post de los datos, con el token de seguridad y los datos en el body
        const res = await fetch(
          `http://localhost:4000/upload/${props.selectedFolder.selectedFolderId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: data,
          }
        );

        const body = await res.json();
        // Lanzamos un error en caso de que no recibamos los datos
        if (body.status === "error") {
          props.setError(body.message);
        } else {
          // Mandamos un mensaje al usuario confirmando que se ha subido correctamente y updateamos para que se vean los cambios reflejados
          props.setMessage(body.message);
          props.update.setUpdate(!props.update.update);
        }
      } catch (err) {
        console.error(err);
        props.setError(err.message);
      } finally {
        // Tras finalizar todo, la carga termina, el mensaje (setOpen) aparece, y el Modal de subir archivo se cierra
        props.loading.setLoading(false);
        props.setOpen(true);
        props.addFile.setModalAddFile(false);
      }
    } else {
      // Si no hay una carpeta seleccionada, subimos el archivo en la raíz, el proceso es el mismo que en el anterior, pero la ruta del fetch es la raíz
      try {
        const uploadedFile = document.querySelector("#uploadedFile");
        const data = new FormData();
        data.append("uploadedFile", uploadedFile.files[0]);

        const res = await fetch("http://localhost:4000/upload", {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: data,
        });

        const body = await res.json();
        // Lanzamos un error en caso de que no recibamos los datos
        if (body.status === "error") {
          props.setError(body.message);
        } else {
          // Mandamos un mensaje al usuario confirmando que se ha subido correctamente y updateamos para que se vean los cambios reflejados
          props.setMessage(body.message);
          props.update.setUpdate(!props.update.update);
        }
      } catch (err) {
        console.error(err);
        props.setError(err.message);
      } finally {
        // Tras finalizar todo, la carga termina, el mensaje (setOpen) aparece, y el Modal de subir archivo se cierra
        props.loading.setLoading(false);
        props.setOpen(true);
        props.addFile.setModalAddFile(false);
      }
    }
  };

  return (
    // MODAL ADD FILE
    <Modal
      open={props.addFile.modalAddFile}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "2vh",
          padding: "5vh",
          position: "relative",
          backgroundColor: "white",
          borderRadius: "1vh",
        }}
      >
        <Fab
          aria-label="close"
          className="btnClose"
          onClick={() => {
            props.addFile.setModalAddFile(false);
          }}
        >
          <Cancel sx={{ color: "red" }} />
        </Fab>
        <h6>
          ./Disk
          {props.selectedFolder.selectedFolderId &&
            `/${props.folderName.selectedFolderName}`}
        </h6>
        <form className="addForm" onSubmit={addFile}>
          <input id="uploadedFile" name="uploadedFile" type="file" required />
          <label htmlFor="uploadedFile">
            <UploadFile />
            Seleccionar archivo
          </label>
          <button>{props.loading.loading ? "Añadiendo..." : "Añadir"}</button>
        </form>
      </Box>
    </Modal>
  );
}
export default ModalAddFile;
