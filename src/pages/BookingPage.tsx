import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Scissors, Calendar, Star, Check, ChevronRight, Clock,
    ChevronLeft, History, List
} from 'lucide-react';
import { createAppointment } from '../store/slices/appointmentSlice';
import toast from 'react-hot-toast';
import type { AppDispatch, RootState } from '../store';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axiosConfig';

const BookingPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading: apiLoading } = useSelector((state: RootState) => state.appointments);
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [step, setStep] = useState(1);
    const [selectedBarber, setSelectedBarber] = useState<any>(null);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [busySlots, setBusySlots] = useState<string[]>([]);


    const [notes, setNotes] = useState('');

    const navigate = useNavigate();



    useEffect(() => {
        if (selectedBarber && selectedDate) {
            api.get(`/appointments/busy-slots?barberName=${selectedBarber.name}&date=${selectedDate}`)
                .then(res => setBusySlots(res.data))
                .catch(err => console.error('Error fetching busy slots:', err));
        }
    }, [selectedBarber, selectedDate]);

    const barbers = [
        { id: 1, name: 'Sebastian Thorne', specialty: 'Beard Design & Classic Cut', rating: 4.9, reviews: 124, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop' },
        { id: 2, name: 'Arthur Sterling', specialty: 'Modern Fade & Styling', rating: 4.8, reviews: 98, image: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop' },
        { id: 3, name: 'Marco Rossi', specialty: 'Hair Tattoo & Art', rating: 5.0, reviews: 56, image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1887&auto=format&fit=crop' }
    ];

    const services = [
        { id: 1, name: 'Haircut', price: '$50', duration: '45 min' },
        { id: 2, name: 'Beard Trim', price: '$20', duration: '30 min' },
        { id: 3, name: 'Facial Care', price: '$30', duration: '30 min' },
    ];

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
        '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];

    const handleServiceToggle = (service: any) => {
        if (selectedServices.find(s => s.id === service.id)) {
            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    if (step === 4) {
        return (
            <div className="min-h-screen bg-[#0a0a05] text-white font-sans flex flex-col items-center pt-24 pb-10 px-4">
                <Navbar />

                <div className="flex flex-col items-center max-w-xl w-full">
                    <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-brand-gold/20">
                        <Check className="w-8 h-8 text-brand-dark" strokeWidth={3} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black mb-3 text-center uppercase tracking-tight text-white">Appointment Created!</h1>
                    <p className="text-gray-400 text-center mb-10 max-w-sm text-sm">
                        Your appointment has been successfully confirmed. You can find the details below. Please arrive 5 minutes before your appointment time.
                    </p>

                    <div className="relative w-full rounded-2xl overflow-hidden bg-[#1a1a0f] border border-white/5 backdrop-blur-md">

                        <div className="relative h-40 overflow-hidden">
                            <img
                                src={selectedBarber?.image}
                                className="w-full h-full object-cover"
                                alt="Barber"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a0f] via-[#1a1a0f]/40 to-transparent" />
                            <div className="absolute bottom-6 left-8">
                                <span className="text-brand-gold text-[10px] font-bold tracking-widest uppercase block mb-1">YOUR BARBER</span>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{selectedBarber?.name}</h3>
                            </div>
                            <div className="absolute bottom-6 right-8 bg-brand-gold p-2 rounded-full shadow-xl">
                                <Scissors className="w-5 h-5 text-brand-dark" />
                            </div>
                        </div>


                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/5 p-3 rounded-xl mt-1 text-white">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">DATE</p>
                                        <p className="text-lg font-bold text-white">
                                            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }) : 'October 24 2023, Tuesday'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/5 p-3 rounded-xl mt-1 text-white">
                                        <List className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1 text-gray-500">SERVICES</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedServices.map(s => (
                                                <span key={s.id} className="text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-300">
                                                    {s.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/5 p-3 rounded-xl mt-1 text-white">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">TIME</p>
                                        <p className="text-lg font-bold text-white">{selectedTime || '14:30'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#14140a] p-6 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                            <Link to="/profile" className="flex-1">
                                <button className="w-full border border-white/10 hover:bg-white/5 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm text-white">
                                    <History className="w-4 h-4" />
                                    My Appointments
                                </button>
                            </Link>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-10 text-gray-500 hover:text-brand-gold transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>

                <div className="w-full mt-24">
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a05] text-white font-sans pt-20 pb-10">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                    <div className="text-left">
                        <h1 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-tighter text-white">
                            {step === 1 && 'Choose Your Barber'}
                            {step === 2 && 'Select Services'}
                            {step === 3 && 'Choose Date and Time'}
                        </h1>
                        <p className="text-gray-500 text-base">
                            {step === 1 && 'Start by choosing the professional that suits you best.'}
                            {step === 2 && 'Add the services you need to your cart.'}
                            {step === 3 && 'Choose a time slot when you are available.'}
                        </p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                        <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Step {step} / 3</span>
                    </div>
                </div>

                <div className="relative mb-16">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-gold transition-all duration-500"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {step === 1 && (
                    <div className="flex flex-wrap justify-center gap-6 mb-16">
                        {barbers.map((barber) => (
                            <div
                                key={barber.id}
                                onClick={() => setSelectedBarber(barber)}
                                className={`relative group cursor-pointer transition-all duration-500 rounded-2xl overflow-hidden bg-[#1a1a0f] border border-white/5 shadow-2xl w-full sm:w-64 ${selectedBarber?.id === barber.id ? 'border-brand-gold ring-4 ring-brand-gold/10 scale-[1.02]' : 'hover:border-white/20'
                                    }`}
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img src={barber.image} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a0f] via-transparent to-transparent opacity-60" />
                                    {selectedBarber?.id === barber.id && (
                                        <div className="absolute top-3 right-3 bg-brand-gold p-1 rounded-full shadow-lg">
                                            <Check className="w-3.5 h-3.5 text-brand-dark" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 text-left">
                                    <h3 className="text-lg font-bold mb-1 uppercase tracking-tight text-white">{barber.name}</h3>
                                    <p className="text-[10px] text-gray-500 mb-3 uppercase font-bold tracking-widest">{barber.specialty}</p>
                                    <div className="flex items-center gap-1 text-brand-gold mb-5">
                                        <Star className="w-3.5 h-3.5 fill-brand-gold" />
                                        <span className="text-xs font-bold">{barber.rating}</span>
                                        <span className="text-[10px] text-gray-600 ml-1">({barber.reviews} Reviews)</span>
                                    </div>
                                    <button className={`w-full py-2.5 rounded-lg font-bold transition-all text-xs ${selectedBarber?.id === barber.id ? 'bg-brand-gold text-brand-dark' : 'bg-white/5 text-gray-400'
                                        }`}>
                                        {selectedBarber?.id === barber.id ? 'Selected' : 'Select'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-3xl mx-auto space-y-4 mb-20 text-white">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => handleServiceToggle(service)}
                                className={`flex items-center justify-between p-6 rounded-2xl border transition-all cursor-pointer group ${selectedServices.find(s => s.id === service.id)
                                    ? 'bg-brand-gold/10 border-brand-gold shadow-lg'
                                    : 'bg-white/5 border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedServices.find(s => s.id === service.id) ? 'bg-brand-gold border-brand-gold' : 'border-white/20'
                                        }`}>
                                        {selectedServices.find(s => s.id === service.id) && <Check className="w-4 h-4 text-brand-dark" strokeWidth={3} />}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-lg text-white">{service.name}</h4>
                                        <p className="text-sm text-gray-500">{service.duration}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-brand-gold font-black text-xl">{service.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Date Selection</h3>
                                <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full font-bold border border-brand-gold/20">
                                    NEXT 7 DAYS
                                </span>
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {Array.from({ length: 7 }, (_, i) => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + i);
                                    const isoDate = date.toISOString().split('T')[0];
                                    const isSelected = selectedDate === isoDate;

                                    return (
                                        <button
                                            key={isoDate}
                                            onClick={() => setSelectedDate(isoDate)}
                                            className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${isSelected
                                                ? 'bg-brand-gold border-brand-gold text-brand-dark shadow-xl shadow-brand-gold/20 scale-105'
                                                : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'
                                                }`}
                                        >
                                            <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-brand-dark/60' : 'text-gray-500'}`}>
                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                            <span className={`text-2xl font-black ${isSelected ? 'text-brand-dark' : 'text-white'}`}>{date.getDate()}</span>
                                            <span className={`text-[9px] font-bold mt-1 ${isSelected ? 'text-brand-dark/80' : 'text-brand-gold'}`}>
                                                {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Available Times</h3>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                                    <Clock className="w-3 h-3" />
                                    30 MIN INTERVALS
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {timeSlots.map(time => {
                                    const isBusy = busySlots.includes(time);
                                    return (
                                        <button
                                            key={time}
                                            onClick={() => !isBusy && setSelectedTime(time)}
                                            disabled={isBusy}
                                            className={`py-3.5 rounded-xl font-bold transition-all border text-sm flex flex-col items-center justify-center gap-1 ${selectedTime === time
                                                ? 'bg-brand-gold border-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20'
                                                : isBusy
                                                    ? 'bg-red-500/10 border-red-500/20 text-red-500/50 cursor-not-allowed'
                                                    : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {time}
                                            {isBusy && <span className="text-[8px] uppercase font-black">Full</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {user?.role === 'ADMIN' && (
                            <div className="space-y-4 pt-6 border-t border-white/10 mt-8">
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-[#f3a91d]">ADD NOTE</h3>
                                <p className="text-sm text-gray-400 mb-4">You can add a note to the appointment. This note will be visible in the admin panel.</p>
                                <textarea
                                    placeholder="e.g., Customer name, special request, reminder..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full bg-[#1a1a0f] border border-white/10 p-4 rounded-xl text-white placeholder:text-gray-600 outline-none focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/20 transition-all resize-none"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="border-t border-white/5 pt-12 flex justify-between items-center text-white">
                    <button
                        onClick={() => step === 1 ? navigate('/') : setStep(step - 1)}
                        className="px-10 py-4 rounded-2xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-all flex items-center gap-2 group text-white"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <button
                        onClick={async () => {
                            if (step < 3) {
                                setStep(step + 1);
                            } else {
                                if (!isAuthenticated) {
                                    navigate('/login');
                                    return;
                                }

                                const appointmentData = {
                                    barberName: selectedBarber.name,
                                    serviceName: selectedServices.map((s: any) => s.name).join(', '),
                                    appointmentDate: selectedDate!,
                                    appointmentTime: selectedTime!,
                                    ...(notes.trim() ? { notes: notes.trim() } : {})
                                };
                                const resultAction = await dispatch(createAppointment(appointmentData));
                                if (createAppointment.fulfilled.match(resultAction)) {
                                    setStep(4);
                                    toast.success('Appointment created successfully!');
                                } else {
                                    toast.error(resultAction.payload as string || 'Failed to create appointment');
                                }
                            }
                        }}
                        disabled={
                            apiLoading ||
                            (isAuthenticated && (
                                (step === 1 && !selectedBarber) ||
                                (step === 2 && selectedServices.length === 0) ||
                                (step === 3 && (!selectedDate || !selectedTime))
                            ))
                        }
                        className={`px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-2xl ${(!isAuthenticated || (step === 1 && selectedBarber) || (step === 2 && selectedServices.length > 0) || (step === 3 && selectedDate && selectedTime))
                            ? 'bg-brand-gold text-brand-dark hover:scale-105 active:scale-95 shadow-brand-gold/20'
                            : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                            }`}
                    >
                        {apiLoading ? 'Processing...' : (step === 3 ? 'Complete' : 'Continue')}
                        {!apiLoading && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="mt-24">
                <Footer />
            </div>
        </div>
    );
};

export default BookingPage;
