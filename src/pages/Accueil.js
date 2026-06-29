import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  AlertTriangle,
  MapPin,
  Calendar,
  Plus,
  ArrowRight,
  LayoutDashboard,
  MessageSquare,
  Heart,
  Bell,
  Eye,
  Search,
  Package,
} from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Accueil.css';

function Accueil() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const username = localStorage.getItem('username');
  const [alertes, setAlertes] = useState([]);
  const [heure, setHeure] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/connexion'); return; }

    const h = new Date().getHours();
    if (h < 12) setHeure('Bonjour');
    else if (h < 18) setHeure('Bon après-midi');
    else setHeure('Bonsoir');

    api.get('signalements/')
      .then((res) => setAlertes(Array.isArray(res.data) ? res.data.slice(0, 4) : []))
      .catch(() => {});
  }, [navigate]);

  const cats = [
    { icon: AlertTriangle, label: 'Kidnapping', type: 'kidnapping', bg: '#FFF0F0', border: '#FFCDD2', color: '#C62828' },
    { icon: Search, label: 'Disparition', type: 'disparition', bg: '#EFF6FF', border: '#BBDEFB', color: '#1565C0' },
    { icon: Package, label: "Perte d'objet", type: 'perte_objet', bg: '#FFFBF0', border: '#FFE082', color: '#E65100' },
    { icon: Eye, label: 'Découverte', type: 'decouverte', bg: '#F0FFF4', border: '#C8E6C9', color: '#2E7D32' },
    { icon: Heart, label: 'Accident', type: 'accident', bg: '#F5F0FF', border: '#D1C4E9', color: '#6A1B9A' },
  ];

  const typeConfig = {
    kidnapping:  { label: 'Kidnapping', icon: AlertTriangle, bg: '#FFF0F0', color: '#C62828' },
    disparition: { label: 'Disparition', icon: Search, bg: '#EFF6FF', color: '#1565C0' },
    perte_objet: { label: "Perte d'objet", icon: Package, bg: '#FFFBF0', color: '#E65100' },
    decouverte:  { label: 'Découverte', icon: Eye, bg: '#F0FFF4', color: '#2E7D32' },
    accident:    { label: 'Accident', icon: Heart, bg: '#F5F0FF', color: '#6A1B9A' },
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
    <div className={`acc-root ${darkMode ? 'dark-mode' : ''}`}>
      <Header />

      <div className="acc-wrap">

        {/* BANNIÈRE DE BIENVENUE */}
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
            <Plus size={18} />
            Nouvelle alerte
          </button>
        </div>

        {/* BOUTON URGENCE */}
        <button className="acc-urgence" onClick={() => navigate('/soumettre')}>
          <div className="acc-urgence-left">
            <div className="acc-urgence-dot" />
            <div>
              <p className="acc-urgence-titre">Signaler une urgence maintenant</p>
              <p className="acc-urgence-sub">Transmission immédiate à la cellule de crise</p>
            </div>
          </div>
          <ArrowRight size={20} className="acc-urgence-arrow" />
        </button>

        {/* SIGNALER RAPIDEMENT */}
        <section className="acc-section">
          <div className="acc-section-hdr">
            <h2 className="acc-section-title">Signaler rapidement</h2>
            <span className="acc-section-sub">Sélectionnez le type d'incident</span>
          </div>
          <div className="acc-cats">
            {cats.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.type}
                  className="acc-cat"
                  style={{
                    '--cat-bg': cat.bg,
                    '--cat-border': cat.border,
                    '--cat-color': cat.color,
                  }}
                  onClick={() => navigate('/soumettre')}
                >
                  <div className="acc-cat-icon-wrap">
                    <Icon size={20} />
                  </div>
                  <span className="acc-cat-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ALERTES RÉCENTES */}
        <section className="acc-section">
          <div className="acc-section-hdr">
            <h2 className="acc-section-title">Alertes récentes</h2>
            <button className="acc-voir-tout" onClick={() => navigate('/alertes')}>
              Voir tout
              <ArrowRight size={16} />
            </button>
          </div>

          {alertes.length === 0 ? (
            <div className="acc-vide">
              <div className="acc-vide-icon">
                <Bell size={28} />
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
                const sc = statutCfg[alerte.statut] || { label: alerte.statut, cls: '' };
                const cfg = typeConfig[alerte.type_alerte] || { 
                  label: alerte.type_alerte || 'Alerte', 
                  icon: Bell, 
                  bg: '#F0F0F0', 
                  color: '#555' 
                };
                const Icon = cfg.icon;
                const loc = afficherLieu(alerte.localisation);
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
                          <MapPin size={13} />
                          {loc}
                        </span>
                      </div>
                      <span className="acc-alrt-type-label" style={{ color: cfg.color }}>
                        {cfg.label.toUpperCase()}
                      </span>
                      <p className="acc-alrt-titre">{cfg.label}</p>
                      <p className="acc-alrt-desc">{alerte.description}</p>
                      <p className="acc-alrt-date">
                        <Calendar size={13} />
                        {new Date(alerte.date_soumission).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    {/* Icône colorée à droite */}
                    <div
                      className="acc-alrt-ico-box"
                      style={{ background: cfg.bg }}
                    >
                      <Icon size={22} style={{ color: cfg.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ACCÈS RAPIDES */}
        <section className="acc-section">
          <h2 className="acc-section-title">Accès rapides</h2>
          <div className="acc-rapides">
            <button className="acc-rapide-card" onClick={() => navigate('/dashboard')}>
              <div className="acc-rapide-icon" style={{ background: '#EFF6FF' }}>
                <LayoutDashboard size={22} style={{ color: '#1565C0' }} />
              </div>
              <span>Mon espace</span>
            </button>
            <button className="acc-rapide-card" onClick={() => navigate('/messagerie')}>
              <div className="acc-rapide-icon" style={{ background: '#F0FFF4' }}>
                <MessageSquare size={22} style={{ color: '#2E7D32' }} />
              </div>
              <span>Messages</span>
            </button>
            <button className="acc-rapide-card" onClick={() => navigate('/alertes')}>
              <div className="acc-rapide-icon" style={{ background: '#FFF0F0' }}>
                <Bell size={22} style={{ color: '#C62828' }} />
              </div>
              <span>Toutes les alertes</span>
            </button>
            <button className="acc-rapide-card" onClick={() => navigate('/don')}>
              <div className="acc-rapide-icon" style={{ background: '#FFFBF0' }}>
                <Heart size={22} style={{ color: '#E65100' }} />
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