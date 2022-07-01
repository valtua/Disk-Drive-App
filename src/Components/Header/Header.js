import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import './Header.css';

function Header() {
    const [token] = useToken();
    const [error, setError] = useState(null);
    const [photo, setPhoto] = useState(null);

    const getUserInfo = async () => {
        try {
            const res = await fetch('http://localhost:4000/user', {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            });

            const body = await res.json();

            const user = body.data.user;

            if (body.status === 'error') {
                setError(body.message);
            }
            setPhoto(user.photo);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);
    return (
        <>
            {!token && (
                <header>
                    <NavLink to="/">
                        <h1>DISK DRIVE</h1>
                    </NavLink>
                </header>
            )}
            {token && (
                <header className="tokenHeader">
                    <NavLink to="/">
                        <h1>DISK DRIVE</h1>
                    </NavLink>
                    <Avatar
                     sx={{ width:"6vh", height:"6vh", fontSize:"4vh", bgcolor: "green"}}
                        alt="Profile photo"
                        src={`http://localhost:4000/${photo}`}
                    />
                </header>
            )}
        </>
    );
}

export default Header;
