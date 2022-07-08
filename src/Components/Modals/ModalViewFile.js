import { useToken } from "../../TokenContext";
import { Box, Fab, IconButton, Modal } from "@mui/material";
import { Cancel, Delete, Download } from "@mui/icons-material";

import "./ModalViewFile.css";

// Función que contiene el modal de visualización de archivos y sus función de descarga
function ModalViewFile(props) {
  const [token] = useToken();

  // Función para descargar un archivo
  const downloadFile = async () => {
    props.setError(null);
    props.loading.setLoading(true);

    try {
      // Realizamos la petición, con el token de seguridad. Utilizamos la id del archivo a descargar
      const res = await fetch(
        `http://localhost:4000/download/file/${props.selectedFile.selectedFileId}`,
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
      const link = document.createElement("a");
      // Le asignamos a link la referencia de la url
      link.href = url;
      // Le damos nombre a la propiedad de descarga del link
      link.download = props.fileName.selectedFileName;
      // Insertamos el link en el body
      document.body.appendChild(link);
      // Accionamos el link
      link.click();
      // Retiramos el link del body
      document.body.removeChild(link);
      // Eliminamos la url
      window.URL.revokeObjectURL(url);

      // Lanzamos un error en caso de que no recibamos los datos
      if (body.status === "error") {
        props.setError(body.message);
      }
    } catch (err) {
      console.error(err);
      props.setError(err.message);
    } finally {
      // Tras finalizar todo, la carga termina, el icono de descarga aparece (setOpen)
      props.loading.setLoading(false);
      props.setOpen(true);
    }
  };

  return (
    // MODAL VIEW FILE
    <Modal
      open={props.viewFile.modalViewFile}
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
            props.viewFile.setModalViewFile(false);
          }}
        >
          <Cancel sx={{ color: "red" }} />
        </Fab>
        <label className="fileData">
          Nombre de archivo: {props.fileName.selectedFileName}{" "}
        </label>
        <div className="divBtnFile">
          <IconButton
            aria-label="download"
            size="large"
            className="btnDownloadFile"
            onClick={downloadFile}
          >
            <Download fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="large"
            className="btnDeleteFile"
            onClick={() => props.setOpenAlert(true)}
          >
            <Delete fontSize="inherit" />
          </IconButton>
        </div>
      </Box>
    </Modal>
  );
}
export default ModalViewFile;
