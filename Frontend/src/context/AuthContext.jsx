import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🟢 AuthContext useEffect REGISTERED - Checking authentication status');
        
        // Check if user is already logged in on refresh
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            console.log('✅ User restored from localStorage:', JSON.parse(savedUser));
        }
        setLoading(false);

        // Cleanup function
        return () => {
            console.log('🔴 AuthContext useEffect UNREGISTERED');
        };
    }, []);

    const login = async (emailId, password) => {
        try {
            const { data } = await api.post('/user/login', { emailId, password });
            
            // SAVE TOKEN & USER
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ emailId: data.emailId, role: data.role }));
            
            setUser({ emailId: data.emailId, role: data.role });
            toast.success("Login Successful!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/user/logout');
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            localStorage.clear();
            setUser(null);
            toast.success("Logged out");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);