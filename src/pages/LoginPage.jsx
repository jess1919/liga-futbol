import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const predefinedUsers = [
    { username: 'admin1', password: 'password123', hint: "Usuario: admin1, Contraseña: password123" },
    { username: 'admin2', password: 'securepass456', hint: "Usuario: admin2, Contraseña: securepass456" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const user = predefinedUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('adminUser', username);
      toast({
        title: 'Inicio de Sesión Exitoso',
        description: `Bienvenido, ${username}!`,
      });
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos.');
      toast({
        title: 'Error de Inicio de Sesión',
        description: 'Usuario o contraseña incorrectos.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-lg border-primary/30">
          <CardHeader className="text-center">
            <div className="inline-block p-3 bg-primary/20 rounded-full mx-auto mb-3">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Acceso Administrador
            </CardTitle>
            <CardDescription>
              Ingresa tus credenciales para gestionar la liga.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background/70 border-input focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/70 border-input focus:border-primary"
                />
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white text-lg py-6">
                Ingresar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" type="button" className="text-sm text-muted-foreground hover:text-primary">
                    <HelpCircle className="h-4 w-4 mr-1.5" /> ¿Olvidaste tu contraseña?
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Recuperación de Contraseña (Demo)</AlertDialogTitle>
                    <AlertDialogDescription>
                      <p className="mb-2">Esta es una demostración de recuperación de contraseña. En un sistema real, se enviaría un enlace seguro a tu correo.</p>
                      <p className="mb-1">Para fines de prueba, estas son las credenciales de administrador:</p>
                      <ul className="list-disc list-inside text-sm">
                        {predefinedUsers.map(user => <li key={user.username}>{user.hint}</li>)}
                      </ul>
                      <p className="mt-3 text-xs text-amber-600">Recuerda: Esta información no debe ser visible en una aplicación de producción.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Entendido</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;