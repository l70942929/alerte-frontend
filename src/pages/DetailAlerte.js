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
  Clock,
  User,
  Shield,
  Loader2,
  AlertCircle,
  ChevronRight,
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
    cloture: 'Clôturée'
  };

  const statutClass = {
    recu: 'tag-attente',
    en_cours: 'tag-publiee',
    resolu: 'tag-resolue',
    cloture: 'tag-cloture'
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

  const fmt = (v) => v ? new Date(v).toLocaleString('fr-FR') : 'Non spécifiée';

  const IconComponent = alerte?.type_alerte ? typeIcon[alerte.type_alerte] || AlertTriangle : AlertTriangle;

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    const cleanPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `https://larrissa.pythonanywhere.com${cleanPath}`;
  };

  const photoUrl = getPhotoUrl(alerte?.photo);

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

            <div className="detail-card">
              <h2>
                <Info size={18} />
                Description
              </h2>
              <p>{alerte.description || 'Aucune description fournie.'}</p>
            </div>

            {photoUrl && (
              <div className="detail-card">
                <h2>
                  <Camera size={18} />
                  Preuve visuelle
                </h2>
                <img
                  src={photoUrl}
                  alt={alerte.type_alerte || 'Photo de l\'alerte'}
                  className="detail-photo"
                  onError={(e) => {
                    console.error('Erreur chargement photo:', photoUrl);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="detail-card">
              <h2>
                <Share2 size={18} />
                Partager cette alerte
              </h2>
              <p className="detail-share-sub">Aidez à diffuser cette alerte pour une réaction plus rapide.</p>
              <div className="detail-share-btns">
                <button className="detail-share-wa" onClick={partagerWhatsApp}>
                  <MessageCircle size={18} />
                  WhatsApp
                </button>
              </div>
            </div>

            <div className="detail-card">
              <h2>
                <Heart size={18} />
                Réactions
              </h2>
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
                      {reactions[r.key] > 0 && (
                        <span className="reaction-count">{reactions[r.key]}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <aside className="detail-side">
            <div className="detail-card">
              <h2>
                <Info size={18} />
                Informations
              </h2>
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
          </aside>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

export default DetailAlerte;