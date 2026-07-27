import api from "./api";

// Register User
export const registerUser = async (registerData) => {
    const response = await api.post(
        "/api/auth/register",
        registerData
    );

    return response.data;
};

// Login User
export const loginUser = async (loginData) => {
    const response = await api.post(
        "/api/auth/login",
        loginData
    );

    return response.data;
};