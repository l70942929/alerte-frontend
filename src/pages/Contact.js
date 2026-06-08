import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

function Contact() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1>Contact d'urgence</h1>
          <p>Besoin d'une aide rapide ou d'une assistance pour un incident citoyen ? Contactez-nous maintenant.</p>
          <Link to="/" className="btn-prim">Retour à l'accueil</Link>
        </div>
      </section>

      <section className="static-body">
        <h2>Support citoyen</h2>
        <p>Vous pouvez envoyer vos questions et signalements à l'adresse e-mail suivante :</p>
        <p className="static-contact">l70942929@gmail.com</p>
        <h3>Téléphone d'urgence</h3>
        <p>+237 6 57 95 52 86</p>
        <h3>Adresse</h3>
        <p>Centre de gestion des alertes, Douala, Cameroun</p>
      </section>
    </main>
  );
}

export default Contact;
