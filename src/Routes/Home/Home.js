import { AddPhotoAlternate } from '@mui/icons-material';
import {
    Alert,
    Snackbar,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import './Home.css';

function Home() {
    // Declaraciones de useState para el cambio de formulario (Login/SignUp) y los mensajes emergentes (open/setOpen)
    const [alignment, setAlignment] = useState('login');
    const [open, setOpen] = useState(false);

    // UseState de datos del formulario de SignUp
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [biography, setBiography] = useState('');
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useToken();

    // Si estamos logueados, nos redirecciona a la página del disco
    if (token) return <Navigate to="/disk" />;

    // Función que maneja el cambio de un formulario a otro
    const handleChange = (event, newAlignment) => {
        // Si el valor que recibimos es login, cambiamos a ese formulario
        if (alignment === 'login') {
            setAlignment(newAlignment || 'login');
            // Si el valor que recibimos es signup, cambiamos a ese formulario
        } else if (alignment === 'signup') {
            setAlignment(newAlignment || 'signup');
        }
    };

    // Función que gestiona el cierre de los mensajes emergentes
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setMessage(null);
        setError(null);
    };

    // Función que maneja los datos del login
    const handleLogin = async (e) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            // Fetch a funcionalidad de login, pasamos los datos necesarios en el body (email y password)
            const res = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            // Almacenamos los datos json
            const body = await res.json();
            // Lanzamos un error en caso de que no recibamos los datos
            if (body.status === 'error') {
                setError(body.message);
            } else {
                // En caso contrario, cogemos el token recibido del login
                setToken(body.data.token);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            setOpen(true);
        } finally {
            // Email y password pasan a estar vacíos
            setEmail('');
            setPassword('');
            setLoading(false);
        }
    };
    // Función que maneja los datos del SignUp
    const handleSignup = async (e) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            // Almacenamos los datos en variables que utilizaremos para su envío
            const photo = document.querySelector('#photo');
            const data = new FormData();
            data.append('name', name);
            data.append('email', email);
            data.append('password', password);
            data.append('biography', biography);
            data.append('photo', photo.files[0]);

            // Fetch a funcionalidad de registro, pasamos los datos necesarios en el body (almacenado en data anteriormente)
            const res = await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: data,
            });

            // Almacenamos los datos json
            const body = await res.json();

            // Lanzamos un error en caso de que no recibamos los datos
            if (body.status === 'error') {
                setError(body.message);
            } else {
                // Mandamos un mensaje al usuario tras el registro y cambiamos al apartado de login
                setMessage(body.message);
                setAlignment('login');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            // El estado de los mensajes (setOpen) pasa a ser true y la carga está finalizada
            setOpen(true);
            setLoading(false);
        }
    };
    return (
        <div className="Home">
            <div className="formSelector">
                <div className="selectorButtons">
                    <ToggleButtonGroup
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                    >
                        <ToggleButton value="login">LOGIN</ToggleButton>
                        <ToggleButton value="signup">SIGN UP</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {alignment === 'login' && (
                    <form className="login" onSubmit={handleLogin}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button disabled={loading} name="enviar">
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                )}
                {alignment === 'signup' && (
                    <form className="signup" onSubmit={handleSignup}>
                        <label htmlFor="name">Nombre*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            maxLength={20}
                            required
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            maxLength={100}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Contraseña*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            maxLength={100}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label htmlFor="biography">Biografía</label>
                        <textarea
                            name="biography"
                            id="biography"
                            maxLength={150}
                            onChange={(e) => {
                                setBiography(e.target.value);
                            }}
                        />

                        <input type="file" id="photo" name="photo" />
                        <label htmlFor="photo">
                            <AddPhotoAlternate />
                            Imagen de perfil
                        </label>
                        <button disabled={loading} name="enviar">
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                )}
            </div>
            {error && (
                <Snackbar
                    open={open}
                    onClose={handleClose}
                    autoHideDuration={4000}
                >
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
            {message && (
                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    onClose={handleClose}
                >
                    <Alert severity="info" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
        </div>
    );
}

export default Home;
