
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Trash2, Users, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
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
import CategorySelector from '@/components/CategorySelector';

const TeamCategoriesManager = ({ categories, setCategories, allAvailableCategories, setAllAvailableCategories }) => {
  const { toast } = useToast();
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(null); 
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '', position: '' });
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Error", description: "El nombre de la categoría es obligatorio.", variant: "destructive" });
      return;
    }
    if (categories.find(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast({ title: "Error", description: `La categoría "${newCategoryName.trim()}" ya existe para este equipo.`, variant: "destructive" });
      return;
    }
    const newCat = { id: Date.now().toString(), name: newCategoryName.trim(), players: [] };
    setCategories([...categories, newCat]);
    
    if (!allAvailableCategories.includes(newCat.name)) {
      setAllAvailableCategories(prev => [...new Set([...prev, newCat.name])].sort());
    }
    
    setNewCategoryName('');
    setShowAddCategoryForm(false);
    toast({ title: "Categoría añadida", description: `Categoría "${newCat.name}" agregada.` });
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({ title: "Categoría eliminada", variant: "destructive" });
  };

  const handleAddPlayer = (categoryId) => {
    if (!newPlayer.name.trim() || !newPlayer.number.trim()) {
      toast({ title: "Error", description: "Nombre y número del jugador son obligatorios.", variant: "destructive" });
      return;
    }
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, players: [...cat.players, { ...newPlayer, id: Date.now().toString() }] };
      }
      return cat;
    });
    setCategories(updatedCategories);
    setNewPlayer({ name: '', number: '', position: '' });
    setShowAddPlayerForm(null);
    toast({ title: "Jugador añadido", description: `Jugador "${newPlayer.name}" agregado.` });
  };

  const handleDeletePlayer = (categoryId, playerId) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, players: cat.players.filter(p => p.id !== playerId) };
      }
      return cat;
    });
    setCategories(updatedCategories);
    toast({ title: "Jugador eliminado", variant: "destructive" });
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-primary">Categorías</h3>
        <Button type="button" size="sm" variant="outline" onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}>
          <PlusCircle className="h-4 w-4 mr-2" /> {showAddCategoryForm ? 'Cancelar' : 'Añadir Categoría'}
        </Button>
      </div>

      <AnimatePresence>
        {showAddCategoryForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 border rounded-md bg-muted/30 space-y-2"
          >
            <Label htmlFor="newCategoryName">Nombre Nueva Categoría</Label>
            <div className="flex gap-2">
               <CategorySelector
                value={newCategoryName}
                onChange={setNewCategoryName}
                allCategories={allAvailableCategories}
                onCategoriesChange={setAllAvailableCategories}
                className="flex-grow"
              />
              <Button type="button" size="sm" onClick={handleAddCategory} className="bg-green-500 hover:bg-green-600 text-white self-end">Añadir</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {categories.length === 0 && !showAddCategoryForm && (
        <p className="text-sm text-muted-foreground text-center py-3">Este equipo aún no tiene categorías.</p>
      )}

      <div className="space-y-3">
        {categories.map((category) => (
          <Card key={category.id} className="bg-card/50">
            <CardHeader className="p-3 cursor-pointer hover:bg-muted/20" onClick={() => toggleCategoryExpansion(category.id)}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-md">{category.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 h-7 w-7" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar categoría "{category.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esto también eliminará todos los jugadores de esta categoría. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {expandedCategories[category.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
            </CardHeader>
            <AnimatePresence>
              {expandedCategories[category.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium flex items-center"><Users className="h-4 w-4 mr-1.5 text-muted-foreground" /> Jugadores ({category.players?.length || 0})</p>
                      <Button type="button" size="xs" variant="outline" onClick={() => setShowAddPlayerForm(showAddPlayerForm === category.id ? null : category.id)}>
                        <UserPlus className="h-3 w-3 mr-1" /> {showAddPlayerForm === category.id ? 'Cancelar' : 'Añadir Jugador'}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showAddPlayerForm === category.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-3 p-2.5 border rounded-md bg-muted/30 space-y-2 text-xs"
                        >
                          <Label>Nuevo Jugador</Label>
                          <Input value={newPlayer.name} onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })} placeholder="Nombre completo" className="h-8 text-xs bg-background/50" />
                          <div className="flex gap-2">
                            <Input type="number" value={newPlayer.number} onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })} placeholder="N°" className="h-8 text-xs bg-background/50 w-1/3" />
                            <Input value={newPlayer.position} onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })} placeholder="Posición" className="h-8 text-xs bg-background/50 flex-grow" />
                          </div>
                          <Button type="button" size="xs" onClick={() => handleAddPlayer(category.id)} className="w-full bg-green-500 hover:bg-green-600 text-white h-8">Añadir Jugador</Button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {category.players && category.players.length > 0 ? (
                      <ul className="space-y-1.5 text-sm">
                        {category.players.map(player => (
                          <li key={player.id} className="flex justify-between items-center p-1.5 bg-background/30 rounded-md text-xs">
                            <div className="flex items-center">
                              <span className="font-semibold w-6 text-center mr-2 bg-primary/20 text-primary rounded-full text-[10px] p-0.5">{player.number}</span>
                              <span>{player.name} <span className="text-muted-foreground">({player.position || 'N/A'})</span></span>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 h-6 w-6" onClick={(e) => e.stopPropagation()}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar jugador "{player.name}"?</AlertDialogTitle>
                                  <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeletePlayer(category.id, player.id)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-2">No hay jugadores en esta categoría.</p>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamCategoriesManager;
