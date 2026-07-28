import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleTest from "./pages/RoleTest";
import AdminDashboard
    from "./pages/admin/AdminDashboard";

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
        <ProtectedRoute>
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
        <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
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