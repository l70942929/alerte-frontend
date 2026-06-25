import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './ListeAlertes.css';

function ListeAlertes() {
  const [alertes, setAlertes] = useState([]);
  const [filtre,  setFiltre]  = useState('tous');
  const [region,  setRegion]  = useState('toutes');
  const [loading, setLoading] = useState(true);
  const [erreur,  setErreur]  = useState('');
  const navigate = useNavigate();

  useEffect(() => { chargerAlertes(); }, []);

  const chargerAlertes = async () => {
    setLoading(true); setErreur('');
    try {
      const token = localStorage.getItem('token');
      const res   = await api.get('signalements/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertes(Array.isArray(res.data) ? res.data : []);
    } catch {
      setErreur('Impossible de charger les alertes. Vérifiez votre connexion.');
      setAlertes([]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Config types ── */
  const typesCfg = {
    tous:        { label: 'Toutes les alertes', icon: 'dashboard',     couleur: '#12406f' },
    kidnapping:  { label: 'Kidnapping',          icon: 'emergency',     couleur: '#C62828' },
    disparition: { label: 'Disparition',         icon: 'search',        couleur: '#1565C0' },
    perte_objet: { label: "Perte d'objet",       icon: 'inventory_2',   couleur: '#E65100' },
    decouverte:  { label: 'Découverte',          icon: 'person_search', couleur: '#2E7D32' },
    accident:    { label: 'Accident',            icon: 'local_hospital',couleur: '#6A1B9A' },
  };

  /* Config couleurs par type pour les cartes */
  const typeBg = {
    kidnapping:  { bg: '#FFF0F0', border: '#FFCDD2', color: '#C62828', lightBg: '#FFEBEE' },
    disparition: { bg: '#EFF6FF', border: '#BBDEFB', color: '#1565C0', lightBg: '#E3F2FD' },
    perte_objet: { bg: '#FFFBF0', border: '#FFE082', color: '#E65100', lightBg: '#FFF8E1' },
    decouverte:  { bg: '#F0FFF4', border: '#C8E6C9', color: '#2E7D32', lightBg: '#E8F5E9' },
    accident:    { bg: '#F5F0FF', border: '#D1C4E9', color: '#6A1B9A', lightBg: '#EDE7F6' },
  };

  const regions = [
    'toutes',
    'Littoral (Douala)',
    'Centre (Yaoundé)',
    'Ouest (Bafoussam)',
    'Sud-Ouest (Buea)',
  ];

  /* Lieu lisible : masque les coords GPS brutes */
  const afficherLieu = (loc = '') => {
    if (!loc) return 'Lieu non précisé';
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(loc.trim())) return 'Localisation GPS';
    return loc;
  };

  /* Titre lisible de la carte */
  const afficherTitre = (alerte) => {
    const type = typesCfg[alerte.type_alerte]?.label
      || alerte.type_alerte?.replace(/_/g, ' ')
      || 'Alerte';
    const lieu = afficherLieu(alerte.localisation);
    return lieu === 'Localisation GPS' ? type : `${type} — ${lieu}`;
  };

  /* Config statut */
  const statutCfg = {
    recu:     { label: 'Urgent',   cls: 'tag-urgent'   },
    en_cours: { label: 'En cours', cls: 'tag-encours'  },
    resolu:   { label: 'Résolu',   cls: 'tag-resolu'   },
    cloture:  { label: 'Clôturé',  cls: 'tag-cloture'  },
  };

  /* Filtrage */
  const alertesFiltrees = alertes.filter((a) => {
    const okType   = filtre === 'tous' || a.type_alerte === filtre;
    const okRegion = region === 'toutes' ||
      (a.localisation || '').toLowerCase().includes(
        region.split('(')[0].trim().toLowerCase()
      );
    return okType && okRegion;
  });

  const nbResultats = alertesFiltrees.length;

  return (
    <div className="la-page">
      <Header />
      <div className="la-layout">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="la-sidebar">
          <div className="la-sidebar-brand">
            <span className="material-symbols-outlined la-brand-icon">notifications_active</span>
            Alerte Citoyenne
          </div>

          <div className="la-sidebar-section">
            <p className="la-sidebar-label">Catégories</p>
            {Object.entries(typesCfg).map(([key, cfg]) => (
              <button
                key={key}
                className={`la-filter-btn ${filtre === key ? 'active' : ''}`}
                onClick={() => setFiltre(key)}
                style={filtre === key ? { '--active-color': cfg.couleur } : {}}
              >
                <span className="material-symbols-outlined la-filter-ico">{cfg.icon}</span>
                {cfg.label}
              </button>
            ))}
          </div>

          <div className="la-sidebar-section">
            <p className="la-sidebar-label">Région</p>
            {regions.map((r) => (
              <button
                key={r}
                className={`la-filter-btn ${region === r ? 'active' : ''}`}
                onClick={() => setRegion(r)}
              >
                <span className="material-symbols-outlined la-filter-ico">location_on</span>
                {r === 'toutes' ? 'Tout le Cameroun' : r}
              </button>
            ))}
          </div>

          <button className="la-new-btn" onClick={() => navigate('/soumettre')}>
            <span className="material-symbols-outlined">add_alert</span>
            Nouveau signalement
          </button>
        </aside>

        {/* ══════════ MAIN ══════════ */}
        <main className="la-main">

          {/* En-tête */}
          <div className="la-main-hdr">
            <div>
              <h1 className="la-main-titre">Fil d'actualité</h1>
              <p className="la-main-sub">
                Signalements citoyens en temps réel au Cameroun
              </p>
            </div>
            <button className="la-refresh-btn" onClick={chargerAlertes}>
              <span className="material-symbols-outlined">refresh</span>
              Actualiser
            </button>
          </div>

          {/* Barre de résultats */}
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
                  Réinitialiser les filtres
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          )}

          {/* Filtres mobile */}
          <div className="la-filtres-mob">
            {Object.entries(typesCfg).map(([key, cfg]) => (
              <button
                key={key}
                className={`la-filt-mob ${filtre === key ? 'active' : ''}`}
                onClick={() => setFiltre(key)}
              >
                {key === 'tous' ? 'Toutes' : cfg.label}
              </button>
            ))}
          </div>

          {/* Erreur */}
          {erreur && (
            <div className="la-error">
              <span className="material-symbols-outlined">error_outline</span>
              {erreur}
            </div>
          )}

          {/* Chargement */}
          {loading ? (
            <div className="la-loading">
              <div className="la-spinner" />
              <p>Chargement des alertes...</p>
            </div>

          /* Vide */
          ) : alertesFiltrees.length === 0 ? (
            <div className="la-empty">
              <div className="la-empty-icon">
                <span className="material-symbols-outlined">notifications_off</span>
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

          /* Grille */
          ) : (
            <div className="la-grid">
              {alertesFiltrees.map((alerte, index) => {
                const sc      = statutCfg[alerte.statut] || { label: alerte.statut, cls: '' };
                const tCfg    = typesCfg[alerte.type_alerte] || typesCfg.tous;
                const tColors = typeBg[alerte.type_alerte] || {};
                const lieu    = afficherLieu(alerte.localisation);
                const titre   = afficherTitre(alerte);
                const date    = new Date(alerte.date_soumission).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                });

                return (
                  <article
                    key={alerte.id}
                    className={`la-card ${index === 0 ? 'la-card-featured' : ''}`}
                    onClick={() => navigate(`/alertes/${alerte.id}`)}
                    style={index === 0 ? {} : {}}
                  >
                    {/* Bande colorée en haut */}
                    <div
                      className="la-card-strip"
                      style={{ background: tColors.color || '#12406f' }}
                    />

                    <div className="la-card-inner">
                      {/* En-tête */}
                      <div className="la-card-top">
                        <div className="la-card-top-left">
                          <span className={`la-tag ${sc.cls}`}>{sc.label}</span>
                          <span className="la-card-lieu">
                            <span className="material-symbols-outlined">location_on</span>
                            {lieu}
                          </span>
                        </div>
                        {/* Icône type dans un carré coloré */}
                        <div
                          className="la-card-type-ico"
                          style={{
                            background: tColors.bg || '#EFF6FF',
                            border: `1px solid ${tColors.border || '#BBDEFB'}`,
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ color: tColors.color || '#1565C0' }}
                          >
                            {tCfg.icon}
                          </span>
                        </div>
                      </div>

                      {/* Type badge */}
                      <div
                        className="la-card-type-label"
                        style={{ color: tColors.color || '#12406f' }}
                      >
                        {tCfg.label}
                      </div>

                      {/* Titre */}
                      <h3 className="la-card-titre">{titre}</h3>

                      {/* Description */}
                      <p className="la-card-desc">{alerte.description}</p>

                      {/* Pied */}
                      <div className="la-card-foot">
                        <span className="la-card-date">
                          <span className="material-symbols-outlined">calendar_today</span>
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
                          <span className="material-symbols-outlined">arrow_forward</span>
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