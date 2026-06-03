import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './DetailAlerte.css';

function DetailAlerte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alerte, setAlerte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [reactions, setReactions] = useState({ '👍': 0, '❤️': 0, '🙏': 0 });
  const [reactionCliquee, setReactionCliquee] = useState(null);

  const emojis = {
    kidnapping: '🚨',
    disparition: '🔍',
    perte_objet: '📦',
    decouverte: '🙋',
    accident: '🚑',
  };

  const statutLabel = {
    recu: 'En attente',
    en_cours: 'Publiée',
    resolu: 'Résolue',
    cloture: 'Clôturée',
  };

  const statutClass = {
    recu: 'tag-attente',
    en_cours: 'tag-publiee',
    resolu: 'tag-resolue',
    cloture: 'tag-cloture',
  };

  useEffect(() => {
    const charger = async () => {
      setLoading(true);
      setErreur('');
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`signalements/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerte(res.data);
      } catch (err) {
        console.error('Erreur chargement alerte:', err);
        setErreur('Alerte introuvable ou accès refusé.');
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, [id]);

  const reagir = (emoji) => {
    if (reactionCliquee === emoji) {
      setReactions((prev) => ({ ...prev, [emoji]: Math.max(0, prev[emoji] - 1) }));
      setReactionCliquee(null);
    } else {
      if (reactionCliquee) {
        setReactions((prev) => ({ ...prev, [reactionCliquee]: Math.max(0, prev[reactionCliquee] - 1) }));
      }
      setReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
      setReactionCliquee(emoji);
    }
  };

  const partagerWhatsApp = () => {
    if (!alerte) return;
    const text = `🚨 ALERTE — ${alerte.type_alerte?.toUpperCase() || ''}\n📍 ${alerte.localisation || ''}\n\n${alerte.description || ''}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const partagerFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const fmt = (val) => (val ? new Date(val).toLocaleString('fr-FR') : 'Non spécifiée');

  if (loading) {
    return (
      <div className="detail-page">
        <Header />
        <div className="detail-loading-inner">
          <p>⏳ Chargement de l'alerte...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (erreur || !alerte) {
    return (
      <div className="detail-page">
        <Header />
        <div className="detail-loading-inner">
          <span>😕</span>
          <p>{erreur || 'Alerte introuvable'}</p>
          <button type="button" onClick={() => navigate('/alertes')}>← Retour aux alertes</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Header />
      <div className="detail-body">
        <button className="detail-back" type="button" onClick={() => navigate('/alertes')}>
          ← Retour aux alertes
        </button>

        <div className="detail-header">
          <div className="detail-header-left">
            <span className={`detail-tag ${statutClass[alerte.statut]}`}>
              {statutLabel[alerte.statut]}
            </span>
            <h1 className="detail-title">
              {alerte.type_alerte?.replace(/_/g, ' ') || 'Alerte'} — {alerte.localisation || 'Lieu non spécifié'}
            </h1>
            <p className="detail-meta">
              📍 {alerte.localisation || 'Non spécifiée'} &nbsp;•&nbsp;
              📅 {fmt(alerte.date_soumission)}
              {alerte.anonyme && ' • 🕵️ Anonyme'}
            </p>
          </div>
          <span className="detail-emoji">{emojis[alerte.type_alerte] || '🔔'}</span>
        </div>

        <div className="detail-content">
          <div className="detail-card">
            <h2>📝 Description</h2>
            <p>{alerte.description || 'Aucune description fournie.'}</p>
          </div>

          <div className="detail-card">
            <h2>ℹ️ Informations</h2>
            <div className="detail-infos">
              {[
                { label: 'Type', val: `${emojis[alerte.type_alerte] || ''} ${alerte.type_alerte?.replace(/_/g, ' ') || '—'}` },
                { label: 'Localisation', val: `📍 ${alerte.localisation || '—'}` },
                { label: "Date de l'incident", val: fmt(alerte.date_evenement) },
                { label: 'Date de soumission', val: fmt(alerte.date_soumission) },
                { label: 'Anonyme', val: alerte.anonyme ? '✅ Oui' : '❌ Non' },
              ].map((item, i) => (
                <div key={i} className="detail-info-row">
                  <span className="detail-info-label">{item.label}</span>
                  <span className="detail-info-val">{item.val}</span>
                </div>
              ))}
              <div className="detail-info-row">
                <span className="detail-info-label">Statut</span>
                <span className={`detail-tag ${statutClass[alerte.statut]}`}>{statutLabel[alerte.statut]}</span>
              </div>
            </div>
          </div>

          {alerte.photo && (
            <div className="detail-card">
              <h2>📷 Preuve visuelle</h2>
              <img
                src={alerte.photo.startsWith('http') ? alerte.photo : `http://127.0.0.1:8000${alerte.photo}`}
                alt={`${alerte.type_alerte?.replace(/_/g, ' ') || 'Alerte'} — ${alerte.localisation || ''}`}
                className="detail-photo"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="detail-card">
            <h2>📤 Partager cette alerte</h2>
            <p className="detail-share-sub">Aidez à diffuser cette alerte pour une réaction plus rapide</p>
            <div className="detail-share-btns">
              <button type="button" className="detail-share-wa" onClick={partagerWhatsApp}>📱 Partager sur WhatsApp</button>
              <button type="button" className="detail-share-fb" onClick={partagerFacebook}>📘 Partager sur Facebook</button>
            </div>
          </div>

          <div className="detail-card">
            <h2>💬 Réactions</h2>
            <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', marginBottom: '14px' }}>
              Cliquez pour réagir à cette alerte
            </p>
            <div className="detail-reactions">
              {[
                { emoji: '👍', label: 'Soutenir' },
                { emoji: '❤️', label: 'Compassion' },
                { emoji: '🙏', label: 'Prier' },
              ].map((r) => (
                <button
                  key={r.emoji}
                  type="button"
                  className={`detail-reaction ${reactionCliquee === r.emoji ? 'active' : ''}`}
                  onClick={() => reagir(r.emoji)}
                >
                  {r.emoji} {r.label}
                  {reactions[r.emoji] > 0 && <span className="reaction-count">{reactions[r.emoji]}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default DetailAlerte;
