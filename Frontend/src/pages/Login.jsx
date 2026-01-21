import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        const success = await login(data.emailId, data.password);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl hover:shadow-2xl transition w-full max-w-md border border-white/20">
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register("emailId")} placeholder="Email" className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white placeholder-gray-400" />
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            {...register("password")} 
                            placeholder="Password" 
                            className="w-full border border-purple-500/30 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 transition bg-slate-900/50 text-white placeholder-gray-400" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all active:scale-95 font-semibold">Sign In</button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-400">
                    Don't have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
