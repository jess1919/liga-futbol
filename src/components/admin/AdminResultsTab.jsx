
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CategorySelector from '@/components/CategorySelector';

const ResultForm = ({ formData, onFormChange, onScoreChange, onFixtureMatchSelect, onCategoryChange, fixtureMatches, allCategories, onCategoriesChange, editingResult, onSave, onCancelEdit }) => {
  const isManualEntry = formData.fixtureMatchId === 'manual_entry';
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingResult ? 'Editar Resultado' : 'Añadir Nuevo Resultado'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="fixtureMatchSelect">Seleccionar Partido del Fixture (Opcional)</Label>
          <Select onValueChange={onFixtureMatchSelect} value={formData.fixtureMatchId}>
            <SelectTrigger className="w-full bg-background/70">
              <SelectValue placeholder="Seleccionar un partido..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual_entry">Ingresar manualmente</SelectItem>
              {fixtureMatches.sort((a,b) => new Date(b.date) - new Date(a.date)).map(match => (
                <SelectItem key={match.id} value={match.id}>
                  {new Date(match.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - {match.teamA} vs {match.teamB} ({match.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="resultDate">Fecha</Label>
            <Input type="date" id="resultDate" name="date" value={formData.date} onChange={onFormChange} className="bg-background/70" disabled={!isManualEntry && !!formData.fixtureMatchId}/>
          </div>
          <div>
            <Label htmlFor="resultCategory">Categoría</Label>
            {isManualEntry || !formData.fixtureMatchId ? (
              <CategorySelector
                value={formData.category}
                onChange={onCategoryChange}
                allCategories={allCategories}
                onCategoriesChange={onCategoriesChange}
              />
            ) : (
              <Input id="resultCategory" name="category" value={formData.category} onChange={onFormChange} placeholder="Ej: Primera" className="bg-background/70" disabled={!isManualEntry && !!formData.fixtureMatchId}/>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          <div>
            <Label htmlFor="resultTeamA">Equipo Local</Label>
            <Input id="resultTeamA" name="teamA" value={formData.teamA} onChange={onFormChange} placeholder="Nombre Equipo Local" className="bg-background/70" disabled={!isManualEntry && !!formData.fixtureMatchId}/>
          </div>
           <div>
            <Label htmlFor="resultScoreA">Goles Local</Label>
            <Input type="number" id="resultScoreA" name="scoreA" value={formData.scoreA} onChange={onScoreChange} placeholder="0" className="bg-background/70"/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          <div>
            <Label htmlFor="resultTeamB">Equipo Visitante</Label>
            <Input id="resultTeamB" name="teamB" value={formData.teamB} onChange={onFormChange} placeholder="Nombre Equipo Visitante" className="bg-background/70" disabled={!isManualEntry && !!formData.fixtureMatchId}/>
          </div>
          <div>
            <Label htmlFor="resultScoreB">Goles Visitante</Label>
            <Input type="number" id="resultScoreB" name="scoreB" value={formData.scoreB} onChange={onScoreChange} placeholder="0" className="bg-background/70"/>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {editingResult && <Button variant="outline" onClick={onCancelEdit}>Cancelar Edición</Button>}
        <Button onClick={onSave} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
          <Save className="mr-2 h-4 w-4"/> {editingResult ? 'Actualizar Resultado' : 'Guardar Resultado'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ResultsList = ({ resultsItems, onEdit, onDelete }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
     <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Resultados Cargados</h3>
        {resultsItems.length > 0 ? (
          <div className="space-y-2">
          {resultsItems.sort((a,b) => new Date(b.date) - new Date(a.date)).map(item => (
            <motion.div key={item.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit">
            <Card className="bg-card/50">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">{item.teamA} <span className="font-bold text-primary">{item.scoreA}</span> - <span className="font-bold text-primary">{item.scoreB}</span> {item.teamB}</CardTitle>
                <CardDescription className="text-xs">{item.category} - {new Date(item.date).toLocaleDateString('es-ES')}</CardDescription>
              </CardHeader>
              <CardFooter className="p-2 flex justify-end gap-1 bg-muted/20">
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-blue-500" onClick={() => onEdit(item)}><Edit2 className="h-4 w-4"/></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4"/></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar este resultado?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(item.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">No hay resultados cargados.</p>}
      </div>
  );
};


const AdminResultsTab = () => {
  const { toast } = useToast();
  const [resultsItems, setResultsItems] = useState([]);
  const [editingResult, setEditingResult] = useState(null);
  const [resultFormData, setResultFormData] = useState({ 
    date: '', 
    category: '', 
    teamA: '', 
    scoreA: '', 
    teamB: '', 
    scoreB: '',
    fixtureMatchId: 'manual_entry' 
  });
  const [fixtureMatches, setFixtureMatches] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allTeams, setAllTeams] = useState([]);

  const loadInitialData = useCallback(() => {
    const storedResults = JSON.parse(localStorage.getItem('soccerResults') || '[]');
    setResultsItems(storedResults);
    const storedFixture = JSON.parse(localStorage.getItem('soccerFixture') || '[]');
    setFixtureMatches(storedFixture);
    const storedTeamsData = JSON.parse(localStorage.getItem('soccerTeams') || '[]');
    setAllTeams(storedTeamsData);

    const categoriesFromTeams = storedTeamsData.reduce((acc, team) => {
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
    const categoriesFromResults = storedResults.reduce((acc, result) => {
      if (result.category && !acc.includes(result.category)) {
        acc.push(result.category);
      }
      return acc;
    }, []);
    
    const defaultCategories = ["Primera", "Reserva", "Sub-17", "Sub-15"];
    const uniqueCategories = [...new Set([...defaultCategories, ...categoriesFromTeams, ...categoriesFromFixture, ...categoriesFromResults])].filter(Boolean).sort();
    setAllCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    loadInitialData();
    const handleStorageChange = (event) => {
      if (['soccerTeams', 'soccerFixture', 'soccerResults'].includes(event.key)) {
        loadInitialData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadInitialData]);

  const handleResultChange = (e) => {
    const { name, value } = e.target;
    setResultFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryDataChange = (categoryValue) => {
    setResultFormData(prev => ({ ...prev, category: categoryValue }));
  };
  
  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    const score = value === '' ? '' : parseInt(value, 10);
    if (score === '' || (score >= 0 && score <= 99)) {
       setResultFormData(prev => ({ ...prev, [name]: score }));
    }
  };

  const handleFixtureMatchSelect = (fixtureId) => {
    if (fixtureId === 'manual_entry') {
      setResultFormData(prev => ({
        ...prev,
        fixtureMatchId: 'manual_entry',
        date: '',
        category: '',
        teamA: '',
        teamB: '',
        scoreA: '',
        scoreB: '',
      }));
    } else {
      const selectedMatch = fixtureMatches.find(match => match.id === fixtureId);
      if (selectedMatch) {
        setResultFormData(prev => ({
          ...prev,
          fixtureMatchId: fixtureId,
          date: selectedMatch.date ? new Date(selectedMatch.date).toISOString().split('T')[0] : '',
          category: selectedMatch.category,
          teamA: selectedMatch.teamA,
          teamB: selectedMatch.teamB,
          scoreA: '', 
          scoreB: '', 
        }));
         if (selectedMatch.category && !allCategories.includes(selectedMatch.category)) {
          setAllCategories(prevCats => [...new Set([...prevCats, selectedMatch.category])].sort());
        }
      }
    }
  };

  const adjustTeamStats = (teamName, category, goalsFor, goalsAgainst, resultType, operation = 'add') => {
    const storedPositions = JSON.parse(localStorage.getItem('soccerPositions') || '[]');
    let teamPosition = storedPositions.find(p => p.team === teamName && p.category === category);
    const teamData = allTeams.find(t => t.name === teamName);

    const multiplier = operation === 'add' ? 1 : -1;

    if (!teamPosition && operation === 'add') {
      teamPosition = { 
        id: teamData?.id || Date.now().toString() + Math.random(), 
        team: teamName, 
        category, 
        pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0, 
        logo: teamData?.logo || ''
      };
      storedPositions.push(teamPosition);
    } else if (!teamPosition && operation === 'subtract') {
      return; 
    }
    
    teamPosition.pj += (1 * multiplier);
    teamPosition.gf += (goalsFor * multiplier);
    teamPosition.gc += (goalsAgainst * multiplier);
    
    if (resultType === 'win') {
      teamPosition.pg += (1 * multiplier);
      teamPosition.pts += (3 * multiplier);
    } else if (resultType === 'draw') {
      teamPosition.pe += (1 * multiplier);
      teamPosition.pts += (1 * multiplier);
    } else if (resultType === 'loss') {
      teamPosition.pp += (1 * multiplier);
    }
    teamPosition.dg = teamPosition.gf - teamPosition.gc;
    
    const finalPositions = storedPositions.map(p => p.id === teamPosition.id ? teamPosition : p).filter(p => p.pj >= 0); // Ensure pj doesn't go negative
    localStorage.setItem('soccerPositions', JSON.stringify(finalPositions));
  };


  const saveResult = () => {
    const finalCategory = resultFormData.category;

    if (!resultFormData.date || !finalCategory || !resultFormData.teamA || !resultFormData.teamB || resultFormData.scoreA === '' || resultFormData.scoreB === '') {
      toast({ title: "Error", description: "Fecha, categoría, equipos y marcadores son obligatorios.", variant: "destructive" });
      return;
    }
    
    const scoreA = parseInt(resultFormData.scoreA, 10);
    const scoreB = parseInt(resultFormData.scoreB, 10);
    const payload = { ...resultFormData, category: finalCategory, scoreA, scoreB };

    let updatedResults;
    let oldResultData = null;

    if (editingResult) {
      oldResultData = resultsItems.find(item => item.id === editingResult.id);
      updatedResults = resultsItems.map(item => item.id === editingResult.id ? { ...editingResult, ...payload } : item);
    } else {
      updatedResults = [...resultsItems, { id: Date.now().toString(), ...payload }];
    }
    setResultsItems(updatedResults);
    localStorage.setItem('soccerResults', JSON.stringify(updatedResults));

    if (oldResultData) {
      const oldScoreA_val = parseInt(oldResultData.scoreA, 10);
      const oldScoreB_val = parseInt(oldResultData.scoreB, 10);
      let oldResultTypeA_val, oldResultTypeB_val;
      if (oldScoreA_val > oldScoreB_val) { oldResultTypeA_val = 'win'; oldResultTypeB_val = 'loss'; }
      else if (oldScoreA_val < oldScoreB_val) { oldResultTypeA_val = 'loss'; oldResultTypeB_val = 'win'; }
      else { oldResultTypeA_val = 'draw'; oldResultTypeB_val = 'draw'; }
      
      adjustTeamStats(oldResultData.teamA, oldResultData.category, oldScoreA_val, oldScoreB_val, oldResultTypeA_val, 'subtract');
      adjustTeamStats(oldResultData.teamB, oldResultData.category, oldScoreB_val, oldScoreA_val, oldResultTypeB_val, 'subtract');
    }
    
    let currentResultTypeA, currentResultTypeB;
    if (scoreA > scoreB) { currentResultTypeA = 'win'; currentResultTypeB = 'loss'; }
    else if (scoreA < scoreB) { currentResultTypeA = 'loss'; currentResultTypeB = 'win'; }
    else { currentResultTypeA = 'draw'; currentResultTypeB = 'draw'; }

    adjustTeamStats(payload.teamA, finalCategory, scoreA, scoreB, currentResultTypeA, 'add');
    adjustTeamStats(payload.teamB, finalCategory, scoreB, scoreA, currentResultTypeB, 'add');

    if (finalCategory && !allCategories.includes(finalCategory)) {
      setAllCategories(prev => [...new Set([...prev, finalCategory])].sort());
    }

    toast({ title: "Éxito", description: `Resultado ${editingResult ? 'actualizado' : 'guardado'}. La tabla de posiciones ha sido actualizada.` });
    setEditingResult(null);
    setResultFormData({ date: '', category: '', teamA: '', scoreA: '', teamB: '', scoreB: '', fixtureMatchId: 'manual_entry' });
  };

  const editResultItem = (item) => {
    setEditingResult(item);
    setResultFormData({ 
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      category: item.category, 
      teamA: item.teamA, 
      scoreA: item.scoreA, 
      teamB: item.teamB, 
      scoreB: item.scoreB,
      fixtureMatchId: item.fixtureMatchId || 'manual_entry'
    });
  };

  const deleteResultItem = (itemId) => {
    const resultToDelete = resultsItems.find(item => item.id === itemId);
    if (!resultToDelete) return;

    const updatedResults = resultsItems.filter(item => item.id !== itemId);
    setResultsItems(updatedResults);
    localStorage.setItem('soccerResults', JSON.stringify(updatedResults));

    const scoreA = parseInt(resultToDelete.scoreA, 10);
    const scoreB = parseInt(resultToDelete.scoreB, 10);
    let resultTypeA, resultTypeB;
    if (scoreA > scoreB) { resultTypeA = 'win'; resultTypeB = 'loss'; }
    else if (scoreA < scoreB) { resultTypeA = 'loss'; resultTypeB = 'win'; }
    else { resultTypeA = 'draw'; resultTypeB = 'draw'; }
    
    adjustTeamStats(resultToDelete.teamA, resultToDelete.category, scoreA, scoreB, resultTypeA, 'subtract');
    adjustTeamStats(resultToDelete.teamB, resultToDelete.category, scoreB, scoreA, resultTypeB, 'subtract');
    
    toast({ title: "Resultado eliminado", description: "La tabla de posiciones ha sido actualizada.", variant: "destructive" });
  };
  
  const handleCancelEdit = () => {
    setEditingResult(null);
    setResultFormData({ date: '', category: '', teamA: '', scoreA: '', teamB: '', scoreB: '', fixtureMatchId: 'manual_entry' });
  };


  return (
    <div>
      <ResultForm
        formData={resultFormData}
        onFormChange={handleResultChange}
        onScoreChange={handleScoreChange}
        onFixtureMatchSelect={handleFixtureMatchSelect}
        onCategoryChange={handleCategoryDataChange}
        fixtureMatches={fixtureMatches}
        allCategories={allCategories}
        onCategoriesChange={setAllCategories}
        editingResult={editingResult}
        onSave={saveResult}
        onCancelEdit={handleCancelEdit}
      />
      <ResultsList
        resultsItems={resultsItems}
        onEdit={editResultItem}
        onDelete={deleteResultItem}
      />
    </div>
  );
};

export default AdminResultsTab;
