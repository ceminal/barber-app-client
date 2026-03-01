import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Check, User, ChevronLeft, ChevronRight, Plus, Settings,
    GripVertical, Info, Repeat, Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchAllAppointments, updateAppointmentStatus, AppointmentStatus } from '../store/slices/appointmentSlice';
import type { AppDispatch, RootState } from '../store';
import toast from 'react-hot-toast';

const AnalyticsView = ({ appointments }: { appointments: any[] }) => {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

    const data = useMemo(() => {
        const filtered = appointments.filter(app => {
            if (app.status !== AppointmentStatus.CONFIRMED) return false;
            return app.appointmentDate.startsWith(month);
        });

        const counts: Record<string, number> = {};
        filtered.forEach(app => {
            counts[app.barberName] = (counts[app.barberName] || 0) + 1;
        });

        return Object.entries(counts).map(([name, count]) => ({
            name,
            'Completed Appointments': count
        })).sort((a, b) => b['Completed Appointments'] - a['Completed Appointments']);
    }, [appointments, month]);

    return (
        <div className="flex-1 bg-[#141414]/30 rounded-[2.5rem] border border-white/5 p-8 max-w-[1700px] mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black tracking-tight uppercase">Performance Report</h2>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-white/10"
                />
            </div>

            <div className="h-[500px] w-full mt-8">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                            <YAxis stroke="#888" tick={{ fill: '#888' }} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: '#222' }}
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#f3a91d', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="Completed Appointments" fill="#f3a91d" radius={[4, 4, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 italic">
                        No completed appointments for this month.
                    </div>
                )}
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { appointments } = useSelector((state: RootState) => state.appointments);
    const [activeTab, setActiveTab] = useState<'calendar' | 'analytics'>('calendar');
    const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const BARBER_DATA = [
        { name: 'Sebastian Thorne', title: 'MASTER BARBER', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Arthur Sterling', title: 'SENIOR BARBER', image: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop' },
        { name: 'Marco Rossi', title: 'STYLIST', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1887&auto=format&fit=crop' }
    ];

    const [activeBarbers, setActiveBarbers] = useState<string[]>(BARBER_DATA.map(b => b.name));

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];

    useEffect(() => {
        dispatch(fetchAllAppointments());
    }, [dispatch]);

    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await dispatch(updateAppointmentStatus({ id, status: AppointmentStatus.CONFIRMED })).unwrap();
            toast.success('Appointment approved!');
        } catch (error: any) {
            toast.error(error || 'Failed to approve appointment');
        }
    };

    const scheduleAppointments = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return appointments.filter(app =>
            app.appointmentDate.split('T')[0] === dateStr && app.status === AppointmentStatus.CONFIRMED
        );
    }, [appointments, selectedDate]);

    const pendingAppointments = useMemo(() => {
        return appointments
            .filter(app => app.status === AppointmentStatus.PENDING)
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date).getTime();
                const dateB = new Date(b.createdAt || b.date).getTime();
                return dateA - dateB;
            });
    }, [appointments]);

    const getAppointmentForSlot = (barber: string, time: string) => {
        return scheduleAppointments.find(app =>
            app.barberName === barber &&
            app.appointmentTime === time
        );
    };

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const timeToPosition = useMemo(() => {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const dateStr = currentTime.toISOString().split('T')[0];
        const selectedDateStr = selectedDate.toISOString().split('T')[0];

        if (dateStr !== selectedDateStr) return null;
        if (hours < 9 || hours > 19) return null;

        const relativeHours = hours - 9;
        const totalMinutes = relativeHours * 60 + minutes;

        return totalMinutes * (140 / 30) + 120;
    }, [currentTime, selectedDate]);

    const stats = useMemo(() => {
        const total = appointments.length;
        return { total };
    }, [appointments]);

    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden pb-16">
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-8 z-[60]">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2">
                        <a href="/" className="text-xl font-black text-[#f3a91d] tracking-tighter">Cutio</a>
                        <span className="text-[10px] font-black text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-[0.2em] mt-1">ADMIN</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'calendar' ? 'text-white border-b-2 border-[#f3a91d] pb-5 translate-y-[10px]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Calendar
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'analytics' ? 'text-white border-b-2 border-[#f3a91d] pb-5 translate-y-[10px]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Analytics
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative transition-colors ${showNotifications ? 'text-[#f3a91d]' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Bell className="w-5 h-5" />
                            {pendingAppointments.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                    {pendingAppointments.length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-4 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#f3a91d]">Notifications</h4>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{pendingAppointments.length} NEW</span>
                                </div>

                                <div className="space-y-1">
                                    {pendingAppointments.length > 0 ? (
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 transition-colors hover:bg-white/10">
                                            <p className="text-xs font-bold text-white mb-1">Pending Approval</p>
                                            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                                                You have <span className="text-[#f3a91d] font-black">{pendingAppointments.length}</span> pending appointments for approval.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-gray-500 italic text-center py-4 font-medium">No new notifications</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-black text-white leading-none">Admin User</p>
                            <p className="text-[9px] font-black text-[#f3a91d] uppercase tracking-[0.1em] mt-1">SHOP OWNER</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
                            <User className="w-5 h-5 text-brand-gold" />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1700px] mx-auto px-6 pt-28 pb-12 flex gap-10">
                {activeTab === 'calendar' ? (
                    <>
                        <div className="w-72 flex-shrink-0 space-y-8">
                            <button
                                onClick={() => navigate('/booking')}
                                className="w-full bg-[#f3a91d] text-black h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e29b1b] transition-all shadow-lg active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                Add New Appointment
                            </button>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">VIEW MODE</p>
                                <div className="bg-[#141414] p-1 rounded-xl flex border border-white/5">
                                    <button
                                        onClick={() => setViewMode('daily')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'daily' ? 'bg-[#222222] text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        onClick={() => setViewMode('weekly')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'weekly' ? 'bg-[#222222] text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        Weekly
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">ACTIVE BARBERS</p>
                                <div className="space-y-3">
                                    {BARBER_DATA.map(barber => (
                                        <label key={barber.name} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={activeBarbers.includes(barber.name)}
                                                    onChange={() => {
                                                        if (activeBarbers.includes(barber.name)) {
                                                            setActiveBarbers(activeBarbers.filter(n => n !== barber.name));
                                                        } else {
                                                            setActiveBarbers([...activeBarbers, barber.name]);
                                                        }
                                                    }}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-5 h-5 border-2 border-[#f3a91d]/30 rounded-md peer-checked:bg-[#f3a91d] peer-checked:border-[#f3a91d] transition-all" />
                                                <Check className="absolute inset-0 w-3.5 h-3.5 m-auto text-black opacity-0 peer-checked:opacity-100 transition-all" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all">
                                                <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className={`text-sm font-semibold transition-all ${activeBarbers.includes(barber.name) ? 'text-white' : 'text-gray-500'}`}>
                                                {barber.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">QUICK STATS</p>
                                <div className="space-y-3">
                                    <div className="bg-[#141414] p-5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 font-bold mb-1">Total Appointments</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black">{stats.total}</span>
                                            <span className="text-xs font-bold text-[#10b981]">+12%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">PENDING APPROVAL</p>
                                    <span className="bg-[#f3a91d]/20 text-[#f3a91d] text-[10px] font-black px-2 py-0.5 rounded-full">{pendingAppointments.length}</span>
                                </div>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {pendingAppointments.length === 0 ? (
                                        <p className="text-xs text-gray-500 italic">No pending appointments.</p>
                                    ) : (
                                        pendingAppointments.map(app => (
                                            <div key={app._id} className="bg-[#1a1814] border-l-4 border-[#f3a91d] p-4 rounded-xl shadow-lg shadow-[#f3a91d]/5 transition-all hover:scale-[1.02]">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="font-black text-sm text-white uppercase leading-none truncate">
                                                        {typeof app.customerId === 'object' ? `${app.customerId.firstName} ${app.customerId.lastName}` : 'Guest'}
                                                    </p>
                                                    <span className="text-[9px] font-bold text-gray-400">
                                                        {new Date(app.appointmentDate).toLocaleDateString()} {app.appointmentTime}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 space-y-1">
                                                    <p className="flex justify-between"><span>Barber:</span> <span className="text-white">{app.barberName}</span></p>
                                                    <p className="flex justify-between"><span>Service:</span> <span className="text-[#f3a91d]">{app.serviceName}</span></p>
                                                </div>
                                                {app.notes && (
                                                    <div className="bg-white/5 rounded-lg p-2.5 mb-3 border border-white/5">
                                                        <p className="text-[10px] text-gray-300 italic leading-relaxed">
                                                            <span className="text-[#f3a91d] font-bold not-italic mr-1">Note:</span>
                                                            {app.notes}
                                                        </p>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={(e) => handleApprove(e, app._id)}
                                                    className="w-full bg-[#10b981] text-white text-[10px] font-black py-2 rounded uppercase hover:bg-[#0ea5e9] transition-colors"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <h2 className="text-2xl font-black tracking-tight uppercase">
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
                                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
                                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedDate(new Date())}
                                            className="bg-[#1a1a1a] px-4 py-1.5 rounded-lg text-[10px] font-black border border-white/5 hover:bg-[#222222] transition-all"
                                        >
                                            TODAY
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirmed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#f3a91d]" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</span>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 bg-[#141414]/30 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col relative h-[900px]">

                                {timeToPosition && (
                                    <div
                                        className="absolute left-0 right-0 z-40 flex items-center pointer-events-none"
                                        style={{ top: `${timeToPosition}px` }}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] ml-28 -translate-x-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                        <div className="flex-1 h-[1px] bg-[#ef4444]" />
                                        <div className="bg-[#ef4444] px-2 py-0.5 rounded-md text-[9px] font-black text-white absolute left-28 translate-x-3">
                                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                )}


                                <div className="flex border-b border-white/5 bg-[#0d0d0d]/80 backdrop-blur-md sticky top-0 z-30">
                                    <div className="w-28 flex-shrink-0" />
                                    {BARBER_DATA.filter(b => activeBarbers.includes(b.name)).map(barber => (
                                        <div key={barber.name} className="flex-1 py-8 text-center border-r border-white/5 last:border-r-0">
                                            <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-3 border-2 border-white/10 shadow-2xl relative group">
                                                <img src={barber.image} alt={barber.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            </div>
                                            <h3 className="text-sm font-black text-white leading-tight uppercase tracking-tight">{barber.name}</h3>
                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">{barber.title}</p>
                                        </div>
                                    ))}
                                </div>


                                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                                    <div className="flex min-h-full">

                                        <div className="w-28 flex-shrink-0 flex flex-col bg-[#0d0d0d]/10">
                                            {timeSlots.map(time => (
                                                <div key={time} className="h-[140px] px-6 text-right pt-4 border-b border-white/[0.02]">
                                                    <span className="text-[11px] font-black text-gray-600 uppercase tracking-tighter">{time}</span>
                                                </div>
                                            ))}
                                        </div>


                                        {BARBER_DATA.filter(b => activeBarbers.includes(b.name)).map(barber => (
                                            <div key={barber.name} className="flex-1 flex flex-col border-r border-white/[0.02] last:border-r-0 relative">
                                                {timeSlots.map(time => {
                                                    const app = getAppointmentForSlot(barber.name, time);
                                                    return (
                                                        <div key={time} className="h-[140px] p-2 border-b border-white/[0.02] group/slot relative">
                                                            {app ? (
                                                                <div
                                                                    className={`h-full rounded-2xl p-4 flex flex-col justify-between border-l-4 transition-all hover:scale-[1.02] hover:shadow-2xl z-20 relative cursor-pointer
                                                                bg-[#141a14] border-[#10b981] shadow-lg shadow-[#10b981]/5`}
                                                                >
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="min-w-0">
                                                                            <p className="font-black text-xs text-white uppercase leading-none truncate mb-1.5">
                                                                                {typeof app.customerId === 'object' ? `${app.customerId.firstName} ${app.customerId.lastName}` : 'Guest'}
                                                                            </p>
                                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">
                                                                                {app.serviceName}
                                                                            </p>
                                                                            {app.notes && (
                                                                                <p className="text-[14px] text-gray-500 italic mt-1 truncate" title={app.notes}>
                                                                                    📝 {app.notes}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <GripVertical className="w-3.5 h-3.5 text-gray-700 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    </div>

                                                                    <div className="flex items-center justify-between pt-2">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Repeat className="w-3 h-3 text-gray-700" />
                                                                            <Info className="w-3 h-3 text-gray-700" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="h-full border border-dashed border-white/[0.05] rounded-2xl flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-all cursor-pointer hover:bg-white/[0.02]">
                                                                    <Plus className="w-4 h-4 text-gray-800" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <AnalyticsView appointments={appointments} />
                )}
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-white/5 px-8 py-2.5 flex items-center justify-between z-50 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                        System Status: <span className="text-white">Live</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/10" />
                    <div>Last Sync: <span className="text-white">Just now</span></div>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Support</a>
                    <span className="text-gray-800">v2.4.0</span>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(243, 169, 29, 0.2);
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
