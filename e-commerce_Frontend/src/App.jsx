import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleTest from "./pages/RoleTest";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/role-test"
                    element={<RoleTest />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;