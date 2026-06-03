import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Accueil.css';

function Accueil() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/connexion');
      return;
    }

    axios.get('http://127.0.0.1:8000/api/signalements/', {
      headers: { Authorization: `Token ${token}` },
    }).then((res) => {
      setAlertes(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
    }).catch(() => {});
  }, [navigate]);

  const cats = [
    { icon: 'emergency', label: 'Kidnapping', type: 'kidnapping', bg: '#FFEBEE', border: '#E53935', color: '#C62828' },
    { icon: 'search', label: 'Disparition', type: 'disparition', bg: '#E3F2FD', border: '#1976D2', color: '#0D47A1' },
    { icon: 'inventory_2', label: "Perte d'objet", type: 'perte_objet', bg: '#FFF3E0', border: '#FF9800', color: '#E65100' },
    { icon: 'person_search', label: 'Découverte', type: 'decouverte', bg: '#E8F5E9', border: '#43A047', color: '#1B5E20' },
    { icon: 'local_hospital', label: 'Accident', type: 'accident', bg: '#F3E5F5', border: '#9C27B0', color: '#6A1B9A' },
  ];

  const statuts = { recu: 'recu', en_cours: 'en-cours', resolu: 'resolu', cloture: 'cloture' };
  const icons = { kidnapping: 'emergency', disparition: 'search', perte_objet: 'inventory_2', decouverte: 'person_search', accident: 'local_hospital' };

  return (
    <div className="acc-page">
      <Header />
      <div className="acc-body">
        <div className="acc-hero">
          <div className="acc-hero-txt">
            <p className="acc-hello">Bonjour, {username}</p>
            <h1 className="acc-title">Tableau de bord</h1>
            <p className="acc-sub">Bienvenue sur votre espace citoyen Alerte Cameroun.</p>
          </div>
          <button className="acc-btn-alert" onClick={() => navigate('/soumettre')}>
            <span className="material-symbols-outlined">add_alert</span>
            Nouvelle alerte
          </button>
        </div>

        <section className="acc-section">
          <h2 className="acc-sec-title">Signaler rapidement</h2>
          <div className="acc-cats">
            {cats.map((cat) => (
              <button
                key={cat.type}
                className="acc-cat"
                style={{ background: cat.bg, borderColor: cat.border, color: cat.color }}
                onClick={() => navigate('/soumettre')}
              >
                <span className="material-symbols-outlined acc-cat-icon">{cat.icon}</span>
                <span className="acc-cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        <button className="acc-urgence" onClick={() => navigate('/soumettre')}>
          <div className="acc-urgence-left">
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>emergency</span>
            <div>
              <p className="acc-urgence-title">Signaler une urgence</p>
              <p className="acc-urgence-sub">Alerte immédiate à la cellule de crise</p>
            </div>
          </div>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        <section className="acc-section">
          <div className="acc-sec-hdr">
            <h2 className="acc-sec-title">Alertes récentes</h2>
            <button className="acc-voir-tout" onClick={() => navigate('/alertes')}>
              Voir tout <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          {alertes.length === 0 ? (
            <div className="acc-empty">
              <span className="material-symbols-outlined">notifications_off</span>
              <p>Aucune alerte pour le moment</p>
              <button onClick={() => navigate('/soumettre')}>Soumettre la première alerte</button>
            </div>
          ) : (
            <div className="acc-alrt-list">
              {alertes.map((alerte) => (
                <div key={alerte.id} className="acc-alrt-card">
                  <div className="acc-alrt-emoji">
                    <span className="material-symbols-outlined">{icons[alerte.type_alerte] || 'notifications'}</span>
                  </div>
                  <div className="acc-alrt-info">
                    <p className="acc-alrt-type">{alerte.type_alerte.replace('_', ' ')} - {alerte.localisation}</p>
                    <p className="acc-alrt-desc">{alerte.description}</p>
                  </div>
                  <span className={`acc-alrt-stat ${statuts[alerte.statut]}`}>{alerte.statut}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <BottomNav />
    </div>
  );
}

export default Accueil;
