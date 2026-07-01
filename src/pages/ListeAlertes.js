import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  AlertTriangle,
  MapPin,
  Calendar,
  RefreshCw,
  Filter,
  X,
  User,
  Package,
  Eye,
  Heart,
  Bell,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './ListeAlertes.css';

function ListeAlertes() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [alertes, setAlertes] = useState([]);
  const [filtre, setFiltre] = useState('tous');
  const [region, setRegion] = useState('toutes');
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => { chargerAlertes(); }, []);

  const chargerAlertes = async () => {
    setLoading(true);
    setErreur('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('signalements/', {
        headers: { Authorization: `Token ${token}` },
      });
      
      const data = Array.isArray(res.data) ? res.data : [];
      
      // ✅ Filtrer selon le rôle
      const role = localStorage.getItem('role');
      let alertesFiltrees;
      
      if (role === 'admin' || role === 'moderateur') {
        // Admin et modérateur voient toutes les alertes
        alertesFiltrees = data;
      } else {
        // Citoyen voit seulement les alertes publiées
        alertesFiltrees = data.filter(a => 
          a.statut === 'en_cours' || 
          a.statut === 'resolu' || 
          a.statut === 'retrouve' || 
          a.statut === 'cloture'
        );
      }
      
      setAlertes(alertesFiltrees);
    } catch {
      setErreur('Impossible de charger les alertes. Vérifiez votre connexion.');
      setAlertes([]);
    } finally {
      setLoading(false);
    }
  };

  const typesCfg = {
    tous: { label: 'Toutes les alertes', icon: Shield, couleur: '#12406f' },
    kidnapping: { label: 'Kidnapping', icon: AlertTriangle, couleur: '#C62828' },
    disparition: { label: 'Disparition', icon: User, couleur: '#1565C0' },
    perte_objet: { label: "Perte d'objet", icon: Package, couleur: '#E65100' },
    decouverte: { label: 'Découverte', icon: Eye, couleur: '#2E7D32' },
    accident: { label: 'Accident', icon: Heart, couleur: '#6A1B9A' },
  };

  const typeBg = {
    kidnapping: { bg: '#FFF0F0', border: '#FFCDD2', color: '#C62828' },
    disparition: { bg: '#EFF6FF', border: '#BBDEFB', color: '#1565C0' },
    perte_objet: { bg: '#FFFBF0', border: '#FFE082', color: '#E65100' },
    decouverte: { bg: '#F0FFF4', border: '#C8E6C9', color: '#2E7D32' },
    accident: { bg: '#F5F0FF', border: '#D1C4E9', color: '#6A1B9A' },
  };

  const regions = [
    'toutes',
    'Littoral (Douala)',
    'Centre (Yaoundé)',
    'Ouest (Bafoussam)',
    'Sud-Ouest (Buea)',
  ];

  const afficherLieu = (loc = '') => {
    if (!loc) return 'Lieu non précisé';
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(loc.trim())) return 'Localisation GPS';
    return loc;
  };

  const afficherTitre = (alerte) => {
    const type = typesCfg[alerte.type_alerte]?.label
      || alerte.type_alerte?.replace(/_/g, ' ')
      || 'Alerte';
    const lieu = afficherLieu(alerte.localisation);
    return lieu === 'Localisation GPS' ? type : `${type} — ${lieu}`;
  };

  const statutCfg = {
    recu: { label: 'Urgent', cls: 'tag-urgent' },
    en_cours: { label: 'En cours', cls: 'tag-encours' },
    resolu: { label: 'Résolu', cls: 'tag-resolu' },
    cloture: { label: 'Clôturé', cls: 'tag-cloture' },
  };

  const alertesFiltrees = alertes.filter((a) => {
    const okType = filtre === 'tous' || a.type_alerte === filtre;
    const okRegion = region === 'toutes' ||
      (a.localisation || '').toLowerCase().includes(
        region.split('(')[0].trim().toLowerCase()
      );
    return okType && okRegion;
  });

  const nbResultats = alertesFiltrees.length;

  return (
    <div className={`la-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className="la-layout">

        <aside className={`la-sidebar ${mobileFiltersOpen ? 'open' : ''}`}>
          <div className="la-sidebar-brand">
            <Bell size={24} className="la-brand-icon" />
            <span>CIVIALERT</span>
          </div>

          <div className="la-sidebar-section">
            <p className="la-sidebar-label">Catégories</p>
            {Object.entries(typesCfg).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={key}
                  className={`la-filter-btn ${filtre === key ? 'active' : ''}`}
                  onClick={() => setFiltre(key)}
                >
                  <Icon size={18} className="la-filter-ico" />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          <div className="la-sidebar-section">
            <p className="la-sidebar-label">Région</p>
            {regions.map((r) => (
              <button
                key={r}
                className={`la-filter-btn ${region === r ? 'active' : ''}`}
                onClick={() => setRegion(r)}
              >
                <MapPin size={18} className="la-filter-ico" />
                {r === 'toutes' ? 'Tout le Cameroun' : r}
              </button>
            ))}
          </div>

          <button className="la-new-btn" onClick={() => navigate('/soumettre')}>
            <Plus size={20} />
            Nouveau signalement
          </button>
        </aside>

        {mobileFiltersOpen && (
          <div className="la-overlay" onClick={() => setMobileFiltersOpen(false)} />
        )}

        <main className="la-main">

          <div className="la-main-hdr">
            <div>
              <h1 className="la-main-titre">Fil d'actualité</h1>
              <p className="la-main-sub">
                Signalements citoyens en temps réel
              </p>
            </div>
            <div className="la-hdr-actions">
              <button
                className="la-mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <Filter size={20} />
              </button>
              <button className="la-refresh-btn" onClick={chargerAlertes}>
                <RefreshCw size={18} />
                Actualiser
              </button>
            </div>
          </div>

          {!loading && (
            <div className="la-results-bar">
              <span className="la-results-count">
                <strong>{nbResultats}</strong>
                {nbResultats > 1 ? ' alertes trouvées' : ' alerte trouvée'}
              </span>
              {(filtre !== 'tous' || region !== 'toutes') && (
                <button
                  className="la-reset-btn"
                  onClick={() => { setFiltre('tous'); setRegion('toutes'); }}
                >
                  Réinitialiser
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {erreur && (
            <div className="la-error">
              <AlertCircle size={20} />
              {erreur}
            </div>
          )}

          {loading ? (
            <div className="la-loading">
              <Loader2 size={40} className="la-spinner" />
              <p>Chargement des alertes...</p>
            </div>

          ) : alertesFiltrees.length === 0 ? (
            <div className="la-empty">
              <div className="la-empty-icon">
                <Bell size={48} />
              </div>
              <p className="la-empty-titre">Aucune alerte trouvée</p>
              <p className="la-empty-sub">
                Aucun résultat pour cette catégorie ou cette région.
              </p>
              <button
                className="la-empty-btn"
                onClick={() => { setFiltre('tous'); setRegion('toutes'); }}
              >
                Voir toutes les alertes
              </button>
            </div>

          ) : (
            <div className="la-grid">
              {alertesFiltrees.map((alerte, index) => {
                const sc = statutCfg[alerte.statut] || { label: alerte.statut, cls: '' };
                const tCfg = typesCfg[alerte.type_alerte] || typesCfg.tous;
                const tColors = typeBg[alerte.type_alerte] || {};
                const lieu = afficherLieu(alerte.localisation);
                const titre = afficherTitre(alerte);
                const date = new Date(alerte.date_soumission).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                });
                const Icon = tCfg.icon;

                return (
                  <article
                    key={alerte.id}
                    className={`la-card ${index === 0 ? 'la-card-featured' : ''}`}
                    onClick={() => navigate(`/alertes/${alerte.id}`)}
                  >
                    <div
                      className="la-card-strip"
                      style={{ background: tColors.color || '#12406f' }}
                    />

                    <div className="la-card-inner">
                      <div className="la-card-top">
                        <div className="la-card-top-left">
                          <span className={`la-tag ${sc.cls}`}>{sc.label}</span>
                          <span className="la-card-lieu">
                            <MapPin size={14} />
                            {lieu}
                          </span>
                        </div>
                        <div
                          className="la-card-type-ico"
                          style={{
                            background: tColors.bg || '#EFF6FF',
                            border: `1px solid ${tColors.border || '#BBDEFB'}`,
                          }}
                        >
                          <Icon size={20} style={{ color: tColors.color || '#1565C0' }} />
                        </div>
                      </div>

                      <div
                        className="la-card-type-label"
                        style={{ color: tColors.color || '#12406f' }}
                      >
                        {tCfg.label}
                      </div>

                      <h3 className="la-card-titre">{titre}</h3>
                      <p className="la-card-desc">{alerte.description}</p>

                      <div className="la-card-foot">
                        <span className="la-card-date">
                          <Calendar size={14} />
                          {date}
                        </span>
                        <button
                          className="la-card-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/alertes/${alerte.id}`);
                          }}
                        >
                          Voir les détails
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

export default ListeAlertes;