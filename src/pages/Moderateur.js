import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  AlertTriangle,
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  FileText,
  Filter,
  Loader2,
  Bell,
  User,
  Check,
  X,
  Search,
} from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { addNotificationForUser } from '../services/notificationService';
import './Moderateur.css';

function Moderateur() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('recu');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [processingIds, setProcessingIds] = useState([]);

  useEffect(() => {
    const roleActuel = localStorage.getItem('role');
    
    if (roleActuel !== 'moderateur' && roleActuel !== 'admin') {
      alert('Accès refusé. Vous devez être modérateur.');
      navigate('/accueil');
      return;
    }

    chargerAlertes();
  }, [navigate]);

  const chargerAlertes = async () => {
    setLoading(true);
    setErreur('');
    try {
      const res = await api.get('signalements/');
      setAlertes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setErreur('Impossible de charger les alertes');
      setAlertes([]);
    } finally {
      setLoading(false);
    }
  };

  const changerStatut = async (id, nouveauStatut) => {
    if (processingIds.includes(id)) return;
    setProcessingIds(prev => [...prev, id]);
    
    const alerteActuelle = alertes.find(a => a.id === id);
    const proprietaireAlerte = alerteActuelle?.utilisateur_nom || alerteActuelle?.username;
    
    try {
      await api.patch(`signalements/moderer/${id}/`, { statut: nouveauStatut });
      setMessage(' Alerte mise à jour avec succès !');
      setErreur('');
      setAlertes(prev => prev.map(a => (a.id === id ? { ...a, statut: nouveauStatut } : a)));
      
      if (proprietaireAlerte) {
        const typeAlerte = alerteActuelle?.type_alerte?.replace(/_/g, ' ') || 'alerte';
        
        if (nouveauStatut === 'en_cours') {
          addNotificationForUser(
            proprietaireAlerte,
            ' Alerte vérifiée et publiée',
            `Votre ${typeAlerte} a été validée et est maintenant publique.`,
            'success',
            id
          );
        } else if (nouveauStatut === 'resolu') {
          addNotificationForUser(
            proprietaireAlerte,
            ' Alerte résolue',
            `L'alerte "${typeAlerte}" est maintenant résolue.`,
            'success',
            id
          );
        } else if (nouveauStatut === 'retrouve') {
          addNotificationForUser(
            proprietaireAlerte,
            'Objet/personne retrouvé(e) !',
            `Félicitations ! L'objet ou la personne de votre alerte "${typeAlerte}" a été retrouvé(e) ! Vous avez gagné 30 points.`,
            'success',
            id
          );
        } else if (nouveauStatut === 'cloture' && alerteActuelle?.statut === 'recu') {
          addNotificationForUser(
            proprietaireAlerte,
            ' Alerte non validée',
            `Votre ${typeAlerte} n'a pas été validée par nos modérateurs.`,
            'error',
            id
          );
        }
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setErreur('Erreur lors de la mise à jour');
      setTimeout(() => setErreur(''), 8000);
    } finally {
      setProcessingIds(prev => prev.filter(x => x !== id));
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      kidnapping: AlertTriangle,
      disparition: User,
      perte_objet: FileText,
      decouverte: Eye,
      accident: Bell,
    };
    const Icon = icons[type] || AlertTriangle;
    return <Icon size={18} />;
  };

  const getTypeColor = (type) => {
    const colors = {
      kidnapping: '#C62828',
      disparition: '#1565C0',
      perte_objet: '#E65100',
      decouverte: '#2E7D32',
      accident: '#6A1B9A',
    };
    return colors[type] || '#1a5490';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      recu: 'En attente',
      en_cours: 'Publiée',
      resolu: 'Résolue',
      cloture: 'Clôturée',
      retrouve: 'Retrouvé ', // ← AJOUT
    };
    return labels[statut] || statut;
  };

  const getStatutClass = (statut) => {
    const classes = {
      recu: 'statut-attente',
      en_cours: 'statut-publiee',
      resolu: 'statut-resolue',
      cloture: 'statut-cloture',
      retrouve: 'statut-retrouve', // ← AJOUT
    };
    return classes[statut] || '';
  };

  const alertesFiltrees = filtre === 'tous' ? alertes : alertes.filter((a) => a.statut === filtre);

  const stats = {
    total: alertes.length,
    recu: alertes.filter((a) => a.statut === 'recu').length,
    en_cours: alertes.filter((a) => a.statut === 'en_cours').length,
    resolu: alertes.filter((a) => a.statut === 'resolu').length,
    retrouve: alertes.filter((a) => a.statut === 'retrouve').length, // ← AJOUT
  };

  const filtres = [
    { key: 'tous', label: 'Toutes', icon: Filter },
    { key: 'recu', label: 'En attente', icon: Clock },
    { key: 'en_cours', label: 'Publiées', icon: CheckCircle },
    { key: 'resolu', label: 'Résolues', icon: ThumbsUp },
    { key: 'retrouve', label: 'Retrouvées ', icon: Search }, // ← AJOUT
    { key: 'cloture', label: 'Clôturées', icon: XCircle },
  ];

  if (loading) {
    return (
      <div className={`modo-page ${darkMode ? 'dark-mode' : ''}`}>
        <Header />
        <div className="modo-loading-center">
          <Loader2 size={48} className="modo-spinner" />
          <p>Chargement des alertes...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={`modo-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className="modo-body">
        <div className="modo-header">
          <div>
            <div className="modo-badge">
              <Shield size={16} />
              Espace Modérateur
            </div>
            <h1 className="modo-title">Tableau de bord modération</h1>
            <p className="modo-sub">
              Gérez et validez les alertes soumises par les citoyens
            </p>
          </div>
        </div>

        {message && (
          <div className={`modo-msg ${message.startsWith('') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {erreur && !message && (
          <div className="modo-msg error">{erreur}</div>
        )}

        <div className="modo-stats">
          <div className="modo-stat" onClick={() => setFiltre('tous')}>
            <div className="modo-stat-icon" style={{ background: '#EFF6FF' }}>
              <FileText size={20} color="#1565C0" />
            </div>
            <div>
              <span className="modo-stat-val">{stats.total}</span>
              <span className="modo-stat-lbl">Total alertes</span>
            </div>
          </div>
          <div className="modo-stat attente" onClick={() => setFiltre('recu')}>
            <div className="modo-stat-icon" style={{ background: '#FFF0F0' }}>
              <Clock size={20} color="#C62828" />
            </div>
            <div>
              <span className="modo-stat-val">{stats.recu}</span>
              <span className="modo-stat-lbl">En attente</span>
            </div>
          </div>
          <div className="modo-stat publiee" onClick={() => setFiltre('en_cours')}>
            <div className="modo-stat-icon" style={{ background: '#E8F5E9' }}>
              <CheckCircle size={20} color="#2E7D32" />
            </div>
            <div>
              <span className="modo-stat-val">{stats.en_cours}</span>
              <span className="modo-stat-lbl">Publiées</span>
            </div>
          </div>
          <div className="modo-stat resolue" onClick={() => setFiltre('resolu')}>
            <div className="modo-stat-icon" style={{ background: '#F0FFF4' }}>
              <ThumbsUp size={20} color="#2E7D32" />
            </div>
            <div>
              <span className="modo-stat-val">{stats.resolu}</span>
              <span className="modo-stat-lbl">Résolues</span>
            </div>
          </div>
        </div>

        <div className="modo-filtres">
          {filtres.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                className={`modo-filtre ${filtre === f.key ? 'active' : ''}`}
                onClick={() => setFiltre(f.key)}
              >
                <Icon size={16} />
                {f.label}
              </button>
            );
          })}
        </div>

        {alertesFiltrees.length === 0 ? (
          <div className="modo-empty">
            <div className="modo-empty-icon">
              <Bell size={48} />
            </div>
            <p className="modo-empty-titre">Aucune alerte dans cette catégorie</p>
            <p className="modo-empty-sub">Les alertes apparaîtront ici une fois soumises.</p>
          </div>
        ) : (
          <div className="modo-liste">
            {alertesFiltrees.map((a) => (
              <div key={a.id} className={`modo-card ${a.statut}`}>
                <div className="modo-card-top">
                  <div className="modo-card-left">
                    <div 
                      className="modo-card-icon"
                      style={{ background: `${getTypeColor(a.type_alerte)}15` }}
                    >
                      {getTypeIcon(a.type_alerte)}
                    </div>
                    <div>
                      <p className="modo-card-type">
                        {a.type_alerte.replace(/_/g, ' ')}
                      </p>
                      <p className="modo-card-lieu">
                        <MapPin size={14} />
                        {a.localisation || 'Non localisé'}
                      </p>
                    </div>
                  </div>
                  <span className={`modo-tag ${getStatutClass(a.statut)}`}>
                    {getStatutLabel(a.statut)}
                  </span>
                </div>

                <p className="modo-card-desc">{a.description}</p>

                <div className="modo-card-date">
                  <Calendar size={14} />
                  Soumis le {new Date(a.date_soumission).toLocaleString('fr-FR')}
                  {a.anonyme && ' • 🕵️ Anonyme'}
                </div>

                <div className="modo-card-actions">
                  {a.statut === 'recu' && (
                    <>
                      <button
                        className="modo-btn-valider"
                        onClick={() => changerStatut(a.id, 'en_cours')}
                        disabled={processingIds.includes(a.id)}
                      >
                        {processingIds.includes(a.id) ? (
                          <Loader2 size={16} className="spinning" />
                        ) : (
                          <Check size={16} />
                        )}
                        Valider et publier
                      </button>
                      <button
                        className="modo-btn-rejeter"
                        onClick={() => changerStatut(a.id, 'cloture')}
                        disabled={processingIds.includes(a.id)}
                      >
                        {processingIds.includes(a.id) ? (
                          <Loader2 size={16} className="spinning" />
                        ) : (
                          <X size={16} />
                        )}
                        Rejeter
                      </button>
                    </>
                  )}
                  {a.statut === 'en_cours' && (
                    <>
                      <button
                        className="modo-btn-resoudre"
                        onClick={() => changerStatut(a.id, 'resolu')}
                        disabled={processingIds.includes(a.id)}
                      >
                        {processingIds.includes(a.id) ? (
                          <Loader2 size={16} className="spinning" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        Marquer comme résolue
                      </button>
                      {/* ✅ NOUVEAU BOUTON RETROUVÉ */}
                      <button
                        className="modo-btn-retrouve"
                        onClick={() => changerStatut(a.id, 'retrouve')}
                        disabled={processingIds.includes(a.id)}
                      >
                        {processingIds.includes(a.id) ? (
                          <Loader2 size={16} className="spinning" />
                        ) : (
                          <Search size={16} />
                        )}
                        Marquer comme retrouvé (+30 pts)
                      </button>
                    </>
                  )}
                  {a.statut === 'resolu' && (
                    <button
                      className="modo-btn-cloturer"
                      onClick={() => changerStatut(a.id, 'cloture')}
                      disabled={processingIds.includes(a.id)}
                    >
                      {processingIds.includes(a.id) ? (
                        <Loader2 size={16} className="spinning" />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Clôturer l'alerte
                    </button>
                  )}
                  {a.statut === 'retrouve' && (
                    <button
                      className="modo-btn-cloturer"
                      onClick={() => changerStatut(a.id, 'cloture')}
                      disabled={processingIds.includes(a.id)}
                    >
                      {processingIds.includes(a.id) ? (
                        <Loader2 size={16} className="spinning" />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Clôturer l'alerte
                    </button>
                  )}
                  <button
                    className="modo-btn-detail"
                    onClick={() => navigate(`/alertes/${a.id}`)}
                  >
                    <Eye size={16} />
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default Moderateur;