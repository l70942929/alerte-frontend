import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getNotifications, markAsRead } from '../services/notificationService';
import './Dashboard.css';

function Dashboard() {
  const [alertes, setAlertes]           = useState([]);
  const [stats, setStats]               = useState({ total: 0, enAttente: 0, publiees: 0, resolues: 0 });
  const [notifications, setNotifications] = useState([]);
  const navigate  = useNavigate();
  const username  = localStorage.getItem('username');

  const loadNotifications = () => setNotifications(getNotifications());

  useEffect(() => {
    const token = localStorage.getItem('token');
   api.get('signalements/');
   then((res) => {
      const all = Array.isArray(res.data) ? res.data : [];
      const mes = all.filter((a) => a.utilisateur_nom === username);
      setAlertes(mes);
      setStats({
        total:     mes.length,
        enAttente: mes.filter((a) => a.statut === 'recu').length,
        publiees:  mes.filter((a) => a.statut === 'en_cours').length,
        resolues:  mes.filter((a) => a.statut === 'resolu').length,
      });
    }).catch(() => {});

    loadNotifications();
    window.addEventListener('notificationsUpdated', loadNotifications);
    window.addEventListener('newNotification', loadNotifications);
    return () => {
      window.removeEventListener('notificationsUpdated', loadNotifications);
      window.removeEventListener('newNotification', loadNotifications);
    };
  }, [username]);

  const statutLabel = { recu: 'En attente', en_cours: 'Publiée', resolu: 'Résolue', cloture: 'Clôturée' };
  const statutClass = { recu: 'stat-attente', en_cours: 'stat-publiee', resolu: 'stat-resolue', cloture: 'stat-cloture' };
  const notifIcon   = { success: 'check_circle', warning: 'warning', error: 'error' };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR');
  const formatNotifDate = (d) => {
    const diff = Date.now() - new Date(d);
    const m = Math.floor(diff / 60000);
    if (m < 1)    return "à l'instant";
    if (m < 60)   return `il y a ${m} min`;
    if (m < 1440) return `il y a ${Math.floor(m / 60)} h`;
    return `il y a ${Math.floor(m / 1440)} j`;
  };

  const handleNotifClick = (notif) => {
    markAsRead(notif.id);
    if (notif.alerteId) navigate(`/alertes/${notif.alerteId}`);
    loadNotifications();
  };

  return (
    <div className="dash-page">
      <Header />
      <div className="dash-body">

        {/* En-tête */}
        <div className="dash-welcome">
          <div>
            <p className="dash-hello">Bonjour, {username}</p>
            <h1 className="dash-title">Mon tableau de bord</h1>
            <p className="dash-sub">Gérez vos signalements et suivez leur évolution.</p>
          </div>
          <button className="dash-new-btn" onClick={() => navigate('/soumettre')}>
            <span className="material-symbols-outlined">add_alert</span>
            Nouvelle alerte
          </button>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {[
            { val: stats.total,     lbl: 'Total alertes', cls: '' },
            { val: stats.enAttente, lbl: 'En attente',    cls: 'orange' },
            { val: stats.publiees,  lbl: 'Publiées',      cls: 'blue' },
            { val: stats.resolues,  lbl: 'Résolues',      cls: 'green' },
          ].map((s) => (
            <div key={s.lbl} className="dash-stat">
              <span className={`dash-stat-val ${s.cls}`}>{s.val}</span>
              <span className="dash-stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>

        <div className="dash-divider" />

        {/* Mes alertes */}
        <div className="dash-section">
          <h2 className="dash-sec-title">Mes alertes</h2>
          {alertes.length === 0 ? (
            <div className="dash-empty">
              <span className="material-symbols-outlined">campaign</span>
              <p>Vous n'avez pas encore soumis d'alerte.</p>
              <button className="dash-new-btn" onClick={() => navigate('/soumettre')}>
                Soumettre une alerte
              </button>
            </div>
          ) : (
            <div className="dash-cards">
              {alertes.map((alerte) => (
                <div key={alerte.id} className="dash-card">
                  <div className="dash-card-header">
                    <span className="dash-card-type">{alerte.type_alerte?.replace(/_/g, ' ') || 'Alerte'}</span>
                    <span className={`dash-statut ${statutClass[alerte.statut]}`}>{statutLabel[alerte.statut]}</span>
                  </div>
                  <p className="dash-card-lieu">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle' }}>location_on</span>
                    {' '}{alerte.localisation}
                  </p>
                  <p className="dash-card-desc">{alerte.description}</p>
                  <p className="dash-card-date">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle' }}>calendar_today</span>
                    {' '}{formatDate(alerte.date_soumission)}
                  </p>
                  <button className="dash-detail-btn" onClick={() => navigate(`/alertes/${alerte.id}`)}>
                    Voir les détails <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-divider" />

        {/* Notifications */}
        <div className="dash-section">
          <h2 className="dash-sec-title">Notifications</h2>
          {notifications.length === 0 ? (
            <div className="dash-notif-empty">Aucune notification pour le moment.</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`dash-notif ${!notif.lu ? 'unread' : ''}`}
                onClick={() => handleNotifClick(notif)}
              >
                <div className="notif-icon-wrap">
                  <span className="material-symbols-outlined">{notifIcon[notif.type] || 'notifications'}</span>
                </div>
                <div className="notif-content">
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-message">{notif.message}</div>
                  <div className="notif-date">{formatNotifDate(notif.date)}</div>
                </div>
                {!notif.lu && <div className="notif-dot" />}
              </div>
            ))
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

export default Dashboard;