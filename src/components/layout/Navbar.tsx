import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Scissors, LogOut, User, Menu, X } from 'lucide-react';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 w-full z-50 ${isMenuOpen ? 'bg-black' : 'bg-brand-dark/80 backdrop-blur-md'} border-b border-white/5 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-brand-gold p-1 rounded-lg group-hover:scale-110 transition-transform">
                            <Scissors className="w-5 h-5 text-brand-dark" strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">Cutio</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
                        <Link to="/booking" className="hover:text-brand-gold transition-colors">Book Now</Link>

                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="hover:text-brand-gold transition-colors text-brand-gold">Admin Panel</Link>
                        )}

                        {isAuthenticated ? (
                            <div className="flex items-center gap-6 ml-4 pl-6 border-l border-white/10">
                                <Link to="/profile" className="flex items-center gap-2 text-white hover:text-brand-gold transition-colors group/user">
                                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 group-hover/user:border-brand-gold transition-colors">
                                        <User className="w-4 h-4 text-brand-gold" />
                                    </div>
                                    <span className="font-black">
                                        {user?.firstName || user?.lastName ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : 'User'}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-brand-gold hover:bg-[#e29b1b] text-brand-dark px-6 py-2.5 rounded-full font-black transition-all transform hover:scale-105 active:scale-95">
                                Login
                            </Link>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 top-16 bg-black z-50 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col p-6 gap-6 text-sm font-black uppercase tracking-[0.2em]">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white py-4 border-b border-white/5">Home</Link>
                        <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white py-4 border-b border-white/5">Book Now</Link>

                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-brand-gold py-4 border-b border-white/5">Admin Panel</Link>
                        )}

                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-white py-4 border-b border-white/5">
                                    <User className="w-5 h-5 text-brand-gold" />
                                    <span>Profile ({user?.firstName})</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-red-500 py-4 text-left"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="bg-brand-gold text-brand-dark p-4 rounded-xl text-center mt-4"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
