import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./components/AppRoutes/AppRoutes";

function App() {
    return (
        <Router>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <AppRoutes />
        </Router>
    );
}

export default App;
