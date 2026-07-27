import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleTest from "./pages/RoleTest";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            {/* Common Navbar */}
            <Navbar />

            <Routes>

                {/* =========================
                    Public Routes
                ========================== */}

                {/* Login Page */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register Page */}
                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    Protected Routes
                ========================== */}

                {/* Role Test / Dashboard */}
                <Route
                    path="/role-test"
                    element={
                        <ProtectedRoute>
                            <RoleTest />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;