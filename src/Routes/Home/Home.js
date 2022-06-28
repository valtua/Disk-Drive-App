import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import './Home.css';

function Home() {
    const [alignment, setAlignment] = useState('login');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };
    return (
        <div className="Home">
            <div className="formSelector">
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                >
                    <ToggleButton value="login">LOGIN</ToggleButton>
                    <ToggleButton value="signup">SIGN UP</ToggleButton>
                </ToggleButtonGroup>
                {alignment === 'login' ? (
                    <form className="login">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" />
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" />
                        <p>Forgot your password?</p>
                        <button name="enviar">Enviar</button>
                    </form>
                ) : (
                    <form className="signup">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" />

                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" />

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" />

                        <label htmlFor="biography">Biography</label>
                        <textarea name="biography" />

                        <label htmlFor="image">Profile Image</label>
                        <input type="file" name="image" />
                        <button name="enviar">Enviar</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Home;
