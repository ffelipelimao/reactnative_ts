import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface AuthState {
    token: string;
    user: object;
};

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthData {
    user: object;
    signIn(credentials: SignInCredentials): Promise<void>;
    signout(): void;
    loading: boolean;
}

const AuthContext = createContext<AuthData>({} as AuthData);

export const AuthProvider: React.FC = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AuthState>({} as AuthState)

    useEffect(() => {
        async function loadStorageData(): Promise<void> {
            const [token, user] = await AsyncStorage.multiGet([
                '@GoBarber:token',
                '@GoBarber:user'
            ]);
            if (token[1] && user[1]) {
                setData({ token: token[1], user: JSON.parse(user[1]) })
            }
            setLoading(false)

        }
        loadStorageData();

    }, []);



    const signIn = useCallback(async ({ email, password }) => {
        const response = await api.post('sessions', {
            email,
            password,
        })
        const { token, user } = response.data;

        await AsyncStorage.multiSet([
            ['@GoBarber:token', token],
            ['@GoBarber:user', JSON.stringify(user)]
        ]);

        setData({ token, user });

    }, [])

    const signout = useCallback(async () => {
        await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);
        setData({} as AuthState)
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, loading, signIn, signout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthData {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('Must be used');
    }

    return context
}
