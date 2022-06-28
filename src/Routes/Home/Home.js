import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { useToken } from '../../TokenContext';
import './Home.css';

function Home() {
    const [alignment, setAlignment] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [biography, setBiography] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    //const [token, setToken] = useToken();
    const [, setToken] = useToken();

    //if (token) return <Navigate to="/disk" />;

    const handleChange = (event, newAlignment) => {
        if (alignment === 'login') {
            setAlignment(newAlignment || 'login');
        } else if (alignment === 'signup') {
            setAlignment(newAlignment || 'signup');
        }
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
            console.log(body);

            if (body.status === 'error') {
                setError(body.message);
            } else {
                setToken(body.data.token);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
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
                {alignment === 'login' ? (
                    <form className="login" onSubmit={handleLogin}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button disabled={loading} name="enviar">
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                ) : (
                    <form className="signup" onSubmit={handleSignup}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
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

                        <label htmlFor="photo">Profile Image:</label>
                        <input type="file" id="photo" name="photo" />
                        <button disabled={loading} name="enviar">
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                )}
                {error && <p className="Error">{error}</p>}
                {message && <p className="Success">{message}</p>}
            </div>
        </div>
    );
}

export default Home;
