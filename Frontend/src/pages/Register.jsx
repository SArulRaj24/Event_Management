import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            // Backend expects: { emailId, password, role, phone, address }
            await api.post('/user/register', data);
            toast.success("Registration Successful! Please Login.");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
            <div className="max-w-lg w-full bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/20">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Create Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">User Role</label>
                        <select {...register("role")} className="mt-1 block w-full border border-purple-500/30 rounded-md p-2 bg-slate-900/50 text-white">
                            <option value="VOLUNTEER" className="bg-slate-900">Volunteer</option>
                            <option value="ORGANIZER" className="bg-slate-900">Organizer</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email ID</label>
                            <input {...register("emailId", { required: true })} type="email" 
                                className="mt-1 block w-full border border-purple-500/30 rounded-md p-2 bg-slate-900/50 text-white placeholder-gray-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Phone</label>
                            <input {...register("phone", { required: true })} type="number" 
                                className="mt-1 block w-full border border-purple-500/30 rounded-md p-2 bg-slate-900/50 text-white placeholder-gray-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <div className="relative mt-1">
                            <input 
                                {...register("password", { required: true })} 
                                type={showPassword ? "text" : "password"}
                                className="w-full border border-purple-500/30 rounded-md p-2 bg-slate-900/50 text-white placeholder-gray-500" 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Address</label>
                        <textarea {...register("address", { required: true })} rows="3"
                            className="mt-1 block w-full border border-purple-500/30 rounded-md p-2 bg-slate-900/50 text-white placeholder-gray-500"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-md hover:from-purple-700 hover:to-pink-700 transition font-semibold">
                        Register
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;