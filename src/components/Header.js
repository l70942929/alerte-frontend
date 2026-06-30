import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';
import Logo from './Logo';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const isActive = (path) => location.pathname === path;
  const homePath = '/';

  const roleLabel = role === 'moderateur' ? 'Modérateur' : role === 'admin' ? 'Admin' : 'Citoyen';

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

  const navLinks = [
    { path: '/accueil', label: 'Accueil' },
    { path: '/alertes', label: 'Alertes' },
    { path: '/soumettre', label: 'Signaler' },
    { path: '/dashboard', label: 'Mon espace' },
    { path: '/messagerie', label: 'Messages' },
    { path: '/don', label: 'Faire un don' },
    { path: '/points', label: 'Points' },
    { path: '/mes-recompenses', label: 'Récompenses' },
  ];

  let filteredNavLinks = [...navLinks];

  if (role === 'moderateur' || role === 'admin') {
    filteredNavLinks.push({ path: '/moderateur', label: 'Modération' });
  }

  if (role === 'admin') {
    filteredNavLinks.push({ path: '/admin', label: 'Admin' });
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <header className="hdr">
        <div className="hdr-inner">
          <div className="hdr-left">
            <Link to={homePath} className="hdr-logo">
              <Logo size={34} variant="full" />
            </Link>

            <nav className="hdr-nav">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.path}
                  className={isActive(link.path) ? 'active' : ''}
                  to={link.path}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hdr-right">
            <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              className="hdr-icon-btn"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}

            <div className="hdr-user" onClick={() => setOpen(!open)}>
              <div className="hdr-avatar">
                {username ? username[0].toUpperCase() : '?'}
              </div>
              {open && (
                <div className="hdr-dropdown">
                  <div className="hdr-dropdown-name">
                    <User size={14} />
                    {username}
                  </div>
                  <div className="hdr-dropdown-role">{roleLabel}</div>
                  <button onClick={handleLogout} className="hdr-logout">
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            <button
              className="hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {filteredNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={isActive(link.path) ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="mobile-logout">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      )}
    </>
  );
}

export default Header;