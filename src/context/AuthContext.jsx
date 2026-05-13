import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        apiClient("/api/me")
            .then(data => setUser(data))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    const logout = async () => {
        await apiClient("/api/logout", { method: "POST" });
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
