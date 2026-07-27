import { useState } from "react";
import { registerUser } from "../services/authService";

function Register() {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "CUSTOMER",
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

            const response = await registerUser(formData);

            console.log(
                "Register Response:",
                response
            );

            setMessage(
                "Registration successful!"
            );

        } catch (error) {

            console.error(error);

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
        }
    };

    return (
        <div>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>First Name</label>

                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Last Name</label>

                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                    <label>Phone Number</label>

                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
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

                <div>
                    <label>Role</label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="CUSTOMER">
                            Customer
                        </option>

                        <option value="SELLER">
                            Seller
                        </option>
                    </select>
                </div>

                <button type="submit">
                    Register
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

        </div>
    );
}

export default Register;