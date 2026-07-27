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

    // Handle Input Changes
    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    // Handle Role Selection
    const handleRoleSelect = (role) => {

        setFormData({
            ...formData,
            role: role,
        });

        // Clear old error/success message
        setMessage("");
    };


    // Handle Registration
    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            console.log(
                "Register Request:",
                formData
            );

            const response = await registerUser(formData);

            console.log(
                "Register Response:",
                response
            );

            setMessage(
                "Registration successful! Redirecting to login..."
            );

            // Redirect to Login
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

        <div className="auth-container">

            <div className="auth-card register-card">

                {/* =========================
                    Header
                ========================== */}

                <div className="auth-header">

                    <div className="auth-logo">
                        🛍️
                    </div>

                    <h1>
                        Create Your Account
                    </h1>

                    <p>
                        Join E-Cart and start your shopping journey
                    </p>

                </div>


                {/* =========================
                    Registration Form
                ========================== */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* First Name + Last Name */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter your first name"
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
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* Email */}

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Phone Number */}

                    <div className="form-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Enter your phone number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Password */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* =========================
                        Account Type
                    ========================== */}

                    <div className="role-section">

                        <div className="role-title">

                            <h3>
                                Choose Your Account Type
                            </h3>

                            <p>
                                Select how you want to use E-Cart
                            </p>

                        </div>


                        <div className="role-options">


                            {/* =====================
                                Customer Role
                            ====================== */}

                            <div
                                className={`role-card ${
                                    formData.role === "CUSTOMER"
                                        ? "role-card-active customer-role"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleRoleSelect("CUSTOMER")
                                }
                            >

                                <div className="role-icon">
                                    🛍️
                                </div>

                                <div className="role-content">

                                    <h4>
                                        Customer
                                    </h4>

                                    <p>
                                        Discover amazing products,
                                        add items to your cart,
                                        and enjoy a great shopping
                                        experience.
                                    </p>

                                </div>

                                <div className="role-check">

                                    {formData.role === "CUSTOMER"
                                        ? "✓"
                                        : ""
                                    }

                                </div>

                            </div>


                            {/* =====================
                                Seller Role
                            ====================== */}

                            <div
                                className={`role-card ${
                                    formData.role === "SELLER"
                                        ? "role-card-active seller-role"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleRoleSelect("SELLER")
                                }
                            >

                                <div className="role-icon">
                                    🏪
                                </div>

                                <div className="role-content">

                                    <h4>
                                        Seller
                                    </h4>

                                    <p>
                                        Create your store, manage
                                        products, track orders,
                                        and grow your business.
                                    </p>

                                </div>

                                <div className="role-check">

                                    {formData.role === "SELLER"
                                        ? "✓"
                                        : ""
                                    }

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        Selected Role
                    ========================== */}

                    <div className="selected-role">

                        <span>
                            Selected Account:
                        </span>

                        <strong>
                            {formData.role === "CUSTOMER"
                                ? " 🛍️ Customer"
                                : " 🏪 Seller"
                            }
                        </strong>

                    </div>


                    {/* =========================
                        Submit Button
                    ========================== */}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Your Account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                {/* =========================
                    Response Message
                ========================== */}

                {message && (

                    <div
                        className={`auth-message ${
                            message.includes("successful")
                                ? "success-message"
                                : "error-message"
                        }`}
                    >

                        {message}

                    </div>

                )}


                {/* =========================
                    Login Link
                ========================== */}

                <div className="auth-footer">

                    <p>
                        Already have an account?
                    </p>

                    <Link to="/login">
                        Login to E-Cart →
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;