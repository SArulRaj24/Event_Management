import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg text-white shadow-2xl">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Event Management
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <>
                                <span className="text-sm font-bold px-5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    {user.role}
                                </span>

                                <Link className="nav-link" to="/dashboard">Dashboard</Link>

                                {user.role === 'ORGANIZER' && (
                                    <Link className="nav-link" to="/create-event">Create Event</Link>
                                )}

                                <Link className="nav-link" to="/profile">Profile</Link>

                                <Link className="nav-link" to="/reset-password">Reset Password</Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-lg transition-all hover:from-red-600 hover:to-pink-600 active:scale-95"
                                >
                                    <LogOut size={16} className="mr-2" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className="nav-link" to="/login">Login</Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden transition active:scale-90"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden origin-top transition-all duration-300 ${
                isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
            }`}>
                <div className="bg-slate-800 px-4 py-3 space-y-2">
                    {user ? (
                        <>
                            <Link className="mobile-link" to="/dashboard">Dashboard</Link>
                            <Link className="mobile-link" to="/profile">Profile</Link>
                            <Link className="mobile-link" to="/reset-password">Reset Password</Link>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link className="mobile-link" to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
