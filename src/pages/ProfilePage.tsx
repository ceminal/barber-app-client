import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    User as UserIcon, Calendar, Clock, Scissors,
    ChevronRight, LogOut, Settings, History
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyAppointments, AppointmentStatus } from '../store/slices/appointmentSlice';
import { logout, updateProfile } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import type { AppDispatch, RootState } from '../store';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
    const { myAppointments, loading: appointmentsLoading } = useSelector((state: RootState) => state.appointments);

    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || ''
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setEditForm({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber
            });
        }
    }, [user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleSaveProfile = async () => {
        try {
            await dispatch(updateProfile(editForm)).unwrap();
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            console.error('Update failed:', error);
            toast.error(error || 'Failed to update profile.');
        }
    };

    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
    </div>

    const filteredAppointments = myAppointments.filter(app => {
        const isUpcoming = app.status === AppointmentStatus.PENDING || app.status === AppointmentStatus.CONFIRMED;
        return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
    });

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-24">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-brand-gold/10 border-2 border-brand-gold/30 flex items-center justify-center mb-6 relative group overflow-hidden">
                                    <UserIcon className="w-10 h-10 text-brand-gold" />
                                    <div className="absolute inset-0 bg-brand-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Settings className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                {isEditing ? (
                                    <div className="w-full space-y-4 mb-6">
                                        <div className="text-left space-y-1">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">FIRST NAME</p>
                                            <input
                                                type="text"
                                                value={editForm.firstName}
                                                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-gold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="text-left space-y-1">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">LAST NAME</p>
                                            <input
                                                type="text"
                                                value={editForm.lastName}
                                                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-gold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="text-left space-y-1">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">PHONE</p>
                                            <input
                                                type="text"
                                                value={editForm.phoneNumber}
                                                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-gold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex-1 bg-brand-gold text-brand-dark py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-brand-gold/90 transition-all"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                                            {authLoading ? "Loading..." : (user?.firstName ? `${user.firstName} ${user.lastName}` : "Name Missing")}
                                        </h1>
                                        <p className="text-gray-500 text-sm font-medium mb-6">{user?.phoneNumber || 'Phone Not Added'}</p>

                                        <div className="w-full space-y-3">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="w-full bg-brand-gold text-brand-dark py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-gold/90 transition-all text-sm uppercase tracking-wider"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm uppercase tracking-wider"
                                            >
                                                <LogOut className="w-4 h-4 text-red-500" />
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">STATISTICS</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">TOTAL</p>
                                            <p className="text-xl font-black text-white">12</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">POINTS</p>
                                            <p className="text-xl font-black text-brand-gold">150</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:flex-1">
                        <div className="flex gap-4 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit">
                            <button
                                onClick={() => setActiveTab('upcoming')}
                                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'upcoming' ? 'bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Calendar className="w-4 h-4" />
                                Upcoming Appointments
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'past' ? 'bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                <History className="w-4 h-4" />
                                Past Appointments
                            </button>
                        </div>

                        <div className="space-y-4">
                            {appointmentsLoading ? (
                                <div className="py-20 text-center">
                                    <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-gray-500">Loading...</p>
                                </div>
                            ) : filteredAppointments.length > 0 ? (
                                filteredAppointments.map((app) => (
                                    <div
                                        key={app._id}
                                        className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-brand-gold/20 transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
                                                    <img src={'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop'} alt={app.barberName} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-0.5">BARBER</p>
                                                    <h3 className="font-bold text-lg text-white group-hover:text-brand-gold transition-colors">{app.barberName || 'Master Barber'}</h3>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex flex-wrap gap-8">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-white/5 p-2 rounded-lg mt-0.5">
                                                        <Calendar className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">DATE</p>
                                                        <p className="font-bold text-sm text-white">{new Date(app.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-white/5 p-2 rounded-lg mt-0.5">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">TIME</p>
                                                        <p className="font-bold text-sm text-white">{app.appointmentTime}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-white/5 p-2 rounded-lg mt-0.5">
                                                        <Scissors className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">SERVICES</p>
                                                        <p className="font-bold text-sm text-white truncate max-w-[150px]">{app.serviceName || 'Haircut'}</p>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto">
                                                <div className="md:mb-1">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${(app.status === AppointmentStatus.CONFIRMED) ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        (app.status === AppointmentStatus.COMPLETED) ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                            app.status === AppointmentStatus.PENDING ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-white/5 text-gray-500'
                                                        }`}>
                                                        {app.status === AppointmentStatus.CONFIRMED ? 'Confirmed' :
                                                            app.status === AppointmentStatus.PENDING ? 'Pending' :
                                                                app.status === AppointmentStatus.COMPLETED ? 'Completed' :
                                                                    app.status === AppointmentStatus.CANCELLED ? 'Cancelled' : app.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="absolute top-1/2 right-4 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                            <ChevronRight className="w-5 h-5 text-brand-gold" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium italic">No appointments in this category yet.</p>
                                    <Link to="/booking" className="inline-block mt-6 text-brand-gold font-bold hover:underline">
                                        Book Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;
