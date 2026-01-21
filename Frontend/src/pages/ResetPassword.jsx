import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const newPassword = watch('newPassword');

    const onSubmit = async (data) => {
        // Validate passwords match
        if (data.newPassword !== data.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        // Validate old and new passwords are different
        if (data.oldPassword === data.newPassword) {
            toast.error("New password must be different from old password");
            return;
        }

        setLoading(true);
        try {
            await api.post('/user/reset-password', {
                emailId: user?.emailId,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });
            toast.success("Password reset successfully! Please login again.");
            await logout();
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Password reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
            <div className="max-w-lg w-full bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/20">
                <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Reset Password
                </h2>
                <p className="text-center text-gray-400 text-sm mb-6">
                    Change your password to keep your account secure
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Old Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                {...register("oldPassword", {
                                    required: "Current password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                type={showOldPassword ? "text" : "password"}
                                placeholder="Enter your current password"
                                className="w-full border border-purple-500/30 rounded-md p-3 bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.oldPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.oldPassword.message}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                {...register("newPassword", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: "Password must contain uppercase, lowercase, and numbers"
                                    }
                                })}
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                className="w-full border border-purple-500/30 rounded-md p-3 bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                {...register("confirmPassword", {
                                    required: "Please confirm your new password",
                                    validate: (value) => value === newPassword || "Passwords do not match"
                                })}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter your new password"
                                className="w-full border border-purple-500/30 rounded-md p-3 bg-slate-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-md hover:from-purple-700 hover:to-pink-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-purple-400 hover:text-purple-300 font-medium text-sm"
                    >
                        ← Back to Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
