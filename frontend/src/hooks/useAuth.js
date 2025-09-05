import { useState, useEffect } from "react";
import api from "../api/axios.js";

export function useAuth() {
    const [user, setUser] = useState(null); // { username, role }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data?.authenticated) {
                    setUser({
                        username: res.data.username,
                        role: res.data.role.toUpperCase() // ADMIN / STUDENT
                    });
                } else {
                    setUser(null);
                }
            })
            .catch(err => {
                console.error("Ошибка получения текущего пользователя:", err);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}
