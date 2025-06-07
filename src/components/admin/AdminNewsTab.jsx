import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
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

const AdminNewsTab = () => {
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [newsFormData, setNewsFormData] = useState({ title: '', date: '', content: '' });

  useEffect(() => {
    const storedNews = JSON.parse(localStorage.getItem('soccerNews') || '[]');
    setNewsItems(storedNews);
  }, []);

  const handleNewsChange = (e) => {
    const { name, value } = e.target;
    setNewsFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveNews = () => {
    if (!newsFormData.title || !newsFormData.date || !newsFormData.content) {
      toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
      return;
    }
    let updatedNews;
    if (editingNews) {
      updatedNews = newsItems.map(item => item.id === editingNews.id ? { ...editingNews, ...newsFormData } : item);
    } else {
      updatedNews = [...newsItems, { id: Date.now().toString(), ...newsFormData }];
    }
    setNewsItems(updatedNews);
    localStorage.setItem('soccerNews', JSON.stringify(updatedNews));
    toast({ title: "Éxito", description: `Novedad ${editingNews ? 'actualizada' : 'guardada'}.` });
    setEditingNews(null);
    setNewsFormData({ title: '', date: '', content: '' });
  };

  const editNewsItem = (item) => {
    setEditingNews(item);
    setNewsFormData({ title: item.title, date: item.date, content: item.content });
  };

  const deleteNewsItem = (itemId) => {
    const updatedNews = newsItems.filter(item => item.id !== itemId);
    setNewsItems(updatedNews);
    localStorage.setItem('soccerNews', JSON.stringify(updatedNews));
    toast({ title: "Novedad eliminada", variant: "destructive" });
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
          <CardTitle>{editingNews ? 'Editar Novedad' : 'Añadir Nueva Novedad'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="newsTitle">Título</Label>
            <Input id="newsTitle" name="title" value={newsFormData.title} onChange={handleNewsChange} className="bg-background/70"/>
          </div>
          <div>
            <Label htmlFor="newsDate">Fecha</Label>
            <Input type="date" id="newsDate" name="date" value={newsFormData.date} onChange={handleNewsChange} className="bg-background/70"/>
          </div>
          <div>
            <Label htmlFor="newsContent">Contenido</Label>
            <Textarea id="newsContent" name="content" value={newsFormData.content} onChange={handleNewsChange} className="bg-background/70" rows={4}/>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {editingNews && <Button variant="outline" onClick={() => { setEditingNews(null); setNewsFormData({ title: '', date: '', content: '' });}}>Cancelar Edición</Button>}
          <Button onClick={saveNews} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <Save className="mr-2 h-4 w-4"/> {editingNews ? 'Actualizar Novedad' : 'Guardar Novedad'}
          </Button>
        </CardFooter>
      </Card>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Novedades Existentes</h3>
        {newsItems.length > 0 ? (
          <div className="space-y-2">
          {newsItems.map(item => (
            <motion.div key={item.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit">
            <Card className="bg-card/50">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">{item.title}</CardTitle>
                <CardDescription className="text-xs">{new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent className="p-3 text-xs">
                <p className="line-clamp-2">{item.content}</p>
              </CardContent>
              <CardFooter className="p-2 flex justify-end gap-1 bg-muted/20">
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-blue-500" onClick={() => editNewsItem(item)}><Edit2 className="h-4 w-4"/></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4"/></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar novedad "{item.title}"?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteNewsItem(item.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">No hay novedades.</p>}
      </div>
    </div>
  );
};

export default AdminNewsTab;