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

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
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

            localStorage.setItem(
                "token",
                response.token
            );

            const userRole =
                response.role?.toUpperCase();

            if (userRole) {

                localStorage.setItem(
                    "role",
                    userRole
                );
            }

            localStorage.setItem(
                "email",
                formData.email
            );

            setMessage(
                "Login successful! Welcome back 🎉"
            );

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

        <div className="auth-page">

            {/* LEFT BRAND SECTION */}

            <div className="auth-brand-panel">

                <div className="brand-decoration decoration-one">
                    ✨
                </div>

                <div className="brand-decoration decoration-two">
                    🛍️
                </div>

                <div className="brand-decoration decoration-three">
                    💜
                </div>


                <div className="brand-content">

                    <div className="brand-logo">
                        🛍️
                    </div>

                    <h1>
                        E-Cart
                    </h1>

                    <h2>
                        Shop smarter.
                        <br />
                        Live better.
                    </h2>

                    <p>
                        Discover products you love,
                        enjoy secure shopping and
                        experience effortless delivery.
                    </p>


                    <div className="brand-features">

                        <div className="brand-feature">
                            <span>🚚</span>
                            <div>
                                <strong>
                                    Fast Delivery
                                </strong>
                                <small>
                                    Delivered to your doorstep
                                </small>
                            </div>
                        </div>


                        <div className="brand-feature">
                            <span>🔒</span>
                            <div>
                                <strong>
                                    Secure Shopping
                                </strong>
                                <small>
                                    Your data is always protected
                                </small>
                            </div>
                        </div>


                        <div className="brand-feature">
                            <span>⭐</span>
                            <div>
                                <strong>
                                    Quality Products
                                </strong>
                                <small>
                                    Shop with confidence
                                </small>
                            </div>
                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT LOGIN SECTION */}

            <div className="auth-form-panel">

                <div className="auth-card">

                    <div className="mobile-brand">
                        🛍️ E-Cart
                    </div>


                    <div className="auth-header">

                        <span className="auth-eyebrow">
                            Welcome back
                        </span>

                        <h1>
                            Sign in to your account
                        </h1>

                        <p>
                            Enter your details to continue
                            shopping with E-Cart.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span>
                                    ✉️
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span>
                                    🔐
                                </span>

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


                        <div className="login-options">

                            <label className="remember-me">

                                <input
                                    type="checkbox"
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>

                            <Link
                                to="/forgot-password"
                                className="forgot-password"
                            >
                                Forgot password?
                            </Link>

                        </div>


                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


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


                    <div className="auth-divider">
                        <span>New to E-Cart?</span>
                    </div>


                    <Link
                        to="/register"
                        className="secondary-button"
                    >
                        Create an account
                    </Link>


                    <div className="secure-login">

                        🔒

                        <span>
                            Secure and encrypted login
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;