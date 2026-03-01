import { Scissors, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => (
    <footer className="border-t border-white/5 py-12 px-4 bg-brand-dark relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-2 mb-8">
                <Scissors className="w-6 h-6 text-brand-gold" />
                <span className="text-xl font-bold text-white">Cutio</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm text-gray-400 font-medium">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-white transition-colors">Careers</a>
                <a href="#" className="hover:text-white transition-colors">Help</a>
            </div>

            <div className="flex gap-6 mb-12">
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold/10 hover:border-brand-gold/30 hover:text-brand-gold transition-all duration-300">
                    <Instagram className="w-5 h-5 text-gray-400" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold/10 hover:border-brand-gold/30 hover:text-brand-gold transition-all duration-300">
                    <Twitter className="w-5 h-5 text-gray-400" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold/10 hover:border-brand-gold/30 hover:text-brand-gold transition-all duration-300">
                    <Facebook className="w-5 h-5 text-gray-400" />
                </a>
            </div>

            <p className="text-gray-500 text-xs">
                © 2023 Cutio. All rights reserved.
            </p>
        </div>
    </footer>
);

export default Footer;
