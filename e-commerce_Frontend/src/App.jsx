import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleTest from "./pages/RoleTest";
import Home from "./pages/Home";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";


function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =========================
                    HOME
                ========================== */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    PUBLIC ROUTES
                ========================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    PROTECTED ROUTES
                ========================== */}

                <Route
                    path="/role-test"
                    element={
                        <ProtectedRoute>
                            <RoleTest />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    UNKNOWN URL
                ========================== */}

                <Route
                    path="*"
                    element={
                        <Navigate to="/" replace />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;