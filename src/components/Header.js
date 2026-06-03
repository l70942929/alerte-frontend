import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const roleLabel = role === 'moderateur' ? 'Modérateur' : role === 'admin' ? 'Admin' : 'Citoyen';

  return (
    <header className="hdr">
      <div className="hdr-inner">
        <div className="hdr-left">
          <button className="hdr-logo" onClick={() => navigate('/accueil')}>
            Alerte Citoyenne
          </button>
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
          <button className="hdr-icon-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
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
