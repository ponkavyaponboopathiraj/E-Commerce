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

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        setMessage("");
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response = await loginUser(formData);

            console.log("Login Response:", response);

            // Save JWT
            localStorage.setItem(
                "token",
                response.token
            );

            // Get user role
            const userRole =
                response.role?.toUpperCase();

            // Save role
            if (userRole) {

                localStorage.setItem(
                    "role",
                    userRole
                );
            }

            // Save email
            localStorage.setItem(
                "email",
                formData.email
            );

            setMessage(
                "Login successful! Welcome back 🎉"
            );

            // Role based navigation
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
                    error.response.data?.message ||
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

        <div className="login-page">

            {/* =================================
                DECORATIVE BACKGROUND
            ================================= */}

            <div className="background-decoration decoration-one"></div>

            <div className="background-decoration decoration-two"></div>

            <div className="background-decoration decoration-three"></div>


            {/* =================================
                LEFT BRANDING SECTION
            ================================= */}

            <section className="login-visual">

                <div className="visual-overlay"></div>

                <div className="visual-content">

                    <div className="brand-logo-wrapper">

                        <div className="brand-logo">
                            🛍️
                        </div>

                        <span>
                            E-Cart
                        </span>

                    </div>


                    <div className="visual-text">

                        <span className="welcome-badge">
                            ✨ Welcome Back
                        </span>

                        <h1>
                            Your shopping
                            <br />

                            <span>
                                journey starts here.
                            </span>
                        </h1>

                        <p>
                            Discover amazing products,
                            explore new collections,
                            and enjoy a seamless
                            shopping experience with E-Cart.
                        </p>

                    </div>


                    {/* FEATURE CARDS */}

                    <div className="shopping-features">

                        <div className="feature-item">

                            <div className="feature-icon">
                                🚚
                            </div>

                            <div>
                                <strong>
                                    Fast Delivery
                                </strong>

                                <span>
                                    Quick & reliable shipping
                                </span>
                            </div>

                        </div>


                        <div className="feature-item">

                            <div className="feature-icon">
                                🔒
                            </div>

                            <div>
                                <strong>
                                    Secure Shopping
                                </strong>

                                <span>
                                    Your data is always protected
                                </span>
                            </div>

                        </div>


                        <div className="feature-item">

                            <div className="feature-icon">
                                ⭐
                            </div>

                            <div>
                                <strong>
                                    Premium Quality
                                </strong>

                                <span>
                                    Products you'll love
                                </span>
                            </div>

                        </div>

                    </div>

                </div>


                {/* FLOATING DECORATIONS */}

                <div className="floating-card floating-card-one">

                    🛒

                    <span>
                        Shop
                    </span>

                </div>


                <div className="floating-card floating-card-two">

                    📦

                    <span>
                        Delivered
                    </span>

                </div>


                <div className="floating-card floating-card-three">

                    ❤️

                </div>

            </section>


            {/* =================================
                RIGHT LOGIN SECTION
            ================================= */}

            <section className="login-form-section">

                <div className="login-card">

                    {/* MOBILE BRAND */}

                    <div className="mobile-brand">

                        <div className="mobile-brand-icon">
                            🛍️
                        </div>

                        <span>
                            E-Cart
                        </span>

                    </div>


                    {/* HEADER */}

                    <div className="login-header">

                        <span className="login-small-title">
                            ACCOUNT LOGIN
                        </span>

                        <h2>
                            Welcome back 👋
                        </h2>

                        <p>
                            Sign in to continue your
                            shopping experience.
                        </p>

                    </div>


                    {/* LOGIN FORM */}

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div className="input-group">

                            <label>
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉️
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="input-group">

                            <div className="password-label-row">

                                <label>
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="forgot-link"
                                >
                                    Forgot password?
                                </Link>

                            </div>


                            <div className="input-wrapper">

                                <span className="input-icon">
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
                                            (previous) =>
                                                !previous
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


                        {/* REMEMBER ME */}

                        <label className="remember-row">

                            <input
                                type="checkbox"
                            />

                            <span>
                                Remember me
                            </span>

                        </label>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <span className="spinner"></span>

                                    Signing you in...

                                </>

                            ) : (

                                <>

                                    <span>
                                        Login to E-Cart
                                    </span>

                                    <span className="button-arrow">
                                        →
                                    </span>

                                </>

                            )}

                        </button>

                    </form>


                    {/* MESSAGE */}

                    {message && (

                        <div
                            className={
                                message.includes(
                                    "successful"
                                )
                                    ? "login-message success"
                                    : "login-message error"
                            }
                        >

                            <span>
                                {message.includes(
                                    "successful"
                                )
                                    ? "✓"
                                    : "!"
                                }
                            </span>

                            {message}

                        </div>

                    )}


                    {/* REGISTER */}

                    <div className="register-section">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create Account
                            <span> →</span>
                        </Link>

                    </div>


                    {/* SECURITY */}

                    <div className="security-info">

                        <span>
                            🛡️
                        </span>

                        <div>

                            <strong>
                                Secure Login
                            </strong>

                            <p>
                                Your information is encrypted
                                and protected.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Login;