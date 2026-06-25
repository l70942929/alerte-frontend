import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Don.css';

function Don() {
  const [montant,   setMontant]   = useState('');
  const [operateur, setOperateur] = useState('mtn');
  const [numero,    setNumero]    = useState('');
  const [statut,    setStatut]    = useState(null); // 'success' | 'error'
  const [message,   setMessage]   = useState([]);

  const simuler = () => {
    if (!montant || !numero) {
      setStatut('error');
      setMessage(['Veuillez remplir le montant et le numéro de téléphone.']);
      return;
    }
    const op = operateur === 'orange' ? 'Orange Money' : 'MTN Mobile Money';
    setStatut('success');
    setMessage([
      `Instructions de transfert via ${op} :`,
      `1. Ouvrez l'application ${op}.`,
      `2. Rendez-vous dans la section Transfert.`,
      `3. Saisissez le numéro administrateur.`,
      `4. Entrez le montant : ${Number(montant).toLocaleString('fr-FR')} XAF.`,
      `5. Confirmez avec votre code secret.`,
      `Merci pour votre soutien à la plateforme.`,
    ]);
  };

  const raisons = [
    { icon: 'volunteer_activism', titre: 'Impact direct',   desc: 'Aide aux signalements et aux familles dans le besoin.' },
    { icon: 'lock',               titre: 'Fiabilité',       desc: 'Hébergement sécurisé et protection des données citoyennes.' },
    { icon: 'groups',             titre: 'Communauté',      desc: 'Modération et notifications pour tous les citoyens camerounais.' },
  ];

  return (
    <div className="don-page">
      <Header />
      <div className="don-body">

        {/* ── Hero ── */}
        <div className="don-hero">
          <div className="don-hero-icon">
            <span className="material-symbols-outlined">favorite</span>
          </div>
          <h1>Soutenir la plateforme</h1>
          <p>
            Votre soutien permet la modération, la diffusion des alertes
            et l'amélioration continue des services citoyens.
          </p>
        </div>

        {/* ── Pourquoi donner ── */}
        <div className="don-why">
          <h2>Pourquoi contribuer ?</h2>
          <div className="don-why-grid">
            {raisons.map((r) => (
              <div key={r.titre} className="don-why-card">
                <div className="don-why-icon">
                  <span className="material-symbols-outlined">{r.icon}</span>
                </div>
                <strong>{r.titre}</strong>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Formulaire ── */}
        <div className="don-form-box">
          <h2>Faire un don</h2>
          <p className="don-form-sub">
            Choisissez votre moyen de paiement mobile camerounais.
          </p>

          <div className="don-fgrp">
            <label>Montant (XAF)</label>
            <div className="don-inp-wrap">
              <span className="material-symbols-outlined don-inp-ico">payments</span>
              <input
                type="number"
                placeholder="Ex : 1 000"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
            </div>
          </div>

          <div className="don-fgrp">
            <label>Opérateur</label>
            <div className="don-operators">
              <button
                className={`don-op ${operateur === 'mtn' ? 'active-mtn' : ''}`}
                onClick={() => setOperateur('mtn')}
              >
                <span className="material-symbols-outlined">phone_android</span>
                MTN Mobile Money
              </button>
              <button
                className={`don-op ${operateur === 'orange' ? 'active-orange' : ''}`}
                onClick={() => setOperateur('orange')}
              >
                <span className="material-symbols-outlined">phone_android</span>
                Orange Money
              </button>
            </div>
          </div>

          <div className="don-fgrp">
            <label>Votre numéro de téléphone</label>
            <div className="don-inp-wrap">
              <span className="material-symbols-outlined don-inp-ico">phone</span>
              <input
                type="tel"
                placeholder="Ex : 699 00 00 00"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>
          </div>

          {statut && (
            <div className={`don-message ${statut}`}>
              <span className="material-symbols-outlined don-msg-icon">
                {statut === 'success' ? 'check_circle' : 'error'}
              </span>
              <div>
                {message.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          )}

          <button className="don-submit" onClick={simuler}>
            <span className="material-symbols-outlined">send</span>
            Simuler le transfert
          </button>

          <p className="don-note">
            Le transfert est envoyé au compte administrateur via l'opérateur
            sélectionné en suivant les étapes indiquées.
          </p>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

export default Don;