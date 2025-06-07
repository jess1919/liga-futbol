import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CalendarDays, Trophy, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdBanner from '@/components/AdBanner.jsx';

const navItems = [
  { href: '/', label: 'Inicio', icon: <Home className="h-6 w-6" /> },
  { href: '/equipos', label: 'Equipos', icon: <Users className="h-6 w-6" /> },
  { href: '/fixture', label: 'Fixture', icon: <CalendarDays className="h-6 w-6" /> },
  { href: '/resultados', label: 'Resultados', icon: <Trophy className="h-6 w-6" /> },
  { href: '/tablas', label: 'Tablas', icon: <ListOrdered className="h-6 w-6" /> },
];

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const [adsData, setAdsData] = useState({});

  useEffect(() => {
    const storedAds = JSON.parse(localStorage.getItem('soccerAdsData') || '{}');
    setAdsData(storedAds);

     const handleStorageChange = (event) => {
      if (event.key === 'soccerAdsData') {
        setAdsData(JSON.parse(event.target.localStorage.soccerAdsData || '{}'));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      <div className="px-2 pb-2 md:px-4 md:pb-4">
         <AdBanner 
            adData={adsData['footer_main']}
            defaultAltText="Publicidad en pie de página"
            className="w-full max-w-4xl mx-auto h-24 md:h-32"
            imageClassName="rounded-md"
          >
            {!adsData['footer_main']?.imageUrl && "Banner publicitario en footer"}
          </AdBanner>
      </div>
      <motion.footer 
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        className="sticky bottom-0 z-40 w-full border-t border-border/40 bg-card shadow-top md:hidden"
      >
        <nav className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors w-1/5",
                location.pathname === item.href 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </motion.footer>
      <div className="hidden md:block bg-card border-t border-border/40 py-4 text-center text-muted-foreground">
          <p className="text-xs">
            &copy; {currentYear} Liga de Fútbol Ciudad. Todos los derechos reservados.
          </p>
          <p className="text-xs mt-1">
            Desarrollado con <span className="text-primary hover:text-primary/80 cursor-pointer">Hostinger Horizons</span>
          </p>
      </div>
    </>
  );
};

export default Footer;