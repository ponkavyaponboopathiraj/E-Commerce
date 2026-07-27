import { useState } from "react";
import { loginUser } from "../services/authService";

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const response = await loginUser(formData);

            console.log("Login Response:", response);

            // Save JWT Token
            localStorage.setItem(
                "token",
                response.token
            );

            setMessage("Login successful!");

        } catch (error) {

            console.error(error);

            if (error.response) {
                setMessage(
                    error.response.data.message ||
                    "Login failed"
                );
            } else {
                setMessage(
                    "Unable to connect to server"
                );
            }
        }
    };

    return (
        <div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">
                    Login
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

        </div>
    );
}

export default Login;