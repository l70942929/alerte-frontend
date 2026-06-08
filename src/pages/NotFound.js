import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

function NotFound() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1>Page introuvable</h1>
          <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
          <Link to="/" className="btn-prim">Retour à l'accueil</Link>
        </div>
      </section>

      <section className="static-body">
        <h2>Que faire maintenant ?</h2>
        <p>Utilisez le menu pour revenir à l'accueil, consulter vos alertes ou créer un nouveau signalement.</p>
      </section>
    </main>
  );
}

export default NotFound;
