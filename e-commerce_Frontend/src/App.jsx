import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard from "./pages/customer/CustomerDashboard";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC HOME PAGE
                ========================== */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* =========================
                    AUTH
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
                    CUSTOMER
                ========================== */}

                <Route
                    path="/customer-dashboard"
                    element={
                        <ProtectedRoute>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;