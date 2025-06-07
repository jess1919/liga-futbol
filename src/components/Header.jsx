import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag as SoccerBall, Home, Users, CalendarDays, Trophy, ListOrdered, Menu, X, UserCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AdBanner from '@/components/AdBanner.jsx';


const navItems = [
  { href: '/', label: 'Inicio', icon: <Home className="h-5 w-5 mr-3" /> },
  { href: '/equipos', label: 'Equipos', icon: <Users className="h-5 w-5 mr-3" /> },
  { href: '/fixture', label: 'Fixture', icon: <CalendarDays className="h-5 w-5 mr-3" /> },
  { href: '/resultados', label: 'Resultados', icon: <Trophy className="h-5 w-5 mr-3" /> },
  { href: '/tablas', label: 'Tablas', icon: <ListOrdered className="h-5 w-5 mr-3" /> },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const mobileMenuVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.3 } },
    exit: { x: '-100%', opacity: 0, transition: { type: 'tween', duration: 0.3 } },
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden text-foreground hover:text-primary">
              <Menu className="h-6 w-6" />
            </Button>
            
            <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors" onClick={closeMobileMenu}>
              <SoccerBall className="h-7 w-7" />
              <span className="font-bold text-lg tracking-tight">LigaDeFutbol</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.label} to={item.href}>
                  <Button variant={location.pathname === item.href ? "secondary" : "ghost"} size="sm" className="flex items-center text-xs">
                    {React.cloneElement(item.icon, { className: "h-4 w-4 mr-1.5"})}
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link to="/admin">
                  <Button variant={location.pathname === "/admin" ? "secondary" : "ghost"} size="sm" className="flex items-center text-xs">
                    <Settings className="h-4 w-4 mr-1.5" />
                    Admin
                  </Button>
                </Link>
            </div>
            
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary md:hidden"> {/* Hide on md and up */}
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>
          <div className="hidden md:block py-1 border-t border-border/20">
             <AdBanner 
                adData={adsData['header_main']}
                defaultAltText="Publicidad en cabecera"
                className="w-full max-w-2xl mx-auto h-12" 
                imageClassName="object-contain rounded-sm"
              >
                {!adsData['header_main']?.imageUrl && "Banner discreto en cabecera"}
              </AdBanner>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-card shadow-xl z-50 p-6 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="flex items-center space-x-2 text-primary" onClick={closeMobileMenu}>
                  <SoccerBall className="h-8 w-8" />
                  <span className="font-bold text-xl">LigaDeFutbol</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={closeMobileMenu} className="text-foreground hover:text-primary">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link key={item.label} to={item.href} onClick={closeMobileMenu}>
                    <Button 
                      variant={location.pathname === item.href ? "secondary" : "ghost"} 
                      className={cn(
                        "w-full justify-start text-lg py-3 px-4",
                        location.pathname === item.href ? "text-secondary-foreground" : "text-foreground hover:bg-muted/50 hover:text-primary"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                ))}
                 <Link to="/admin" onClick={closeMobileMenu}>
                    <Button 
                      variant={location.pathname === "/admin" ? "secondary" : "ghost"} 
                      className={cn(
                        "w-full justify-start text-lg py-3 px-4",
                        location.pathname === "/admin" ? "text-secondary-foreground" : "text-foreground hover:bg-muted/50 hover:text-primary"
                      )}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Admin
                    </Button>
                  </Link>
              </nav>
              <div className="mt-auto pt-6 border-t border-border">
                 <Button variant="outline" className="w-full text-lg py-3">
                    <UserCircle className="h-5 w-5 mr-3" />
                    Iniciar Sesión
                  </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;