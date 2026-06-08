import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

function Privacy() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1>Politique de confidentialité</h1>
          <p>Votre vie privée est importante. Nous nous engageons à protéger vos informations personnelles lorsque vous utilisez Alerte Citoyenne.</p>
          <Link to="/" className="btn-prim">Retour à l'accueil</Link>
        </div>
      </section>

      <section className="static-body">
        <h2>Données collectées</h2>
        <p>Nous collectons uniquement les données nécessaires à l'identification et à la publication de vos alertes, telles que le nom d'utilisateur, le rôle, et le jeton d'authentification.</p>
        <h3>Utilisation</h3>
        <p>Ces informations servent à sécuriser votre session, afficher votre tableau de bord et permettre la communication avec les services de notification.</p>
        <h3>Conservation</h3>
        <p>Les informations conservées localement dans votre navigateur restent dans votre appareil tant que vous ne vous déconnectez pas.</p>
      </section>
    </main>
  );
}

export default Privacy;
