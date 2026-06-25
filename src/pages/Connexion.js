import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Connexion.css';

function Connexion() {
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [erreur,  setErreur]  = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.username || !form.password) { setErreur('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setErreur('');
    try {
      const res = await api.post('/auth/connexion/', form);
      if (res.data?.token) {
        localStorage.setItem('token',    res.data.token);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('role',     res.data.role);
        navigate('/accueil');
      } else { setErreur('Réponse invalide du serveur.'); }
    } catch (error) {
      if (error.response?.status === 400) setErreur('Identifiants incorrects. Veuillez réessayer.');
      else if (error.message === 'Network Error') setErreur('Impossible de se connecter au serveur.');
      else setErreur('Erreur lors de la connexion. Veuillez réessayer.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-visual">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="36" height="36">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2>Alerte Citoyenne</h2>
          <p>Votre plateforme de signalement citoyenne au Cameroun</p>
          <div className="auth-stats">
            <div className="auth-stat"><strong>12k+</strong><span>Citoyens</span></div>
            <div className="auth-stat"><strong>98%</strong><span>Vérifiées</span></div>
            <div className="auth-stat"><strong>15 min</strong><span>Réaction</span></div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box fade-up">
          <button className="auth-back" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte citoyen.</p>

          <div className="fgrp">
            <label>Nom d'utilisateur</label>
            <div className="finp">
              <span className="material-symbols-outlined finp-ico">person</span>
              <input type="text" placeholder="Votre nom d'utilisateur" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && submit()} />
            </div>
          </div>
          <div className="fgrp">
            <label>Mot de passe</label>
            <div className="finp">
              <span className="material-symbols-outlined finp-ico">lock</span>
              <input type="password" placeholder="Votre mot de passe" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && submit()} />
            </div>
          </div>

          {erreur && <div className="form-err"><span className="material-symbols-outlined">error</span>{erreur}</div>}

          <button className="auth-submit" onClick={submit} disabled={loading}>
            <span className="material-symbols-outlined">login</span>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <div className="auth-or"><span>ou</span></div>
          <button className="auth-switch" onClick={() => navigate('/inscription')}>
            Pas encore de compte ? <strong>Créer un compte</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Connexion;