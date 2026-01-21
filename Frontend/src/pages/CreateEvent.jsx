import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateEvent = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await api.post('/event/create', data);
            toast.success("Event Created Successfully!");
            navigate('/dashboard');
        } catch {
            toast.error("Failed to create event");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Create New Event</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {[
                    { label: 'Event Name', name: 'name' },
                    { label: 'City', name: 'city' },
                    { label: 'Address', name: 'address' },
                ].map(f => (
                    <div key={f.name}>
                        <label className="label">{f.label}</label>
                        <input {...register(f.name)} required className="input" />
                    </div>
                ))}

                <div>
                    <label className="label">Description</label>
                    <textarea {...register("description")} className="input h-28" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Start Date</label>
                        <input type="date" {...register("startDate")} className="input" required />
                    </div>
                    <div>
                        <label className="label">End Date</label>
                        <input type="date" {...register("endDate")} className="input" required />
                    </div>
                </div>

                <div>
                    <label className="label">Max Registrations</label>
                    <input type="number" {...register("maximumAllowedRegistrations")} className="input" />
                </div>

                <div className="flex items-center">
                    <input type="checkbox" {...register("registrationAllowed")} className="mr-2 w-4 h-4" />
                    <label className="text-gray-300">Allow Registrations Immediately</label>
                </div>

                <button className="btn-primary w-full">Publish Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
