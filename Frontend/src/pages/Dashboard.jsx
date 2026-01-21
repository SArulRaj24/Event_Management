import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
// 1. ADD IMPORT for navigation
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // 2. Initialize Hook
    const [events, setEvents] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]); 
    const [filter, setFilter] = useState('upcoming'); 

    // 1. Fetch Events
    const fetchEvents = async () => {
        try {
            const response = await api.get(`/event/list?type=${filter}`);
            setEvents(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load events");
        }
    };

    // 2. Fetch User's Registrations
    const fetchMyRegistrations = async () => {
        if (user.role === 'VOLUNTEER') {
            try {
                const response = await api.get('/event/my-registrations');
                setMyRegistrations(response.data); 
            } catch (error) {
                console.error("Failed to fetch registrations", error);
            }
        }
    };

    // Load data
    useEffect(() => {
        console.log('🟢 Dashboard useEffect REGISTERED - Fetching data for filter:', filter, 'role:', user.role);
        
        fetchEvents();
        fetchMyRegistrations();

        // Cleanup function
        return () => {
            console.log('🔴 Dashboard useEffect UNREGISTERED - Cleaning up for filter:', filter);
        };
    }, [filter, user.role]);

    const handleRegister = async (eventId) => {
        try {
            await api.post('/event/register', { eventId, emailId: user.emailId });
            toast.success("Registered Successfully!");
            
            // 🟢 Immediately update local state without refresh
            console.log('✅ Updating registration status immediately for eventId:', eventId);
            setMyRegistrations([...myRegistrations, eventId]);
            
            // Fetch fresh data in background
            fetchEvents();
            fetchMyRegistrations();
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed");
        }
    };

    const handleUnregister = async (eventId) => {
        if (!window.confirm("Are you sure you want to unregister from this event?")) return;
        try {
            await api.post('/event/unregister', { eventId, emailId: user.emailId });
            toast.success("Unregistered Successfully!");
            
            // 🟢 Immediately update local state without refresh
            console.log('✅  Updating unregistration status immediately for eventId:', eventId);
            setMyRegistrations(myRegistrations.filter(id => id !== eventId));
            
            // Fetch fresh data in background
            fetchEvents();
            fetchMyRegistrations();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unregistration Failed");
        }
    };

    const handleDelete = async (eventId) => {
        if(!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/event/delete?eventId=${eventId}`);
            toast.success("Event Deleted");
            fetchEvents(); 
        } catch (error) {
            toast.error("Delete failed");
        }
    }

    const isEventEnded = (endDateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const eventEnd = new Date(endDateString);
        return eventEnd < today;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {user.role === 'ORGANIZER' ? 'Manage Events' : 'Available Events'}
                </h1>
                
                <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
                    {['upcoming', 'ongoing', 'completed'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-md capitalize font-medium transition-all cursor-pointer ${filter === type ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => {
                    const hasEnded = isEventEnded(event.endDate);
                    const isOpen = event.registrationAllowed && !hasEnded;
                    const isRegistered = myRegistrations.includes(event.eventId);

                    return (
                        <div key={event.eventId} className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6 border border-white/20 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${isOpen ? 'bg-green-500/20 text-green-300 border border-green-500/50' : 'bg-red-500/20 text-red-300 border border-red-500/50'}`}>
                                        {isOpen ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                                
                                <div className="text-sm text-gray-400 space-y-1 mb-4">
                                    <p>📍 {event.city}</p>
                                    <p>📅 {event.startDate} to {event.endDate}</p>
                                </div>
                            </div>

                            {/* 3. UPDATED FOOTER LAYOUT */}
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                
                                {/* NEW: View Details Link (Left Side) */}
                                <button 
                                    onClick={() => navigate(`/event/${event.eventId}`)}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all text-xs cursor-pointer"
                                >
                                    View Details & Analytics
                                </button>

                                {/* EXISTING: Action Buttons (Right Side) */}
                                <div className="flex space-x-2">
                                    {user.role === 'VOLUNTEER' && (
                                        <div className="flex space-x-2">
                                            {isRegistered ? (
                                                <>
                                                    <span className="bg-green-600/20 text-green-300 border border-green-500/50 px-4 py-2 rounded-lg font-medium text-sm">
                                                         Registered
                                                    </span>
                                                    <button 
                                                        onClick={() => handleUnregister(event.eventId)}
                                                        disabled={hasEnded}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                                                            hasEnded
                                                                ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                                                                : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 cursor-pointer'
                                                        }`}
                                                    >
                                                        Unregister
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleRegister(event.eventId)}
                                                    disabled={!isOpen}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                        !isOpen 
                                                            ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/30' 
                                                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 cursor-pointer'
                                                    }`}
                                                >
                                                    {hasEnded ? 'Event Ended' : (isOpen ? 'Register' : 'Registration Closed')}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    
                                    {user.role === 'ORGANIZER' && (
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => navigate(`/edit-event/${event.eventId}`)}
                                                disabled={hasEnded}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                                                    hasEnded
                                                        ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                                                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 cursor-pointer'
                                                }`}
                                            >
                                                {hasEnded ? 'Ended' : 'Edit'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(event.eventId)}
                                                disabled={hasEnded}
                                                className={`px-4 py-2 rounded font-medium transition-all text-sm ${
                                                    hasEnded
                                                        ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                                                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 cursor-pointer'
                                                }`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {events.length === 0 && (
                <p className="text-center text-gray-400 mt-10">No events found for this category.</p>
            )}
        </div>
    );
};

export default Dashboard;