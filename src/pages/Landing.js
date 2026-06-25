import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const alertes = [
    {
      // Femme africaine — portrait fort et expressif
      image: 'https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=800&q=80',
      type: 'ENLÈVEMENT',
      lieu: 'Douala — il y a 10 min',
      titre: 'Enlèvement signalé à Bonanjo',
      desc: 'Signalement reçu et transmis aux autorités compétentes.',
      statut: 'Urgent',
      sc: 'urgent',
    },
    {
      // Enfants africains à l'école — groupe d'enfants
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
      type: 'DISPARITION',
      lieu: 'Yaoundé — il y a 2 h',
      titre: 'Enfant porté disparu à Bastos',
      desc: 'Recherche en cours avec diffusion des informations.',
      statut: 'En cours',
      sc: 'en-cours',
    },
    {
      // Documents officiels / papiers retrouvés — image claire de documents
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
    { icon: 'person_add',        title: 'Créer un compte',  desc: 'Un accès personnel pour signaler et suivre les alertes.' },
    { icon: 'add_location_alt',  title: 'Localiser',        desc: 'Ajoutez un lieu précis ou utilisez votre position GPS.' },
    { icon: 'verified_user',     title: 'Vérifier',         desc: 'Les modérateurs contrôlent les informations reçues.' },
    { icon: 'campaign',          title: 'Diffuser',         desc: 'Les alertes validées sont partagées à toute la communauté.' },
  ];

  return (
    <div className="land">

      {/* ══════════════════════ HEADER ══════════════════════ */}
      <header className="land-hdr">
        <div className="land-hdr-in">

          <a className="logo" href="/">
            <span className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <span className="logo-text">Alerte Citoyenne</span>
          </a>

          <nav className="land-nav">
            <a href="#alertes">Alertes</a>
            <a href="#comment">Fonctionnement</a>
          </nav>

          <div className="land-hdr-btns">
            <button className="btn-ghost" onClick={() => navigate('/connexion')}>
              Se connecter
            </button>
            <button className="btn-prim" onClick={() => navigate('/inscription')}>
              Créer un compte
            </button>
            <button className="theme-btn-landing" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              className="hamburger-landing"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════ MENU MOBILE ══════════════════════ */}
      {mobileMenuOpen && (
        <div className="mobile-menu-landing">
          <a href="#alertes" onClick={() => setMobileMenuOpen(false)}>Alertes</a>
          <a href="#comment" onClick={() => setMobileMenuOpen(false)}>Fonctionnement</a>
          <button onClick={() => { navigate('/connexion');   setMobileMenuOpen(false); }}>
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

            {/* Texte gauche */}
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
                  <span className="material-symbols-outlined">add_alert</span>
                  Soumettre une alerte
                </button>
                <button className="btn-ghost-lg" onClick={() => navigate('/connexion')}>
                  Se connecter
                </button>
              </div>
            </div>

            {/* Carte dernière alerte */}
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
                    <span className="material-symbols-outlined">arrow_forward</span>
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
            <span className="material-symbols-outlined sc-icon">groups</span>
            <div>
              <div className="sc-val">12k+</div>
              <div className="sc-lbl">Citoyens engagés</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="material-symbols-outlined sc-icon">fact_check</span>
            <div>
              <div className="sc-val">98%</div>
              <div className="sc-lbl">Alertes vérifiées</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="material-symbols-outlined sc-icon">timer</span>
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
              <span className="material-symbols-outlined">arrow_forward</span>
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
                  <span className="material-symbols-outlined">arrow_forward</span>
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
            {steps.map((step, index) => (
              <article key={step.title} className="step-card">
                <div className="step-num">0{index + 1}</div>
                <span className="material-symbols-outlined step-icon">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
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
            {/*  Groupe d'africains en réunion communautaire */}
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
              alt="Citoyens africains en réunion communautaire"
            />
            {/*  Femme africaine souriante dans la communauté */}
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
              alt="Femme africaine dans sa communauté"
            />
            {/*  Hommes africains en discussion, solidarité */}
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
            <span className="material-symbols-outlined">campaign</span>
            Signaler maintenant
          </button>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="land-footer">
        <div className="foot-in">
          <div>
            <div className="foot-logo">Alerte Citoyenne</div>
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