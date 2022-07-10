import { useToken } from "../../TokenContext";
import { Box, Fab, Modal } from "@mui/material";
import { Cancel } from "@mui/icons-material";

import "./ModalAddFolder.css";

// Función que contiene el modal de añadir carpetas y su función de añadir
function ModalAddFolder(props) {
  const [token] = useToken();

  // Función para añadir una carpeta
  const addFolder = async (e) => {
    e.preventDefault();
    props.setError(null);
    props.loading.setLoading(true);

    try {
      // Realizamos el post de los datos, con el token de seguridad y los datos en el body (en este caso es el nombre (value) que se le da a la carpeta
      const res = await fetch("http://localhost:4000/folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          folder: document.getElementById("folder").value,
        }),
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
      // Tras finalizar todo, la carga termina, el mensaje (setOpen) aparece, y el Modal de subir carpeta se cierra
      props.loading.setLoading(false);
      props.setOpen(true);
      props.addFolder.setModalAddFolder(false);
      props.update.setUpdate(!props.update.update);
    }
  };

  return (
    // MODAL ADD FOLDER
    <Modal
      open={props.addFolder.modalAddFolder}
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
          margin: "2vh",
          width: "50vh",
          position: "relative",
          backgroundColor: "white",
          borderRadius: "1vh",
        }}
      >
        <Fab
          aria-label="close"
          className="btnCloseModalAddFolder"
          onClick={() => {
            props.addFolder.setModalAddFolder(false);
          }}
        >
          <Cancel sx={{ color: "red" }} />
        </Fab>
        <form className="addFolderForm" onSubmit={addFolder}>
          <label htmlFor="folder">Nombre de carpeta</label>
          <input
            id="folder"
            name="folder"
            type="text"
            placeholder="Mi-Carpeta"
            maxlength="15"
            required
          />
          <button>{props.loading.loading ? "Añadiendo..." : "Añadir"}</button>
        </form>
      </Box>
    </Modal>
  );
}
export default ModalAddFolder;
