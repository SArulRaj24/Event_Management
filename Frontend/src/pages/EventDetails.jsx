import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';

const EventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, analyticsRes] = await Promise.all([
                    api.get(`/event/${eventId}`),
                    api.get(`/event/${eventId}/analytics`)
                ]);
                setEvent(eventRes.data);
                setAnalytics(analyticsRes.data);
                
                // Check if user is registered
                if (user.role === 'VOLUNTEER') {
                    const registrations = await api.get('/event/my-registrations');
                    setIsRegistered(registrations.data.includes(eventId));
                }
            } catch (error) {
                toast.error("Failed to load details");
                navigate('/dashboard');
            }
        };
        fetchData();
    }, [eventId, navigate, user.role]);

    const handleRegister = async () => {
        try {
            await api.post('/event/register', { eventId, emailId: user.emailId });
            toast.success("Registered Successfully!");
            setIsRegistered(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed");
        }
    };

    const handleUnregister = async () => {
        if (!window.confirm("Are you sure you want to unregister from this event?")) return;
        try {
            await api.post('/event/unregister', { eventId, emailId: user.emailId });
            toast.success("Unregistered Successfully!");
            setIsRegistered(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unregistration Failed");
        }
    };

    if (!event || !analytics) return <div className="p-10 text-center text-gray-400">Loading...</div>;

    // Check if event has ended
    const isEventEnded = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventEnd = new Date(event.endDate);
        return eventEnd < today;
    };

    const hasEnded = isEventEnded();

    // Prepare Pie Data
    const spotsTaken = analytics.totalRegistrations;
    const spotsLeft = Math.max(0, analytics.maxCapacity - spotsTaken);
    const pieData = [
        { name: 'Registered', value: spotsTaken },
        { name: 'Available', value: spotsLeft },
    ];
    const COLORS = ['#A855F7', '#64748B']; // Purple & Slate

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-300 hover:text-purple-400 transition">
                    <ArrowLeft size={20} className="mr-2"/> Back to Dashboard
                </button>
                
                {/* Registration/Unregistration Buttons */}
                {user.role === 'VOLUNTEER' && (
                    <div className="flex space-x-4 items-center">
                        {isRegistered ? (
                            <>
                                <span className="bg-green-600/20 text-green-300 border border-green-500/50 px-3 py-1 rounded-lg text-xs font-medium flex items-center">
                                    Registered
                                </span>
                                <button 
                                    onClick={handleUnregister}
                                    disabled={hasEnded}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                                        hasEnded
                                            ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                                            : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                                    }`}
                                >
                                    Unregister
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={handleRegister}
                                disabled={!event.registrationAllowed || hasEnded}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                                    hasEnded || !event.registrationAllowed
                                        ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                }`}
                            >
                                {hasEnded ? 'Event Ended' : (event.registrationAllowed ? 'Register' : 'Registration Closed')}
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: Event Details Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                            <h1 className="text-3xl font-bold">{event.name}</h1>
                            <div className="flex items-center mt-2 opacity-90">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${event.registrationAllowed ? 'bg-green-500/20 text-green-300 border border-green-500/50' : 'bg-red-500/20 text-red-300 border border-red-500/50'} mr-3`}>
                                    {event.registrationAllowed ? "OPEN FOR REGISTRATION" : "CLOSED"}
                                </span>
                                <span>ID: #{event.eventId}</span>
                            </div>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="prose max-w-none text-gray-300">
                                <h3 className="text-lg font-bold text-white">About Event</h3>
                                <p>{event.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                                <div className="flex items-start">
                                    <Calendar className="text-purple-400 mr-3" />
                                    <div>
                                        <p className="font-bold text-white">Date & Time</p>
                                        <p className="text-sm text-gray-300">Start: {event.startDate}</p>
                                        <p className="text-sm text-gray-300">End: {event.endDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="text-pink-400 mr-3" />
                                    <div>
                                        <p className="font-bold text-white">Location</p>
                                        <p className="text-sm text-gray-300">{event.address}</p>
                                        <p className="text-sm text-gray-300">{event.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Users className="text-green-400 mr-3" />
                                    <div>
                                        <p className="font-bold text-white">Capacity</p>
                                        <p className="text-sm text-gray-300">{analytics.totalRegistrations} / {analytics.maxCapacity} Registered</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* GRAPH 1: Registration Trend (Line Chart) */}
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-6">Participation Trend</h3>
                        <div className="h-64">
                            {analytics.dailyStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analytics.dailyStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.5)" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30,30,30,0.9)', border: '1px solid rgba(255,255,255,0.2)' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="cumulative" name="Total Participants" stroke="#A855F7" strokeWidth={3} />
                                        <Line type="monotone" dataKey="count" name="New Daily" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    No registration data available yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Pie Chart & Quick Stats */}
                <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">Availability</h3>
                        <div className="h-64 relative group">
                            {/* Hover Overlay - positioned above */}
                            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black rounded-lg px-4 py-3 shadow-lg z-10 whitespace-nowrap">
                                <p className="text-xs text-white font-medium">Remaining Participants</p>
                                <p className="text-2xl font-bold text-white">{spotsLeft}</p>
                                <p className="text-xs text-gray-300 mt-2">Total Allowed: {analytics.maxCapacity}</p>
                            </div>
                            
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{Math.round((spotsTaken / analytics.maxCapacity) * 100)}%</p>
                            <p className="text-gray-400 text-sm">Full</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;