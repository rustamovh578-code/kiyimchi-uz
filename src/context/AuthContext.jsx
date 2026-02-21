import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setToken } from '../services/api';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'kiyimchi_user';
const TOKEN_KEY = 'kiyimchi_token';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(AUTH_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, [user]);

    // Verify token on mount
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token && user) {
            authAPI.me().catch(() => {
                // Token expired or invalid
                setUser(null);
                setToken(null);
            });
        }
    }, []);

    const login = async (phone, password) => {
        setLoading(true);
        try {
            const data = await authAPI.login(phone, password);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, phone, password) => {
        setLoading(true);
        try {
            const data = await authAPI.register(name, phone, password);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isAdmin,
            loading,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
