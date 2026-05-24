import { createContext, useState, useEffect } from "react";
import { getMe, login, register, logout } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 INIT AUTH ONLY ONCE
    useEffect(() => {
        const init = async () => {
            try {
                const res = await getMe();
                setUser(res?.user || null);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const handleLogin = async (data) => {
        const res = await login(data);
        setUser(res.user);
        return res.user;
    };

    const handleRegister = async (data) => {
        const res = await register(data);
        setUser(res.user);
        return res.user;
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            handleLogin,
            handleRegister,
            handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};