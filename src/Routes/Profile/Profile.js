import {
  AddPhotoAlternate,
  ArrowBack,
  Cancel,
  Create,
  Logout,
} from "@mui/icons-material";
import { Alert, Avatar, Box, Fab, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { useToken } from "../../TokenContext";
import "./Profile.css";

function Profile() {
  // Declaraciones de useState donde manejamos el usuario, errores y mensajes...
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [modify, setModify] = useState(false);
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  // Declaraciones de useState donde manejamos los datos del usuario y la carga de las acciones
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [biography, setBiography] = useState("");
  const [loading, setLoading] = useState(false);

  // Declaración del useToken, donde manejamos el token
  const [token, setToken] = useToken();

  // Función que recoge información del usuario
  const getUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/user", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      // Almacenamos los datos json
      const body = await res.json();
      // Almacenamos los datos recibidos
      const userInfo = body.data.user;
      // Lanzamos un error en caso de que no recibamos los datos
      if (body.status === "error") {
        setError(body.message);
      } else {
        // En caso contrario, pasamos la información
        setUser(userInfo);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Función que gestiona el cierre de los mensajes emergentes
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setMessage(null);
    setError(null);
  };

  // Función que maneja la modificación de datos
  const handleModify = () => {
    setModify(true);
  };

  // Función que maneja el envío de modificación de datos
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      // Almacenamos los datos que el usuario ha cambiado
      const uploadedPhoto = document.querySelector("#photo");
      const data = new FormData();
      name !== "" && data.append("name", name);
      email !== "" && data.append("email", email);
      biography !== "" && data.append("biography", biography);
      uploadedPhoto && data.append("photo", uploadedPhoto.files[0]);

      // Realizamos la petición para actualizar los datos modificados
      const res = await fetch("http://localhost:4000/user", {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: data,
      });

      // Almacenamos los datos json
      const body = await res.json();
      // Lanzamos un error en caso de que no recibamos los datos
      if (body.status === "error") {
        setError(body.message);
      } else {
        // En caso contrario, mandamos un mensaje al usuario
        setMessage(body.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      // La carga termina, el mensaje aparece, y actualizamos para que se reflejen los cambios
      setLoading(false);
      setOpen(true);
      setModify(false);
      setOpen(true);
      setUpdate(!update);
    }
  };

  // Utilización del hook useEffect que hará uso, cada vez que cambie el valor del estado 'update', de la función getUserDiskInfo
  useEffect(() => {
    getUserInfo();
  }, [update]);

  if (!token) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="Profile">
        <NavLink to="/disk" className="linkToDisk">
          <ArrowBack fontSize="inherit" />
          <h3>Disco</h3>
        </NavLink>
        {user && (
          <div className="ProfileCard">
            {modify ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "2vh",
                  position: "relative",
                  borderRadius: "1vh",
                }}
              >
                <Fab
                  aria-label="close"
                  className="btnCloseProfile"
                  onClick={() => {
                    setModify(false);
                  }}
                >
                  <Cancel sx={{ color: "red" }} />
                </Fab>
                <Avatar
                  sx={{
                    width: "20vh",
                    height: "20vh",
                    fontSize: "4vh",
                    bgcolor: "green",
                  }}
                  alt="Profile photo"
                  src={`http://localhost:4000/${user.photo}`}
                />
                <form className="modifyInfo" onSubmit={handleSubmit}>
                  <input type="file" id="photo" name="photo" />
                  <label htmlFor="photo" className="photoLabel">
                    <AddPhotoAlternate />
                    Imagen de perfil
                  </label>
                  <label htmlFor="name">Nombre:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={user.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="biography">Biografía:</label>
                  <textarea
                    name="biography"
                    id="biography"
                    placeholder={user.biography || "Escribe una biografía"}
                    onChange={(e) => {
                      setBiography(e.target.value);
                    }}
                  />

                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={user.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <button disabled={loading} name="enviar">
                    {loading ? "Enviando..." : "Enviar"}
                  </button>
                </form>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "2vh",
                  position: "relative",
                  borderRadius: "1vh",
                }}
              >
                <Avatar
                  sx={{
                    width: "20vh",
                    height: "20vh",
                    fontSize: "4vh",
                    bgcolor: "green",
                  }}
                  alt="Profile photo"
                  src={`http://localhost:4000/${user.photo}`}
                />

                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p className="biography">
                  {user.biography === ""
                    ? "Escribe una biografía"
                    : user.biography}
                </p>
                <p>
                  Fecha de creación{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <button className="Modify" onClick={handleModify}>
                  <Create fontSize="small" />
                  Modificar
                </button>
                <button className="Logout" onClick={() => setToken(null)}>
                  <Logout fontSize="small" />
                  Logout
                </button>
              </Box>
            )}
          </div>
        )}
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

export default Profile;
