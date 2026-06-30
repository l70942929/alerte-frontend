import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  Sun,
  Moon,
  UserPlus,
  Menu,
  X,
  LogIn,
} from 'lucide-react';
import Logo from '../components/Logo';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`land ${darkMode ? 'dark-mode' : ''}`}>

      {/* HEADER */}
      <header className={`land-hdr ${scrolled ? 'scrolled' : ''}`}>
        <div className="land-hdr-in">
          <a className="logo" href="/">
            <Logo size={38} variant="full" />
          </a>

          <nav className="land-nav">
            <a href="#alertes">Alertes</a>
            <a href="#comment">Fonctionnement</a>
            <a href="#features">Caractéristiques</a>
            <a href="#community">Communauté</a>
          </nav>

          <div className="land-hdr-btns">
            {isLoggedIn ? (
              <button className="btn-prim" onClick={() => navigate('/accueil')}>
                Accéder à mon Dashboard
              </button>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => navigate('/connexion')}>
                  <LogIn size={18} />
                  Se connecter
                </button>
                <button className="btn-prim" onClick={() => navigate('/inscription')}>
                  <UserPlus size={18} />
                  Créer un compte
                </button>
              </>
            )}
            <button className="theme-btn-landing" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="hamburger-landing"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="mobile-menu-landing">
          <a href="#alertes" onClick={() => setMobileMenuOpen(false)}>Alertes</a>
          <a href="#comment" onClick={() => setMobileMenuOpen(false)}>Fonctionnement</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Caractéristiques</a>
          <a href="#community" onClick={() => setMobileMenuOpen(false)}>Communauté</a>
          {isLoggedIn ? (
            <button className="btn-prim-mobile" onClick={() => { navigate('/accueil'); setMobileMenuOpen(false); }}>
              Accéder à mon Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => { navigate('/connexion'); setMobileMenuOpen(false); }}>
                Se connecter
              </button>
              <button className="btn-prim-mobile" onClick={() => { navigate('/inscription'); setMobileMenuOpen(false); }}>
                Créer un compte
              </button>
            </>
          )}
        </div>
      )}

      {/* HERO */}
      <section className="land-hero">
        <div className="hero-overlay">
          <div className="hero-grid">
            <div className="hero-txt">
              <div className="hero-badge">
                <Shield size={16} />
                Plateforme citoyenne 🇨🇲
              </div>
              <h1 className="hero-h1">
                Protégez votre <span className='titre'>communauté</span>,<br />
                un signalement <span className='titre'>à la fois.</span>
              </h1>
              <p className="hero-p">
                Rejoignez des milliers de citoyens qui utilisent CIVIALERT
                pour signaler des incidents, retrouver des personnes disparues
                et sécuriser leurs quartiers.
              </p>
              <div className="hero-btns">
                <button className="btn-sec" onClick={() => navigate('/inscription')}>
                  Soumettre une alerte
                </button>
                <button className="btn-ghost-lg" onClick={() => navigate('/connexion')}>
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="land-footer">
        <div className="foot-in">
          <div className="foot-brand">
            <div className="foot-logo">
              <Logo size={28} variant="icon" />
              <span style={{ marginLeft: '8px' }}>CIVIALERT</span>
            </div>
            <p className="foot-copy">
              © 2026 Tous droits réservés.
            </p>
          </div>
          <div className="foot-links">
            <div className="foot-links-group">
              <h4>Plateforme</h4>
              <a href="/conditions-d-utilisation">Conditions</a>
              <a href="/politique-de-confidentialite">Confidentialité</a>
              <a href="/contact-d-urgence">Contact d'urgence</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;