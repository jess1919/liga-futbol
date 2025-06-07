import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Search, PlusCircle, Edit2, Trash2, ChevronDown, ChevronUp, Shield, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const initialTeamsData = [
  { id: '1', name: 'Club Atlético Sol Naciente', categories: [{id: 'cat1', name: 'Primera', players: [{id: 'p1', name: 'Jugador A1', number: 10, position: 'Delantero'}]}, {id: 'cat2', name: 'Reserva', players: []}], logo: 'sol_naciente_logo.png', dt: 'Carlos Bianchi' },
  { id: '2', name: 'Deportivo Estrella Fugaz', categories: [{id: 'cat3', name: 'Primera', players: []}], logo: 'estrella_fugaz_logo.png', dt: 'Marcelo Gallardo' },
  { id: '3', name: 'Unión Vecinal Centenario', categories: [], logo: 'union_centenario_logo.png', dt: 'Pep Guardiola' },
  { id: '4', name: 'Sportivo Huracán del Oeste', categories: [], logo: 'huracan_oeste_logo.png', dt: 'Jurgen Klopp' },
];

const TeamCard = ({ team, onDelete, onEdit }) => {
  const [expandedTeam, setExpandedTeam] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleTeamExpansion = () => {
    setExpandedTeam(!expandedTeam);
    if (expandedTeam) setExpandedCategory(null); 
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };
  
  const itemVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div layout>
      <Card className="bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-primary/15 transition-all duration-300 overflow-hidden">
        <CardHeader 
          className="flex flex-row items-start gap-3 p-4 cursor-pointer hover:bg-muted/10"
          onClick={toggleTeamExpansion}
        >
          <div className="flex-shrink-0">
            <img  
              alt={`Logo de ${team.name}`} 
              className="h-14 w-14 rounded-full border-2 border-primary object-cover bg-slate-700" 
              src={team.logo || 'https://placehold.co/60x60/333/fff?text=L'} 
            />
          </div>
          <div className="flex-grow">
            <CardTitle className="text-lg text-primary">{team.name}</CardTitle>
            <CardDescription className="text-xs">
              {team.categories?.length || 0} categorías. DT: {team.dt || 'No asignado'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 self-center">
            {expandedTeam ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CardHeader>
        
        <AnimatePresence>
          {expandedTeam && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CardContent className="p-4 pt-0 space-y-2">
                {team.categories && team.categories.length > 0 ? (
                  team.categories.map(category => (
                    <div key={category.id} className="border-l-2 border-primary/30 pl-3">
                      <div 
                        className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-muted/10 rounded-r-md"
                        onClick={() => toggleCategoryExpansion(category.id)}
                      >
                        <p className="text-sm font-medium text-foreground flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-primary/70" />
                          {category.name} ({category.players?.length || 0} jugadores)
                        </p>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          {expandedCategory === category.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {expandedCategory === category.id && (
                          <motion.ul
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mt-1 space-y-1 pl-4 text-xs"
                          >
                            {category.players && category.players.length > 0 ? (
                              category.players.map(player => (
                                <li key={player.id} className="flex items-center text-muted-foreground">
                                  <UserCircle className="h-3.5 w-3.5 mr-1.5 text-primary/50" />
                                  <span className="font-medium text-foreground/80">{player.name}</span>
                                  <span className="ml-1">(N°{player.number || 'S/N'}, {player.position || 'N/A'})</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-muted-foreground italic">No hay jugadores en esta categoría.</li>
                            )}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">Este equipo no tiene categorías registradas.</p>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        <CardFooter className="p-3 flex justify-end gap-2 bg-card/30 border-t border-border/50">
          <Button variant="outline" size="sm" onClick={() => onEdit(team.id)}>
            <Edit2 className="h-4 w-4 mr-1" /> Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente el equipo "{team.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(team.id)}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
};


const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTeams = localStorage.getItem('soccerTeams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    } else {
      setTeams(initialTeamsData);
      localStorage.setItem('soccerTeams', JSON.stringify(initialTeamsData));
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteTeam = (teamId) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    setTeams(updatedTeams);
    localStorage.setItem('soccerTeams', JSON.stringify(updatedTeams));
    toast({
      title: "Equipo eliminado",
      description: "El equipo ha sido eliminado correctamente.",
      variant: "destructive",
    });
  };
  
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
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
            <Users className="mr-2 h-8 w-8 text-primary" />
            Equipos
          </h1>
          <Link to="/equipo/nuevo">
            <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
              <PlusCircle className="mr-2 h-5 w-5" />
              Añadir Equipo
            </Button>
          </Link>
        </div>
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Buscar equipo..."
            className="pl-10 bg-card border-border focus:ring-primary text-base"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredTeams.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 gap-4 px-1"
          >
            {filteredTeams.map((team) => (
              <TeamCard 
                key={team.id} 
                team={team} 
                onDelete={handleDeleteTeam} 
                onEdit={() => navigate(`/equipo/editar/${team.id}`)} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground text-base py-8 px-1"
          >
            No se encontraron equipos con ese nombre.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamsPage;
