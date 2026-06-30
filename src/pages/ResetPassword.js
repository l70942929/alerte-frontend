import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Connexion.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

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
      setMessage(' Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/connexion'), 3000);
    } catch (error) {
      setErreur(error.response?.data?.error || 'Erreur lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-right" style={{ marginTop: '80px' }}>
        <div className="auth-box fade-up">
          <h1>Réinitialiser le mot de passe</h1>
          <p>Entrez votre nouveau mot de passe.</p>
          
          {erreur && (
            <div className="form-err">
              <span className="material-symbols-outlined">error</span>
              {erreur}
            </div>
          )}
          
          {message && (
            <div className="form-success">
              <span className="material-symbols-outlined">check_circle</span>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="fgrp">
              <label>Nouveau mot de passe</label>
              <div className="finp">
                <span className="material-symbols-outlined finp-ico">lock</span>
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
                <span className="material-symbols-outlined finp-ico">lock</span>
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