import { createContext, useContext, useState } from 'react';

// Creación del contexto
const UpdateContext = createContext(null);

// Creación del componente para proveer los datos del contexto
export const UpdateProvider = ({ children }) => {
    // Estado que almacenará el valor del token
    const [update, setUpdate] = useState(false);

    // Guardamos el token en el local storage

    return (
        <UpdateContext.Provider value={[update, setUpdate]}>
            {children}
        </UpdateContext.Provider>
    );
};

// Creación del hook para utilizar el contexto
export const useUpdate = () => {
    return useContext(UpdateContext);
};
