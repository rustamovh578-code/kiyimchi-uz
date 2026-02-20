import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'kiyimchi_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(AUTH_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, [user]);

    const login = (phone, password) => {
        // Mock login
        const mockUser = {
            id: 1,
            name: 'Foydalanuvchi',
            phone,
            role: phone === '+998901111111' ? 'admin' : 'customer',
        };
        setUser(mockUser);
        return mockUser;
    };

    const register = (name, phone, password) => {
        const mockUser = {
            id: Date.now(),
            name,
            phone,
            role: 'customer',
        };
        setUser(mockUser);
        return mockUser;
    };

    const logout = () => {
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isAdmin,
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
