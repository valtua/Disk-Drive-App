import {
  IconButton,
  Fab,
  Breadcrumbs,
  Modal,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Add,
  Delete,
  Download,
  Cancel,
  UploadFile,
} from "@mui/icons-material";
import { useToken } from "../../TokenContext";
import { Navigate } from "react-router-dom";
import "./Disk.css";
import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/system";

function Disk() {
  // Declaraciones de useToken y useState
  const [token] = useToken();
  const [disk, setDisk] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  // Declaración de useState que usaremos para manejar nombre/id de carpetas y archivos, además de la visualización de los Modales
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedFolderName, setSelectedFolderName] = useState("");
  const [selectedFileId, setSelectedFileId] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [modalAddFolder, setModalAddFolder] = useState(false);
  const [modalAddFile, setModalAddFile] = useState(false);
  const [modalViewFile, setModalViewFile] = useState(false);

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

  // Función para agregar un archivo, dentro de una carpeta, o en la raíz
  const addFile = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    // Si tenemos seleccionada una carpeta, el archivo se subirá ahí
    if (selectedFolderId) {
      try {
        const uploadedFile = document.querySelector("#uploadedFile");
        const data = new FormData();
        data.append("uploadedFile", uploadedFile.files[0]);

        // Realizamos el post de los datos, con el token de seguridad y los datos en el body
        const res = await fetch(
          `http://localhost:4000/upload/${selectedFolderId}`,
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
          setError(body.message);
        } else {
          // Mandamos un mensaje al usuario confirmando que se ha subido correctamente y updateamos para que se vean los cambios reflejados
          setMessage(body.message);
          setUpdate(!update);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        // Tras finalizar todo, la carga termina, el mensaje (setOpen) aparece, y el Modal de subir archivo se cierra
        setLoading(false);
        setOpen(true);
        setModalAddFile(false);
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
          setError(body.message);
        } else {
          // Mandamos un mensaje al usuario confirmando que se ha subido correctamente y updateamos para que se vean los cambios reflejados
          setMessage(body.message);
          setUpdate(!update);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        // Tras finalizar todo, la carga termina, el mensaje (setOpen) aparece, y el Modal de subir archivo se cierra
        setLoading(false);
        setOpen(true);
        setModalAddFile(false);
      }
    }
  };

  // Función para añadir una carpeta
  const addFolder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
        setError(body.message);
      } else {
        // Mandamos un mensaje al usuario confirmando que se ha subido correctamente y updateamos para que se vean los cambios reflejados
        setMessage(body.message);
        setUpdate(!update);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      // Tras finalizar todo, la carga termina, el mensaje (setOpen) aparece, y el Modal de subir carpeta se cierra
      setLoading(false);
      setOpen(true);
      setModalAddFolder(false);
      setUpdate(!update);
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

  // Función para eliminar una carpeta
  const deleteFolder = async () => {
    setError(null);
    setLoading(true);

    // Abrimos una ventana para que el usuario confirme la eliminación
    if (window.confirm("¿Deseas eliminar la carpeta?")) {
      try {
        // Realizamos la petición, con el token de seguridad. Utilizamos la id de la carpeta a eliminar
        const res = await fetch(
          `http://localhost:4000/folder/${selectedFolderId}`,
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
          setError(body.message);
        } else {
          // Se muestra el mensaje, se lanza update para ver los cambios reflejados y como no existe ya esa carpeta, el valor pasa a ser vacío
          setMessage(body.message);
          setUpdate(!update);
          setSelectedFolderId("");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        // Tras finalizar todo, la carga termina, el mensaje aparece (setOpen)
        setLoading(false);
        setOpen(true);
      }
    }
  };

  // Función para descargar un archivo
  const downloadFile = async () => {
    setError(null);
    setLoading(true);

    try {
      // Realizamos la petición, con el token de seguridad. Utilizamos la id del archivo a descargar
      const res = await fetch(
        `http://localhost:4000/download/file/${selectedFileId}`,
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
      link.download = selectedFileName;
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

  // Función que elimina un archivo
  const deleteFile = async () => {
    setError(null);
    setLoading(true);

    // Abrimos una ventana para que el usuario confirme la eliminación
    if (window.confirm("¿Deseas eliminar el archivo?")) {
      try {
        // Realizamos la petición, con el token de seguridad. Utilizamos la id del archivo a eliminar
        const res = await fetch(
          `http://localhost:4000/file/${selectedFileId}`,
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
          setError(body.message);
        } else {
          // Se muestra el mensaje, se lanza update para ver los cambios reflejados y como no existe ya ese archivo, el valor pasa a ser vacío
          setMessage(body.message);
          setUpdate(!update);
          setSelectedFileId("");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        // Tras finalizar todo, la carga termina, el mensaje aparece (setOpen) y el Modal que visualiza el archivo seleccionado se cierra
        setLoading(false);
        setOpen(true);
        setModalViewFile(false);
      }
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
        <div className="folderSearch">
          <IconButton
            aria-label="arrowBack"
            size="large"
            className="btnBackScroll"
            onClick={() => scroll(-5000)}
          >
            <ArrowBack fontSize="inherit" />
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
                  <a
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolderId(folder.id);
                      setSelectedFolderName(folder.name);
                    }}
                  >
                    {folder.name}
                  </a>
                );
              })}
          </div>
          <IconButton
            aria-label="arrowForward"
            size="large"
            className="btnForwardScroll"
            onClick={() => scroll(5000)}
          >
            <ArrowForward fontSize="inherit" />
          </IconButton>
        </div>
        <Modal
          open={modalAddFolder}
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
                setModalAddFolder(false);
              }}
            >
              <Cancel sx={{ color: "red" }} />
            </Fab>
            <form className="addForm" onSubmit={addFolder}>
              <label htmlFor="folder">Nombre de carpeta</label>
              <input
                id="folder"
                name="folder"
                type="text"
                placeholder="Mi-Carpeta"
                required
              />
              <button>{loading ? "Añadiendo..." : "Añadir"}</button>
            </form>
          </Box>
        </Modal>
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
                onClick={deleteFolder}
              >
                <Delete fontSize="inherit" />
              </IconButton>
            </>
          )}
        </div>
        <Fab color="primary" aria-label="add" className="btnFileAdd">
          <Add />
        </Fab>
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

          <Modal
            open={modalViewFile}
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
                  setModalViewFile(false);
                }}
              >
                <Cancel sx={{ color: "red" }} />
              </Fab>
              <label className="fileData">
                Nombre de archivo: {selectedFileName}{" "}
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
                  onClick={deleteFile}
                >
                  <Delete fontSize="inherit" />
                </IconButton>
              </div>
            </Box>
          </Modal>

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

          <Modal
            open={modalAddFile}
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
                  setModalAddFile(false);
                }}
              >
                <Cancel sx={{ color: "red" }} />
              </Fab>
              <h6>
                ./Disk
                {selectedFolderId && `/${selectedFolderName}`}
              </h6>
              <form className="addForm" onSubmit={addFile}>
                <input
                  id="uploadedFile"
                  name="uploadedFile"
                  type="file"
                  required
                />
                <label htmlFor="uploadedFile">
                  <UploadFile />
                  Seleccionar archivo
                </label>
                <button>{loading ? "Añadiendo..." : "Añadir"}</button>
              </form>
            </Box>
          </Modal>
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
