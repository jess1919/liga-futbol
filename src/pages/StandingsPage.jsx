import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ListOrdered, ShieldAlert, Award, Settings, Filter, XCircle } from 'lucide-react';
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


const StandingsPage = () => {
  const [positions, setPositions] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [cautioned, setCautioned] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Primera');

  const loadData = useCallback(() => {
    const storedPositions = JSON.parse(localStorage.getItem('soccerPositions') || '[]');
    setPositions(storedPositions);

    const storedScorers = JSON.parse(localStorage.getItem('soccerScorers') || '[]');
    setScorers(storedScorers);
    
    const storedCautioned = JSON.parse(localStorage.getItem('soccerCautioned') || '[]');
    setCautioned(storedCautioned);

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
    
    const categoriesFromStorage = [
      ...new Set([
        ...JSON.parse(localStorage.getItem('soccerFixture') || '[]').map(f => f.category),
        ...storedPositions.map(p => p.category),
        ...storedScorers.map(s => s.category),
        ...storedCautioned.map(c => c.category),
        ...JSON.parse(localStorage.getItem('soccerResults') || '[]').map(r => r.category)
      ])
    ];

    const defaultCategories = ["Primera", "Reserva", "Sub-17", "Sub-15"];
    const uniqueCategories = [...new Set([...defaultCategories, ...categoriesFromTeams, ...categoriesFromStorage])].filter(Boolean).sort();
    setAllCategories(uniqueCategories);

    if (!uniqueCategories.includes(selectedCategory) && uniqueCategories.length > 0) {
      setSelectedCategory(uniqueCategories[0]);
    } else if (uniqueCategories.length === 0 && !defaultCategories.includes(selectedCategory)) {
       setSelectedCategory("Primera");
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadData();
    const handleStorageChange = (event) => {
      if (['soccerTeams', 'soccerPositions', 'soccerScorers', 'soccerCautioned', 'soccerResults', 'soccerFixture'].includes(event.key)) {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadData]);


  const tableContainerVariants = {
    hidden: { opacity: 0, y:10 },
    visible: { opacity: 1, y:0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const filteredPositions = positions
    .filter(p => p.category === selectedCategory)
    .sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dg !== a.dg) return b.dg - a.dg;
        return b.gf - a.gf;
    }).map((p, index) => ({...p, pos: index + 1}));

  const filteredScorers = scorers
    .filter(s => s.category === selectedCategory)
    .sort((a,b) => b.totalGoals - a.totalGoals)
    .map((s, i) => ({...s, rank: i + 1}));

  const filteredCautioned = cautioned
    .filter(c => c.category === selectedCategory)
    .sort((a,b) => new Date(b.date) - new Date(a.date));
  
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
            <ListOrdered className="mr-2 h-8 w-8 text-primary" />
            Tablas
          </h1>
          <Link to="/admin?tab=tables">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              Gestionar Tablas
            </Button>
          </Link>
        </div>
         <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-card/50 rounded-lg shadow mb-4">
          <Label htmlFor="categoryFilterPublic" className="text-sm font-medium whitespace-nowrap">
            <Filter className="inline h-4 w-4 mr-1.5 text-secondary" />
            Ver Categoría:
          </Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="categoryFilterPublic" className="w-full sm:w-auto bg-background/70 border-border text-foreground flex-grow">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.length > 0 ? (
                allCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))
              ) : (
                <SelectItem value="no_categories" disabled>No hay categorías disponibles</SelectItem>
              )}
            </SelectContent>
          </Select>
          {allCategories.length > 1 && selectedCategory !== allCategories[0] && ( // Assuming first category is like 'all' or default
             <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(allCategories[0] || 'Primera')} className="text-muted-foreground hover:text-destructive">
              <XCircle className="h-4 w-4 mr-1" /> Volver a por defecto
            </Button>
          )}
        </div>
      </motion.div>

      <Tabs defaultValue="positions" className="w-full px-1">
        <TabsList className="grid w-full grid-cols-3 bg-card p-1 h-auto rounded-lg shadow-md">
          <TabsTrigger value="positions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all text-xs sm:text-sm py-2">
            <ListOrdered className="mr-1 h-4 w-4" />Posiciones
          </TabsTrigger>
          <TabsTrigger value="scorers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all text-xs sm:text-sm py-2">
            <Award className="mr-1 h-4 w-4" />Goleadores
          </TabsTrigger>
          <TabsTrigger value="cautioned" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all text-xs sm:text-sm py-2">
            <ShieldAlert className="mr-1 h-4 w-4" />Amonestados
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
        <motion.div key={selectedCategory} variants={tableContainerVariants} initial="hidden" animate="visible" exit="exit" className="mt-4">
          <TabsContent value="positions">
            <Card className="bg-card/70 backdrop-blur-sm shadow-xl">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Posiciones - {selectedCategory}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {filteredPositions.length > 0 ? (
                  <table className="w-full min-w-[400px] text-xs text-left">
                    <thead className="text-muted-foreground uppercase bg-background/20">
                      <tr>
                        <th scope="col" className="px-2 py-2">#</th>
                        <th scope="col" className="px-2 py-2">Equipo</th>
                        <th scope="col" className="px-1 py-2 text-center">PJ</th>
                        <th scope="col" className="px-1 py-2 text-center">G</th>
                        <th scope="col" className="px-1 py-2 text-center">E</th>
                        <th scope="col" className="px-1 py-2 text-center">P</th>
                        <th scope="col" className="px-1 py-2 text-center hidden sm:table-cell">GF</th>
                        <th scope="col" className="px-1 py-2 text-center hidden sm:table-cell">GC</th>
                        <th scope="col" className="px-1 py-2 text-center">DG</th>
                        <th scope="col" className="px-2 py-2 text-center">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPositions.map((row) => (
                        <tr key={row.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-2 py-2 font-medium text-center">{row.pos}</td>
                          <td className="px-2 py-2 flex items-center whitespace-nowrap">
                             <img alt={`Logo ${row.team}`} className="h-5 w-5 mr-1.5 rounded-full bg-slate-600 object-cover" src={row.logo || 'https://placehold.co/40x40/222/fff?text=L'} />
                            {row.team}
                          </td>
                          <td className="px-1 py-2 text-center">{row.pj}</td>
                          <td className="px-1 py-2 text-center">{row.pg}</td>
                          <td className="px-1 py-2 text-center">{row.pe}</td>
                          <td className="px-1 py-2 text-center">{row.pp}</td>
                          <td className="px-1 py-2 text-center hidden sm:table-cell">{row.gf}</td>
                          <td className="px-1 py-2 text-center hidden sm:table-cell">{row.gc}</td>
                          <td className="px-1 py-2 text-center">{row.dg}</td>
                          <td className="px-2 py-2 text-center font-bold text-primary">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-sm text-muted-foreground text-center p-4">No hay datos de posiciones para la categoría "{selectedCategory}".</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scorers">
             <Card className="bg-card/70 backdrop-blur-sm shadow-xl">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Goleadores - {selectedCategory}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {filteredScorers.length > 0 ? (
                  <table className="w-full min-w-[300px] text-xs text-left">
                    <thead className="text-muted-foreground uppercase bg-background/20">
                      <tr>
                        <th scope="col" className="px-2 py-2">#</th>
                        <th scope="col" className="px-2 py-2">Jugador</th>
                        <th scope="col" className="px-2 py-2 hidden sm:table-cell">Equipo</th>
                        <th scope="col" className="px-2 py-2 text-center">Goles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredScorers.map((row) => (
                         <tr key={row.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-2 py-2 font-medium text-center">{row.rank}</td>
                          <td className="px-2 py-2 flex items-center whitespace-nowrap">
                            <img alt={`Avatar ${row.player}`} className="h-6 w-6 mr-1.5 rounded-full bg-slate-600 object-cover" src={row.avatar || 'https://placehold.co/40x40/333/fff?text=P'} />
                            {row.player}
                          </td>
                          <td className="px-2 py-2 hidden sm:table-cell">{row.team}</td>
                          <td className="px-2 py-2 text-center font-bold text-primary">{row.totalGoals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-sm text-muted-foreground text-center p-4">No hay goleadores para la categoría "{selectedCategory}".</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cautioned">
            <Card className="bg-card/70 backdrop-blur-sm shadow-xl">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Amonestados - {selectedCategory}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {filteredCautioned.length > 0 ? (
                   <table className="w-full min-w-[300px] text-xs text-left">
                    <thead className="text-muted-foreground uppercase bg-background/20">
                      <tr>
                        <th scope="col" className="px-2 py-2">Fecha</th>
                        <th scope="col" className="px-2 py-2">Jugador</th>
                        <th scope="col" className="px-2 py-2 hidden sm:table-cell">Equipo</th>
                        <th scope="col" className="px-2 py-2">Tarjeta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCautioned.map((row) => ( 
                         <tr key={row.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-2 py-2">{new Date(row.date).toLocaleDateString('es-ES')}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{row.player}</td>
                          <td className="px-2 py-2 hidden sm:table-cell">{row.team}</td>
                          <td className={`px-2 py-2 font-semibold ${row.card === 'Roja' ? 'text-destructive' : 'text-yellow-500'}`}>{row.card}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-sm text-muted-foreground text-center p-4">No hay amonestados para la categoría "{selectedCategory}".</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default StandingsPage;