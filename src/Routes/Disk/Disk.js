import {
  IconButton,
  Fab,
  Breadcrumbs,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add,
  Delete,
  Download,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import { useToken } from "../../TokenContext";
import { Navigate } from "react-router-dom";
import "./Disk.css";
import { useEffect, useState, useRef } from "react";
import AlertDialog from "../../Components/alertDialog/alertDialog";
import ModalAddFolder from "../../Components/Modals/ModalAddFolder";
import ModalAddFile from "../../Components/Modals/ModalAddFile";
import ModalViewFile from "../../Components/Modals/ModalViewFile";

function Disk() {
  // Declaraciones de useToken y useState
  const [token] = useToken();
  const [disk, setDisk] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  // Declaración de useState que usaremos para manejar nombre/id de carpetas y archivos, además de la visualización de los Modales y el mensaje al eliminar carpetas/archivos
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedFolderName, setSelectedFolderName] = useState("");
  const [selectedFileId, setSelectedFileId] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [modalAddFolder, setModalAddFolder] = useState(false);
  const [modalAddFile, setModalAddFile] = useState(false);
  const [modalViewFile, setModalViewFile] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);

  // Función que recoge la información de usuario, sus archivos y carpetas
  const getUserDiskInfo = async () => {
    try {
      // Fetch al disco del usuario utilizando token como medida de seguridad y autentificación
      const res = await fetch("http://localhost:4000/disk", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      // Almacenamos los datos json
      const body = await res.json();

      // Almacenamos los datos del disco para manejarlos en el resto de la aplicación
      const disk = body.data.space;

      // Lanzamos un error en caso de que no recibamos los datos
      if (body.status === "error") {
        setError(body.message);
      }
      setDisk(disk);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Función para descargar una carpeta y su contenido
  const downloadFolder = async () => {
    setError(null);
    setLoading(true);

    try {
      // Realizamos la petición, con el token de seguridad. Utilizamos la id de la carpeta a descargar
      const res = await fetch(
        `http://localhost:4000/download/folder/${selectedFolderId}`,
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
      link.download = selectedFolderName;
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
        setError(body.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      // Tras finalizar todo, la carga termina, el icono de descarga aparece (setOpen)
      setLoading(false);
      setOpen(true);
    }
  };

  // Función que gestiona la acción de cerrar de los mensajes emergentes
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // Tras finalizar, todo pasa al valor inicial para que no se muestre
    setOpen(false);
    setMessage(null);
    setError(null);
  };

  // Declaramos useRef para el manejo del Scroll de carpetas
  const ref = useRef(null);
  // Función que el comportamiento del scroll
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  // Utilización del hook useEffect que hará uso, cada vez que cambie el valor del estado 'update', de la función getUserDiskInfo
  useEffect(() => {
    getUserDiskInfo();
  }, [update]);

  if (!token) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="Disk">
        {/* Mensajes de confirmación al usuario para eliminar carpetas/archivos */}
        <AlertDialog
          openAlert={alertMessage}
          setOpenAlert={setAlertMessage}
          setError={setError}
          setMessage={setMessage}
          setLoading={setLoading}
          setOpen={setOpen}
          update={{ update, setUpdate }}
          selectedFolder={{ selectedFolderId, setSelectedFolderId }}
          selectedFile={{ selectedFileId, setSelectedFileId }}
          modalFile={{ setModalViewFile }}
        />

        {/* Modal para agregar carpeta (se abre con btnFolderAdd) */}
        <ModalAddFolder
          openAlert={alertMessage}
          setOpenAlert={setAlertMessage}
          setError={setError}
          setMessage={setMessage}
          loading={{ loading, setLoading }}
          setOpen={setOpen}
          update={{ update, setUpdate }}
          addFolder={{ modalAddFolder, setModalAddFolder }}
        />

        {/* Modal para agregar archivo (se abre con btnFileAdd) */}
        <ModalAddFile
          openAlert={alertMessage}
          setOpenAlert={setAlertMessage}
          setError={setError}
          setMessage={setMessage}
          loading={{ loading, setLoading }}
          setOpen={setOpen}
          update={{ update, setUpdate }}
          addFile={{ modalAddFile, setModalAddFile }}
          selectedFolder={{ selectedFolderId, setSelectedFolderId }}
          folderName={{ selectedFolderName, setSelectedFolderName }}
        />

        {/* Modal para visualizar el archivo (se abre pinchando el archivo (li) situado en fileGallery) */}
        <ModalViewFile
          openAlert={alertMessage}
          setOpenAlert={setAlertMessage}
          setError={setError}
          setMessage={setMessage}
          loading={{ loading, setLoading }}
          setOpen={setOpen}
          update={{ update, setUpdate }}
          viewFile={{ modalViewFile, setModalViewFile }}
          selectedFile={{ selectedFileId, setSelectedFileId }}
          fileName={{ selectedFileName, setSelectedFileName }}
        />

        <div className="folderSearch">
          <IconButton
            aria-label="arrowBack"
            size="large"
            className="btnBackScroll"
            onClick={() => scroll(-5000)}
          >
            <ArrowBackIos fontSize="inherit" />
          </IconButton>
          <div className="folderScroll" ref={ref}>
            <div
              className="divFolderAdd"
              onClick={() => {
                setModalAddFolder(true);
              }}
            >
              <button className="btnFolderAdd">+</button>
            </div>
            {/* Aquí habrá que hacer bucle en base a los datos que recibamos de la query que selecciona carpetas del usuario */}
            {disk &&
              disk.folders.map((folder) => {
                return (
                  <p
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolderId(folder.id);
                      setSelectedFolderName(folder.name);
                    }}
                  >
                    {folder.name}
                  </p>
                );
              })}
          </div>
          <IconButton
            aria-label="arrowForward"
            size="large"
            className="btnForwardScroll"
            onClick={() => scroll(5000)}
          >
            <ArrowForwardIos fontSize="inherit" />
          </IconButton>
        </div>
        <div className="directory">
          <Breadcrumbs aria-label="breadcrumb">
            <Typography
              sx={{ color: "black", cursor: "pointer" }}
              onClick={() => {
                setSelectedFolderId("");
              }}
            >
              Disco
            </Typography>
            {selectedFolderId && (
              <Typography sx={{ color: "black" }}>
                {selectedFolderName}
              </Typography>
            )}
          </Breadcrumbs>
          {selectedFolderId && (
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
                onClick={() => setAlertMessage(true)}
              >
                <Delete fontSize="inherit" />
              </IconButton>
            </>
          )}
        </div>
        <div className="fileGallery">
          {/* Aquí se mostrarán todos los archivos de la carpeta seleccionada */}
          <ul className="fileList">
            {selectedFolderId
              ? disk &&
                disk.folders
                  .filter((folder) => {
                    return folder.id === selectedFolderId;
                  })[0]
                  .files.map((file) => {
                    return (
                      <li
                        key={file.id}
                        onClick={() => {
                          setSelectedFileId(file.id);
                          setSelectedFileName(file.name);
                          setModalViewFile(true);
                        }}
                      >
                        {file.name}
                      </li>
                    );
                  })
              : disk &&
                disk.files.map((file) => {
                  return (
                    <li
                      key={file.id}
                      onClick={() => {
                        setSelectedFileId(file.id);
                        setSelectedFileName(file.name);
                        setModalViewFile(true);
                      }}
                    >
                      {file.name}
                    </li>
                  );
                })}
          </ul>

          <Fab
            color="primary"
            aria-label="add"
            className="btnFileAdd"
            onClick={() => {
              setModalAddFile(true);
            }}
          >
            <Add />
          </Fab>
        </div>
        {error && (
          <Snackbar open={open} onClose={handleClose} autoHideDuration={4000}>
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Snackbar>
        )}
        {message && (
          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert severity="info" sx={{ width: "100%" }}>
              {message}
            </Alert>
          </Snackbar>
        )}
      </div>
    );
  }
}
export default Disk;
