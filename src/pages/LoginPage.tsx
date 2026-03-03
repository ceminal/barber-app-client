import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Scissors, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { login, clearError } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(clearError());

        let formattedPhone = phone.replace(/\D/g, '');

        if (formattedPhone.startsWith('90')) {
            formattedPhone = '0' + formattedPhone.slice(2);
        }

        const resultAction = await dispatch(login({ phoneNumber: formattedPhone, password }));

        if (login.fulfilled.match(resultAction)) {
            toast.success('Login successful!');
            navigate('/');
        } else {
            toast.error(resultAction.payload as string || 'Login failed');
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

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex bg-brand-gold p-2.5 rounded-2xl mb-6 shadow-2xl shadow-brand-gold/20">
                        <Scissors className="w-8 h-8 text-brand-dark" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 uppercase text-white">Welcome to Cutio</h1>
                    <p className="text-gray-500 text-sm">Login for your personalized premium experience.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                    <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold mb-6 text-center text-white">Login</h2>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-4">PHONE NUMBER</label>
                                <input
                                    type="tel"
                                    placeholder="phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm hover:bg-white/10 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-4">PASSWORD</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                        Login
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] text-center mb-4">Demo Accounts</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhone('1111111111');
                                        setPassword('1234');
                                    }}
                                    className="bg-white/5 border border-white/10 hover:border-brand-gold/30 hover:bg-white/10 py-3 rounded-xl transition-all group"
                                >
                                    <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-0.5">ADMIN</p>
                                    <p className="text-[11px] text-gray-400 group-hover:text-white transition-colors">Auto Fill</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhone('1112223344');
                                        setPassword('1234');
                                    }}
                                    className="bg-white/5 border border-white/10 hover:border-brand-gold/30 hover:bg-white/10 py-3 rounded-xl transition-all group"
                                >
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">CUSTOMER</p>
                                    <p className="text-[11px] text-gray-400 group-hover:text-white transition-colors">Auto Fill</p>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Don't have an account? <Link to="/register" className="text-brand-gold font-bold hover:underline">Register</Link>
                            </p>
                        </div>
                    </form>
                </div>

                <p className="text-center mt-8 text-xs text-gray-600">
                    By continuing, you accept the <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">Terms of Use</a> and <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
