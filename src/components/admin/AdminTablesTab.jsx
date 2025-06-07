
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Edit2, Save, Trash2, Award, ShieldAlert, ListOrdered } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
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

const initialPositionFormData = {
  id: 'manual_entry', team: '', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0, logo: ''
};

const initialScorerFormData = {
  id: 'manual_entry', playerId: 'manual_entry', player: '', team: '', teamId: 'manual_entry', goals: '', avatar: '', category: '', totalGoals: 0
};

const initialCautionedFormData = {
  id: 'manual_entry', playerId: 'manual_entry', player: '', team: '', teamId: 'manual_entry', card: 'Amarilla', date: '', matchId: '', category: ''
};


const PositionForm = ({ editingPosition, formData, onFormChange, onTeamSelect, allTeams, selectedCategory, onSave, onReset, existingPositions }) => {
  const isManualTeamEntry = formData.id === 'manual_entry' && !editingPosition;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{editingPosition ? `Editando: ${editingPosition.team}` : `Añadir Equipo a Tabla (${selectedCategory})`}</CardTitle>
        {!editingPosition && (
          <div className="mt-2">
            <Label htmlFor="teamSelectPos">Seleccionar Equipo</Label>
            <Select onValueChange={onTeamSelect} value={formData.id || 'manual_entry'}>
              <SelectTrigger id="teamSelectPos" className="w-full bg-background/70">
                <SelectValue placeholder="Seleccionar equipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual_entry">-- Ingresar Manualmente --</SelectItem>
                {allTeams.filter(t => !existingPositions.some(p => p.team === t.name && p.category === selectedCategory && p.id !== editingPosition?.id)).map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {editingPosition || formData.id !== 'manual_entry' || isManualTeamEntry ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div><Label>Equipo</Label><Input name="team" value={formData.team} onChange={onFormChange} className="bg-background/50" disabled={!isManualTeamEntry && !!formData.id && !editingPosition} /></div>
              <div><Label>PJ</Label><Input type="number" name="pj" value={formData.pj} onChange={onFormChange} className="bg-background/50" /></div>
              <div><Label>PG</Label><Input type="number" name="pg" value={formData.pg} onChange={onFormChange} className="bg-background/50" /></div>
              <div><Label>PE</Label><Input type="number" name="pe" value={formData.pe} onChange={onFormChange} className="bg-background/50" /></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div><Label>PP</Label><Input type="number" name="pp" value={formData.pp} onChange={onFormChange} className="bg-background/50" /></div>
              <div><Label>GF</Label><Input type="number" name="gf" value={formData.gf} onChange={onFormChange} className="bg-background/50" /></div>
              <div><Label>GC</Label><Input type="number" name="gc" value={formData.gc} onChange={onFormChange} className="bg-background/50" /></div>
              <div><Label>Pts</Label><Input type="number" name="pts" value={formData.pts} onChange={onFormChange} className="bg-background/50" /></div>
            </div>
            <Input name="logo" type="hidden" value={formData.logo} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground p-4 text-center">Seleccione un equipo de la lista para añadirlo o editarlo.</p>
        )}
      </CardContent>
      {(editingPosition || formData.id !== 'manual_entry' || isManualTeamEntry) && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onReset}>
            {editingPosition ? 'Cancelar Edición' : 'Limpiar'}
          </Button>
          <Button onClick={onSave} className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <Save className="mr-2 h-4 w-4" /> {editingPosition ? 'Actualizar Posición' : 'Guardar Posición'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const PositionsList = ({ positions, onEdit, onDelete, selectedCategory }) => {
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
  const currentCategoryPositions = positions
    .filter(p => p.category === selectedCategory)
    .sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dg !== a.dg) return b.dg - a.dg;
        return b.gf - a.gf;
    }).map((p, index) => ({...p, pos: index + 1}));


  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold mb-2">Tabla de Posiciones Actual ({selectedCategory})</h4>
      {currentCategoryPositions.length > 0 ? (
        <div className="space-y-2">
          {currentCategoryPositions.map(item => (
            <motion.div key={item.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
              <Card className="bg-card/50">
                <CardHeader className="p-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm flex items-center">
                      <span className="mr-2 font-bold text-primary w-6 text-center">{item.pos}.</span>
                      <img alt={`Logo ${item.team}`} className="h-5 w-5 mr-1.5 rounded-full bg-slate-500 object-cover" src={item.logo || 'https://placehold.co/40x40/222/fff?text=L'} />
                      {item.team}
                    </CardTitle>
                    <CardDescription className="text-xs">PTS: {item.pts} | DG: {item.dg}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-2 text-xs grid grid-cols-3 sm:grid-cols-5 gap-1">
                  <span>PJ: {item.pj}</span><span>PG: {item.pg}</span><span>PE: {item.pe}</span><span>PP: {item.pp}</span>
                  <span className="hidden sm:inline">GF: {item.gf}</span><span className="hidden sm:inline">GC: {item.gc}</span>
                </CardContent>
                <CardFooter className="p-2 flex justify-end gap-1 bg-muted/20">
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-blue-500" onClick={() => onEdit(item)}><Edit2 className="h-4 w-4" /></Button>
                  <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar a "{item.team}" de la tabla?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(item.id)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : <p className="text-sm text-muted-foreground text-center py-3">No hay datos de posiciones para la categoría "{selectedCategory}".</p>}
    </div>
  );
};

const ScorerForm = ({ editingScorer, formData, onFormChange, onTeamSelect, onPlayerSelect, allTeams, playersInSelectedTeam, selectedCategory, onSave, onReset }) => {
  const isManualPlayerEntry = formData.playerId === 'manual_entry';
  return (
    <Card className="mb-6">
      <CardHeader><CardTitle>{editingScorer ? `Editando Goleador: ${editingScorer.player}` : `Añadir/Actualizar Goles (${selectedCategory})`}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="teamSelectScorer">Equipo</Label>
          <Select onValueChange={(teamId) => onTeamSelect(teamId, 'scorer')} value={formData.teamId || 'manual_entry'} disabled={!!editingScorer && formData.teamId !== 'manual_entry'}>
            <SelectTrigger id="teamSelectScorer"><SelectValue placeholder="Seleccionar equipo..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manual_entry">-- Ingresar Manualmente --</SelectItem>
              {allTeams.map(team => (<SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>))}
            </SelectContent>
          </Select>
          {formData.teamId === 'manual_entry' && <Input name="team" value={formData.team} onChange={onFormChange} placeholder="Nombre del Equipo (Manual)" className="mt-2 bg-background/50" />}
        </div>
        
        <div>
          <Label htmlFor="playerSelectScorer">Jugador</Label>
          <Select onValueChange={(playerId) => onPlayerSelect(playerId, 'scorer')} value={formData.playerId || 'manual_entry'} disabled={!!editingScorer && formData.playerId !== 'manual_entry'}>
            <SelectTrigger id="playerSelectScorer"><SelectValue placeholder="Seleccionar jugador..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manual_entry">-- Ingresar Manualmente --</SelectItem>
              {playersInSelectedTeam.length > 0 ? playersInSelectedTeam.map(p => (<SelectItem key={p.id} value={p.id}>{p.name} ({p.number || 'S/N'})</SelectItem>)) : <SelectItem value="no_players" disabled>No hay jugadores en esta categoría para este equipo</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        
        {isManualPlayerEntry && <Input name="player" value={formData.player} onChange={onFormChange} placeholder="Nombre del Jugador (Manual)" className="mt-2 bg-background/50" />}
        <div><Label htmlFor="goals">Goles a Añadir</Label><Input type="number" name="goals" id="goals" value={formData.goals} onChange={onFormChange} className="bg-background/50" placeholder="Goles en este partido/fecha" /></div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReset}> {editingScorer ? 'Cancelar Edición' : 'Limpiar'} </Button>
        <Button onClick={onSave} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"><Save className="mr-2 h-4 w-4" /> {editingScorer ? 'Actualizar Goles' : 'Guardar Goles'} </Button>
      </CardFooter>
    </Card>
  );
};

const ScorersList = ({ scorers, onEdit, onDelete, selectedCategory }) => {
   const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
   const currentCategoryScorers = scorers.filter(s => s.category === selectedCategory).sort((a,b) => b.totalGoals - a.totalGoals).map((s, i) => ({...s, rank: i + 1}));
  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold mb-2">Goleadores ({selectedCategory})</h4>
      {currentCategoryScorers.length > 0 ? (
        <div className="space-y-2">
          {currentCategoryScorers.map(item => (
            <motion.div key={item.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
              <Card className="bg-card/50">
                <CardHeader className="p-3 flex flex-row justify-between items-center">
                  <div className="flex items-center">
                    <span className="mr-2 font-bold text-primary w-6 text-center">{item.rank}.</span>
                    <img alt={`Avatar ${item.player}`} className="h-6 w-6 mr-2 rounded-full bg-slate-500 object-cover" src={item.avatar || 'https://placehold.co/40x40/333/fff?text=P'} />
                    <div>
                      <CardTitle className="text-sm">{item.player}</CardTitle>
                      <CardDescription className="text-xs">{item.team}</CardDescription>
                    </div>
                  </div>
                  <span className="font-bold text-primary text-sm">{item.totalGoals} Goles</span>
                </CardHeader>
                <CardFooter className="p-2 flex justify-end gap-1 bg-muted/20">
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-blue-500" onClick={() => onEdit(item)}><Edit2 className="h-4 w-4" /></Button>
                  <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar a "{item.player}" de goleadores?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(item.id)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : <p className="text-sm text-muted-foreground text-center py-3">No hay goleadores para la categoría "{selectedCategory}".</p>}
    </div>
  );
};

const CautionedForm = ({ editingCautioned, formData, onFormChange, onTeamSelect, onPlayerSelect, allTeams, playersInSelectedTeam, selectedCategory, onSave, onReset }) => {
  const isManualPlayerEntry = formData.playerId === 'manual_entry';
  return (
    <Card className="mb-6">
      <CardHeader><CardTitle>{editingCautioned ? `Editando Amonestación: ${editingCautioned.player}` : `Añadir Amonestado (${selectedCategory})`}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="teamSelectCaut">Equipo</Label>
          <Select onValueChange={(teamId) => onTeamSelect(teamId, 'cautioned')} value={formData.teamId || 'manual_entry'} disabled={!!editingCautioned && formData.teamId !== 'manual_entry'}>
            <SelectTrigger id="teamSelectCaut"><SelectValue placeholder="Seleccionar equipo..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manual_entry">-- Ingresar Manualmente --</SelectItem>
              {allTeams.map(team => (<SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>))}
            </SelectContent>
          </Select>
          {formData.teamId === 'manual_entry' && <Input name="team" value={formData.team} onChange={onFormChange} placeholder="Nombre del Equipo (Manual)" className="mt-2 bg-background/50" />}
        </div>

        <div>
            <Label htmlFor="playerSelectCaut">Jugador</Label>
            <Select onValueChange={(playerId) => onPlayerSelect(playerId, 'cautioned')} value={formData.playerId || 'manual_entry'} disabled={!!editingCautioned && formData.playerId !== 'manual_entry'}>
              <SelectTrigger id="playerSelectCaut"><SelectValue placeholder="Seleccionar jugador..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="manual_entry">-- Ingresar Manualmente --</SelectItem>
                {playersInSelectedTeam.length > 0 ? playersInSelectedTeam.map(p => (<SelectItem key={p.id} value={p.id}>{p.name} ({p.number || 'S/N'})</SelectItem>)) : <SelectItem value="no_players_cautioned" disabled>No hay jugadores en esta categoría para este equipo</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        {isManualPlayerEntry && <Input name="player" value={formData.player} onChange={onFormChange} placeholder="Nombre del Jugador (Manual)" className="mt-2 bg-background/50" />}
        
        <div className="grid grid-cols-2 gap-3">
          <div><Label htmlFor="cardType">Tipo de Tarjeta</Label>
            <Select name="card" onValueChange={(value) => onFormChange({target: {name: 'card', value}})} value={formData.card}>
              <SelectTrigger id="cardType"><SelectValue placeholder="Seleccionar tarjeta..." /></SelectTrigger>
              <SelectContent><SelectItem value="Amarilla">Amarilla</SelectItem><SelectItem value="Roja">Roja</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label htmlFor="cautionDate">Fecha</Label><Input type="date" name="date" id="cautionDate" value={formData.date} onChange={onFormChange} className="bg-background/50" /></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReset}>{editingCautioned ? 'Cancelar Edición' : 'Limpiar'}</Button>
        <Button onClick={onSave} className="bg-gradient-to-r from-orange-500 to-red-600 text-white"><Save className="mr-2 h-4 w-4" />{editingCautioned ? 'Actualizar Amonestación' : 'Guardar Amonestación'}</Button>
      </CardFooter>
    </Card>
  );
};

const CautionedList = ({ cautioned, onEdit, onDelete, selectedCategory }) => {
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
  const currentCategoryCautioned = cautioned.filter(c => c.category === selectedCategory).sort((a,b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold mb-2">Amonestados ({selectedCategory})</h4>
      {currentCategoryCautioned.length > 0 ? (
        <div className="space-y-2">
          {currentCategoryCautioned.map(item => (
            <motion.div key={item.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
              <Card className="bg-card/50">
                <CardHeader className="p-3 flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-sm">{item.player}</CardTitle>
                    <CardDescription className="text-xs">{item.team} - {new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</CardDescription>
                  </div>
                  <span className={`font-semibold text-sm px-2 py-0.5 rounded ${item.card === 'Roja' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black'}`}>{item.card}</span>
                </CardHeader>
                <CardFooter className="p-2 flex justify-end gap-1 bg-muted/20">
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-blue-500" onClick={() => onEdit(item)}><Edit2 className="h-4 w-4" /></Button>
                  <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar amonestación de "{item.player}"?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(item.id)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : <p className="text-sm text-muted-foreground text-center py-3">No hay amonestados para la categoría "{selectedCategory}".</p>}
    </div>
  );
};


const AdminTablesTab = () => {
  const { toast } = useToast();
  const [currentPositionsData, setCurrentPositionsData] = useState([]);
  const [editingPosition, setEditingPosition] = useState(null);
  const [positionFormData, setPositionFormData] = useState(initialPositionFormData);
  
  const [currentScorersData, setCurrentScorersData] = useState([]);
  const [editingScorer, setEditingScorer] = useState(null);
  const [scorerFormData, setScorerFormData] = useState(initialScorerFormData);

  const [currentCautionedData, setCurrentCautionedData] = useState([]);
  const [editingCautioned, setEditingCautioned] = useState(null);
  const [cautionedFormData, setCautionedFormData] = useState(initialCautionedFormData);

  const [allTeams, setAllTeams] = useState([]);
  const [playersInSelectedTeamScorer, setPlayersInSelectedTeamScorer] = useState([]);
  const [playersInSelectedTeamCautioned, setPlayersInSelectedTeamCautioned] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Primera');
  const [allCategories, setAllCategories] = useState([]);

  const loadData = useCallback(() => {
    const storedPositions = JSON.parse(localStorage.getItem('soccerPositions') || '[]');
    setCurrentPositionsData(storedPositions);

    const storedScorers = JSON.parse(localStorage.getItem('soccerScorers') || '[]');
    setCurrentScorersData(storedScorers);

    const storedCautioned = JSON.parse(localStorage.getItem('soccerCautioned') || '[]');
    setCurrentCautionedData(storedCautioned);

    const storedTeamsData = JSON.parse(localStorage.getItem('soccerTeams') || '[]');
    setAllTeams(storedTeamsData.map(team => ({ 
      id: team.id, 
      name: team.name, 
      logo: team.logo, 
      categories: team.categories || [] 
    })));

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
    
    const intervalId = setInterval(() => {
        const storedTeamsData = JSON.parse(localStorage.getItem('soccerTeams') || '[]');
        const currentTeamsSimplified = allTeams.map(t => ({id: t.id, name: t.name, categories: t.categories.map(c => ({name: c.name, players: c.players.map(p => p.id)})) }));
        const storedTeamsSimplified = storedTeamsData.map(t => ({id: t.id, name: t.name, categories: (t.categories || []).map(c => ({name: c.name, players: (c.players || []).map(p => p.id)})) }));

        if (JSON.stringify(currentTeamsSimplified) !== JSON.stringify(storedTeamsSimplified)) {
            loadData();
        }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [loadData, allTeams]);

  const handleCategoryFilterChange = (category) => {
    setSelectedCategory(category);
    resetAllForms();
  };

  const resetAllForms = () => {
    setEditingPosition(null);
    setPositionFormData(initialPositionFormData);
    setEditingScorer(null);
    setScorerFormData({...initialScorerFormData, category: selectedCategory, goals: ''});
    setEditingCautioned(null);
    setCautionedFormData({...initialCautionedFormData, category: selectedCategory});
    setPlayersInSelectedTeamScorer([]);
    setPlayersInSelectedTeamCautioned([]);
  };

  useEffect(() => {
    const updatePlayersList = (formType) => {
      const currentFormData = formType === 'scorer' ? scorerFormData : cautionedFormData;
      const setPlayersFunc = formType === 'scorer' ? setPlayersInSelectedTeamScorer : setPlayersInSelectedTeamCautioned;

      if (currentFormData.teamId && currentFormData.teamId !== 'manual_entry') {
        const team = allTeams.find(t => t.id === currentFormData.teamId);
        if (team && team.categories) {
          const teamCategory = team.categories.find(c => c.name === selectedCategory);
          setPlayersFunc(teamCategory && teamCategory.players ? teamCategory.players : []);
        } else {
          setPlayersFunc([]);
        }
      } else {
        setPlayersFunc([]);
      }
    };
    updatePlayersList('scorer');
    updatePlayersList('cautioned');
  }, [selectedCategory, allTeams, scorerFormData.teamId, cautionedFormData.teamId]);

  const handlePositionFormChange = (e) => {
    const { name, value } = e.target;
    const numValue = ['pj', 'pg', 'pe', 'pp', 'gf', 'gc', 'pts'].includes(name) ? (value === '' ? 0 : parseInt(value, 10)) : value;
    setPositionFormData(prev => {
      const updatedForm = { ...prev, [name]: numValue };
      if (name === 'gf' || name === 'gc') {
        updatedForm.dg = (updatedForm.gf || 0) - (updatedForm.gc || 0);
      }
      return updatedForm;
    });
  };

  const handleTeamSelectForPosition = (teamId) => {
    if (teamId === 'manual_entry') {
      setPositionFormData(prev => ({ ...initialPositionFormData, id: 'manual_entry', category: selectedCategory }));
    } else {
      const selectedTeam = allTeams.find(t => t.id === teamId);
      if (selectedTeam) {
        setPositionFormData(prev => ({
          ...initialPositionFormData,
          id: selectedTeam.id,
          team: selectedTeam.name,
          logo: selectedTeam.logo || '',
          category: selectedCategory
        }));
      }
    }
  };

  const savePosition = () => {
    const requiredFields = ['team', 'pj', 'pg', 'pe', 'pp', 'gf', 'gc', 'pts'];
    for (const field of requiredFields) {
      if (positionFormData[field] === '' || positionFormData[field] === null) {
        toast({ title: "Error", description: `El campo "${field}" es obligatorio.`, variant: "destructive" });
        return;
      }
    }
    let updatedPositions;
    const positionDataToSave = {
      ...positionFormData,
      pj: Number(positionFormData.pj),
      pg: Number(positionFormData.pg),
      pe: Number(positionFormData.pe),
      pp: Number(positionFormData.pp),
      gf: Number(positionFormData.gf),
      gc: Number(positionFormData.gc),
      dg: Number(positionFormData.gf) - Number(positionFormData.gc),
      pts: Number(positionFormData.pts),
      category: selectedCategory
    };

    if (editingPosition) {
      updatedPositions = currentPositionsData.map(item => item.id === editingPosition.id ? positionDataToSave : item);
    } else {
      const teamExistsInCategory = currentPositionsData.find(p => p.team === positionDataToSave.team && p.category === selectedCategory);
      if (teamExistsInCategory && positionDataToSave.id !== teamExistsInCategory.id) {
        toast({ title: "Error", description: `El equipo "${positionDataToSave.team}" ya existe en la tabla para esta categoría.`, variant: "destructive" });
        return;
      }
      const newEntryId = positionDataToSave.id === 'manual_entry' ? Date.now().toString() : positionDataToSave.id;
      updatedPositions = [...currentPositionsData, { ...positionDataToSave, id: newEntryId }];
    }
    
    setCurrentPositionsData(updatedPositions);
    localStorage.setItem('soccerPositions', JSON.stringify(updatedPositions));
    toast({ title: "Éxito", description: `Posición ${editingPosition ? 'actualizada' : 'guardada'}.` });
    setEditingPosition(null);
    setPositionFormData(initialPositionFormData);
  };

  const editPositionItem = (item) => {
    setEditingPosition(item);
    setPositionFormData({ ...item });
  };

  const deletePositionItem = (itemId) => {
    let updatedPositions = currentPositionsData.filter(item => item.id !== itemId);
    setCurrentPositionsData(updatedPositions);
    localStorage.setItem('soccerPositions', JSON.stringify(updatedPositions));
    toast({ title: "Posición eliminada", variant: "destructive" });
  };

  const resetPositionForm = () => {
    setEditingPosition(null);
    setPositionFormData({...initialPositionFormData, category: selectedCategory });
  };


  const handleScorerFormChange = (e) => {
    const { name, value } = e.target;
    setScorerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamSelectForScorer = (teamId) => {
    const isManual = teamId === 'manual_entry';
    const selectedTeamData = allTeams.find(t => t.id === teamId);
    
    setScorerFormData(prev => ({ 
      ...initialScorerFormData, 
      teamId: teamId,
      team: isManual ? '' : (selectedTeamData?.name || ''),
      playerId: 'manual_entry', 
      player: '', 
      avatar: '', 
      category: selectedCategory,
      goals: ''
    }));

    if (selectedTeamData) {
      const teamCategory = selectedTeamData.categories.find(c => c.name === selectedCategory);
      setPlayersInSelectedTeamScorer(teamCategory ? teamCategory.players : []);
    } else {
      setPlayersInSelectedTeamScorer([]);
    }
  };

  const handlePlayerSelectForScorer = (playerId) => {
    if (playerId === 'manual_entry' || playerId === 'no_players') {
      setScorerFormData(prev => ({ ...prev, playerId: 'manual_entry', player: '', avatar: '' }));
    } else {
      const selectedPlayer = playersInSelectedTeamScorer.find(p => p.id === playerId);
      if (selectedPlayer) {
        setScorerFormData(prev => ({ ...prev, playerId: selectedPlayer.id, player: selectedPlayer.name, avatar: selectedPlayer.avatar || '' }));
      }
    }
  };

  const saveScorer = () => {
    const goalsToAdd = parseInt(scorerFormData.goals, 10);
    if (!scorerFormData.player || !scorerFormData.team || isNaN(goalsToAdd) || goalsToAdd <= 0) {
      toast({ title: "Error", description: "Jugador, equipo y goles (cantidad positiva) son obligatorios.", variant: "destructive" });
      return;
    }

    let updatedScorers;
    const scorerId = scorerFormData.playerId !== 'manual_entry' 
      ? `${scorerFormData.playerId}_${selectedCategory}` 
      : `${scorerFormData.player.trim().toLowerCase().replace(/\s+/g, '-')}_${scorerFormData.team.trim().toLowerCase().replace(/\s+/g, '-')}_${selectedCategory}`;
    
    const existingScorerIndex = currentScorersData.findIndex(s => s.id === scorerId);

    if (existingScorerIndex !== -1) {
      updatedScorers = currentScorersData.map((s, index) => 
        index === existingScorerIndex 
        ? { ...s, totalGoals: (s.totalGoals || 0) + goalsToAdd } 
        : s
      );
    } else {
      const newScorer = { 
        id: scorerId,
        playerId: scorerFormData.playerId,
        player: scorerFormData.player,
        team: scorerFormData.team,
        teamId: scorerFormData.teamId,
        avatar: scorerFormData.avatar,
        totalGoals: goalsToAdd, 
        category: selectedCategory 
      };
      updatedScorers = [...currentScorersData, newScorer];
    }
    
    setCurrentScorersData(updatedScorers);
    localStorage.setItem('soccerScorers', JSON.stringify(updatedScorers));
    toast({ title: "Éxito", description: `Goles ${existingScorerIndex !== -1 ? 'sumados' : 'guardados'} para ${scorerFormData.player}.` });
    setEditingScorer(null);
    setScorerFormData({...initialScorerFormData, category: selectedCategory, goals: ''});
  };
  

  const editScorerItem = (item) => {
    setEditingScorer(item);
    const teamData = allTeams.find(t => t.name === item.team || t.id === item.teamId);
    let playersForTeamCategory = [];
    if (teamData) {
        const categoryData = teamData.categories.find(c => c.name === item.category);
        if (categoryData) {
            playersForTeamCategory = categoryData.players || [];
        }
    }
    setPlayersInSelectedTeamScorer(playersForTeamCategory);

    setScorerFormData({ 
      ...item, 
      goals: '', 
      teamId: teamData?.id || 'manual_entry',
      playerId: playersForTeamCategory.find(p => p.name === item.player)?.id || 'manual_entry'
    });
  };

  const deleteScorerItem = (itemId) => {
    const updatedScorers = currentScorersData.filter(item => item.id !== itemId);
    setCurrentScorersData(updatedScorers);
    localStorage.setItem('soccerScorers', JSON.stringify(updatedScorers));
    toast({ title: "Goleador eliminado", variant: "destructive" });
  };
  
  const resetScorerForm = () => {
    setEditingScorer(null);
    setScorerFormData({...initialScorerFormData, category: selectedCategory, goals: ''});
    setPlayersInSelectedTeamScorer([]);
  };


  const handleCautionedFormChange = (e) => {
    const { name, value } = e.target;
    setCautionedFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamSelectForCautioned = (teamId) => {
    const isManual = teamId === 'manual_entry';
    const selectedTeamData = allTeams.find(t => t.id === teamId);

    setCautionedFormData(prev => ({ 
        ...initialCautionedFormData, 
        teamId: teamId,
        team: isManual ? '' : (selectedTeamData?.name || ''),
        playerId: 'manual_entry', 
        player: '', 
        category: selectedCategory 
    }));
    
    if (selectedTeamData) {
      const teamCategory = selectedTeamData.categories.find(c => c.name === selectedCategory);
      setPlayersInSelectedTeamCautioned(teamCategory ? teamCategory.players : []);
    } else {
      setPlayersInSelectedTeamCautioned([]);
    }
  };

  const handlePlayerSelectForCautioned = (playerId) => {
    if (playerId === 'manual_entry' || playerId === 'no_players_cautioned') {
      setCautionedFormData(prev => ({ ...prev, playerId: 'manual_entry', player: '' }));
    } else {
      const selectedPlayer = playersInSelectedTeamCautioned.find(p => p.id === playerId);
      if (selectedPlayer) {
        setCautionedFormData(prev => ({ ...prev, playerId: selectedPlayer.id, player: selectedPlayer.name }));
      }
    }
  };

  const saveCautioned = () => {
    if (!cautionedFormData.player || !cautionedFormData.team || !cautionedFormData.card || !cautionedFormData.date) {
      toast({ title: "Error", description: "Jugador, equipo, tarjeta y fecha son obligatorios.", variant: "destructive" });
      return;
    }
    let updatedCautioned;
    if (editingCautioned) {
      updatedCautioned = currentCautionedData.map(item => item.id === editingCautioned.id ? { ...cautionedFormData, category: selectedCategory } : item);
    } else {
      const newEntryId = cautionedFormData.playerId !== 'manual_entry' 
        ? `${cautionedFormData.playerId}_${cautionedFormData.date}_${selectedCategory}` 
        : `${Date.now().toString()}_${selectedCategory}`;
      updatedCautioned = [...currentCautionedData, { ...cautionedFormData, id: newEntryId, category: selectedCategory }];
    }
    setCurrentCautionedData(updatedCautioned);
    localStorage.setItem('soccerCautioned', JSON.stringify(updatedCautioned));
    toast({ title: "Éxito", description: `Amonestación ${editingCautioned ? 'actualizada' : 'guardada'}.` });
    setEditingCautioned(null);
    setCautionedFormData({...initialCautionedFormData, category: selectedCategory});
  };

  const editCautionedItem = (item) => {
    setEditingCautioned(item);
    const teamData = allTeams.find(t => t.name === item.team || t.id === item.teamId);
    let playersForTeamCategory = [];
    if (teamData) {
        const categoryData = teamData.categories.find(c => c.name === item.category);
        if (categoryData) {
            playersForTeamCategory = categoryData.players || [];
        }
    }
    setPlayersInSelectedTeamCautioned(playersForTeamCategory);

    setCautionedFormData({ 
        ...item, 
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
        teamId: teamData?.id || 'manual_entry',
        playerId: playersForTeamCategory.find(p => p.name === item.player)?.id || 'manual_entry'
    });
  };

  const deleteCautionedItem = (itemId) => {
    const updatedCautioned = currentCautionedData.filter(item => item.id !== itemId);
    setCurrentCautionedData(updatedCautioned);
    localStorage.setItem('soccerCautioned', JSON.stringify(updatedCautioned));
    toast({ title: "Amonestación eliminada", variant: "destructive" });
  };

  const resetCautionedForm = () => {
    setEditingCautioned(null);
    setCautionedFormData({...initialCautionedFormData, category: selectedCategory});
    setPlayersInSelectedTeamCautioned([]);
  };


  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Label htmlFor="categoryFilterTable" className="whitespace-nowrap text-lg font-medium">Filtrar Tablas por Categoría:</Label>
        <CategorySelector
          value={selectedCategory}
          onChange={handleCategoryFilterChange}
          allCategories={allCategories}
          onCategoriesChange={setAllCategories}
          className="w-full max-w-xs"
        />
      </div>

      <div className="mb-8 pb-4 border-b border-border/30">
        <h3 className="text-xl font-semibold mb-3 text-primary flex items-center"><ListOrdered className="mr-2 h-6 w-6"/>Tabla de Posiciones</h3>
        <PositionForm
          editingPosition={editingPosition}
          formData={positionFormData}
          onFormChange={handlePositionFormChange}
          onTeamSelect={handleTeamSelectForPosition}
          allTeams={allTeams}
          selectedCategory={selectedCategory}
          onSave={savePosition}
          onReset={resetPositionForm}
          existingPositions={currentPositionsData}
        />
        <PositionsList
          positions={currentPositionsData}
          onEdit={editPositionItem}
          onDelete={deletePositionItem}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="mb-8 pb-4 border-b border-border/30">
        <h3 className="text-xl font-semibold mb-3 text-primary flex items-center"><Award className="mr-2 h-6 w-6"/>Goleadores</h3>
        <ScorerForm
          editingScorer={editingScorer}
          formData={scorerFormData}
          onFormChange={handleScorerFormChange}
          onTeamSelect={handleTeamSelectForScorer}
          onPlayerSelect={handlePlayerSelectForScorer}
          allTeams={allTeams}
          playersInSelectedTeam={playersInSelectedTeamScorer}
          selectedCategory={selectedCategory}
          onSave={saveScorer}
          onReset={resetScorerForm}
        />
        <ScorersList
          scorers={currentScorersData}
          onEdit={editScorerItem}
          onDelete={deleteScorerItem}
          selectedCategory={selectedCategory}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-primary flex items-center"><ShieldAlert className="mr-2 h-6 w-6"/>Amonestados</h3>
        <CautionedForm
          editingCautioned={editingCautioned}
          formData={cautionedFormData}
          onFormChange={handleCautionedFormChange}
          onTeamSelect={handleTeamSelectForCautioned}
          onPlayerSelect={handlePlayerSelectForCautioned}
          allTeams={allTeams}
          playersInSelectedTeam={playersInSelectedTeamCautioned}
          selectedCategory={selectedCategory}
          onSave={saveCautioned}
          onReset={resetCautionedForm}
        />
        <CautionedList
          cautioned={currentCautionedData}
          onEdit={editCautionedItem}
          onDelete={deleteCautionedItem}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
};

export default AdminTablesTab;
