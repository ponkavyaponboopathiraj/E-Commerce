import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../service/authService";
import "./Auth.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response = await loginUser(formData);

            console.log("Login Response:", response);

            // Save JWT Token
            localStorage.setItem("token", response.token);

            // Save role if backend sends role
            if (response.role) {
                localStorage.setItem("role", response.role);
            }

            setMessage("Login successful!");

            // Navigate after login
            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {

            console.error("Login Error:", error);

            if (error.response) {

                setMessage(
                    error.response.data.message ||
                    "Invalid email or password"
                );

            } else {

                setMessage(
                    "Unable to connect to server"
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-container">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>Welcome Back</h1>

                    <p>
                        Login to your E-Cart account
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>

                {message && (

                    <p className="auth-message">
                        {message}
                    </p>

                )}

                <div className="auth-footer">

                    <p>
                        Don't have an account?
                    </p>

                    <Link to="/register">
                        Create an account
                    </Link>

                </div>

            </div>

        </div>

    );
}

export default Login;