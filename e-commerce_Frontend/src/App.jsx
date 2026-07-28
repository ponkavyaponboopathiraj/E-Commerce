import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleTest from "./pages/RoleTest";

import CustomerDashboard
    from "./pages/customer/CustomerDashboard";
    
import SellerDashboard from "./pages/seller/SellerDashboard";
import Navbar
    from "./components/Navbar";

import ProtectedRoute
    from "./components/ProtectedRoute";

import "./App.css";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC LANDING PAGE
                ========================== */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                {/* =========================
                    AUTHENTICATION
                ========================== */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* =========================
                    CUSTOMER DASHBOARD
                ========================== */}

                <Route
                    path="/customer-dashboard"
                    element={

                        <ProtectedRoute
                            allowedRoles={[
                                "CUSTOMER"
                            ]}
                        >

                            <CustomerDashboard />

                        </ProtectedRoute>

                    }
                />


                {/* =========================
                    SELLER DASHBOARD
                ========================== */}

   <Route
    path="/seller-dashboard"
    element={
        <ProtectedRoute>
            <SellerDashboard />
        </ProtectedRoute>
    }
/>


                {/* =========================
                    ADMIN DASHBOARD
                ========================== */}

                <Route
                    path="/admin-dashboard"
                    element={

                        <ProtectedRoute
                            allowedRoles={[
                                "ADMIN"
                            ]}
                        >

                            <div>
                                Admin Dashboard
                            </div>

                        </ProtectedRoute>

                    }
                />


                {/* =========================
                    ROLE TEST
                ========================== */}

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