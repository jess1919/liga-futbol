import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays, Filter, Settings, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const FixturePage = () => {
  const [allFixture, setAllFixture] = useState([]);
  const [filteredFixture, setFilteredFixture] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadData = useCallback(() => {
    const storedFixture = JSON.parse(localStorage.getItem('soccerFixture') || '[]');
    setAllFixture(storedFixture);

    const storedTeams = JSON.parse(localStorage.getItem('soccerTeams') || '[]');
    const categoriesFromTeams = storedTeams.reduce((acc, team) => {
      if (team.categories && Array.isArray(team.categories)) {
        team.categories.forEach(cat => {
          if (cat && cat.name && !acc.includes(cat.name)) {
            acc.push(cat.name);
          }
        });
      }
      return acc;
    }, []);

    const categoriesFromFixture = storedFixture.reduce((acc, match) => {
      if (match.category && !acc.includes(match.category)) {
        acc.push(match.category);
      }
      return acc;
    }, []);
    
    const defaultCategories = ["Primera", "Reserva", "Sub-17", "Sub-15"];
    const uniqueCategories = [...new Set([...defaultCategories, ...categoriesFromTeams, ...categoriesFromFixture])].filter(Boolean).sort();
    setAllCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    loadData();
    const handleStorageChange = (event) => {
      if (['soccerTeams', 'soccerFixture'].includes(event.key)) {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFixture(allFixture.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } else {
      setFilteredFixture(allFixture.filter(match => match.category === selectedCategory).sort((a, b) => new Date(a.date) - new Date(b.date)));
    }
  }, [selectedCategory, allFixture]);


  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no definida";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.07,
        type: "spring",
        stiffness: 100,
      },
    }),
    exit: { opacity: 0, x: 30, transition: { duration: 0.2 } }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-1"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent flex items-center">
            <CalendarDays className="mr-2 h-8 w-8 text-primary" />
            Fixture
          </h1>
          <Link to="/admin?tab=fixture">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              Gestionar
            </Button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-card/50 rounded-lg shadow">
          <Label htmlFor="categoryFilterFixture" className="text-sm font-medium whitespace-nowrap">
            <Filter className="inline h-4 w-4 mr-1.5 text-secondary" />
            Filtrar por Categoría:
          </Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="categoryFilterFixture" className="w-full sm:w-auto bg-background/70 border-border text-foreground flex-grow">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Categorías</SelectItem>
              {allCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategory !== 'all' && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory('all')} className="text-muted-foreground hover:text-destructive">
              <XCircle className="h-4 w-4 mr-1" /> Limpiar Filtro
            </Button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredFixture.length > 0 ? (
          <motion.div 
            key={selectedCategory} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{duration: 0.3}}
            className="space-y-4 px-1"
          >
            {filteredFixture.map((match, index) => (
              <motion.div key={match.id} custom={index} variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                <Card className="bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-primary/15 transition-all duration-300">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-md text-primary leading-tight">{match.teamA} vs {match.teamB}</CardTitle>
                        <CardDescription className="text-xs">{match.category} - {formatDate(match.date)}</CardDescription>
                      </div>
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full whitespace-nowrap">{match.stadium}</span>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p 
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground text-base py-4 px-1"
          >
            No hay partidos programados para la categoría "{selectedCategory !== 'all' ? selectedCategory : 'seleccionada'}".
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FixturePage;