import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Accueil.css';

function Accueil() {
  const navigate  = useNavigate();
  const username  = localStorage.getItem('username');
  const [alertes, setAlertes] = useState([]);
  const [heure,   setHeure]   = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/connexion'); return; }

    const h = new Date().getHours();
    if (h < 12)      setHeure('Bonjour');
    else if (h < 18) setHeure('Bon après-midi');
    else             setHeure('Bonsoir');

    api.get('signalements/')
      .then((res) => setAlertes(Array.isArray(res.data) ? res.data.slice(0, 4) : []))
      .catch(() => {});
  }, [navigate]);

  const cats = [
    { icon: 'emergency',      label: 'Kidnapping',    type: 'kidnapping',  bg: '#FFF0F0', border: '#FFCDD2', color: '#C62828' },
    { icon: 'search',         label: 'Disparition',   type: 'disparition', bg: '#EFF6FF', border: '#BBDEFB', color: '#1565C0' },
    { icon: 'inventory_2',    label: "Perte d'objet", type: 'perte_objet', bg: '#FFFBF0', border: '#FFE082', color: '#E65100' },
    { icon: 'person_search',  label: 'Découverte',    type: 'decouverte',  bg: '#F0FFF4', border: '#C8E6C9', color: '#2E7D32' },
    { icon: 'local_hospital', label: 'Accident',      type: 'accident',    bg: '#F5F0FF', border: '#D1C4E9', color: '#6A1B9A' },
  ];

  const typeConfig = {
    kidnapping:  { label: 'Kidnapping',    icon: 'emergency',      bg: '#FFF0F0', color: '#C62828' },
    disparition: { label: 'Disparition',   icon: 'search',         bg: '#EFF6FF', color: '#1565C0' },
    perte_objet: { label: "Perte d'objet", icon: 'inventory_2',    bg: '#FFFBF0', color: '#E65100' },
    decouverte:  { label: 'Découverte',    icon: 'person_search',  bg: '#F0FFF4', color: '#2E7D32' },
    accident:    { label: 'Accident',      icon: 'local_hospital', bg: '#F5F0FF', color: '#6A1B9A' },
  };

  const statutCfg = {
    recu:     { label: 'En attente', cls: 'badge-attente' },
    en_cours: { label: 'En cours',   cls: 'badge-encours' },
    resolu:   { label: 'Résolu',     cls: 'badge-resolu'  },
    cloture:  { label: 'Clôturé',    cls: 'badge-cloture' },
  };

  const afficherLieu = (loc = '') => {
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(loc.trim())) return 'Position GPS enregistrée';
    return loc || 'Lieu non précisé';
  };

  const initiales = username ? username.slice(0, 2).toUpperCase() : 'U';

  return (
    <div className="acc-root">
      <Header />

      <div className="acc-wrap">

        {/* ════ BANNIÈRE ════ */}
        <div className="acc-banner">
          <div className="acc-banner-left">
            <div className="acc-avatar">{initiales}</div>
            <div>
              <p className="acc-salut">{heure},</p>
              <h1 className="acc-username">{username}</h1>
              <p className="acc-tagline">Votre espace de vigilance citoyenne</p>
            </div>
          </div>
          <button className="acc-btn-primary" onClick={() => navigate('/soumettre')}>
            <span className="material-symbols-outlined">add_alert</span>
            Nouvelle alerte
          </button>
        </div>

        {/* ════ URGENCE ════ */}
        <button className="acc-urgence" onClick={() => navigate('/soumettre')}>
          <div className="acc-urgence-left">
            <div className="acc-urgence-dot" />
            <div>
              <p className="acc-urgence-titre">Signaler une urgence maintenant</p>
              <p className="acc-urgence-sub">Transmission immédiate à la cellule de crise</p>
            </div>
          </div>
          <span className="material-symbols-outlined acc-urgence-arrow">arrow_forward</span>
        </button>

        {/* ════ SIGNALER RAPIDEMENT ════ */}
        <section className="acc-section">
          <div className="acc-section-hdr">
            <h2 className="acc-section-title">Signaler rapidement</h2>
            <span className="acc-section-sub">Sélectionnez le type d'incident</span>
          </div>
          <div className="acc-cats">
            {cats.map((cat) => (
              <button
                key={cat.type}
                className="acc-cat"
                style={{ '--cat-bg': cat.bg, '--cat-border': cat.border, '--cat-color': cat.color }}
                onClick={() => navigate('/soumettre')}
              >
                <div className="acc-cat-icon-wrap">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <span className="acc-cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ════ ALERTES RÉCENTES ════ */}
        <section className="acc-section">
          <div className="acc-section-hdr">
            <h2 className="acc-section-title">Alertes récentes</h2>
            <button className="acc-voir-tout" onClick={() => navigate('/alertes')}>
              Voir tout
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          {alertes.length === 0 ? (
            <div className="acc-vide">
              <div className="acc-vide-icon">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <p className="acc-vide-titre">Aucune alerte pour le moment</p>
              <p className="acc-vide-sub">Soyez le premier à signaler un incident dans votre zone.</p>
              <button className="acc-vide-btn" onClick={() => navigate('/soumettre')}>
                Soumettre une alerte
              </button>
            </div>
          ) : (
            <div className="acc-alrt-list">
              {alertes.map((alerte) => {
                const sc   = statutCfg[alerte.statut] || { label: alerte.statut, cls: '' };
                const cfg  = typeConfig[alerte.type_alerte] || { label: alerte.type_alerte, icon: 'notifications', bg: '#F0F0F0', color: '#555' };
                const loc  = afficherLieu(alerte.localisation);
                return (
                  <div
                    key={alerte.id}
                    className="acc-alrt-card"
                    onClick={() => navigate(`/alertes/${alerte.id}`)}
                  >
                    <div className="acc-alrt-info">
                      <div className="acc-alrt-top">
                        <span className={`acc-badge ${sc.cls}`}>{sc.label}</span>
                        <span className="acc-alrt-lieu">
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                          {loc}
                        </span>
                      </div>
                      <span className="acc-alrt-type-label" style={{ color: cfg.color }}>
                        {cfg.label.toUpperCase()}
                      </span>
                      <p className="acc-alrt-titre">{cfg.label}</p>
                      <p className="acc-alrt-desc">{alerte.description}</p>
                      <p className="acc-alrt-date">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>calendar_today</span>
                        {new Date(alerte.date_soumission).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    {/* ── Icône colorée à droite ── */}
                    <div
                      className="acc-alrt-ico-box"
                      style={{ background: cfg.bg }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: cfg.color, fontSize: '22px' }}
                      >
                        {cfg.icon}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ════ ACCÈS RAPIDES ════ */}
        <section className="acc-section">
          <h2 className="acc-section-title">Accès rapides</h2>
          <div className="acc-rapides">
            <button className="acc-rapide-card" onClick={() => navigate('/dashboard')}>
              <div className="acc-rapide-icon" style={{ background: '#EFF6FF' }}>
                <span className="material-symbols-outlined" style={{ color: '#1565C0' }}>bar_chart</span>
              </div>
              <span>Mon espace</span>
            </button>
            <button className="acc-rapide-card" onClick={() => navigate('/messagerie')}>
              <div className="acc-rapide-icon" style={{ background: '#F0FFF4' }}>
                <span className="material-symbols-outlined" style={{ color: '#2E7D32' }}>chat</span>
              </div>
              <span>Messages</span>
            </button>
            <button className="acc-rapide-card" onClick={() => navigate('/alertes')}>
              <div className="acc-rapide-icon" style={{ background: '#FFF0F0' }}>
                <span className="material-symbols-outlined" style={{ color: '#C62828' }}>notifications_active</span>
              </div>
              <span>Toutes les alertes</span>
            </button>
            <button className="acc-rapide-card" onClick={() => navigate('/don')}>
              <div className="acc-rapide-icon" style={{ background: '#FFFBF0' }}>
                <span className="material-symbols-outlined" style={{ color: '#E65100' }}>favorite</span>
              </div>
              <span>Faire un don</span>
            </button>
          </div>
        </section>

      </div>

      <BottomNav />
    </div>
  );
}

export default Accueil;