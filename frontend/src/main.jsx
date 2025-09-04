import './i18n/i18n.js';
import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import LoginPage, { AuthProvider, ProtectedRoute } from "./auth/AuthPack.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<ProtectedRoute><App /></ProtectedRoute>} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
