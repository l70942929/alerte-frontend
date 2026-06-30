import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  Sun,
  Moon,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Bell,
  UserPlus,
  Verified,
  Send,
  Menu,
  X,
  ArrowRight,
  LogIn,
  Award,
  Heart,
  Phone,
  Mail,
  Flag,
} from 'lucide-react';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const alertes = [
    {
      // ✅ Image générique - pas de vraie personne
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80',
      type: 'ENLÈVEMENT',
      lieu: 'Douala — il y a 10 min',
      titre: 'Enlèvement signalé à Bonanjo',
      desc: 'Signalement reçu et transmis aux autorités compétentes.',
      statut: 'Urgent',
      sc: 'urgent',
    },
    {
      // ✅ Illustration générique
      image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&q=80',
      type: 'DISPARITION',
      lieu: 'Yaoundé — il y a 2 h',
      titre: 'Enfant porté disparu à Bastos',
      desc: 'Recherche en cours avec diffusion des informations.',
      statut: 'En cours',
      sc: 'en-cours',
    },
    {
      // ✅ Illustration générique - pas de CNI réelle
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
      type: 'OBJET RETROUVÉ',
      lieu: 'Bafoussam — aujourd\'hui',
      titre: 'Documents officiels retrouvés',
      desc: 'Documents officiels remis au centre de collecte communautaire.',
      statut: 'Nouveau',
      sc: 'nouveau',
    },
  ];

  const communityImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80',
  ];

  const steps = [
    { icon: UserPlus, title: 'Créer un compte', desc: 'Un accès personnel pour signaler et suivre les alertes.', color: '#e74c3c' },
    { icon: MapPin, title: 'Localiser', desc: 'Ajoutez un lieu précis ou utilisez votre position GPS.', color: '#3498db' },
    { icon: Verified, title: 'Vérifier', desc: 'Les modérateurs contrôlent les informations reçues.', color: '#2ecc71' },
    { icon: Send, title: 'Diffuser', desc: 'Les alertes validées sont partagées à toute la communauté.', color: '#f39c12' },
  ];

  const features = [
    { icon: Shield, title: 'Sécurisé', desc: 'Toutes les données sont protégées et confidentielles.' },
    { icon: Clock, title: 'Rapide', desc: 'Traitement des alertes en moins de 15 minutes.' },
    { icon: Award, title: 'Fiable', desc: '98% des alertes sont vérifiées et authentifiées.' },
    { icon: Heart, title: 'Communautaire', desc: 'Une plateforme solidaire et engagée.' },
  ];

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className={`land ${darkMode ? 'dark-mode' : ''}`}>

      {/* HEADER */}
      <header className={`land-hdr ${scrolled ? 'scrolled' : ''}`}>
        <div className="land-hdr-in">

          <a className="logo" href="/">
            <span className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <span className="logo-text">CIVIALERT</span>
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
                  <AlertTriangle size={20} />
                  Soumettre une alerte
                </button>
                <button className="btn-ghost-lg" onClick={() => navigate('/connexion')}>
                  Se connecter
                </button>
              </div>
              <div className="hero-trust">
                <div className="trust-item">
                  <Users size={20} />
                  <span>12 000+ citoyens</span>
                </div>
                <div className="trust-item">
                  <CheckCircle size={20} />
                  <span>98% vérifiées</span>
                </div>
                <div className="trust-item">
                  <Clock size={20} />
                  <span>15 min de réponse</span>
                </div>
              </div>
            </div>

            <div className="hero-latest">
              <div className="hero-latest-card">
                <img
                  src={alertes[0].image}
                  alt={alertes[0].titre}
                  className="hero-latest-img"
                />
                <div className="hero-latest-tag">
                  <Bell size={14} />
                  Dernière alerte
                </div>
                <div className="hero-latest-body">
                  <div className="hero-latest-meta">
                    <span className={`status-dot ${alertes[0].sc}`}></span>
                    {alertes[0].type} — {alertes[0].lieu}
                  </div>
                  <h3 className="hero-latest-titre">{alertes[0].titre}</h3>
                  <button
                    className="hero-latest-btn"
                    onClick={() => navigate('/connexion')}
                  >
                    Voir les détails
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="land-stats">
        <div className="stats-in">
          <div className="stat-card">
            <div className="stat-icon-wrap">
              <Users size={32} className="sc-icon" />
            </div>
            <div>
              <div className="sc-val">12 000+</div>
              <div className="sc-lbl">Citoyens engagés</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap">
              <CheckCircle size={32} className="sc-icon" />
            </div>
            <div>
              <div className="sc-val">98%</div>
              <div className="sc-lbl">Alertes vérifiées</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap">
              <Clock size={32} className="sc-icon" />
            </div>
            <div>
              <div className="sc-val">15 min</div>
              <div className="sc-lbl">Délai de traitement</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap">
              <Award size={32} className="sc-icon" />
            </div>
            <div>
              <div className="sc-val">4.9/5</div>
              <div className="sc-lbl">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="land-features" id="features">
        <div className="sec-in">
          <div className="sec-hdr">
            <div>
              <span className="sec-tag">Pourquoi nous choisir</span>
              <h2 className="sec-title">Des fonctionnalités pensées pour vous</h2>
              <p className="sec-desc">
                Une plateforme simple, rapide et sécurisée pour tous les citoyens.
              </p>
            </div>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="feature-icon-wrap">
                    <Icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ALERTES */}
      <section className="land-alertes" id="alertes">
        <div className="sec-in">
          <div className="sec-hdr">
            <div>
              <span className="sec-tag">Actualités</span>
              <h2 className="sec-title">Alertes récentes</h2>
              <p className="sec-desc">
                Exemples d'informations publiées après vérification par notre équipe.
              </p>
            </div>
            <button className="btn-link" onClick={() => navigate('/connexion')}>
              Voir tout
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="alrt-grid">
            {alertes.map((alerte, index) => (
              <article key={alerte.titre} className="alrt-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="alrt-img-wrap">
                  <img
                    src={alerte.image}
                    alt={alerte.titre}
                    className="alrt-image"
                  />
                  <span className={`alrt-statut ${alerte.sc}`}>
                    <Flag size={12} />
                    {alerte.statut}
                  </span>
                </div>
                <div className="alrt-meta">
                  <span className="alrt-type">{alerte.type}</span>
                  <span className="alrt-lieu">
                    <MapPin size={14} />
                    {alerte.lieu}
                  </span>
                </div>
                <h3 className="alrt-titre">{alerte.titre}</h3>
                <p className="alrt-desc">{alerte.desc}</p>
                <button className="alrt-btn" onClick={() => navigate('/connexion')}>
                  Voir les détails
                  <ArrowRight size={18} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="land-how" id="comment">
        <div className="sec-in">
          <div className="sec-hdr center">
            <span className="sec-tag">Guide</span>
            <h2 className="sec-title">Comment ça marche ?</h2>
            <p className="sec-desc">
              En 4 étapes simples, devenez acteur de la sécurité de votre communauté.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="step-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="step-number" style={{ background: step.color }}>
                    {index + 1}
                  </div>
                  <div className="step-icon-wrap" style={{ color: step.color }}>
                    <Icon size={40} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="community-section" id="community">
        <div className="sec-in">
          <div className="sec-hdr center">
            <span className="sec-tag">Notre communauté</span>
            <h2 className="sec-title">
              Une plateforme pensée pour les citoyens africains
            </h2>
            <p className="sec-desc">
              Rejoignez une communauté solidaire et engagée pour la sécurité de tous.
            </p>
          </div>
          <div className="community-grid">
            {communityImages.map((img, index) => (
              <div 
                key={index} 
                className={`community-item ${index === currentImageIndex ? 'active' : ''}`}
              >
                <img src={img} alt={`Communauté ${index + 1}`} />
                <div className="community-overlay">
                  <Heart size={24} />
                  <span>Solidarité</span>
                </div>
              </div>
            ))}
          </div>
          <div className="community-dots">
            {communityImages.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="land-cta">
        <div className="cta-content">
          <div className="cta-icon">
            <Bell size={48} />
          </div>
          <h2>Ensemble, protégeons nos communautés.</h2>
          <p>
            Chaque information partagée peut aider à retrouver une personne,
            sécuriser une zone ou retrouver un objet perdu.
          </p>
          <div className="cta-buttons">
            <button className="btn-sec" onClick={() => navigate('/inscription')}>
              <UserPlus size={20} />
              Créer un compte
            </button>
            <button className="btn-ghost-lg" onClick={() => navigate('/connexion')}>
              Se connecter
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="land-footer">
        <div className="foot-in">
          <div className="foot-brand">
            <div className="foot-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              CIVIALERT
            </div>
            <p className="foot-copy">
              © 2026 Tous droits réservés.
            </p>
          </div>
          <div className="foot-links">
            <div className="foot-links-group">
              <h4>Plateforme</h4>
              <Link to="/conditions-d-utilisation">Conditions</Link>
              <Link to="/politique-de-confidentialite">Confidentialité</Link>
              <Link to="/contact-d-urgence">Contact d'urgence</Link>
            </div>
            <div className="foot-links-group">
              <h4>Contact</h4>
              <a href="mailto:contact@civialert.com"><Mail size={16} /> contact@civialert.com</a>
              <a href="tel:+237691234567"><Phone size={16} /> +237 691 234 567</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;