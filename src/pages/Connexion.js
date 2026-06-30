import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  LogIn,
  User,
  Lock,
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  Mail,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import './Connexion.css';

function Connexion() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [form, setForm] = useState({ username: '', password: '' });
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  // ✅ REDIRIGER VERS DASHBOARD SI DÉJÀ CONNECTÉ
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/accueil');
    }
  }, [navigate]);

  const submit = async () => {
    if (!form.username || !form.password) {
      setErreur('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    setErreur('');
    try {
      const res = await api.post('/auth/connexion/', form);
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('role', res.data.role);
        navigate('/accueil');
      } else {
        setErreur('Réponse invalide du serveur.');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErreur('Identifiants incorrects. Veuillez réessayer.');
      } else if (error.message === 'Network Error') {
        setErreur('Impossible de se connecter au serveur.');
      } else {
        setErreur('Erreur lors de la connexion. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setResetMessage('Veuillez entrer votre email.');
      return;
    }
    setLoading(true);
    setResetMessage('');
    try {
      await api.post('/auth/mot-de-passe-oublie/', { email: resetEmail });
      setResetMessage('Un email de réinitialisation vous a été envoyé.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      setResetMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="auth-left">
        <div className="auth-visual">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="48" height="48">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2>CIVIALERT</h2>
          <p>Votre plateforme de signalement citoyenne</p>
          <div className="auth-stats">
            <div className="auth-stat">
              <Users size={24} />
              <strong>12k+</strong>
              <span>Citoyens</span>
            </div>
            <div className="auth-stat">
              <CheckCircle size={24} />
              <strong>98%</strong>
              <span>Vérifiées</span>
            </div>
            <div className="auth-stat">
              <Clock size={24} />
              <strong>15 min</strong>
              <span>Réaction</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box fade-up">
          <button className="auth-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte citoyen.</p>

          <div className="fgrp">
            <label>Nom d'utilisateur</label>
            <div className="finp">
              <User size={20} className="finp-ico" />
              <input
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </div>
          </div>

          <div className="fgrp">
            <label>Mot de passe</label>
            <div className="finp">
              <Lock size={20} className="finp-ico" />
              <input
                type="password"
                placeholder="Votre mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </div>
          </div>

          <div className="forgot-password">
            <button
              className="forgot-btn"
              onClick={() => setShowForgotPassword(!showForgotPassword)}
            >
              <KeyRound size={16} />
              Mot de passe oublié ?
            </button>
          </div>

          {showForgotPassword && (
            <div className="forgot-modal">
              <p>Entrez votre email pour réinitialiser votre mot de passe.</p>
              <div className="finp">
                <Mail size={20} className="finp-ico" />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              {resetMessage && (
                <div className={`reset-message ${resetMessage.includes('envoyé') ? 'success' : 'error'}`}>
                  {resetMessage}
                </div>
              )}
              <div className="forgot-actions">
                <button className="btn-cancel" onClick={() => setShowForgotPassword(false)}>
                  Annuler
                </button>
                <button className="btn-send" onClick={handleForgotPassword} disabled={loading}>
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          )}

          {erreur && (
            <div className="form-err">
              <span className="material-symbols-outlined">error</span>
              {erreur}
            </div>
          )}

          <button className="auth-submit" onClick={submit} disabled={loading}>
            <LogIn size={20} />
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="auth-or">
            <span>ou</span>
          </div>

          <button className="auth-switch" onClick={() => navigate('/inscription')}>
            Pas encore de compte ? <strong>Créer un compte</strong>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Connexion;