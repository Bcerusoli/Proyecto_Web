


export const getToken = () => {
    return localStorage.getItem('token');
};


export const estaAutenticado = () => {
    return !!getToken();
};