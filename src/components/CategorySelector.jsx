
import React, { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const CategorySelector = ({ value, onChange, allCategories = [], onCategoriesChange, className, disabled = false }) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [manualCategoryName, setManualCategoryName] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);

  const loadCategories = useCallback(() => {
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
    const uniqueCategories = [...new Set([...defaultCategories, ...categoriesFromTeams, ...categoriesFromStorage, ...allCategories])].filter(Boolean).sort();
    setAvailableCategories(uniqueCategories);

    if (value && !uniqueCategories.includes(value) && value !== 'Otra') {
      setIsManualEntry(true);
      setManualCategoryName(value);
      setInternalValue('Otra');
    } else if (value && uniqueCategories.includes(value)) {
      setIsManualEntry(false);
      setManualCategoryName('');
      setInternalValue(value);
    } else if (!value) {
      setIsManualEntry(false);
      setManualCategoryName('');
      setInternalValue('');
    }

  }, [allCategories, value]);

  useEffect(() => {
    loadCategories();
    
    const handleStorageChange = (event) => {
      if (['soccerTeams', 'soccerFixture', 'soccerResults', 'soccerPositions', 'soccerScorers', 'soccerCautioned'].includes(event.key)) {
        loadCategories();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadCategories]);


  useEffect(() => {
    if (value && !availableCategories.includes(value) && value !== 'Otra') {
      setIsManualEntry(true);
      setManualCategoryName(value);
      setInternalValue('Otra');
    } else if (value && availableCategories.includes(value)) {
      setIsManualEntry(false);
      setManualCategoryName('');
      setInternalValue(value);
    } else if (!value) {
        setIsManualEntry(false);
        setManualCategoryName('');
        setInternalValue('');
    }
  }, [value, availableCategories]);


  const handleSelectChange = (selectedValue) => {
    setInternalValue(selectedValue);
    if (selectedValue === 'Otra') {
      setIsManualEntry(true);
      setManualCategoryName(''); 
      onChange(''); 
    } else {
      setIsManualEntry(false);
      setManualCategoryName('');
      onChange(selectedValue);
    }
  };

  const handleManualInputChange = (e) => {
    const newName = e.target.value;
    setManualCategoryName(newName);
    onChange(newName); 
  };

  const handleManualInputBlur = () => {
    if (manualCategoryName.trim() && !availableCategories.includes(manualCategoryName.trim())) {
        const updatedCategories = [...availableCategories, manualCategoryName.trim()].sort();
        setAvailableCategories(updatedCategories);
        if (onCategoriesChange) {
            onCategoriesChange(updatedCategories);
        }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Select onValueChange={handleSelectChange} value={internalValue} disabled={disabled}>
        <SelectTrigger className="w-full bg-background/70">
          <SelectValue placeholder="Seleccionar categoría..." />
        </SelectTrigger>
        <SelectContent>
          {availableCategories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
          <SelectItem value="Otra">Otra (Ingresar Manualmente)</SelectItem>
        </SelectContent>
      </Select>
      {isManualEntry && (
        <div className="mt-2">
          <Label htmlFor="manualCategoryInput" className="text-xs text-muted-foreground">Nombre Nueva Categoría:</Label>
          <Input
            id="manualCategoryInput"
            value={manualCategoryName}
            onChange={handleManualInputChange}
            onBlur={handleManualInputBlur}
            placeholder="Escribe el nombre de la categoría"
            className="bg-background/70 mt-1"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
