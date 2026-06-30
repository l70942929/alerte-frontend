import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Landing from '../pages/Landing';
import Connexion from '../pages/Connexion';
import Inscription from '../pages/Inscription';
import Accueil from '../pages/Accueil';
import Dashboard from '../pages/Dashboard';
import ListeAlertes from '../pages/ListeAlertes';
import DetailAlerte from '../pages/DetailAlerte';
import SoumettreAlerte from '../pages/SoumettreAlerte';
import Don from '../pages/Don';
import Messagerie from '../pages/Messagerie';
import Moderateur from '../pages/Moderateur';
import Conditions from '../pages/Conditions';
import Privacy from '../pages/Privacy';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Points from '../pages/Points';
import ResetPassword from '../pages/ResetPassword';
import AiderAlerte from '../pages/AiderAlerte';



// Et dans les routes

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/connexion" />;
}

function Layout({ children }) {
  return (
    <div>
      <Header />
      {children}
      <BottomNav />
    </div>
  );
}


function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
      
        
        {/* Routes protégées avec Layout */}
        <Route element={<Layout><PrivateRoute><Accueil /></PrivateRoute></Layout>} path="/accueil" />
        <Route element={<Layout><PrivateRoute><Dashboard /></PrivateRoute></Layout>} path="/dashboard" />
        <Route element={<Layout><PrivateRoute><ListeAlertes /></PrivateRoute></Layout>} path="/alertes" />
        <Route element={<Layout><PrivateRoute><DetailAlerte /></PrivateRoute></Layout>} path="/alertes/:id" />
        <Route element={<Layout><PrivateRoute><SoumettreAlerte /></PrivateRoute></Layout>} path="/soumettre" />
        <Route element={<Layout><PrivateRoute><Messagerie /></PrivateRoute></Layout>} path="/messagerie" />
        <Route element={<Layout><PrivateRoute><Moderateur /></PrivateRoute></Layout>} path="/moderateur" />
        <Route element={<Layout><Don /></Layout>} path="/don" />
        
        <Route path="/aider/:id" element={<AiderAlerte />} />
        <Route path="/points" element={<Points />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
        <Route path="/conditions-d-utilisation" element={<Conditions />} />
        <Route path="/politique-de-confidentialite" element={<Privacy />} />
        <Route path="/contact-d-urgence" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;