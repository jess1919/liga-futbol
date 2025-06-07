import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import TeamCategoriesManager from '@/components/team/TeamCategoriesManager';
import TeamForm from '@/components/team/TeamForm.jsx';

const EditTeamPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewTeam = !teamId;

  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [teamColors, setTeamColors] = useState({ primary: '#000000', secondary: '#FFFFFF' });
  const [categories, setCategories] = useState([]);
  const [allAvailableCategories, setAllAvailableCategories] = useState([]);


  const loadAllCategories = useCallback(() => {
    const storedTeams = JSON.parse(localStorage.getItem('soccerTeams') || '[]');
    const storedFixture = JSON.parse(localStorage.getItem('soccerFixture') || '[]');
    const storedResults = JSON.parse(localStorage.getItem('soccerResults') || '[]');
    const storedPositions = JSON.parse(localStorage.getItem('soccerPositions') || '[]');
    const storedScorers = JSON.parse(localStorage.getItem('soccerScorers') || '[]');
    const storedCautioned = JSON.parse(localStorage.getItem('soccerCautioned') || '[]');

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
        ...storedFixture.map(f => f.category),
        ...storedResults.map(r => r.category),
        ...storedPositions.map(p => p.category),
        ...storedScorers.map(s => s.category),
        ...storedCautioned.map(c => c.category),
      ])
    ];
    const defaultCategories = ["Primera", "Reserva", "Sub-17", "Sub-15"];
    const uniqueCategories = [...new Set([...defaultCategories, ...categoriesFromTeams, ...categoriesFromStorage])].filter(Boolean).sort();
    setAllAvailableCategories(uniqueCategories);
  }, []);


  useEffect(() => {
    loadAllCategories();
    if (!isNewTeam) {
      const teams = JSON.parse(localStorage.getItem('soccerTeams') || '[]');
      const currentTeam = teams.find(t => t.id === teamId);
      if (currentTeam) {
        setTeamName(currentTeam.name);
        setTeamLogo(currentTeam.logo || '');
        setTeamColors(currentTeam.colors || { primary: '#000000', secondary: '#FFFFFF' });
        setCategories(currentTeam.categories || []);
      } else {
        toast({ title: "Error", description: "Equipo no encontrado.", variant: "destructive" });
        navigate('/equipos');
      }
    }
     const handleStorageChange = (event) => {
      if (['soccerTeams', 'soccerFixture', 'soccerResults', 'soccerPositions', 'soccerScorers', 'soccerCautioned'].includes(event.key)) {
        loadAllCategories();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [teamId, isNewTeam, navigate, toast, loadAllCategories]);

  const handleSaveTeam = () => {
    if (!teamName.trim()) {
      toast({ title: "Error", description: "El nombre del equipo es obligatorio.", variant: "destructive" });
      return;
    }

    const teams = JSON.parse(localStorage.getItem('soccerTeams') || '[]');
    const teamData = {
      id: isNewTeam ? Date.now().toString() : teamId,
      name: teamName,
      logo: teamLogo,
      colors: teamColors,
      categories: categories,
    };

    if (isNewTeam) {
      teams.push(teamData);
    } else {
      const teamIndex = teams.findIndex(t => t.id === teamId);
      if (teamIndex > -1) {
        teams[teamIndex] = teamData;
      }
    }

    localStorage.setItem('soccerTeams', JSON.stringify(teams));
    toast({ title: "Éxito", description: `Equipo ${isNewTeam ? 'creado' : 'actualizado'} correctamente.` });
    navigate('/equipos');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-2 py-8 max-w-3xl"
    >
      <Card className="shadow-xl bg-card/80 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate('/equipos')} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent flex-grow">
              {isNewTeam ? 'Crear Nuevo Equipo' : `Editando: ${teamName || 'Equipo'}`}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <TeamForm 
            teamName={teamName}
            setTeamName={setTeamName}
            teamLogo={teamLogo}
            setTeamLogo={setTeamLogo}
            teamColors={teamColors}
            setTeamColors={setTeamColors}
          />
          <TeamCategoriesManager 
            categories={categories} 
            setCategories={setCategories}
            allAvailableCategories={allAvailableCategories}
            setAllAvailableCategories={setAllAvailableCategories}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveTeam} className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white">
            <Save className="mr-2 h-5 w-5" /> {isNewTeam ? 'Crear Equipo' : 'Guardar Cambios'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EditTeamPage;