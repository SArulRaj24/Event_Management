import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth(); // Get logged in user email
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    // Fetch Profile Data on Load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Backend expects: /user/profile?emailId=...
                const response = await api.get(`/user/profile`, {
                    params: { emailId: user.emailId }
                });
                setProfile(response.data);
                reset(response.data); // Pre-fill form with existing data
            } catch (error) {
                toast.error("Failed to load profile.");
            }
        };
        if (user) fetchProfile();
    }, [user, reset]);

    // Handle Update
    const onSubmit = async (data) => {
        try {
            // Backend expects UserRequest object
            await api.put('/user/update', {
                emailId: user.emailId, // Email is the key, cannot change
                phone: data.phone,
                address: data.address
            });
            
            setProfile({ ...profile, phone: data.phone, address: data.address });
            setIsEditing(false);
            toast.success("Profile Updated!");
        } catch (error) {
            toast.error("Update Failed.");
        }
    };

    if (!profile) return <div className="text-center mt-20 text-gray-400">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6">
            <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-lg overflow-hidden border border-white/20">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center">
                    <div className="flex items-center text-white">
                        <div className="bg-white/20 p-3 rounded-full border border-white/30">
                            <User size={32} className="text-white" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold">My Profile</h2>
                            <p className="text-purple-100">{profile.role}</p>
                        </div>
                    </div>
                    
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded flex items-center transition border border-white/30"
                        >
                            <Edit2 size={16} className="mr-2" /> Edit
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-8">
                    {isEditing ? (
                        /* EDIT FORM */
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 font-bold mb-1">Phone Number</label>
                                <input 
                                    {...register("phone")} 
                                    type="number" 
                                    className="w-full border border-purple-500/30 p-2 rounded bg-slate-900/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500" 
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-bold mb-1">Address</label>
                                <textarea 
                                    {...register("address")} 
                                    className="w-full border border-purple-500/30 p-2 rounded bg-slate-900/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 h-24" 
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded flex justify-center items-center hover:from-green-700 hover:to-emerald-700 transition">
                                    <Save size={18} className="mr-2" /> Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => { setIsEditing(false); reset(profile); }}
                                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded flex justify-center items-center transition border border-slate-500"
                                >
                                    <X size={18} className="mr-2" /> Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* VIEW DETAILS */
                        <div className="space-y-6">
                            <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg">
                                <Mail className="text-purple-400 mr-4" size={24} />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Email ID</p>
                                    <p className="text-lg text-white font-medium">{profile.emailId}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg">
                                <Phone className="text-green-400 mr-4" size={24} />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Phone</p>
                                    <p className="text-lg text-white font-medium">{profile.phone || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex items-start p-4 bg-white/5 border border-white/10 rounded-lg">
                                <MapPin className="text-pink-400 mr-4 mt-1" size={24} />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Address</p>
                                    <p className="text-lg text-white font-medium">{profile.address || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;