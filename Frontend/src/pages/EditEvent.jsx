import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const EditEvent = () => {
    const { eventId } = useParams();
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);

    // Fetch event details
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/event/${eventId}`);
                setEvent(response.data);
                reset(response.data); // Populate form with existing data
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load event details");
                navigate('/dashboard');
            }
        };
        fetchEvent();
    }, [eventId, navigate, reset]);

    const onSubmit = async (data) => {
        try {
            await api.put(`/event/update?eventId=${eventId}`, data);
            toast.success("Event Updated Successfully!");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update event");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-400">Loading event details...</div>
            </div>
        );
    }

    // Check if event has ended
    const isEventEnded = () => {
        if (!event) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventEnd = new Date(event.endDate);
        return eventEnd < today;
    };

    const eventEnded = isEventEnded();

    return (
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center mb-8">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-400 hover:text-purple-400 transition mr-4"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Edit Event
                </h2>
            </div>

            {eventEnded && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                    <p className="text-red-300 font-semibold">⚠️ This event has ended. You cannot edit it.</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Event Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                    <input 
                        {...register("name")} 
                        required 
                        className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white placeholder-gray-500"
                    />
                </div>

                {/* City */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    <input 
                        {...register("city")} 
                        required 
                        className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white placeholder-gray-500"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                    <input 
                        {...register("address")} 
                        required 
                        className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white placeholder-gray-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea 
                        {...register("description")} 
                        className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white placeholder-gray-500 h-28"
                    />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                        <input 
                            type="date" 
                            {...register("startDate")} 
                            required 
                            className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                        <input 
                            type="date" 
                            {...register("endDate")} 
                            required 
                            className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white"
                        />
                    </div>
                </div>

                {/* Max Registrations */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Registrations</label>
                    <input 
                        type="number" 
                        {...register("maximumAllowedRegistrations")} 
                        className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white placeholder-gray-500"
                    />
                </div>

                {/* Registration Allowed */}
                <div className="flex items-center bg-slate-900/30 p-4 rounded-lg border border-purple-500/20">
                    <input 
                        type="checkbox" 
                        {...register("registrationAllowed")} 
                        className="mr-3 w-5 h-5 cursor-pointer"
                    />
                    <label className="text-gray-300 font-medium cursor-pointer flex-1">
                        Allow Registrations
                    </label>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex gap-4 pt-6">
                    <button 
                        type="submit"
                        disabled={eventEnded}
                        className={`flex-1 py-3 rounded-lg transition-all active:scale-95 font-semibold ${
                            eventEnded
                                ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        }`}
                    >
                        {eventEnded ? 'Cannot Update Ended Event' : 'Update Event'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-semibold"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;
