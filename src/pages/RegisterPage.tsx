import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Scissors, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { register, clearError } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        const cleanedPhone = formData.phoneNumber.replace(/\D/g, '');
        const dataToSend = { ...formData, phoneNumber: cleanedPhone };

        const resultAction = await dispatch(register(dataToSend));
        if (register.fulfilled.match(resultAction)) {
            toast.success('Registration successful! Welcome to Cutio.');
            navigate('/');
        } else {
            toast.error(resultAction.payload as string || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col justify-center items-center px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 blur-[120px] rounded-full" />

            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="max-w-md w-full relative z-10 py-10">
                <div className="text-center mb-8">
                    <div className="inline-flex bg-brand-gold p-2.5 rounded-2xl mb-4 shadow-2xl shadow-brand-gold/20">
                        <Scissors className="w-8 h-8 text-brand-dark" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 uppercase text-white">Create Account</h1>
                    <p className="text-gray-500 text-sm">Complete your membership and book an appointment now.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                    <form onSubmit={handleRegister} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-4">FIRST NAME</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm hover:bg-white/10 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-4">LAST NAME</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm hover:bg-white/10 text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-4">PHONE NUMBER</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="+90 (5__) ___ __ __"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm hover:bg-white/10 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-4">PASSWORD</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm hover:bg-white/10 text-white"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-dark py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Register
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Already have an account? <Link to="/login" className="text-brand-gold font-bold hover:underline">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
