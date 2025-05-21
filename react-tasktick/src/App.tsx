import { HashRouter } from 'react-router-dom';

import "./App.css";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./components/AppRoutes/AppRoutes";

function App() {
    return (
        <HashRouter>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <AppRoutes />
        </HashRouter>
    );
}

export default App;
