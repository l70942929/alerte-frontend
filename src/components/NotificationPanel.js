import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  clearAllNotifications,
  fetchMessageNotifications,
  markMessageNotificationAsRead,
  fetchBackendNotifications,
  markBackendNotificationAsRead,
} from '../services/notificationService';
import './NotificationPanel.css';

function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [messageNotifs, setMessageNotifs] = useState([]);
  const [backendNotifs, setBackendNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const panelRef = useRef(null);

  // Charger toutes les notifications
  const loadNotifications = async () => {
    setLoading(true);
    try {
      // 1. Notifications locales (localStorage)
      const existingNotifs = getNotifications();
      setNotifications(existingNotifs);
      
      // 2. Notifications de messages (backend)
      const messages = await fetchMessageNotifications();
      setMessageNotifs(messages || []);
      
      // 3. Notifications backend (BDD)
      const backend = await fetchBackendNotifications();
      setBackendNotifs(backend || []);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    const handleUpdate = () => {
      setNotifications(getNotifications());
    };
    
    window.addEventListener('notificationsUpdated', handleUpdate);
    window.addEventListener('newNotification', handleUpdate);
    
    return () => {
      window.removeEventListener('notificationsUpdated', handleUpdate);
      window.removeEventListener('newNotification', handleUpdate);
    };
  }, []);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Gérer le clic sur une notification
  const handleNotificationClick = async (notif) => {
    // Si c'est un message
    if (notif.id && typeof notif.id === 'string' && notif.id.startsWith('msg_')) {
      await markMessageNotificationAsRead(notif.messageId);
      setMessageNotifs(prev => 
        prev.map(n => n.id === notif.id ? { ...n, lu: true } : n)
      );
      navigate('/messagerie');
      if (onClose) onClose();
      return;
    }
    
    // Si c'est une notification backend (BDD)
    if (notif.id && typeof notif.id === 'number') {
      await markBackendNotificationAsRead(notif.id);
      setBackendNotifs(prev => 
        prev.map(n => n.id === notif.id ? { ...n, lu: true } : n)
      );
      if (notif.alerte_id) {
        navigate(`/alertes/${notif.alerte_id}`);
        if (onClose) onClose();
      }
      return;
    }
    
    // Sinon, notification locale
    markAsRead(notif.id);
    if (notif.alerteId) {
      navigate(`/alertes/${notif.alerteId}`);
      if (onClose) onClose();
    }
  };

  // Supprimer une notification
  const handleDelete = (e, notifId) => {
    e.stopPropagation();
    if (typeof notifId === 'string' && notifId.startsWith('msg_')) {
      setMessageNotifs(prev => prev.filter(n => n.id !== notifId));
      return;
    }
    deleteNotification(notifId);
  };

  // Tout marquer comme lu
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setMessageNotifs(prev => prev.map(n => ({ ...n, lu: true })));
    setBackendNotifs(prev => prev.map(n => ({ ...n, lu: true })));
  };

  // Tout supprimer
  const handleClearAll = () => {
    if (window.confirm('Supprimer toutes les notifications ?')) {
      clearAllNotifications();
      setMessageNotifs([]);
      setBackendNotifs([]);
    }
  };

  // Combiner tous les types de notifications
  const allNotifications = [
    ...backendNotifs.map(n => ({ ...n, id: `backend_${n.id}` })),
    ...messageNotifs,
    ...notifications
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const unreadCount = allNotifications.filter(n => !n.lu).length;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'à l\'instant';
    if (minutes < 60) return `il y a ${minutes} min`;
    if (hours < 24) return `il y a ${hours} h`;
    if (days < 7) return `il y a ${days} j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getTypeIcon = (type) => {
    if (type === 'success') return '✅';
    if (type === 'warning') return '⚠️';
    if (type === 'error') return '❌';
    return '🔔';
  };

  const getTypeClass = (type) => {
    if (type === 'success') return 'notif-success';
    if (type === 'warning') return 'notif-warning';
    if (type === 'error') return 'notif-error';
    return 'notif-info';
  };

  return (
    <div className="notification-panel" ref={panelRef}>
      <div className="notification-header">
        <h3>
          <span className="material-symbols-outlined">notifications</span>
          Notifications
          {unreadCount > 0 && <span className="notif-badge-count">{unreadCount}</span>}
        </h3>
        <div className="notification-actions">
          {allNotifications.length > 0 && (
            <>
              <button onClick={handleMarkAllAsRead} className="notif-action-btn" title="Tout marquer comme lu">
                <span className="material-symbols-outlined">done_all</span>
              </button>
              <button onClick={handleClearAll} className="notif-action-btn" title="Tout supprimer">
                <span className="material-symbols-outlined">delete_sweep</span>
              </button>
            </>
          )}
          <button onClick={onClose} className="notif-close-btn">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      
      <div className="notification-list">
        {loading ? (
          <div className="notification-empty">
            <span className="material-symbols-outlined">hourglass_empty</span>
            <p>Chargement...</p>
          </div>
        ) : allNotifications.length === 0 ? (
          <div className="notification-empty">
            <span className="material-symbols-outlined">notifications_off</span>
            <p>Aucune notification</p>
          </div>
        ) : (
          allNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`notification-item ${!notif.lu ? 'unread' : ''} ${getTypeClass(notif.type)}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="notif-icon">{getTypeIcon(notif.type)}</div>
              <div className="notif-content">
                <div className="notif-title">{notif.title}</div>
                <div className="notif-message">{notif.message}</div>
                <div className="notif-date">{formatDate(notif.date)}</div>
              </div>
              <button 
                className="notif-delete" 
                onClick={(e) => handleDelete(e, notif.id)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;