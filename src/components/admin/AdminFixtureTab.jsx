
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit2, Save, MapPin } from 'lucide-react';
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

const AdminFixtureTab = () => {
  const { toast } = useToast();
  const [fixtureItems, setFixtureItems] = useState([]);
  const [editingFixture, setEditingFixture] = useState(null);
  const [fixtureFormData, setFixtureFormData] = useState({ 
    date: '', 
    category: '', 
    teamA: '', 
    teamB: '', 
    stadium: '', 
    locationUrl: '',
    teamAId: 'manual_entry',
    teamBId: 'manual_entry'
  });
  const [allTeams, setAllTeams] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const loadInitialData = useCallback(() => {
    const storedFixture = JSON.parse(localStorage.getItem('soccerFixture') || '[]');
    setFixtureItems(storedFixture);
    const storedTeams = JSON.parse(localStorage.getItem('soccerTeams') || '[]');
    setAllTeams(storedTeams.map(team => ({ id: team.id, name: team.name })));

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
    loadInitialData();
     const handleStorageChange = (event) => {
      if (['soccerTeams', 'soccerFixture'].includes(event.key)) {
        loadInitialData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadInitialData]);

  const handleFixtureChange = (e) => {
    const { name, value } = e.target;
    setFixtureFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryValue) => {
    setFixtureFormData(prev => ({ ...prev, category: categoryValue }));
  };

  const handleTeamSelect = (teamId, teamField) => {
    const selectedTeam = allTeams.find(t => t.id === teamId);
    if (teamField === 'teamA') {
      if (teamId === 'manual_entry') {
        setFixtureFormData(prev => ({ ...prev, teamAId: 'manual_entry', teamA: '' }));
      } else {
        setFixtureFormData(prev => ({ ...prev, teamAId: teamId, teamA: selectedTeam?.name || '' }));
      }
    } else if (teamField === 'teamB') {
      if (teamId === 'manual_entry') {
        setFixtureFormData(prev => ({ ...prev, teamBId: 'manual_entry', teamB: '' }));
      } else {
        setFixtureFormData(prev => ({ ...prev, teamBId: teamId, teamB: selectedTeam?.name || '' }));
      }
    }
  };
  
  const saveFixture = () => {
    const finalTeamA = fixtureFormData.teamAId === 'manual_entry' ? fixtureFormData.teamA : allTeams.find(t => t.id === fixtureFormData.teamAId)?.name;
    const finalTeamB = fixtureFormData.teamBId === 'manual_entry' ? fixtureFormData.teamB : allTeams.find(t => t.id === fixtureFormData.teamBId)?.name;

    if (!fixtureFormData.date || !fixtureFormData.category || !finalTeamA || !finalTeamB || !fixtureFormData.stadium) {
      toast({ title: "Error", description: "Fecha, categoría, equipos y estadio son obligatorios.", variant: "destructive" });
      return;
    }

    const payload = {
      date: fixtureFormData.date,
      category: fixtureFormData.category,
      teamA: finalTeamA,
      teamB: finalTeamB,
      stadium: fixtureFormData.stadium,
      locationUrl: fixtureFormData.locationUrl,
      teamAId: fixtureFormData.teamAId,
      teamBId: fixtureFormData.teamBId,
    };

    let updatedFixture;
    if (editingFixture) {
      updatedFixture = fixtureItems.map(item => item.id === editingFixture.id ? { ...editingFixture, ...payload } : item);
    } else {
      updatedFixture = [...fixtureItems, { id: Date.now().toString(), ...payload }];
    }
    setFixtureItems(updatedFixture);
    localStorage.setItem('soccerFixture', JSON.stringify(updatedFixture));
    
    if (fixtureFormData.category && !allCategories.includes(fixtureFormData.category)) {
      setAllCategories(prev => [...new Set([...prev, fixtureFormData.category])].sort());
    }

    toast({ title: "Éxito", description: `Partido ${editingFixture ? 'actualizado' : 'guardado'}.` });
    setEditingFixture(null);
    setFixtureFormData({ date: '', category: '', teamA: '', teamB: '', stadium: '', locationUrl: '', teamAId: 'manual_entry', teamBId: 'manual_entry' });
  };

  const editFixtureItem = (item) => {
    setEditingFixture(item);
    const itemDate = item.date ? new Date(item.date).toISOString().substring(0, 16) : '';
    
    const teamAExists = allTeams.some(t => t.name === item.teamA);
    const teamBExists = allTeams.some(t => t.name === item.teamB);

    setFixtureFormData({ 
      date: itemDate, 
      category: item.category, 
      teamA: item.teamA, 
      teamB: item.teamB, 
      stadium: item.stadium, 
      locationUrl: item.locationUrl || '',
      teamAId: item.teamAId || (teamAExists ? allTeams.find(t => t.name === item.teamA)?.id : 'manual_entry'),
      teamBId: item.teamBId || (teamBExists ? allTeams.find(t => t.name === item.teamB)?.id : 'manual_entry'),
    });
  };

  const deleteFixtureItem = (itemId) => {
    const updatedFixture = fixtureItems.filter(item => item.id !== itemId);
    setFixtureItems(updatedFixture);
    localStorage.setItem('soccerFixture', JSON.stringify(updatedFixture));
    toast({ title: "Partido eliminado", variant: "destructive" });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{editingFixture ? 'Editar Partido' : 'Añadir Nuevo Partido'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fixtureDate">Fecha y Hora</Label>
              <Input type="datetime-local" id="fixtureDate" name="date" value={fixtureFormData.date} onChange={handleFixtureChange} className="bg-background/70"/>
            </div>
            <div>
              <Label htmlFor="fixtureCategory">Categoría</Label>
              <CategorySelector
                value={fixtureFormData.category}
                onChange={handleCategoryChange}
                allCategories={allCategories}
                onCategoriesChange={setAllCategories}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fixtureTeamASelect">Equipo Local</Label>
              <Select onValueChange={(value) => handleTeamSelect(value, 'teamA')} value={fixtureFormData.teamAId}>
                <SelectTrigger id="fixtureTeamASelect" className="bg-background/70">
                  <SelectValue placeholder="Seleccionar equipo local..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual_entry">-- Ingresar Manualmente --</SelectItem>
                  {allTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fixtureFormData.teamAId === 'manual_entry' && (
                <Input 
                  id="fixtureTeamAManual" 
                  name="teamA" 
                  value={fixtureFormData.teamA} 
                  onChange={handleFixtureChange} 
                  placeholder="Nombre Equipo Local (Manual)" 
                  className="bg-background/70 mt-2"
                />
              )}
            </div>
            <div>
              <Label htmlFor="fixtureTeamBSelect">Equipo Visitante</Label>
              <Select onValueChange={(value) => handleTeamSelect(value, 'teamB')} value={fixtureFormData.teamBId}>
                <SelectTrigger id="fixtureTeamBSelect" className="bg-background/70">
                  <SelectValue placeholder="Seleccionar equipo visitante..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual_entry">-- Ingresar Manualmente --</SelectItem>
                  {allTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fixtureFormData.teamBId === 'manual_entry' && (
                <Input 
                  id="fixtureTeamBManual" 
                  name="teamB" 
                  value={fixtureFormData.teamB} 
                  onChange={handleFixtureChange} 
                  placeholder="Nombre Equipo Visitante (Manual)" 
                  className="bg-background/70 mt-2"
                />
              )}
            </div>
          </div>
            <div>
            <Label htmlFor="fixtureStadium">Estadio</Label>
            <Input id="fixtureStadium" name="stadium" value={fixtureFormData.stadium} onChange={handleFixtureChange} placeholder="Nombre del Estadio" className="bg-background/70"/>
          </div>
          <div>
            <Label htmlFor="fixtureLocationUrl">URL de Ubicación (Google Maps - Opcional)</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground"/>
              <Input id="fixtureLocationUrl" name="locationUrl" value={fixtureFormData.locationUrl} onChange={handleFixtureChange} placeholder="https://maps.app.goo.gl/example" className="bg-background/70"/>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {editingFixture && <Button variant="outline" onClick={() => { setEditingFixture(null); setFixtureFormData({ date: '', category: '', teamA: '', teamB: '', stadium: '', locationUrl: '', teamAId: 'manual_entry', teamBId: 'manual_entry' });}}>Cancelar Edición</Button>}
          <Button onClick={saveFixture} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <Save className="mr-2 h-4 w-4"/> {editingFixture ? 'Actualizar Partido' : 'Guardar Partido'}
          </Button>
        </CardFooter>
      </Card>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Partidos Programados</h3>
        {fixtureItems.length > 0 ? (
          <div className="space-y-2">
          {fixtureItems.sort((a,b) => new Date(a.date) - new Date(b.date)).map(item => (
            <motion.div key={item.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit">
            <Card className="bg-card/50">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">{item.teamA} vs {item.teamB}</CardTitle>
                <CardDescription className="text-xs">{item.category} - {item.date ? new Date(item.date).toLocaleString('es-ES') : 'Fecha no definida'} - {item.stadium}</CardDescription>
              </CardHeader>
              <CardFooter className="p-2 flex justify-end gap-1 bg-muted/20">
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-blue-500" onClick={() => editFixtureItem(item)}><Edit2 className="h-4 w-4"/></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4"/></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar este partido del fixture?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteFixtureItem(item.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">No hay partidos en el fixture.</p>}
      </div>
    </div>
  );
};

export default AdminFixtureTab;
