import { IconButton, Fab, Breadcrumbs, Modal, Typography } from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Add,
  Delete,
  Download,
  Cancel,
} from "@mui/icons-material";
import { useToken } from "../../TokenContext";
import { Navigate } from "react-router-dom";
import "./Disk.css";
import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/system";

function Disk() {
  const [token] = useToken();
  const [disk, setDisk] = useState(null);
  const [, setError] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [modalAddFolder, setModalAddFolder] = useState(false);
  const [modalAddFile, setModalAddFile] = useState(false);
  const [modalViewFile, setModalViewFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getUserDiskInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/disk", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const body = await res.json();

      const disk = body.data.space;
      console.log(disk);

      if (body.status === "error") {
        setError(body.message);
      }

      setDisk(disk);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const addFile = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    if (selectedFolder) {
      try {
        const uploadedFile = document.querySelector("#uploadedFile");
        const data = new FormData();
        data.append("uploadedFile", uploadedFile.files[0]);

        const res = await fetch(
          `http://localhost:4000/upload/${selectedFolder}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: data,
          }
        );

        const body = await res.json();

        if (body.status === "error") {
          setError(body.message);
        } else {
          setUpdate(!update);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
        setModalAddFile(false);
      }
    } else {
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

        if (body.status === "error") {
          setError(body.message);
        } else {
          setUpdate(!update);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
        setModalAddFile(false);
      }
    }
  };

  const addFolder = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
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

      if (body.status === "error") {
        setError(body.message);
      } else {
        setUpdate(!update);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setModalAddFolder(false);
      setUpdate(!update);
    }
  };

  const downloadFolder = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/download/folder/${selectedFolder}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const body = await res.blob();
      const url = window.URL.createObjectURL(body);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedFolder;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log(body);

      if (body.status === "error") {
        setError(body.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async () => {
    setError(null);
    setLoading(true);

    if (window.confirm("¿Deseas eliminar la carpeta?")) {
      try {
        const res = await fetch(
          `http://localhost:4000/folder/${selectedFolder}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
            },
          }
        );

        const body = await res.json();

        if (body.status === "error") {
          setError(body.message);
        } else {
          setUpdate(!update);
          setSelectedFolder("");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadFile = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/download/file/${selectedFile}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const body = await res.blob();
      const url = window.URL.createObjectURL(body);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      if (body.status === "error") {
        setError(body.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async () => {
    setError(null);
    setLoading(true);

    if (window.confirm("¿Deseas eliminar el archivo?")) {
      try {
        const res = await fetch(`http://localhost:4000/file/${selectedFile}`, {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        });

        const body = await res.json();

        if (body.status === "error") {
          setError(body.message);
        } else {
          setUpdate(!update);
          setSelectedFile("");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
        setModalViewFile(false);
      }
    }
  };

  const handleFolderModal = () => {
    setModalAddFolder(true);
  };

  const handleFileModal = () => {
    setModalAddFile(true);
  };

  const handleViewFileModal = () => {
    setModalViewFile(true);
  };

  const handleFolderModalClose = () => {
    setModalAddFolder(false);
  };
  const handleFileModalClose = () => {
    setModalAddFile(false);
  };

  const handleViewFileModalClose = () => {
    setModalViewFile(false);
  };

  const ref = useRef(null);
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

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
            <div className="divFolderAdd" onClick={handleFolderModal}>
              <button className="btnFolderAdd">+</button>
            </div>
            {/* Aquí habrá que hacer bucle en base a los datos que recibamos de la query que selecciona carpetas del usuario */}
            {disk &&
              disk.folders.map((folder) => {
                return (
                  <a
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolder(folder.id);
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
              onClick={handleFolderModalClose}
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
                setSelectedFolder("");
              }}
            >
              Disk
            </Typography>
            {selectedFolder && (
              <Typography sx={{ color: "black" }}>{selectedFolder}</Typography>
            )}
          </Breadcrumbs>
          {selectedFolder && (
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
            {selectedFolder
              ? disk &&
                disk.folders
                  .filter((folder) => {
                    return folder.id === selectedFolder;
                  })[0]
                  .files.map((file) => {
                    return (
                      <li
                        key={file.id}
                        onClick={() => {
                          setSelectedFile(file.id);
                          handleViewFileModal();
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
                        setSelectedFile(file.id);
                        handleViewFileModal();
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
                onClick={handleViewFileModalClose}
              >
                <Cancel sx={{ color: "red" }} />
              </Fab>
              <p>File Name:</p>
              <p>Upload Date:</p>
              <p>Size:</p>
              <div className="divBtnFile">
                <IconButton
                  aria-label="delete"
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
            onClick={handleFileModal}
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
                onClick={handleFileModalClose}
              >
                <Cancel sx={{ color: "red" }} />
              </Fab>
              <h6>./Disk{selectedFolder && `/${selectedFolder}`}</h6>
              <form className="addForm" onSubmit={addFile}>
                <input
                  id="uploadedFile"
                  name="uploadedFile"
                  type="file"
                  required
                />
                <button>{loading ? "Añadiendo..." : "Añadir"}</button>
              </form>
            </Box>
          </Modal>
        </div>
      </div>
    );
  }
}
export default Disk;
