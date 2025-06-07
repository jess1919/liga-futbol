import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, CalendarPlus, Trophy, ListOrdered, ArrowLeft, LogOut, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNewsTab from '@/components/admin/AdminNewsTab.jsx';
import AdminFixtureTab from '@/components/admin/AdminFixtureTab.jsx';
import AdminResultsTab from '@/components/admin/AdminResultsTab.jsx';
import AdminTablesTab from '@/components/admin/AdminTablesTab.jsx';
import AdminAdsTab from '@/components/admin/AdminAdsTab.jsx';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const activeTab = searchParams.get('tab') || 'news';
  const adminUser = localStorage.getItem('adminUser') || 'Admin';

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUser');
    toast({
      title: 'Sesión Cerrada',
      description: 'Has cerrado sesión correctamente.',
    });
    navigate('/login');
  };

  const tabsConfig = [
    { value: "news", label: "Novedades", icon: Newspaper, component: <AdminNewsTab /> },
    { value: "fixture", label: "Fixture", icon: CalendarPlus, component: <AdminFixtureTab /> },
    { value: "results", label: "Resultados", icon: Trophy, component: <AdminResultsTab /> },
    { value: "tables", label: "Tablas", icon: ListOrdered, component: <AdminTablesTab /> },
    { value: "ads", label: "Publicidad", icon: Megaphone, component: <AdminAdsTab /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-16 md:pb-8 px-1"
    >
      <Card className="bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
             <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent flex-grow">
              Panel de Administración
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleLogout} className="ml-2">
              <LogOut className="h-4 w-4 mr-1.5" /> Cerrar Sesión
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Bienvenido, <span className="font-semibold text-primary">{adminUser}</span>.</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-muted/50 p-1 h-auto rounded-lg shadow-sm">
              {tabsConfig.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all text-xs sm:text-sm py-2"
                >
                  <tab.icon className="mr-1 h-4 w-4" />{tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                {tabsConfig.map(tab => (
                  <TabsContent key={tab.value} value={tab.value}>
                    {tab.component}
                  </TabsContent>
                ))}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminPage;