import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Connexion.css';

function Inscription() {
  const [form,    setForm]    = useState({ username: '', password: '', email: '', telephone: '', localisation: '' });
  const [erreur,  setErreur]  = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.username || !form.password) { setErreur('Nom et mot de passe obligatoires.'); return; }
    setLoading(true); setErreur('');
    try {
      const res = await api.post('/auth/inscription/', form);
      if (res.data.token) {
        localStorage.setItem('token',    res.data.token);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('role',     res.data.role);
        navigate('/accueil');
      } else { setErreur("Erreur lors de l'inscription. Réessayez."); }
    } catch (err) {
      if (err.response?.data?.username) setErreur("Ce nom d'utilisateur existe déjà.");
      else if (err.response?.data?.email) setErreur("Cet email est déjà utilisé.");
      else if (err.response?.data) setErreur(Object.values(err.response.data).flat()[0] || "Erreur lors de l'inscription.");
      else setErreur("Impossible de contacter le serveur.");
    }
    setLoading(false);
  };

  const fields = [
    { key: 'username',     label: "Nom d'utilisateur", icon: 'person',      type: 'text',     placeholder: "Choisissez un nom d'utilisateur" },
    { key: 'password',     label: 'Mot de passe',       icon: 'lock',        type: 'password', placeholder: 'Choisissez un mot de passe sécurisé' },
    { key: 'email',        label: 'Email',              icon: 'email',       type: 'email',    placeholder: 'votre@email.com' },
    { key: 'telephone',    label: 'Téléphone',          icon: 'phone',       type: 'text',     placeholder: 'Ex : 699 00 00 00' },
    { key: 'localisation', label: 'Localisation',       icon: 'location_on', type: 'text',     placeholder: 'Ex : Douala, Bonanjo' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-visual">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="36" height="36">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2>Rejoignez la communauté</h2>
          <p>Plus de 12 000 citoyens camerounais protègent déjà leur communauté.</p>
          <div className="auth-stats">
            <div className="auth-stat"><strong>Gratuit</strong><span>Pour tous</span></div>
            <div className="auth-stat"><strong>Sécurisé</strong><span>Données</span></div>
            <div className="auth-stat"><strong>Anonyme</strong><span>Si souhaité</span></div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box fade-up">
          <button className="auth-back" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1>Créer un compte</h1>
          <p>Rejoignez le réseau de vigilance citoyenne.</p>

          {fields.map((f) => (
            <div className="fgrp" key={f.key}>
              <label>{f.label}</label>
              <div className="finp">
                <span className="material-symbols-outlined finp-ico">{f.icon}</span>
                <input type={f.type} placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            </div>
          ))}

          {erreur && <div className="form-err"><span className="material-symbols-outlined">error</span>{erreur}</div>}

          <button className="auth-submit" onClick={submit} disabled={loading}>
            <span className="material-symbols-outlined">app_registration</span>
            {loading ? 'Inscription...' : "S'inscrire gratuitement"}
          </button>
          <div className="auth-or"><span>ou</span></div>
          <button className="auth-switch" onClick={() => navigate('/connexion')}>
            Déjà un compte ? <strong>Se connecter</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inscription;