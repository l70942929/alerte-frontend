import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './ListeAlertes.css';

function ListeAlertes() {
  const [alertes, setAlertes] = useState([]);
  const [filtre, setFiltre] = useState('tous');
  const [region, setRegion] = useState('toutes');
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    chargerAlertes();
  }, []);

  const chargerAlertes = async () => {
    setLoading(true);
    setErreur('');

    try {
      const token = localStorage.getItem('token');
      const res = await api.get('signalements/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Alertes chargées:', res.data);
      setAlertes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
      setErreur('Impossible de charger les alertes');
      setAlertes([]);
    } finally {
      setLoading(false);
    }
  };

  const filtres = [
    { key: 'tous', label: 'Toutes les alertes', icon: 'dashboard' },
    { key: 'kidnapping', label: 'Kidnapping', icon: 'warning' },
    { key: 'disparition', label: 'Disparition', icon: 'search' },
    { key: 'perte_objet', label: "Perte d'objet", icon: 'inventory_2' },
    { key: 'decouverte', label: 'Découverte', icon: 'person_search' },
    { key: 'accident', label: 'Accident', icon: 'local_hospital' },
  ];

  const regions = ['toutes', 'Littoral (Douala)', 'Centre (Yaoundé)', 'Ouest (Bafoussam)', 'Sud-Ouest (Buea)'];
  const icons = { kidnapping: 'emergency', disparition: 'search', perte_objet: 'inventory_2', decouverte: 'person_search', accident: 'local_hospital' };

  const alertesFiltrees = alertes.filter((alerte) => {
    const okType = filtre === 'tous' || alerte.type_alerte === filtre;
    const okRegion = region === 'toutes' || (alerte.localisation || '').toLowerCase().includes(region.split('(')[0].trim().toLowerCase());
    return okType && okRegion;
  });

  return (
    <div className="la-page">
      <Header />
      <div className="la-layout">
        <aside className="la-sidebar">
          <div className="la-sidebar-logo">Alerte Citoyenne</div>
          <div className="la-sidebar-section">
            <h3>Catégories</h3>
            {filtres.map((filtreItem) => (
              <button
                key={filtreItem.key}
                className={`la-filter-btn ${filtre === filtreItem.key ? 'active' : ''}`}
                onClick={() => setFiltre(filtreItem.key)}
              >
                <span className="material-symbols-outlined">{filtreItem.icon}</span>
                {filtreItem.label}
              </button>
            ))}
          </div>
          <div className="la-sidebar-section">
            <h3>Région</h3>
            {regions.map((item) => (
              <button
                key={item}
                className={`la-filter-btn ${region === item ? 'active' : ''}`}
                onClick={() => setRegion(item)}
              >
                {item === 'toutes' ? 'Tout le Cameroun' : item}
              </button>
            ))}
          </div>
          <button className="la-new-btn" onClick={() => navigate('/soumettre')}>
            <span className="material-symbols-outlined">add_alert</span>
            Nouveau signalement
          </button>
        </aside>

        <main className="la-main">
          <div className="la-main-hdr">
            <div>
              <h1>Fil d'actualité des alertes</h1>
              <p>Surveillance en temps réel des signalements citoyens au Cameroun.</p>
            </div>
          </div>

          {erreur && (
            <div className="la-error">
              <span className="material-symbols-outlined">error</span>
              {erreur}
            </div>
          )}

          <div className="la-filtres-mob">
            {filtres.map((filtreItem) => (
              <button
                key={filtreItem.key}
                className={`la-filt-mob ${filtre === filtreItem.key ? 'active' : ''}`}
                onClick={() => setFiltre(filtreItem.key)}
              >
                {filtreItem.label === 'Toutes les alertes' ? 'Toutes' : filtreItem.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="la-loading">Chargement des alertes...</div>
          ) : alertesFiltrees.length === 0 ? (
            <div className="la-empty">
              <span className="material-symbols-outlined">notifications_off</span>
              <p>Aucune alerte dans cette catégorie</p>
            </div>
          ) : (
            <div className="la-grid">
              {alertesFiltrees.map((alerte, index) => (
                <article key={alerte.id} className={`la-card ${index === 0 ? 'featured' : ''}`}>
                  <div className="la-card-hdr">
                    <div className="la-card-meta">
                      <span className={`la-tag ${alerte.statut === 'recu' ? 'urgent' : alerte.statut === 'en_cours' ? 'en-cours' : 'resolu'}`}>
                        {alerte.statut === 'recu' ? 'Urgent' : alerte.statut === 'en_cours' ? 'En cours' : 'Résolu'}
                      </span>
                      <span className="la-lieu">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                        {alerte.localisation}
                      </span>
                    </div>
                    <span className="material-symbols-outlined la-emoji">{icons[alerte.type_alerte] || 'notifications'}</span>
                  </div>
                  <h3 className="la-card-title">{alerte.type_alerte.replace('_', ' ')} - {alerte.localisation}</h3>
                  <p className="la-card-desc">{alerte.description}</p>
                  <div className="la-card-foot">
                    <span className="la-date">{new Date(alerte.date_soumission).toLocaleDateString('fr-FR')}</span>
                    <button className="la-detail-btn" onClick={() => navigate(`/alertes/${alerte.id}`)}>
                      Voir les détails <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

export default ListeAlertes;