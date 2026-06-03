import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Dashboard.css';

function Dashboard() {
  const [alertes, setAlertes] = useState([]);
  const [stats, setStats] = useState({ total: 0, enAttente: 0, publiees: 0, resolues: 0 });
  const [notifications] = useState([]);
  const [reactions, setReactions] = useState({});
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/api/signalements/', {
      headers: { Authorization: `Token ${token}` },
    }).then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setAlertes(data);
      setStats({
        total: data.length,
        enAttente: data.filter((alerte) => alerte.statut === 'recu').length,
        publiees: data.filter((alerte) => alerte.statut === 'en_cours').length,
        resolues: data.filter((alerte) => alerte.statut === 'resolu').length,
      });
    }).catch(() => {});
  }, []);

  const icons = { kidnapping: 'emergency', disparition: 'search', perte_objet: 'inventory_2', decouverte: 'person_search', accident: 'local_hospital' };
  const statutLabel = { recu: 'En attente', en_cours: 'Publiée', resolu: 'Résolue', cloture: 'Clôturée' };
  const statutClass = { recu: 'stat-attente', en_cours: 'stat-publiee', resolu: 'stat-resolue', cloture: 'stat-cloture' };

  const reagir = (alerteId, reaction) => {
    setReactions((prev) => ({
      ...prev,
      [alerteId]: {
        ...prev[alerteId],
        [reaction]: (prev[alerteId]?.[reaction] || 0) + 1,
      },
    }));
  };

  const partager = (alerte) => {
    const text = `${alerte.type_alerte} - ${alerte.localisation}: ${alerte.description}`;
    const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${window.location.href}`)}`;
    window.open(wa, '_blank');
  };

  return (
    <div className="dash-page">
      <Header />
      <div className="dash-body">
        <div className="dash-welcome">
          <div>
            <p className="dash-hello">Bonjour, {username}</p>
            <h1 className="dash-title">Mon tableau de bord</h1>
            <p className="dash-sub">Bienvenue sur votre espace personnel Alerte Citoyenne.</p>
          </div>
          <button className="dash-new-btn" onClick={() => navigate('/soumettre')}>
            <span className="material-symbols-outlined">add_alert</span>
            Publier une alerte
          </button>
        </div>

        <div className="dash-stats">
          <div className="dash-stat">
            <span className="dash-stat-val">{stats.total}</span>
            <span className="dash-stat-lbl">Total alertes</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-val orange">{stats.enAttente}</span>
            <span className="dash-stat-lbl">En attente</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-val blue">{stats.publiees}</span>
            <span className="dash-stat-lbl">Publiées</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-val green">{stats.resolues}</span>
            <span className="dash-stat-lbl">Résolues</span>
          </div>
        </div>

        <div className="dash-section">
          <h2 className="dash-sec-title">Mes alertes récentes</h2>
          {alertes.length === 0 ? (
            <div className="dash-empty">
              <span className="material-symbols-outlined">notifications_off</span>
              <p>Vous n'avez pas encore publié d'alerte.</p>
              <button onClick={() => navigate('/soumettre')}>Publier ma première alerte</button>
            </div>
          ) : (
            <div className="dash-cards">
              {alertes.map((alerte) => (
                <article key={alerte.id} className="dash-card">
                  <div className="dash-card-top">
                    <span className="material-symbols-outlined dash-card-emoji">{icons[alerte.type_alerte] || 'notifications'}</span>
                    <span className={`dash-card-statut ${statutClass[alerte.statut]}`}>
                      {statutLabel[alerte.statut]}
                    </span>
                  </div>
                  <div className="dash-card-type">{alerte.type_alerte.replace('_', ' ')} - {alerte.localisation}</div>
                  <p className="dash-card-desc">{alerte.description}</p>
                  <div className="dash-card-date">{new Date(alerte.date_soumission).toLocaleDateString('fr-FR')}</div>
                  <div className="dash-card-actions">
                    <button className="dash-act-btn" onClick={() => partager(alerte)}>
                      <span className="material-symbols-outlined">ios_share</span>
                      Partager
                    </button>
                    <div className="dash-reactions">
                      {[
                        { key: 'utile', icon: 'thumb_up' },
                        { key: 'soutien', icon: 'favorite' },
                        { key: 'suivi', icon: 'visibility' },
                      ].map((reaction) => (
                        <button
                          key={reaction.key}
                          onClick={() => reagir(alerte.id, reaction.key)}
                          className={reactions[alerte.id]?.[reaction.key] ? 'reacted' : ''}
                          title={`${reactions[alerte.id]?.[reaction.key] || 0} réactions`}
                        >
                          <span className="material-symbols-outlined">{reaction.icon}</span>
                          {reactions[alerte.id]?.[reaction.key] > 0 && (
                            <span className="reaction-count">{reactions[alerte.id][reaction.key]}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="dash-section">
          <h2 className="dash-sec-title">Notifications</h2>
          {notifications.length === 0 ? (
            <div className="dash-notif-empty">Aucune notification pour le moment.</div>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="dash-notif">{notification}</div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default Dashboard;
