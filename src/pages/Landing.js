/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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
  Eye,
  Home,
  Phone,
  FileText,
  Lock,
  LogIn,
  PlusCircle,
  Search,
  Award,
  Heart,
  Globe,
  Camera,
  Video,
  MessageCircle,
  Share2,
  ThumbsUp,
  Flag,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const alertes = [
    {
      image: 'https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=800&q=80',
      type: 'ENLÈVEMENT',
      lieu: 'Douala — il y a 10 min',
      titre: 'Enlèvement signalé à Bonanjo',
      desc: 'Signalement reçu et transmis aux autorités compétentes.',
      statut: 'Urgent',
      sc: 'urgent',
    },
    {
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
      type: 'DISPARITION',
      lieu: 'Yaoundé — il y a 2 h',
      titre: 'Enfant porté disparu à Bastos',
      desc: 'Recherche en cours avec diffusion des informations.',
      statut: 'En cours',
      sc: 'en-cours',
    },
    {
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80',
      type: 'OBJET RETROUVÉ',
      lieu: 'Bafoussam — aujourd\'hui',
      titre: 'Documents officiels retrouvés',
      desc: 'Documents officiels remis au centre de collecte communautaire.',
      statut: 'Nouveau',
      sc: 'nouveau',
    },
  ];

  const steps = [
    { icon: UserPlus, title: 'Créer un compte', desc: 'Un accès personnel pour signaler et suivre les alertes.' },
    { icon: MapPin, title: 'Localiser', desc: 'Ajoutez un lieu précis ou utilisez votre position GPS.' },
    { icon: Verified, title: 'Vérifier', desc: 'Les modérateurs contrôlent les informations reçues.' },
    { icon: Send, title: 'Diffuser', desc: 'Les alertes validées sont partagées à toute la communauté.' },
  ];

  return (
    <div className="land">

      {/* ══════════════════════ HEADER ══════════════════════ */}
      <header className="land-hdr">
        <div className="land-hdr-in">

          <a className="logo" href="/">
            <span className="logo-icon">
              <Shield size={28} />
            </span>
            <span className="logo-text">Alerte Citoyenne</span>
          </a>

          <nav className="land-nav">
            <a href="#alertes">Alertes</a>
            <a href="#comment">Fonctionnement</a>
          </nav>

          <div className="land-hdr-btns">
            <button className="btn-ghost" onClick={() => navigate('/connexion')}>
              <LogIn size={18} />
              Se connecter
            </button>
            <button className="btn-prim" onClick={() => navigate('/inscription')}>
              <UserPlus size={18} />
              Créer un compte
            </button>
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

      {/* ══════════════════════ MENU MOBILE ══════════════════════ */}
      {mobileMenuOpen && (
        <div className="mobile-menu-landing">
          <a href="#alertes" onClick={() => setMobileMenuOpen(false)}>Alertes</a>
          <a href="#comment" onClick={() => setMobileMenuOpen(false)}>Fonctionnement</a>
          <button onClick={() => { navigate('/connexion'); setMobileMenuOpen(false); }}>
            Se connecter
          </button>
          <button onClick={() => { navigate('/inscription'); setMobileMenuOpen(false); }}>
            Créer un compte
          </button>
        </div>
      )}

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="land-hero">
        <div className="hero-overlay">
          <div className="hero-grid">

            <div className="hero-txt">
              <h1 className="hero-h1">
                Protégez votre <span className='titre'>communauté</span>, un signalement <span className='titre'>à la fois.</span>
              </h1>
              <p className="hero-p">
                Rejoignez des milliers de citoyens qui utilisent Alerte Citoyenne
                pour signaler des incidents, retrouver des personnes disparues
                et sécuriser leurs quartiers au Cameroun.
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
            </div>

            <div className="hero-latest">
              <div className="hero-latest-card">
                <img
                  src={alertes[0].image}
                  alt={alertes[0].titre}
                  className="hero-latest-img"
                />
                <div className="hero-latest-tag">Dernière alerte</div>
                <div className="hero-latest-body">
                  <div className="hero-latest-meta">
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

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section className="land-stats">
        <div className="stats-in">
          <div className="stat-card">
            <Users size={32} className="sc-icon" />
            <div>
              <div className="sc-val">12k+</div>
              <div className="sc-lbl">Citoyens engagés</div>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle size={32} className="sc-icon" />
            <div>
              <div className="sc-val">98%</div>
              <div className="sc-lbl">Alertes vérifiées</div>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={32} className="sc-icon" />
            <div>
              <div className="sc-val">15 min</div>
              <div className="sc-lbl">Délai de traitement</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ ALERTES RÉCENTES ══════════════════════ */}
      <section className="land-alertes" id="alertes">
        <div className="sec-in">
          <div className="sec-hdr">
            <div>
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
            {alertes.map((alerte) => (
              <article key={alerte.titre} className="alrt-card">
                <div className="alrt-img-wrap">
                  <img
                    src={alerte.image}
                    alt={alerte.titre}
                    className="alrt-image"
                  />
                  <span className={`alrt-statut ${alerte.sc}`}>{alerte.statut}</span>
                </div>
                <div className="alrt-meta">{alerte.type} — {alerte.lieu}</div>
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

      {/* ══════════════════════ COMMENT ÇA MARCHE ══════════════════════ */}
      <section className="land-how" id="comment">
        <div className="sec-in">
          <h2 className="sec-title center">Comment ça marche ?</h2>
          <div className="steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="step-card">
                  <div className="step-num">0{index + 1}</div>
                  <Icon size={40} className="step-icon" />
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════ COMMUNITY ══════════════════════ */}
      <section className="community-section">
        <div className="sec-in">
          <h2 className="sec-title center">
            Une plateforme pensée pour les citoyens africains
          </h2>
          <div className="community-grid">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
              alt="Citoyens africains en réunion communautaire"
            />
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
              alt="Femme africaine dans sa communauté"
            />
            <img
              src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80"
              alt="Communauté africaine solidaire"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="land-cta">
        <div className="cta-content">
          <h2>Ensemble, protégeons nos communautés.</h2>
          <p>
            Chaque information partagée peut aider à retrouver une personne,
            sécuriser une zone ou retrouver un objet perdu.
          </p>
          <button className="btn-sec" onClick={() => navigate('/inscription')}>
            <Bell size={20} />
            Signaler maintenant
          </button>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="land-footer">
        <div className="foot-in">
          <div>
            <div className="foot-logo">
              <Shield size={20} />
              Alerte Citoyenne
            </div>
            <p className="foot-copy">
              © 2026 Alerte Citoyenne Cameroun. Tous droits réservés.
            </p>
          </div>
          <div className="foot-links">
            <Link to="/conditions-d-utilisation">Conditions</Link>
            <Link to="/politique-de-confidentialite">Confidentialité</Link>
            <Link to="/contact-d-urgence">Contact d'urgence</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;