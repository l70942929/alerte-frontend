import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } from '../services/notificationService';
import './NotificationPanel.css';

function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const panelRef = useRef(null);

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();
    
    const handleUpdate = () => loadNotifications();
    window.addEventListener('notificationsUpdated', handleUpdate);
    window.addEventListener('newNotification', handleUpdate);
    
    return () => {
      window.removeEventListener('notificationsUpdated', handleUpdate);
      window.removeEventListener('newNotification', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.alerteId) {
      navigate(`/alertes/${notif.alerteId}`);
      if (onClose) onClose();
    }
  };

  const handleDelete = (e, notifId) => {
    e.stopPropagation();
    deleteNotification(notifId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    if (window.confirm('Supprimer toutes les notifications ?')) {
      clearAllNotifications();
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '🔔';
    }
  };

  const getTypeClass = (type) => {
    switch(type) {
      case 'success': return 'notif-success';
      case 'warning': return 'notif-warning';
      case 'error': return 'notif-error';
      default: return 'notif-info';
    }
  };

  const formatDate = (dateString) => {
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

  const unreadCount = notifications.filter(n => !n.lu).length;

  return (
    <div className="notification-panel" ref={panelRef}>
      <div className="notification-header">
        <h3>
          <span className="material-symbols-outlined">notifications</span>
          Notifications
          {unreadCount > 0 && <span className="notif-badge-count">{unreadCount}</span>}
        </h3>
        <div className="notification-actions">
          {notifications.length > 0 && (
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
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <span className="material-symbols-outlined">notifications_off</span>
            <p>Aucune notification</p>
          </div>
        ) : (
          notifications.map(notif => (
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