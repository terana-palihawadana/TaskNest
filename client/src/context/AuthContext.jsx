import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as loginRequest, register as registerRequest } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await getMe();
                setUser(data.user);
            } catch {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const saveSession = (sessionToken, sessionUser) => {
        localStorage.setItem('token', sessionToken);
        setToken(sessionToken);
        setUser(sessionUser);
    };

    const login = async (credentials) => {
        const { data } = await loginRequest(credentials);
        saveSession(data.token, data.user);
        return data.user;
    };

    const register = async (credentials) => {
        const { data } = await registerRequest(credentials);
        saveSession(data.token, data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            isAuthenticated: Boolean(token && user),
            login,
            register,
            logout,
        }),
        [user, token, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
