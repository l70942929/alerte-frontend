import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  Home,
  AlertTriangle,
  PlusCircle,
  LayoutDashboard,
  MessageSquare,
  Heart,
  Award,
} from 'lucide-react';
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
    { path: '/accueil', label: 'Accueil', icon: Home },
    { path: '/alertes', label: 'Alertes', icon: AlertTriangle },
    { path: '/soumettre', label: 'Signaler', icon: PlusCircle },
    { path: '/dashboard', label: 'Mon espace', icon: LayoutDashboard },
    { path: '/messagerie', label: 'Messages', icon: MessageSquare },
    { path: '/don', label: 'Faire un don', icon: Heart },
    { path: '/points', label: 'Points', icon: Award },
  ];

  const filteredNavLinks = role === 'moderateur' || role === 'admin' 
    ? [...navLinks, { path: '/moderateur', label: 'Modération', icon: Shield }]
    : navLinks;

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
              <span className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              CIVIALERT
            </Link>

            <nav className="hdr-nav">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.path}
                  className={isActive(link.path) ? 'active' : ''}
                  to={link.path}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hdr-right">
            {/* BOUTON MODE NUIT/JOUR */}
            <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* BOUTON NOTIFICATION */}
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

            {/* PANEAU NOTIFICATIONS */}
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}

            {/* MENU UTILISATEUR */}
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

            {/* BOUTON HAMBURGER */}
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

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {filteredNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={isActive(link.path) ? 'active' : ''}
            >
              <link.icon size={18} />
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