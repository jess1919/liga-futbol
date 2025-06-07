
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import TeamsPage from '@/pages/TeamsPage';
import EditTeamPage from '@/pages/EditTeamPage'; 
import FixturePage from '@/pages/FixturePage';
import ResultsPage from '@/pages/ResultsPage';
import StandingsPage from '@/pages/StandingsPage';
import AdminPage from '@/pages/AdminPage';
import LoginPage from '@/pages/LoginPage';
import { Toaster } from "@/components/ui/toaster";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/equipos" element={<TeamsPage />} />
        <Route path="/equipo/editar/:teamId" element={<EditTeamPage />} />
        <Route path="/equipo/nuevo" element={<EditTeamPage />} />
        <Route path="/fixture" element={<FixturePage />} />
        <Route path="/resultados" element={<ResultsPage />} />
        <Route path="/tablas" element={<StandingsPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
