import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './DetailAlerte.css';

function DetailAlerte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alerte,         setAlerte]         = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [erreur,         setErreur]         = useState('');
  const [reactions,      setReactions]      = useState({ soutien: 0, compassion: 0, solidarite: 0 });
  const [reactionActive, setReactionActive] = useState(null);

  const typeIcon  = { kidnapping: 'emergency', disparition: 'search', perte_objet: 'inventory_2', decouverte: 'person_search', accident: 'local_hospital' };
  const statutLabel = { recu: 'En attente', en_cours: 'Publiée', resolu: 'Résolue', cloture: 'Clôturée' };
  const statutClass = { recu: 'tag-attente', en_cours: 'tag-publiee', resolu: 'tag-resolue', cloture: 'tag-cloture' };

  useEffect(() => {
    const charger = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`signalements/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
        setAlerte(res.data);
      } catch {
        setErreur('Alerte introuvable ou accès refusé.');
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, [id]);

  const reagir = (key) => {
    if (reactionActive === key) {
      setReactions((p) => ({ ...p, [key]: Math.max(0, p[key] - 1) }));
      setReactionActive(null);
    } else {
      if (reactionActive) setReactions((p) => ({ ...p, [reactionActive]: Math.max(0, p[reactionActive] - 1) }));
      setReactions((p) => ({ ...p, [key]: p[key] + 1 }));
      setReactionActive(key);
    }
  };

  const partagerWhatsApp = () => {
    if (!alerte) return;
    const text = `ALERTE — ${alerte.type_alerte?.toUpperCase()}\nLieu : ${alerte.localisation}\n\n${alerte.description}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const partagerFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const fmt = (v) => v ? new Date(v).toLocaleString('fr-FR') : 'Non spécifiée';

  if (loading) return (
    <div className="detail-page">
      <Header />
      <div className="detail-loading-inner">
        <span className="material-symbols-outlined detail-loading-icon">hourglass_empty</span>
        <p>Chargement de l'alerte...</p>
      </div>
      <BottomNav />
    </div>
  );

  if (erreur || !alerte) return (
    <div className="detail-page">
      <Header />
      <div className="detail-loading-inner">
        <span className="material-symbols-outlined detail-loading-icon">error_outline</span>
        <p>{erreur || 'Alerte introuvable'}</p>
        <button onClick={() => navigate('/alertes')}>Retour aux alertes</button>
      </div>
      <BottomNav />
    </div>
  );

  return (
    <div className="detail-page">
      <Header />
      <div className="detail-body">

        <button className="detail-back" onClick={() => navigate('/alertes')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Retour aux alertes
        </button>

        <div className="detail-header">
          <div className="detail-header-left">
            <span className={`detail-tag ${statutClass[alerte.statut]}`}>{statutLabel[alerte.statut]}</span>
            <h1 className="detail-title">
              {alerte.type_alerte?.replace(/_/g, ' ')} — {alerte.localisation || 'Lieu non spécifié'}
            </h1>
            <p className="detail-meta">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
              {' '}{alerte.localisation || 'Non spécifiée'}
              {' · '}
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
              {' '}{fmt(alerte.date_soumission)}
              {alerte.anonyme && ' · Signalement anonyme'}
            </p>
          </div>
          <div className="detail-type-icon">
            <span className="material-symbols-outlined">{typeIcon[alerte.type_alerte] || 'notifications'}</span>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-main">

            <div className="detail-card">
              <h2><span className="material-symbols-outlined">description</span> Description</h2>
              <p>{alerte.description || 'Aucune description fournie.'}</p>
            </div>

            {alerte.photo && (
              <div className="detail-card">
                <h2><span className="material-symbols-outlined">photo_camera</span> Preuve visuelle</h2>
                <img
                  src={alerte.photo.startsWith('http') ? alerte.photo : `http://127.0.0.1:8000${alerte.photo}`}
                  alt={alerte.type_alerte}
                  className="detail-photo"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <div className="detail-card">
              <h2><span className="material-symbols-outlined">share</span> Partager cette alerte</h2>
              <p className="detail-share-sub">Aidez à diffuser cette alerte pour une réaction plus rapide.</p>
              <div className="detail-share-btns">
                <button className="detail-share-wa" onClick={partagerWhatsApp}>
                  <span className="material-symbols-outlined">chat</span> WhatsApp
                </button>
                <button className="detail-share-fb" onClick={partagerFacebook}>
                  <span className="material-symbols-outlined">thumb_up</span> Facebook
                </button>
              </div>
            </div>

            <div className="detail-card">
              <h2><span className="material-symbols-outlined">favorite</span> Réactions</h2>
              <p className="detail-share-sub">Cliquez pour réagir à cette alerte.</p>
              <div className="detail-reactions">
                {[
                  { key: 'soutien',    icon: 'thumb_up',  label: 'Soutenir' },
                  { key: 'compassion', icon: 'favorite',  label: 'Compassion' },
                  { key: 'solidarite',icon: 'handshake', label: 'Solidarité' },
                ].map((r) => (
                  <button
                    key={r.key}
                    className={`detail-reaction ${reactionActive === r.key ? 'active' : ''}`}
                    onClick={() => reagir(r.key)}
                  >
                    <span className="material-symbols-outlined">{r.icon}</span>
                    {r.label}
                    {reactions[r.key] > 0 && <span className="reaction-count">{reactions[r.key]}</span>}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <aside className="detail-side">
            <div className="detail-card">
              <h2><span className="material-symbols-outlined">info</span> Informations</h2>
              <div className="detail-infos">
                {[
                  { label: 'Type',            val: alerte.type_alerte?.replace(/_/g, ' ') || '—' },
                  { label: 'Localisation',    val: alerte.localisation || '—' },
                  { label: "Date incident",   val: fmt(alerte.date_evenement) },
                  { label: 'Date soumission', val: fmt(alerte.date_soumission) },
                  { label: 'Anonyme',         val: alerte.anonyme ? 'Oui' : 'Non' },
                ].map((item) => (
                  <div key={item.label} className="detail-info-row">
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
          </aside>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

export default DetailAlerte;