import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Filter, Settings, XCircle } from 'lucide-react';
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

const ResultsPage = () => {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadData = useCallback(() => {
    const storedResults = JSON.parse(localStorage.getItem('soccerResults') || '[]');
    setAllResults(storedResults);

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

    const categoriesFromResults = storedResults.reduce((acc, result) => {
      if (result.category && !acc.includes(result.category)) {
        acc.push(result.category);
      }
      return acc;
    }, []);

    const defaultCategories = ["Primera", "Reserva", "Sub-17", "Sub-15"];
    const uniqueCategories = [...new Set([...defaultCategories, ...categoriesFromTeams, ...categoriesFromResults])].filter(Boolean).sort();
    setAllCategories(uniqueCategories);
  }, []);
  
  useEffect(() => {
    loadData();
    const handleStorageChange = (event) => {
      if (['soccerTeams', 'soccerResults'].includes(event.key)) {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);


  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredResults(allResults.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setFilteredResults(allResults.filter(result => result.category === selectedCategory).sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, [selectedCategory, allResults]);

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no definida";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.07,
        type: "spring",
        stiffness: 120,
      },
    }),
     exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
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
            <Trophy className="mr-2 h-8 w-8 text-primary" />
            Resultados
          </h1>
           <Link to="/admin?tab=results">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              Gestionar
            </Button>
          </Link>
        </div>
         <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-card/50 rounded-lg shadow">
          <Label htmlFor="categoryFilterResults" className="text-sm font-medium whitespace-nowrap">
            <Filter className="inline h-4 w-4 mr-1.5 text-secondary" />
            Filtrar por Categoría:
          </Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="categoryFilterResults" className="w-full sm:w-auto bg-background/70 border-border text-foreground flex-grow">
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
        {filteredResults.length > 0 ? (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{duration: 0.3}}
            className="space-y-4 px-1"
          >
            {filteredResults.map((result, index) => (
              <motion.div key={result.id} custom={index} variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                <Card className="bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-primary/15 transition-all duration-300">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <CardDescription className="text-xs">{result.category} - {formatDate(result.date)}</CardDescription>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      <span className={result.scoreA > result.scoreB ? 'text-primary font-semibold' : 'font-medium'}>{result.teamA}</span>
                      <span className="text-xl font-bold mx-2 px-2 py-0.5 rounded bg-accent text-accent-foreground">{result.scoreA} - {result.scoreB}</span>
                      <span className={result.scoreB > result.scoreA ? 'text-primary font-semibold' : 'font-medium'}>{result.teamB}</span>
                    </CardTitle>
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
            No hay resultados para la categoría "{selectedCategory !== 'all' ? selectedCategory : 'seleccionada'}".
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsPage;