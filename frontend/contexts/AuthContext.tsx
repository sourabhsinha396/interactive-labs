"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/fetchWithAuth';
import { User, SignupRequest, SignupResponse } from '@/types/auth';

interface AuthContextType {
    user: User | null;
    signup: (data: SignupRequest) => Promise<void>;
    login: (username: string, password: string, next?: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    signup: async () => { },
    login: async () => { },
    logout: async () => { },
    isLoading: true,
    refreshUser: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check authentication on mount
    useEffect(() => {
        const checkUserAuthentication = async () => {
            try {
                const response = await api.get('/auth/me', false); // Don't require auth, don't redirect
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // User is not authenticated, but that's OK
                    setUser(null);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserAuthentication();
    }, []);

    const signup = async (data: SignupRequest) => {
        try {
            const response = await api.post('/auth/signup', data, false);

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Signup failed');
                } else {
                    throw new Error('Signup failed');
                }
            }

            const signupData: SignupResponse = await response.json();
            setUser(signupData.user);
            
            // Redirect to home after successful signup
            router.push('/');
            
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const login = async (username: string, password: string, next: string = '/dashboard') => {
        try {
            const response = await api.post('/auth/login', { username, password }, false);

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Login failed');
                } else {
                    throw new Error('Login failed');
                }
            }

            // After successful login, fetch user data
            const userResponse = await api.get('/auth/me', false);
            
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            
            const userData = await userResponse.json();
            setUser(userData);
            
            // Redirect to the next URL
            router.push(next);
            
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // If you have a logout endpoint, call it here
            // await api.post('/auth/logout', {}, false);
            
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const refreshUser = async (): Promise<User | null> => {
        try {
            const response = await api.get('/auth/me', false);
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                return userData;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, isLoading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};