import { useNavigate } from 'react-router-dom';
import { Scissors, Diamond, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
    const navigate = useNavigate();




    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-gold/30">
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/70 to-brand-dark z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
                            alt="Luxury Barber Shop"
                            className="w-full h-full object-cover scale-110 animate-subtle-zoom"
                        />
                    </div>

                    <div className="relative z-20 text-center max-w-4xl px-4 mt-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-wider uppercase mb-8 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                            </span>
                            Premium Experience
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 leading-tight">
                            Where Art <br /> Meets Hair
                        </h1>

                        <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto text-center">
                            Your elite address where modern and classic cuts meet. <br className="hidden md:block" />
                            Personal style consultancy and first-class care services.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <button
                                onClick={() => navigate('/booking')}
                                className="group bg-brand-gold hover:bg-brand-gold/90 text-brand-dark px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-brand-gold/20 text-sm"
                            >
                                Book Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {/* <button className="px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm font-bold border-white/10 hover:bg-white/10 transition-all active:scale-95 text-sm text-white">
                                View Services
                            </button> */}
                        </div>
                    </div>
                </section >

                <section className="py-16 px-4 relative z-20 -mt-15">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-brand-gold/30 transition-all duration-500 group">
                            <div className="bg-brand-gold/10 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <Scissors className="w-8 h-8 text-brand-gold" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Expert Staff</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Let's create the most suitable style for your facial features together with our award-winning, experienced barbers.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-brand-gold/30 transition-all duration-500 group">
                            <div className="bg-brand-gold/10 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <Diamond className="w-8 h-8 text-brand-gold" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Premium Experience</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Feel special with our exclusive treats, relaxing hot towel service, and VIP rooms.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-brand-gold/30 transition-all duration-500 group">
                            <div className="bg-brand-gold/10 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <Calendar className="w-8 h-8 text-brand-gold" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Easy Booking</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Choose your preferred barber and time with our 24/7 online booking system and get served without waiting.
                            </p>
                        </div>
                    </div>
                </section>
            </div >
            <Footer />
        </>
    );
};

export default LandingPage;
