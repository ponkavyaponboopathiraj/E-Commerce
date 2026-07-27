import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../service/authService";
import "./Auth.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "CUSTOMER",
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


    const handleRoleSelect = (role) => {

        setFormData({
            ...formData,
            role: role,
        });

        setMessage("");
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            console.log(
                "Register Request:",
                formData
            );

            const response =
                await registerUser(formData);

            console.log(
                "Register Response:",
                response
            );

            setMessage(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            if (error.response) {

                setMessage(
                    error.response.data.message ||
                    "Registration failed"
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

        <div className="auth-page register-page">

            {/* LEFT BRAND PANEL */}

            <div className="auth-brand-panel register-brand-panel">

                <div className="brand-decoration decoration-one">
                    ✨
                </div>

                <div className="brand-decoration decoration-two">
                    🏪
                </div>

                <div className="brand-decoration decoration-three">
                    🚀
                </div>


                <div className="brand-content">

                    <div className="brand-logo">
                        🛍️
                    </div>

                    <h1>
                        E-Cart
                    </h1>

                    <h2>
                        Your journey
                        <br />
                        starts here.
                    </h2>

                    <p>
                        Create your account and
                        unlock a world of shopping,
                        selling and endless possibilities.
                    </p>


                    <div className="brand-features">

                        <div className="brand-feature">
                            <span>🛍️</span>

                            <div>
                                <strong>
                                    Shop Everything
                                </strong>

                                <small>
                                    Discover products you love
                                </small>
                            </div>

                        </div>


                        <div className="brand-feature">
                            <span>🏪</span>

                            <div>
                                <strong>
                                    Grow Your Business
                                </strong>

                                <small>
                                    Sell products with E-Cart
                                </small>
                            </div>

                        </div>


                        <div className="brand-feature">
                            <span>💜</span>

                            <div>
                                <strong>
                                    Simple Experience
                                </strong>

                                <small>
                                    Easy, fast and secure
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT REGISTER PANEL */}

            <div className="auth-form-panel">

                <div className="auth-card register-card">

                    <div className="mobile-brand">
                        🛍️ E-Cart
                    </div>


                    <div className="auth-header">

                        <span className="auth-eyebrow">
                            Get started
                        </span>

                        <h1>
                            Create your account
                        </h1>

                        <p>
                            Join E-Cart and start your
                            shopping journey today.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* NAME */}

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


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


                        {/* PHONE */}

                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <div className="input-wrapper">

                                <span>
                                    📱
                                </span>

                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Enter phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
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
                                    placeholder="Create a strong password"
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


                        {/* ACCOUNT TYPE */}

                        <div className="role-section">

                            <div className="role-title">

                                <h3>
                                    Choose your account type
                                </h3>

                                <p>
                                    How do you want to use E-Cart?
                                </p>

                            </div>


                            <div className="role-options">

                                {/* CUSTOMER */}

                                <button
                                    type="button"
                                    className={
                                        formData.role === "CUSTOMER"
                                            ? "role-card active customer-role"
                                            : "role-card"
                                    }
                                    onClick={() =>
                                        handleRoleSelect(
                                            "CUSTOMER"
                                        )
                                    }
                                >

                                    <span className="role-icon">
                                        🛍️
                                    </span>

                                    <span className="role-content">

                                        <strong>
                                            Customer
                                        </strong>

                                        <small>
                                            Shop products,
                                            discover new items
                                            and enjoy easy delivery.
                                        </small>

                                    </span>

                                    <span className="role-check">

                                        {formData.role === "CUSTOMER"
                                            ? "✓"
                                            : ""
                                        }

                                    </span>

                                </button>


                                {/* SELLER */}

                                <button
                                    type="button"
                                    className={
                                        formData.role === "SELLER"
                                            ? "role-card active seller-role"
                                            : "role-card"
                                    }
                                    onClick={() =>
                                        handleRoleSelect(
                                            "SELLER"
                                        )
                                    }
                                >

                                    <span className="role-icon">
                                        🏪
                                    </span>

                                    <span className="role-content">

                                        <strong>
                                            Seller
                                        </strong>

                                        <small>
                                            Create your store,
                                            manage products
                                            and grow your business.
                                        </small>

                                    </span>

                                    <span className="role-check">

                                        {formData.role === "SELLER"
                                            ? "✓"
                                            : ""
                                        }

                                    </span>

                                </button>

                            </div>

                        </div>


                        {/* SELECTED ROLE */}

                        <div className="selected-role">

                            <span>
                                Account selected
                            </span>

                            <strong>

                                {formData.role === "CUSTOMER"
                                    ? "🛍️ Customer"
                                    : "🏪 Seller"
                                }

                            </strong>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="spinner"></span>
                                    Creating account...
                                </>

                            ) : (

                                <>
                                    Create Account
                                    <span>→</span>
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


                    <div className="auth-divider">
                        <span>Already have an account?</span>
                    </div>


                    <Link
                        to="/login"
                        className="secondary-button"
                    >
                        Sign in to E-Cart
                    </Link>


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

export default Register;