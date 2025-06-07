import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Newspaper, CalendarCheck, BarChart3, Users, Edit, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import AdBanner from '@/components/AdBanner.jsx';

const initialNewsData = [
  { id: 'news1', title: "Nuevo Sponsor para la Liga", date: "2025-05-19", content: "La liga se complace en anunciar un nuevo acuerdo de patrocinio con \"Empresa X\" para la temporada actual." },
  { id: 'news2', title: "Cambios en el Fixture Sub-17", date: "2025-05-18", content: "Atención: El partido de la categoría Sub-17 entre Equipo A y Equipo B ha sido reprogramado." }
];

const HomePage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [adsData, setAdsData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    const storedNews = localStorage.getItem('soccerNews');
    if (storedNews) {
      setNewsItems(JSON.parse(storedNews));
    } else {
      setNewsItems(initialNewsData);
      localStorage.setItem('soccerNews', JSON.stringify(initialNewsData));
    }

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
  
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="space-y-8 pb-16 md:pb-8">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center py-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg shadow-xl relative"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
          ¡Vive la Liga!
        </h1>
        <p className="mt-4 max-w-md mx-auto text-lg text-primary-foreground/90 px-4">
          Resultados, fixture, tablas y todas las novedades del fútbol local.
        </p>
        <Link to="/admin?tab=news" className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </motion.section>

      <section className="px-1">
        <AdBanner 
          adData={adsData['home_main']}
          defaultAltText="Patrocina la liga - Banner Principal"
          className="mb-8 h-48 md:h-64"
          imageClassName="rounded-md"
        >
          {!adsData['home_main']?.imageUrl && "Banner publicitario principal para patrocinadores"}
        </AdBanner>
      </section>

      <section className="px-1">
        <h2 className="text-2xl font-semibold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/fixture">
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow h-full">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <CalendarCheck className="h-10 w-10 text-primary mb-2" />
                  <p className="font-semibold text-sm">Próximos Partidos</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
          <Link to="/resultados">
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-secondary/20 transition-shadow h-full">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Newspaper className="h-10 w-10 text-secondary mb-2" />
                  <p className="font-semibold text-sm">Últimos Resultados</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
          <Link to="/tablas">
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-accent/20 transition-shadow h-full">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <BarChart3 className="h-10 w-10 text-accent mb-2" />
                  <p className="font-semibold text-sm">Ver Tablas</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
           <Link to="/equipos">
            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow h-full">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <p className="font-semibold text-sm">Explorar Equipos</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>
      </section>
      
      <section className="px-1">
         <AdBanner 
          adData={adsData['home_secondary']}
          defaultAltText="Publicidad secundaria - Entre secciones"
          className="my-6 h-32 md:h-40"
          imageClassName="rounded-md"
        >
          {!adsData['home_secondary']?.imageUrl && "Banner publicitario secundario"}
        </AdBanner>
      </section>

      <section className="px-1">
        <h2 className="text-2xl font-semibold mb-4 text-center">Novedades Destacadas</h2>
        {newsItems.length > 0 ? (
          <div className="space-y-4">
            {newsItems.slice(0, 3).map((item, index) => ( 
              <motion.div key={item.id} custom={index + 4} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="bg-card/70 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{formatDate(item.date)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{item.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" size="sm" className="text-accent p-0">Leer Más <ArrowRight className="ml-1 h-4 w-4"/></Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground text-base py-4"
          >
            No hay novedades por el momento.
          </motion.p>
        )}
      </section>
    </div>
  );
};

export default HomePage;