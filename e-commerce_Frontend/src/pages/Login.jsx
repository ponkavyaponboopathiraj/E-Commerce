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
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });

        setMessage("");
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response = await loginUser(formData);

            console.log("Login Response:", response);

            // =========================================
            // SAVE JWT TOKEN
            // =========================================

            localStorage.setItem(
                "token",
                response.token
            );

            // =========================================
            // GET ROLE
            // =========================================

            const userRole = response.role?.toUpperCase();

            if (userRole) {

                localStorage.setItem(
                    "role",
                    userRole
                );
            }

            // =========================================
            // SAVE USER EMAIL
            // =========================================

            localStorage.setItem(
                "email",
                formData.email
            );

            // =========================================
            // SUCCESS MESSAGE
            // =========================================

            setMessage(
                "Login successful! Welcome back 🎉"
            );

            // =========================================
            // ROLE BASED REDIRECTION
            // =========================================

            setTimeout(() => {

                if (userRole === "ADMIN") {

                    navigate("/admin-dashboard");

                } else if (userRole === "SELLER") {

                    navigate("/seller-dashboard");

                } else {

                    navigate("/customer-dashboard");
                }

            }, 1000);

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

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

        <div className="auth-container login-page">

            {/* =========================================
                LEFT SIDE - E-CART BRANDING
            ========================================= */}

            <div className="auth-visual">

                <div className="visual-content">

                    <div className="brand-logo">
                        🛍️
                    </div>

                    <h1>
                        Welcome to
                        <span> E-Cart</span>
                    </h1>

                    <p>
                        Your world of shopping,
                        delivered to your doorstep.
                    </p>

                    <div className="shopping-features">

                        <div className="feature-item">
                            <span>🚚</span>
                            <p>Fast & Secure Delivery</p>
                        </div>

                        <div className="feature-item">
                            <span>💳</span>
                            <p>Safe & Easy Payments</p>
                        </div>

                        <div className="feature-item">
                            <span>⭐</span>
                            <p>Quality Products</p>
                        </div>

                    </div>

                </div>

                <div className="floating-shape shape-one">
                    🛒
                </div>

                <div className="floating-shape shape-two">
                    📦
                </div>

                <div className="floating-shape shape-three">
                    ❤️
                </div>

            </div>


            {/* =========================================
                RIGHT SIDE - LOGIN FORM
            ========================================= */}

            <div className="auth-form-section">

                <div className="auth-card">

                    <div className="auth-header">

                        <div className="mobile-logo">
                            🛍️ E-Cart
                        </div>

                        <h1>
                            Welcome Back 👋
                        </h1>

                        <p>
                            Login to continue your shopping journey
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                📧 Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label>
                                🔐 Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁️"
                                    }
                                </button>

                            </div>

                        </div>


                        {/* FORGOT PASSWORD */}

                        <div className="login-options">

                            <label className="remember-me">

                                <input
                                    type="checkbox"
                                />

                                Remember me

                            </label>

                            <Link
                                to="/forgot-password"
                                className="forgot-password"
                            >
                                Forgot Password?
                            </Link>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="auth-button login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="spinner"></span>
                                    Signing you in...
                                </>

                            ) : (

                                <>
                                    Login to E-Cart →
                                </>

                            )}

                        </button>

                    </form>


                    {/* MESSAGE */}

                    {message && (

                        <div
                            className={
                                message.includes("successful")
                                    ? "auth-message success-message"
                                    : "auth-message error-message"
                            }
                        >

                            {message}

                        </div>

                    )}


                    {/* REGISTER */}

                    <div className="auth-footer">

                        <p>
                            New to E-Cart?
                        </p>

                        <Link to="/register">
                            Create your account →
                        </Link>

                    </div>


                    {/* SECURITY */}

                    <div className="secure-login">

                        🔒
                        <span>
                            Your information is securely protected
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;