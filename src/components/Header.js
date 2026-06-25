import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import NotificationPanel from './NotificationPanel';
import { getUnreadCount } from '../services/notificationService';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { darkMode, setDarkMode } = useTheme();
  const isActive = (path) => location.pathname === path;
  const homePath = '/';

  const roleLabel = role === 'moderateur' ? 'Modérateur' : role === 'admin' ? 'Admin' : 'Citoyen';

  // Mettre à jour le compteur de notifications non lues
  useEffect(() => {
    const updateCount = () => setUnreadCount(getUnreadCount());
    updateCount();
    window.addEventListener('notificationsUpdated', updateCount);
    window.addEventListener('newNotification', updateCount);
    return () => {
      window.removeEventListener('notificationsUpdated', updateCount);
      window.removeEventListener('newNotification', updateCount);
    };
  }, []);

  return (
    <header className="hdr">
      <div className="hdr-inner">
        <div className="hdr-left">
          <Link
            to={homePath}
            className="hdr-logo"
            onClick={(e) => {
              if (location.pathname === homePath) {
                e.preventDefault();
                navigate(homePath);
              }
            }}
          >
            Alerte Citoyenne
          </Link>
          <nav className="hdr-nav">
            <Link className={isActive('/accueil') ? 'active' : ''} to="/accueil">Accueil</Link>
            <Link className={isActive('/alertes') ? 'active' : ''} to="/alertes">Alertes</Link>
            <Link className={isActive('/soumettre') ? 'active' : ''} to="/soumettre">Signaler</Link>
            <Link className={isActive('/dashboard') ? 'active' : ''} to="/dashboard">Mon espace</Link>
            <Link className={isActive('/messagerie') ? 'active' : ''} to="/messagerie">Messages</Link>
            <Link className={isActive('/don') ? 'active' : ''} to="/don">Faire un don</Link>
            {(role === 'moderateur' || role === 'admin') && (
              <Link className={isActive('/moderateur') ? 'active' : ''} to="/moderateur">
                Modération
              </Link>
            )}
          </nav>
        </div>
        <div className="hdr-right">
          {/* BOUTON MODE NUIT/JOUR */}
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* BOUTON NOTIFICATION (CLOCHE) - CLIQUABLE */}
          <button 
            className="hdr-icon-btn" 
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>
          
          {/* PANEAU DES NOTIFICATIONS */}
          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}

          {/* MENU UTILISATEUR */}
          <div className="hdr-user" onClick={() => setOpen(!open)}>
            <div className="hdr-avatar">{username ? username[0].toUpperCase() : '?'}</div>
            {open && (
              <div className="hdr-dropdown">
                <div className="hdr-dropdown-name">{username}</div>
                <div className="hdr-dropdown-role">{roleLabel}</div>
                <button
                  onClick={() => { localStorage.clear(); navigate('/'); }}
                  className="hdr-logout"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;