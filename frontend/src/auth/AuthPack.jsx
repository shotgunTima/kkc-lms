// src/auth/AuthPack.jsx
// ------------------------------------------------------------
// Drop this file anywhere under src/ (e.g. src/auth/AuthPack.jsx)
// What it contains:
// 1) Axios instance with JWT header + 401 auto-redirect
// 2) AuthContext (AuthProvider) with login/logout and token storage
// 3) <LoginPage /> — styled like the project (Tailwind + motion + FloatingLabelInput + AnimatedButton)
// 4) <ProtectedRoute /> to guard routes
// ------------------------------------------------------------

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {useTranslation} from "react-i18next";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { LockKeyhole, LogIn, Eye, EyeOff, Check, UserIcon } from "lucide-react";

// Reuse your existing inputs and buttons for a consistent look
import FloatingLabelInput from "../components/Inputs/FloatingLabelInput.jsx";
import AnimatedButton from "../components/Buttons/AnimatedButton.jsx";
// Optional: use your logo if available
import logo from "../assets/bKKClogo.svg";

// ============================
// Axios instance
// ============================
const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8080";
export const api = axios.create({ baseURL: API_BASE, withCredentials: false });

function getStoredTokens() {
    const access = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
    return { access, refresh };
}

function putTokens({ access, refresh }, persist) {
    const store = persist ? localStorage : sessionStorage;
    if (access) store.setItem("accessToken", access);
    if (refresh) store.setItem("refreshToken", refresh);
}

function clearTokens() {
    [localStorage, sessionStorage].forEach(s => {
        s.removeItem("accessToken");
        s.removeItem("refreshToken");
    });
}

// inject Authorization header
api.interceptors.request.use((config) => {
    const { access } = getStoredTokens();
    if (access) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${access}`;
    }
    return config;
});

// simple 401 handler (logout and kick to /login)
let _onUnauthorized = () => {};
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401) {
            _onUnauthorized();
        }
        return Promise.reject(err);
    }
);

// ============================
// Auth Context
// ============================
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [{ access, refresh }, setTokens] = useState(getStoredTokens());
    const [loading, setLoading] = useState(false);

    const isAuthenticated = !!access;

    const logout = useCallback(() => {
        clearTokens();
        setTokens({ access: null, refresh: null });
        setUser(null);
        navigate("/login", { replace: true });
    }, [navigate]);

    // Wire unauthorized handler
    useEffect(() => {
        _onUnauthorized = logout;
        return () => { _onUnauthorized = () => {}; };
    }, [logout]);

    // Optionally, load current user profile if your backend supports it
    const loadProfile = useCallback(async () => {
        try {
            const me = await api.get("/api/auth/me"); // adjust if your backend uses another path
            setUser(me.data);
        } catch {
            // If /auth/me is not available, keep a minimal user object decoded from JWT (best-effort)
            const payload = access?.split(".")?.[1];
            if (payload) {
                try {
                    const json = JSON.parse(atob(payload));
                    setUser({ username: json?.sub || json?.username || "" , roles: json?.roles || json?.authorities });
                } catch {}
            }
        }
    }, [access]);

    useEffect(() => {
        if (access && !user) {
            loadProfile();
        }
    }, [access, user, loadProfile]);

    const login = useCallback(async (username, password, remember) => {
        setLoading(true);
        try {
            // Try common auth endpoints and token shapes
            const resp = await api.post("/api/auth/login", { username, password });
            const data = resp.data || {};
            const accessToken = data.accessToken || data.token || data.jwt || null;
            const refreshToken = data.refreshToken || null;
            if (!accessToken) throw new Error("Нет accessToken в ответе сервера");

            putTokens({ access: accessToken, refresh: refreshToken }, !!remember);
            setTokens({ access: accessToken, refresh: refreshToken });

            // Optional: fetch profile
            await loadProfile();

            setLoading(false);
            navigate("/", { replace: true });
            return true;
        } catch (e) {
            setLoading(false);
            throw e;
        }
    }, [navigate, loadProfile]);

    const value = useMemo(() => ({ user, isAuthenticated, login, logout, loading, token: access }), [user, isAuthenticated, login, logout, loading, access]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================
// ProtectedRoute
// ============================
export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

// ============================
// Login Page UI (KKC visual style)
// ============================
export function LoginPage() {
    const navigate = useNavigate();
    const {isAuthenticated, login, loading} = useAuth() || {};

    useEffect(() => {
        if (isAuthenticated) navigate("/", {replace: true});
    }, [isAuthenticated, navigate]);

    const [form, setForm] = useState({username: "", password: "", remember: true});
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const {t} = useTranslation();
    const onChange = (e) => setForm((f) => ({
        ...f,
        [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
    }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(form.username.trim(), form.password, form.remember);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Ошибка авторизации";
            setError(msg);
        }
    };

    return (
        <div
            className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-bgPrimary/40 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.35}}
                        className="w-full max-w-md">
                <div
                    className="rounded-2xl shadow-black-around bg-white/80 dark:bg-gray-800/70 backdrop-blur p-6 md:p-8">
                    <div className="flex flex-col items-center mb-6">
                        {logo ? <img src={logo} alt="KKC" className="h-16 mb-2"/> :
                            <div className="text-2xl font-bold text-textPrimary">KKC LMS</div>}
                        <div className="text-sm text-gray-600 dark:text-gray-300">{t("login_title")}</div>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <FloatingLabelInput
                            id="username"
                            name="username"
                            label={t("username")}
                            value={form.username}
                            onChange={onChange}
                            leftAddon={<span
                                className="inline-flex items-center px-3 rounded-l-lg bg-bgSecondary text-white dark:bg-gray-900"><UserIcon
                                className="h-5 w-5"/></span>}
                        />

                        <div className="relative">
                            <FloatingLabelInput
                                id="password"
                                name="password"
                                label={t("password")}
                                type={showPwd ? "text" : "password"}
                                value={form.password}
                                onChange={onChange}
                                leftAddon={<span
                                    className="inline-flex items-center px-3 rounded-l-lg bg-bgSecondary text-white dark:bg-gray-900"><LockKeyhole
                                    className="h-5 w-5"/></span>}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label={showPwd ? t("hide_password") : t("show_password")}
                            >
                                {showPwd ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                            </button>
                        </div>

                        {error && <div
                            className="text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/40 rounded-lg p-2">{error}</div>}

                        <div className="flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 select-none">
                                <input type="checkbox" name="remember" checked={form.remember} onChange={onChange}
                                       className="rounded text-bgSecondary"/>
                                <span className="text-sm text-gray-700 dark:text-gray-200">{t("remember_me")}</span>
                            </label>
                            <a href="#"
                               className="text-sm text-bgSecondary hover:underline dark:text-gray-200 opacity-70 hover:opacity-100">{t("forgot_password")}</a>
                        </div>
                        <button type="submit" disabled={loading}
                                className="flex items-center justify-center dark:bg-gray-900 dark:hover:bg-gray-900/60 gap-2 w-full px-4 py-2 rounded-lg bg-bgSecondary text-white font-medium hover:bg-bgSecondary/90 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                                </svg>
                            ) : (
                                <LogIn className="w-5 h-5"/>
                            )}
                            <span>{t('log_in')}</span>
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

/* ============================================
Интеграция (пример):

// main.jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LoginPage, { AuthProvider, ProtectedRoute } from './auth/AuthPack.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedRoute><App /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

// Теперь все ваши старые страницы останутся как есть, но будут доступны только после входа.
// Если ваш Navbar нужно скрывать на /login — переместите его внутрь App.
============================================ */
