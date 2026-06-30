import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Connexion.css';

function ResetPassword() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  // ✅ REDIRIGER VERS DASHBOARD SI DÉJÀ CONNECTÉ
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/accueil');
    }
  }, [navigate]);

  useEffect(() => {
    if (!uid || !token) {
      setErreur('Lien de réinitialisation invalide.');
    }
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    if (password !== confirmPassword) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    
    setLoading(true);
    setErreur('');
    setMessage('');
    
    try {
      await api.post('/auth/reinitialiser-mot-de-passe/', {
        uid,
        token,
        new_password: password
      });
      setMessage('Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/connexion'), 3000);
    } catch (error) {
      setErreur(error.response?.data?.error || 'Erreur lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className="auth-right" style={{ marginTop: '80px' }}>
        <div className="auth-box fade-up">
          <button className="auth-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Réinitialiser le mot de passe</h1>
          <p>Entrez votre nouveau mot de passe.</p>
          
          {erreur && (
            <div className="form-err">
              <AlertCircle size={18} />
              {erreur}
            </div>
          )}
          
          {message && (
            <div className="form-success">
              <CheckCircle size={18} />
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="fgrp">
              <label>Nouveau mot de passe</label>
              <div className="finp">
                <Lock size={20} className="finp-ico" />
                <input
                  type="password"
                  placeholder="Entrez votre nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="fgrp">
              <label>Confirmer le mot de passe</label>
              <div className="finp">
                <Lock size={20} className="finp-ico" />
                <input
                  type="password"
                  placeholder="Confirmez votre nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Chargement...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default ResetPassword;