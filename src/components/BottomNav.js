import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/accueil', icon: 'home', label: 'Accueil' },
    { path: '/alertes', icon: 'list_alt', label: 'Alertes' },
    { path: '/soumettre', icon: 'add_alert', label: 'Signaler' },
    { path: '/messagerie', icon: 'forum', label: 'Messages' },
    { path: '/dashboard', icon: 'person', label: 'Mon espace' },
  ];

  return (
    <nav className="bnav">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`bnav-item ${location.pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="material-symbols-outlined">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
