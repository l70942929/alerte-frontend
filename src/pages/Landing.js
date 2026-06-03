import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  const alertes = [
    { icon: 'emergency', type: 'KIDNAPPING', lieu: 'Douala - il y a 10 min', titre: 'Enlèvement signalé à Bonanjo', desc: 'Un citoyen a signalé une situation suspecte près du marché. Alerte transmise pour vérification.', statut: 'Urgent', sc: 'urgent' },
    { icon: 'search', type: 'DISPARITION', lieu: 'Yaoundé - il y a 2 h', titre: 'Enfant porté disparu à Bastos', desc: "Signalement avec description vestimentaire, dernier lieu connu et numéro d'urgence.", statut: 'En cours', sc: 'en-cours' },
    { icon: 'inventory_2', type: "PERTE D'OBJET", lieu: 'Bafoussam - aujourd’hui', titre: 'Documents officiels retrouvés', desc: 'Pièces administratives récupérées et en attente d’identification du propriétaire.', statut: 'Nouveau', sc: 'nouveau' },
  ];

  const steps = [
    { icon: 'person_add', title: 'Créer un compte', desc: 'Un accès personnel pour signaler et suivre les alertes.' },
    { icon: 'add_location_alt', title: 'Localiser', desc: 'Ajoutez un lieu précis ou utilisez votre position.' },
    { icon: 'verified_user', title: 'Vérifier', desc: 'Les modérateurs contrôlent les informations reçues.' },
    { icon: 'campaign', title: 'Diffuser', desc: 'Les alertes utiles sont partagées à la communauté.' },
  ];

  return (
    <div className="land">
      <header className="land-hdr">
        <div className="land-hdr-in">
          <span className="land-logo">Alerte Citoyenne</span>
          <nav className="land-nav">
            <a href="#alertes">Alertes</a>
            <a href="#comment">Fonctionnement</a>
          </nav>
          <div className="land-hdr-btns">
            <button className="btn-ghost" onClick={() => navigate('/connexion')}>Se connecter</button>
            <button className="btn-prim" onClick={() => navigate('/inscription')}>Créer un compte</button>
          </div>
        </div>
      </header>

      <section className="land-hero">
        <div className="hero-overlay" />
        <div className="hero-txt">
          <div className="hero-badge">
            <span className="material-symbols-outlined">verified</span>
            Plateforme citoyenne au Cameroun
          </div>
          <h1 className="hero-h1">Alerte Citoyenne</h1>
          <p className="hero-p">
            Signalez rapidement une disparition, un accident, un enlèvement ou un objet retrouvé. Des informations claires aident la communauté à réagir plus vite.
          </p>
          <div className="hero-btns">
            <button className="btn-sec" onClick={() => navigate('/inscription')}>
              <span className="material-symbols-outlined">add_alert</span>
              Soumettre une alerte
            </button>
            <button className="btn-ghost-lg" onClick={() => navigate('/connexion')}>Se connecter</button>
          </div>
        </div>
      </section>

      <section className="land-stats">
        <div className="stats-in">
          <div className="stat-card">
            <span className="material-symbols-outlined sc-icon">groups</span>
            <div><div className="sc-val">12k+</div><div className="sc-lbl">Citoyens engagés</div></div>
          </div>
          <div className="stat-card">
            <span className="material-symbols-outlined sc-icon">fact_check</span>
            <div><div className="sc-val">98%</div><div className="sc-lbl">Alertes vérifiées</div></div>
          </div>
          <div className="stat-card">
            <span className="material-symbols-outlined sc-icon">timer</span>
            <div><div className="sc-val">15 min</div><div className="sc-lbl">Délai de traitement</div></div>
          </div>
        </div>
      </section>

      <section className="land-alertes" id="alertes">
        <div className="sec-in">
          <div className="sec-hdr">
            <div>
              <h2 className="sec-title">Alertes récentes</h2>
              <p className="sec-desc">Exemples d’informations publiées après vérification.</p>
            </div>
            <button className="btn-link" onClick={() => navigate('/connexion')}>
              Voir tout <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="alrt-grid">
            {alertes.map((alerte) => (
              <article key={alerte.titre} className="alrt-card">
                <div className="alrt-top">
                  <span className="material-symbols-outlined alrt-icon">{alerte.icon}</span>
                  <span className={`alrt-statut ${alerte.sc}`}>{alerte.statut}</span>
                </div>
                <div className="alrt-meta">{alerte.type} - {alerte.lieu}</div>
                <h3 className="alrt-titre">{alerte.titre}</h3>
                <p className="alrt-desc">{alerte.desc}</p>
                <button className="alrt-btn" onClick={() => navigate('/connexion')}>
                  Voir les détails <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      <section className="land-cta">
        <h2>Une information précise peut sauver du temps.</h2>
        <p>Décrivez l’incident, ajoutez une photo et indiquez le lieu exact.</p>
        <button className="btn-sec" onClick={() => navigate('/inscription')}>
          <span className="material-symbols-outlined">send</span>
          Lancer une alerte
        </button>
      </section>

      <footer className="land-footer">
        <div className="foot-in">
          <div>
            <div className="foot-logo">Alerte Citoyenne</div>
            <p className="foot-copy">© 2026 Alerte Citoyenne Cameroun. Tous droits réservés.</p>
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
