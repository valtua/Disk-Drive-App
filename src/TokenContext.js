import { createContext, useContext, useState } from 'react';

// Creación del contexto
const TokenContext = createContext(null);

// Creación del componente para proveer los datos del contexto
export const TokenProvider = ({ children }) => {
    // Estado que almacenará el valor del token
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Guardamos el token en el local storage
    const setTokenInLocalStorage = (newToken) => {
        if (!newToken) {
            localStorage.removeItem('token');
        } else {
            localStorage.setItem('token', newToken);
        }

        // Añadimos valor al estado de token con el código recibido
        setToken(newToken);
    };

    return (
        <TokenContext.Provider value={[token, setTokenInLocalStorage]}>
            {children}
        </TokenContext.Provider>
    );
};

// Creación del hook para utilizar el contexto
export const useToken = () => {
    return useContext(TokenContext);
};
