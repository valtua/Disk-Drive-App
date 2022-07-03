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
    const [alignment, setAlignment] = useState('login');
    const [open, setOpen] = useState('login');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [biography, setBiography] = useState('');
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useToken();

    if (token) return <Navigate to="/disk" />;

    const handleChange = (event, newAlignment) => {
        if (alignment === 'login') {
            setAlignment(newAlignment || 'login');
        } else if (alignment === 'signup') {
            setAlignment(newAlignment || 'signup');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
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

            const body = await res.json();

            if (body.status === 'error') {
                setError(body.message);
            } else {
                setToken(body.data.token);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setEmail('');
            setPassword('');
            setLoading(false);
        }
    };
    const handleSignup = async (e) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const photo = document.querySelector('#photo');
            const data = new FormData();
            data.append('name', name);
            data.append('email', email);
            data.append('password', password);
            data.append('biography', biography);
            data.append('photo', photo.files[0]);

            const res = await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: data,
            });

            const body = await res.json();

            if (body.status === 'error') {
                setError(body.message);
            } else {
                setMessage(body.message);
                setAlignment('login');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setName('');
            setEmail('');
            setPassword('');
            setBiography('');
            setLoading(false);
        }
    };
    return (
        <div className="Home">
            <div className="formSelector">
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                >
                    <ToggleButton value="login">LOGIN</ToggleButton>
                    <ToggleButton value="signup">SIGN UP</ToggleButton>
                </ToggleButtonGroup>
                {alignment === 'login' && (
                    <form className="login" onSubmit={handleLogin}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password">Password:</label>
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
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label htmlFor="biography">Biography:</label>
                        <textarea
                            name="biography"
                            id="biography"
                            onChange={(e) => {
                                setBiography(e.target.value);
                            }}
                        />

                        <input type="file" id="photo" name="photo" />
                        <label htmlFor="photo">
                            <AddPhotoAlternate />
                            Profile Image
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
                    autoHideDuration={6000}
                >
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
            {message && (
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
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
