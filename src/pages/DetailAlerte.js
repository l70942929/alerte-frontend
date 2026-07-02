import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Calendar,
  Eye,
  Share2,
  ThumbsUp,
  Heart,
  Handshake,
  MessageCircle,
  Info,
  Camera,
  User,
  Shield,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Award,
  CheckCircle,
} from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './DetailAlerte.css';

function DetailAlerte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [alerte, setAlerte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [reactions, setReactions] = useState({ soutien: 0, compassion: 0, solidarite: 0 });
  const [reactionActive, setReactionActive] = useState(null);

  const username = localStorage.getItem('username');

  const typeIcon = {
    kidnapping: AlertTriangle,
    disparition: User,
    perte_objet: Eye,
    decouverte: Shield,
    accident: Heart,
  };

  const statutLabel = {
    recu: 'En attente',
    en_cours: 'Publiée',
    resolu: 'Résolue',
    cloture: 'Clôturée',
    retrouve: 'Retrouvé ',
  };

  const statutClass = {
    recu: 'tag-attente',
    en_cours: 'tag-publiee',
    resolu: 'tag-resolue',
    cloture: 'tag-cloture',
    retrouve: 'tag-retrouve',
  };

  useEffect(() => {
    const charger = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`signalements/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
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
      if (reactionActive) {
        setReactions((p) => ({ ...p, [reactionActive]: Math.max(0, p[reactionActive] - 1) }));
      }
      setReactions((p) => ({ ...p, [key]: p[key] + 1 }));
      setReactionActive(key);
    }
  };

  const partagerWhatsApp = () => {
    if (!alerte) return;
    const text = `ALERTE — ${alerte.type_alerte?.toUpperCase()}\nLieu : ${alerte.localisation}\n\n${alerte.description}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const validerContribution = async (contributionId) => {
    if (!window.confirm('Valider cette contribution ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await api.post(`/signalements/contribution/valider/${contributionId}/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      
      alert('✅ Contribution validée avec succès !');
      
      const res = await api.get(`signalements/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setAlerte(res.data);
      
    } catch (error) {
      alert('Erreur lors de la validation : ' + (error.response?.data?.error || 'Réessayez'));
    }
  };

  const fmt = (v) => v ? new Date(v).toLocaleString('fr-FR') : 'Non spécifiée';

  const IconComponent = alerte?.type_alerte ? typeIcon[alerte.type_alerte] || AlertTriangle : AlertTriangle;

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    const cleanPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `https://larrissa.pythonanywhere.com${cleanPath}`;
  };

  const photoUrl = getPhotoUrl(alerte?.photo);

  const isActive = alerte?.statut !== 'resolu' && 
                   alerte?.statut !== 'retrouve' && 
                   alerte?.statut !== 'cloture';

  const isAuteur = alerte?.utilisateur_nom === username;

  if (loading) {
    return (
      <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
        <Header />
        <div className="detail-loading-inner">
          <Loader2 size={48} className="detail-loading-icon" />
          <p>Chargement de l'alerte...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (erreur || !alerte) {
    return (
      <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
        <Header />
        <div className="detail-loading-inner">
          <AlertCircle size={48} className="detail-loading-icon error" />
          <p>{erreur || 'Alerte introuvable'}</p>
          <button onClick={() => navigate('/alertes')}>Retour aux alertes</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className="detail-body">

        <button className="detail-back" onClick={() => navigate('/alertes')}>
          <ArrowLeft size={18} />
          Retour aux alertes
        </button>

        <div className="detail-header">
          <div className="detail-header-left">
            <span className={`detail-tag ${statutClass[alerte.statut]}`}>
              {statutLabel[alerte.statut]}
            </span>
            <h1 className="detail-title">
              {alerte.type_alerte?.replace(/_/g, ' ')} — {alerte.localisation || 'Lieu non spécifié'}
            </h1>
            <div className="detail-meta">
              <MapPin size={14} />
              {alerte.localisation || 'Non spécifiée'}
              <span className="detail-meta-sep">·</span>
              <Calendar size={14} />
              {fmt(alerte.date_soumission)}
              {alerte.anonyme && ' · Signalement anonyme'}
            </div>
          </div>
          <div className="detail-type-icon">
            <IconComponent size={28} />
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-main">

            {alerte.montant_recompense > 0 && (
              <div className="detail-card aider-card">
                <h2>
                  <Award size={18} color="#f5ab35" />
                  Récompense disponible
                </h2>
                <p className="aider-card-text">
                  Une récompense de <strong>{alerte.montant_recompense} FCFA</strong> est proposée.
                  {alerte.statut === 'recu' && " L'alerte est en attente de vérification."}
                  {alerte.statut === 'en_cours' && " L'alerte est active."}
                  {alerte.statut === 'resolu' && "  L'alerte a été résolue."}
                  {alerte.statut === 'retrouve' && "  L'objet/la personne a été retrouvé(e) !"}
                  {alerte.statut === 'cloture' && "  L'alerte est clôturée."}
                </p>
                {isActive && (
                  <button className="btn-aider" onClick={() => navigate(`/aider/${alerte.id}`)}>
                     Proposer mon aide
                  </button>
                )}
                {alerte.statut === 'retrouve' && (
                  <div className="aider-retrouve-badge">🎉 Objet/personne retrouvé(e) !</div>
                )}
              </div>
            )}

            <div className="detail-card">
              <h2><Info size={18} /> Description</h2>
              <p>{alerte.description || 'Aucune description fournie.'}</p>
            </div>

            {photoUrl && (
              <div className="detail-card">
                <h2><Camera size={18} /> Preuve visuelle</h2>
                {/* ✅ CORRECTION ICI : alt descriptif au lieu de "Photo" */}
                <img 
                  src={photoUrl} 
                  alt={`Illustration de l'alerte ${alerte.type_alerte?.replace(/_/g, ' ')} à ${alerte.localisation}`} 
                  className="detail-photo" 
                />
              </div>
            )}

            <div className="detail-card">
              <h2><Share2 size={18} /> Partager cette alerte</h2>
              <p className="detail-share-sub">Aidez à diffuser cette alerte pour une réaction plus rapide.</p>
              <div className="detail-share-btns">
                <button className="detail-share-wa" onClick={partagerWhatsApp}>
                  <MessageCircle size={18} /> WhatsApp
                </button>
              </div>
            </div>

            <div className="detail-card">
              <h2><Heart size={18} /> Réactions</h2>
              <p className="detail-share-sub">Cliquez pour réagir à cette alerte.</p>
              <div className="detail-reactions">
                {[
                  { key: 'soutien', icon: ThumbsUp, label: 'Soutenir' },
                  { key: 'compassion', icon: Heart, label: 'Compassion' },
                  { key: 'solidarite', icon: Handshake, label: 'Solidarité' },
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.key}
                      className={`detail-reaction ${reactionActive === r.key ? 'active' : ''}`}
                      onClick={() => reagir(r.key)}
                    >
                      <Icon size={16} />
                      {r.label}
                      {reactions[r.key] > 0 && <span className="reaction-count">{reactions[r.key]}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONTRIBUTIONS */}
            <div className="detail-card">
              <h2><Handshake size={18} /> Aides proposées</h2>
              
              {alerte.contributions && alerte.contributions.length > 0 ? (
                <div className="contributions-list">
                  {alerte.contributions.map((contrib) => (
                    <div key={contrib.id} className={`contribution-item ${contrib.statut}`}>
                      <div className="contribution-header">
                        <div className="contribution-author">
                          <User size={16} />
                          <strong>{contrib.contributeur_nom || 'Anonyme'}</strong>
                        </div>
                        <span className={`contribution-statut ${contrib.statut}`}>
                          {contrib.statut === 'en_attente' && ' En attente'}
                          {contrib.statut === 'validee' && ' Validée'}
                          {contrib.statut === 'refusee' && ' Refusée'}
                          {contrib.statut === 'recompensee' && ' Récompensée'}
                        </span>
                      </div>
                      <p className="contribution-message">{contrib.message}</p>
                      <div className="contribution-date">
                        <Calendar size={14} />
                        {new Date(contrib.date_creation).toLocaleString('fr-FR')}
                      </div>
                      {contrib.statut === 'en_attente' && isAuteur && (
                        <button className="btn-valider-contribution" onClick={() => validerContribution(contrib.id)}>
                          <CheckCircle size={16} /> Valider cette aide
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="contributions-empty">
                  <Handshake size={32} color="#d0d0d8" />
                  <p>Aucune aide proposée pour le moment.</p>
                  <small>Soyez le premier à proposer votre aide !</small>
                </div>
              )}
            </div>

          </div>

          <aside className="detail-side">
            <div className="detail-card">
              <h2><Info size={18} /> Informations</h2>
              <div className="detail-infos">
                {[
                  { label: 'Type', val: alerte.type_alerte?.replace(/_/g, ' ') || '—' },
                  { label: 'Localisation', val: alerte.localisation || '—' },
                  { label: "Date incident", val: fmt(alerte.date_evenement) },
                  { label: 'Date soumission', val: fmt(alerte.date_soumission) },
                  { label: 'Anonyme', val: alerte.anonyme ? 'Oui' : 'Non' },
                ].map((item) => (
                  <div key={item.label} className="detail-info-row">
                    <span className="detail-info-label">{item.label}</span>
                    <span className="detail-info-val">{item.val}</span>
                  </div>
                ))}
                <div className="detail-info-row">
                  <span className="detail-info-label">Statut</span>
                  <span className={`detail-tag ${statutClass[alerte.statut]}`}>
                    {statutLabel[alerte.statut]}
                  </span>
                </div>
              </div>
            </div>

            {!alerte.anonyme && alerte.utilisateur_nom && (
              <div className="detail-card">
                <h2><User size={18} /> Informations de l'auteur</h2>
                <div className="detail-infos">
                  <div className="detail-info-row">
                    <span className="detail-info-label">Nom</span>
                    <span className="detail-info-val">{alerte.utilisateur_nom || 'Non spécifié'}</span>
                  </div>
                  {alerte.utilisateur_email && (
                    <div className="detail-info-row">
                      <span className="detail-info-label"><Mail size={14} /></span>
                      <span className="detail-info-val">{alerte.utilisateur_email}</span>
                    </div>
                  )}
                  {alerte.utilisateur_telephone && (
                    <div className="detail-info-row">
                      <span className="detail-info-label"><Phone size={14} /></span>
                      <span className="detail-info-val">{alerte.utilisateur_telephone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </aside>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

export default DetailAlerte;