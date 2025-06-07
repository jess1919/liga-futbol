import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, Link2, Trash2, Eye } from 'lucide-react';
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

const adSlotsConfig = [
  { id: 'home_main', name: 'Banner Principal (Home)', description: 'Banner grande en la parte superior de la página de inicio.' },
  { id: 'home_secondary', name: 'Banner Secundario (Home)', description: 'Banner mediano entre secciones de la página de inicio.' },
  { id: 'header_main', name: 'Banner Cabecera (Desktop)', description: 'Banner pequeño en la cabecera, visible en pantallas grandes.' },
  { id: 'footer_main', name: 'Banner Pie de Página', description: 'Banner en el pie de página, visible en todas las páginas.' },
];

const AdminAdsTab = () => {
  const { toast } = useToast();
  const [adsData, setAdsData] = useState({});
  const [previewAd, setPreviewAd] = useState(null);

  useEffect(() => {
    const storedAds = JSON.parse(localStorage.getItem('soccerAdsData') || '{}');
    setAdsData(storedAds);
  }, []);

  const handleImageUpload = (slotId, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "Error", description: "La imagen es demasiado grande. Máximo 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdsData(prev => ({
          ...prev,
          [slotId]: { ...prev[slotId], imageUrl: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkChange = (slotId, value) => {
    setAdsData(prev => ({
      ...prev,
      [slotId]: { ...prev[slotId], linkUrl: value }
    }));
  };
  
  const handleAltTextChange = (slotId, value) => {
    setAdsData(prev => ({
      ...prev,
      [slotId]: { ...prev[slotId], altText: value }
    }));
  };

  const handleSaveAds = () => {
    localStorage.setItem('soccerAdsData', JSON.stringify(adsData));
    toast({ title: "Publicidad Guardada", description: "Los cambios en la publicidad han sido guardados." });
  };

  const handleRemoveImage = (slotId) => {
    setAdsData(prev => {
      const updatedSlot = { ...prev[slotId], imageUrl: null };
      if (!updatedSlot.linkUrl && !updatedSlot.altText) { // If no other data, remove slot
         const { [slotId]: _, ...rest } = prev;
         return { ...rest, [slotId]: { imageUrl: null, linkUrl: prev[slotId]?.linkUrl, altText: prev[slotId]?.altText } };
      }
      return { ...prev, [slotId]: updatedSlot };
    });
  };
  
  const handleClearSlot = (slotId) => {
     setAdsData(prev => {
      const { [slotId]: _, ...rest } = prev; // Remove the slot
      return rest;
    });
     toast({ title: "Espacio Vaciado", description: `Publicidad para "${adSlotsConfig.find(s => s.id === slotId)?.name}" eliminada.` });
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Espacios Publicitarios</CardTitle>
          <CardDescription>Sube imágenes y define enlaces para los banners de la aplicación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {adSlotsConfig.map(slot => {
            const currentAd = adsData[slot.id] || {};
            return (
              <Card key={slot.id} className="bg-muted/20 p-4 rounded-lg">
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-lg">{slot.name}</CardTitle>
                  <CardDescription className="text-xs">{slot.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <Label htmlFor={`image-${slot.id}`} className="text-sm font-medium">Imagen del Banner</Label>
                    <div className="mt-1 flex items-center gap-3">
                      <Input
                        id={`image-${slot.id}`}
                        type="file"
                        accept="image/png, image/jpeg, image/gif, image/webp, image/svg+xml"
                        onChange={(e) => handleImageUpload(slot.id, e)}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById(`image-${slot.id}`).click()}>
                        <UploadCloud className="h-4 w-4 mr-2" /> {currentAd.imageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
                      </Button>
                      {currentAd.imageUrl && (
                        <>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewAd(currentAd)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRemoveImage(slot.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    {currentAd.imageUrl && <p className="text-xs text-muted-foreground mt-1">Imagen cargada. Máx 2MB.</p>}
                  </div>
                  <div>
                    <Label htmlFor={`link-${slot.id}`} className="text-sm font-medium">Enlace (URL)</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Link2 className="h-5 w-5 text-muted-foreground" />
                      <Input
                        id={`link-${slot.id}`}
                        type="url"
                        placeholder="https://ejemplo.com/patrocinador"
                        value={currentAd.linkUrl || ''}
                        onChange={(e) => handleLinkChange(slot.id, e.target.value)}
                        className="bg-background/70"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`altText-${slot.id}`} className="text-sm font-medium">Texto Alternativo (para accesibilidad)</Label>
                     <Input
                        id={`altText-${slot.id}`}
                        type="text"
                        placeholder="Ej: Banner de SuperMarca Deportes"
                        value={currentAd.altText || ''}
                        onChange={(e) => handleAltTextChange(slot.id, e.target.value)}
                        className="bg-background/70 mt-1"
                      />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleClearSlot(slot.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50">
                    <Trash2 className="h-4 w-4 mr-2" /> Vaciar Espacio Publicitario
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveAds} className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white">Guardar Cambios de Publicidad</Button>
        </CardFooter>
      </Card>

      {previewAd && (
        <AlertDialog open={!!previewAd} onOpenChange={() => setPreviewAd(null)}>
          <AlertDialogContent className="max-w-lg w-full">
            <AlertDialogHeader>
              <AlertDialogTitle>Vista Previa del Banner</AlertDialogTitle>
              <AlertDialogDescription>
                Así se verá la imagen del banner. El enlace es: {previewAd.linkUrl || 'No definido'}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4 flex justify-center items-center bg-muted/50 p-4 rounded-md max-h-64 overflow-hidden">
              {previewAd.imageUrl && <img src={previewAd.imageUrl} alt="Vista previa" className="max-w-full max-h-full object-contain" />}
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setPreviewAd(null)}>Cerrar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default AdminAdsTab;