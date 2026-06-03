import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Don.css';

function Don() {
  const [montant, setMontant] = useState('');
  const [operateur, setOperateur] = useState('mtn');
  const [numero, setNumero] = useState('');
  const [message, setMessage] = useState('');

  const simuler = () => {
    if (!montant || !numero) {
      setMessage('❌ Veuillez remplir le montant et le numéro');
      return;
    }
    const op = operateur === 'orange' ? 'Orange Money' : 'MTN Mobile Money';
    setMessage(`✅ Étapes ${op} :\n1. Ouvrez l'app ${op}.\n2. Allez dans Transfert.\n3. Saisissez le numéro admin.\n4. Entrez le montant : ${montant} XAF.\n5. Confirmez avec votre code secret.\n\nMerci pour votre soutien ! 🙏`);
  };

  return (
    <div className="don-page">
      <Header />
      <div className="don-body">

        {/* HERO */}
        <div className="don-hero">
          <span style={{fontSize:'48px'}}>🙏</span>
          <h1>Soutenir la plateforme</h1>
          <p>Votre soutien permet la modération, la diffusion des alertes et l'amélioration continue des services. Merci !</p>
        </div>

        {/* POURQUOI DONNER */}
        <div className="don-why">
          <h2>Pourquoi donner ?</h2>
          <div className="don-why-grid">
            <div className="don-why-card">
              <span>💪</span>
              <strong>Impact</strong>
              <p>Aide aux signalements et aux familles dans le besoin</p>
            </div>
            <div className="don-why-card">
              <span>🔒</span>
              <strong>Fiabilité</strong>
              <p>Hébergement et sécurité des données citoyennes</p>
            </div>
            <div className="don-why-card">
              <span>🤝</span>
              <strong>Communauté</strong>
              <p>Modération et notifications pour tous les citoyens</p>
            </div>
          </div>
        </div>

        {/* FORMULAIRE DONS */}
        <div className="don-form-box">
          <h2>Faire un don</h2>
          <p className="don-form-sub">Choisissez votre moyen de paiement mobile camerounais</p>

          <div className="don-fgrp">
            <label>Montant (XAF)</label>
            <input type="number" placeholder="Ex: 1000" value={montant}
              onChange={e => setMontant(e.target.value)} />
          </div>

          <div className="don-fgrp">
            <label>Opérateur</label>
            <div className="don-operators">
              <button
                className={`don-op ${operateur === 'mtn' ? 'active-mtn' : ''}`}
                onClick={() => setOperateur('mtn')}>
                <span>📱</span> MTN Mobile Money
              </button>
              <button
                className={`don-op ${operateur === 'orange' ? 'active-orange' : ''}`}
                onClick={() => setOperateur('orange')}>
                <span>🟠</span> Orange Money
              </button>
            </div>
          </div>

          <div className="don-fgrp">
            <label>Votre numéro de téléphone</label>
            <input type="tel" placeholder="Ex: 699 00 00 00" value={numero}
              onChange={e => setNumero(e.target.value)} />
          </div>

          {message && (
            <div className={`don-message ${message.startsWith('❌') ? 'error' : 'success'}`}>
              {message.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          )}

          <button className="don-submit" onClick={simuler}>
            💝 Simuler le transfert
          </button>

          <p className="don-note">
            Le transfert est envoyé au compte administrateur par défaut (Orange ou MTN) en suivant les étapes de l'opérateur choisi.
          </p>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

export default Don;