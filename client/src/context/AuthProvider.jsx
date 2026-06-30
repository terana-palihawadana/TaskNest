import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMe, login as loginRequest, register as registerRequest } from '../api/authApi';
import { AuthContext } from './authContext';

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

    const saveSession = useCallback((sessionToken, sessionUser) => {
        localStorage.setItem('token', sessionToken);
        setToken(sessionToken);
        setUser(sessionUser);
    }, []);

    const login = useCallback(async (credentials) => {
        const { data } = await loginRequest(credentials);
        saveSession(data.token, data.user);
        return data.user;
    }, [saveSession]);

    const register = useCallback(async (credentials) => {
        const { data } = await registerRequest(credentials);
        saveSession(data.token, data.user);
        return data.user;
    }, [saveSession]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

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
        [user, token, loading, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
