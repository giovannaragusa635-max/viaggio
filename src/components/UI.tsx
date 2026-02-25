import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Shield, Users, Utensils, Navigation, Camera, AlertCircle, Heart } from 'lucide-react';

export const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
        <Navigation className="text-black w-5 h-5" />
      </div>
      <span className="font-display font-bold text-xl tracking-tight">VibeRoute</span>
    </div>
    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
      <a href="#" className="hover:text-brand-primary transition-colors">Esplora</a>
      <a href="#" className="hover:text-brand-primary transition-colors">Sicurezza</a>
      <a href="#" className="hover:text-brand-primary transition-colors">Social</a>
      <a href="#" className="hover:text-brand-primary transition-colors">Sapori</a>
    </nav>
    <button className="btn-primary py-2 text-sm">Unisciti ora</button>
  </header>
);

export const FeatureCard = ({ icon: Icon, title, description, color, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="card-vibe group cursor-pointer"
  >
    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-${color}/10 text-${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-brand-primary transition-colors">{title}</h3>
    <p className="text-white/60 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export const BottomNav = () => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 glass px-6 py-4 flex items-center justify-between rounded-t-3xl border-t border-white/10">
    <button className="flex flex-col items-center gap-1 text-brand-primary">
      <MapPin className="w-6 h-6" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Mappa</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-white/40">
      <Users className="w-6 h-6" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Social</span>
    </button>
    <div className="relative -top-8">
      <button className="w-14 h-14 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
        <Navigation className="text-black w-6 h-6" />
      </button>
    </div>
    <button className="flex flex-col items-center gap-1 text-white/40">
      <Utensils className="w-6 h-6" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Sapori</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-white/40">
      <Camera className="w-6 h-6" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Lente</span>
    </button>
  </div>
);
