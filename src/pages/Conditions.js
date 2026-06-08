import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

function Conditions() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1>Conditions d'utilisation</h1>
          <p>Bienvenue sur Alerte Citoyenne. En utilisant cette plateforme, vous acceptez nos règles de confidentialité et d'utilisation.</p>
          <Link to="/" className="btn-prim">Retour à l'accueil</Link>
        </div>
      </section>

      <section className="static-body">
        <h2>Règles d’utilisation</h2>
        <p>Notre plateforme est dédiée à la publication d’alertes citoyennes responsables. Toute fausse alerte, diffusion de données personnelles sensibles ou comportement abusif est interdit.</p>
        <h3>Accès et sécurité</h3>
        <p>Vous devez garder vos identifiants confidentiels et utiliser un compte personnel par utilisateur. Nous ne sommes pas responsables des usages partagés d’un même compte.</p>
        <h3>Contenu autorisé</h3>
        <p>Signalez uniquement des événements qui concernent la sécurité, la recherche de personnes disparues, la découverte d’objets ou des incidents d’intérêt public.</p>
      </section>
    </main>
  );
}

export default Conditions;
