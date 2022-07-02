import { AddPhotoAlternate, Create, Logout } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [modify, setModify] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [biography, setBiography] = useState('');
    const [loading, setLoading] = useState(false);

    const [token, setToken] = useToken();

    const getUserInfo = async () => {
        try {
            const res = await fetch('http://localhost:4000/user', {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            });

            const body = await res.json();

            const userInfo = body.data.user;

            if (body.status === 'error') {
                setError(body.message);
            } else {
                setUser(userInfo);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const handleModify = () => {
        setModify(true);
    };

    const handleSubmit = async (e) => {};

    useEffect(() => {
        getUserInfo();
    }, []);
    console.log(user);
    if (!token) {
        return <Navigate to="/" />;
    } else {
        return (
            <div className="Profile">
                {user && (
                    <div className="ProfileCard">
                        {modify ? (
                            <>
                                <Avatar
                                    sx={{
                                        width: '20vh',
                                        height: '20vh',
                                        fontSize: '4vh',
                                        bgcolor: 'green',
                                    }}
                                    alt="Profile photo"
                                    src={`http://localhost:4000/${user.photo}`}
                                />
                                <form
                                    className="modifyInfo"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                    />
                                    <label
                                        htmlFor="photo"
                                        className="photoLabel"
                                    >
                                        <AddPhotoAlternate />
                                        Profile Image
                                    </label>
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder={user.name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                    <label htmlFor="biography">
                                        Biography:
                                    </label>
                                    <textarea
                                        name="biography"
                                        id="biography"
                                        placeholder={
                                            user.biography ||
                                            'Write a biography'
                                        }
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
                                        required
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />

                                    <button disabled={loading} name="enviar">
                                        {loading ? 'Enviando...' : 'Enviar'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Avatar
                                    sx={{
                                        width: '20vh',
                                        height: '20vh',
                                        fontSize: '4vh',
                                        bgcolor: 'green',
                                    }}
                                    alt="Profile photo"
                                    src={`http://localhost:4000/${user.photo}`}
                                />
                                <h2>{user.name}</h2>
                                <p>
                                    {user.biography === ''
                                        ? 'Write a biography'
                                        : user.biography}
                                </p>
                                <p>
                                    Joined{' '}
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </p>
                                <p>Email: {user.email}</p>
                                <button
                                    className="Modify"
                                    onClick={handleModify}
                                >
                                    <Create fontSize="small" />
                                    Modify
                                </button>
                                <button
                                    className="Logout"
                                    onClick={() => setToken(null)}
                                >
                                    <Logout fontSize="small" />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default Profile;
