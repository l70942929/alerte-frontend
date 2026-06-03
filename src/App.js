import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Accueil from './pages/Accueil';
import Dashboard from './pages/Dashboard';
import ListeAlertes from './pages/ListeAlertes';
import DetailAlerte from './pages/DetailAlerte';
import SoumettreAlerte from './pages/SoumettreAlerte';
import Don from './pages/Don';
import Messagerie from './pages/Messagerie';
import Moderateur from './pages/Moderateur';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/connexion" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/accueil" element={<PrivateRoute><Accueil /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/alertes" element={<PrivateRoute><ListeAlertes /></PrivateRoute>} />
        <Route path="/alertes/:id" element={<PrivateRoute><DetailAlerte /></PrivateRoute>} />
        <Route path="/soumettre" element={<PrivateRoute><SoumettreAlerte /></PrivateRoute>} />
        <Route path="/don" element={<Don />} />
        <Route path="/messagerie" element={<PrivateRoute><Messagerie /></PrivateRoute>} />
        <Route path="/moderateur" element={<PrivateRoute><Moderateur /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;