import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TeamForm = ({ teamName, setTeamName, teamLogo, setTeamLogo, teamColors, setTeamColors }) => {
  const { toast } = useToast();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "Error", description: "La imagen es demasiado grande. Máximo 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="teamName" className="text-lg">Nombre del Equipo</Label>
        <Input 
          id="teamName" 
          value={teamName} 
          onChange={(e) => setTeamName(e.target.value)} 
          placeholder="Ej: Club Atlético Independiente" 
          className="text-base py-3 bg-background/70 mt-1"
        />
      </div>

      <div>
        <Label className="text-lg">Logo del Equipo</Label>
        <div className="mt-1 flex items-center gap-4">
          {teamLogo ? (
            <div className="relative group">
              <img alt="Logo del equipo" src={teamLogo} className="h-24 w-24 rounded-full object-cover border-2 border-primary/50 shadow-md" />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setTeamLogo('')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <ImagePlus className="h-10 w-10" />
            </div>
          )}
          <Input 
            id="logoUpload" 
            type="file" 
            accept="image/png, image/jpeg, image/svg+xml, image/webp" 
            onChange={handleLogoUpload} 
            className="hidden" 
          />
          <Button type="button" variant="outline" onClick={() => document.getElementById('logoUpload').click()}>
            <ImagePlus className="h-4 w-4 mr-2" /> {teamLogo ? 'Cambiar Logo' : 'Subir Logo'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Recomendado: PNG, JPG, SVG o WEBP. Máx 2MB.</p>
      </div>

      <div>
        <Label className="text-lg">Colores del Equipo</Label>
        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryColor" className="text-sm">Color Primario</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input 
                id="primaryColor" 
                type="color" 
                value={teamColors.primary} 
                onChange={(e) => setTeamColors(prev => ({ ...prev, primary: e.target.value }))} 
                className="w-12 h-10 p-1 bg-background/70"
              />
              <Input 
                type="text" 
                value={teamColors.primary} 
                onChange={(e) => setTeamColors(prev => ({ ...prev, primary: e.target.value }))} 
                className="bg-background/70"
                maxLength="7"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="secondaryColor" className="text-sm">Color Secundario</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input 
                id="secondaryColor" 
                type="color" 
                value={teamColors.secondary} 
                onChange={(e) => setTeamColors(prev => ({ ...prev, secondary: e.target.value }))} 
                className="w-12 h-10 p-1 bg-background/70"
              />
               <Input 
                type="text" 
                value={teamColors.secondary} 
                onChange={(e) => setTeamColors(prev => ({ ...prev, secondary: e.target.value }))} 
                className="bg-background/70"
                maxLength="7"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamForm;