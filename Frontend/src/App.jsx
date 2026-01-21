
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import EventDetails from './pages/EventDetails';
import ResetPassword from './pages/ResetPassword';
import EditEvent from './pages/EditEvent';

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            
            <Route path="/create-event" element={
                <PrivateRoute><CreateEvent /></PrivateRoute>
            } />

            <Route path="/edit-event/:eventId" element={
                <PrivateRoute><EditEvent /></PrivateRoute>
            } />

            <Route path="/profile" element={
                <PrivateRoute><Profile /></PrivateRoute>
            } />

            <Route path="/reset-password" element={
                <PrivateRoute><ResetPassword /></PrivateRoute>
            } />

            <Route path="/event/:eventId" element={
                 <PrivateRoute><EventDetails /></PrivateRoute>
             } />

            {/* Redirect root to dashboard or login */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>

          
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;