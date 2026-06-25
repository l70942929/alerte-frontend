import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Moderateur.css';
import { addNotificationForUser } from '../services/notificationService';

function Moderateur() {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('recu');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [processingIds, setProcessingIds] = useState([]);
  const navigate = useNavigate();

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
      await api.patch(`signalements/${id}/`, { statut: nouveauStatut });
      setMessage('✅ Alerte mise à jour avec succès !');
      setErreur('');
      setAlertes(prev => prev.map(a => (a.id === id ? { ...a, statut: nouveauStatut } : a)));
      
      // Envoyer la notification au propriétaire de l'alerte
      if (proprietaireAlerte) {
        const typeAlerte = alerteActuelle?.type_alerte?.replace(/_/g, ' ') || 'alerte';
        
        if (nouveauStatut === 'en_cours') {
          addNotificationForUser(
            proprietaireAlerte,
            '✅ Alerte vérifiée et publiée',
            `Votre ${typeAlerte} a été validée et est maintenant publique.`,
            'success',
            id
          );
        } else if (nouveauStatut === 'resolu') {
          addNotificationForUser(
            proprietaireAlerte,
            '🏁 Alerte résolue',
            `L'alerte "${typeAlerte}" est maintenant résolue.`,
            'success',
            id
          );
        } else if (nouveauStatut === 'cloture' && alerteActuelle?.statut === 'recu') {
          addNotificationForUser(
            proprietaireAlerte,
            '❌ Alerte non validée',
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

  const emojis = {
    kidnapping: '🚨',
    disparition: '🔍',
    perte_objet: '📦',
    decouverte: '🙋',
    accident: '🚑',
  };

  const alertesFiltrees = filtre === 'tous' ? alertes : alertes.filter((a) => a.statut === filtre);

  const stats = {
    total: alertes.length,
    recu: alertes.filter((a) => a.statut === 'recu').length,
    en_cours: alertes.filter((a) => a.statut === 'en_cours').length,
    resolu: alertes.filter((a) => a.statut === 'resolu').length,
  };

  return (
    <div className="modo-page">
      <Header />
      <div className="modo-body">
        <div className="modo-header">
          <div>
            <p className="modo-badge">🛡️ Espace Modérateur</p>
            <h1 className="modo-title">Tableau de bord modération</h1>
            <p className="modo-sub">
              Gérez et validez les alertes soumises par les citoyens
            </p>
          </div>
        </div>

        {message && (
          <div className={`modo-msg ${message.startsWith('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {erreur && !message && (
          <div className="modo-msg error">{erreur}</div>
        )}

        <div className="modo-stats">
          <div className="modo-stat" onClick={() => setFiltre('tous')}>
            <span className="modo-stat-val">{stats.total}</span>
            <span className="modo-stat-lbl">Total alertes</span>
          </div>
          <div className="modo-stat attente" onClick={() => setFiltre('recu')}>
            <span className="modo-stat-val">{stats.recu}</span>
            <span className="modo-stat-lbl">⏳ En attente</span>
          </div>
          <div className="modo-stat publiee" onClick={() => setFiltre('en_cours')}>
            <span className="modo-stat-val">{stats.en_cours}</span>
            <span className="modo-stat-lbl">📢 Publiées</span>
          </div>
          <div className="modo-stat resolue" onClick={() => setFiltre('resolu')}>
            <span className="modo-stat-val">{stats.resolu}</span>
            <span className="modo-stat-lbl">✅ Résolues</span>
          </div>
        </div>

        <div className="modo-filtres">
          {[
            { key: 'tous', label: 'Toutes' },
            { key: 'recu', label: '⏳ En attente' },
            { key: 'en_cours', label: '📢 Publiées' },
            { key: 'resolu', label: '✅ Résolues' },
            { key: 'cloture', label: '🔒 Clôturées' },
          ].map((f) => (
            <button
              key={f.key}
              className={`modo-filtre ${filtre === f.key ? 'active' : ''}`}
              onClick={() => setFiltre(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="modo-loading">Chargement des alertes...</div>
        ) : alertesFiltrees.length === 0 ? (
          <div className="modo-empty">
            <span>📭</span>
            <p>Aucune alerte dans cette catégorie</p>
          </div>
        ) : (
          <div className="modo-liste">
            {alertesFiltrees.map((a) => (
              <div key={a.id} className={`modo-card ${a.statut}`}>
                <div className="modo-card-top">
                  <div className="modo-card-left">
                    <span className="modo-card-emoji">
                      {emojis[a.type_alerte] || '🔔'}
                    </span>
                    <div>
                      <p className="modo-card-type">
                        {a.type_alerte.replace(/_/g, ' ')}
                      </p>
                      <p className="modo-card-lieu">
                        📍 {a.localisation || 'Non localisé'}
                      </p>
                    </div>
                  </div>
                  <span className={`modo-tag modo-tag-${a.statut}`}>
                    {a.statut === 'recu'
                      ? '⏳ En attente'
                      : a.statut === 'en_cours'
                      ? '📢 Publiée'
                      : a.statut === 'resolu'
                      ? '✅ Résolue'
                      : '🔒 Clôturée'}
                  </span>
                </div>

                <p className="modo-card-desc">{a.description}</p>

                <p className="modo-card-date">
                  📅 Soumis le {new Date(a.date_soumission).toLocaleString('fr-FR')}
                  {a.anonyme && ' • 🕵️ Anonyme'}
                </p>

                <div className="modo-card-actions">
                  {a.statut === 'recu' && (
                    <>
                      <button
                        className="modo-btn-valider"
                        onClick={() => changerStatut(a.id, 'en_cours')}
                        disabled={processingIds.includes(a.id)}
                      >
                        {processingIds.includes(a.id) ? 'Traitement...' : '✅ Valider et publier'}
                      </button>
                      <button
                        className="modo-btn-rejeter"
                        onClick={() => changerStatut(a.id, 'cloture')}
                        disabled={processingIds.includes(a.id)}
                      >
                        {processingIds.includes(a.id) ? 'Traitement...' : '❌ Rejeter'}
                      </button>
                    </>
                  )}
                  {a.statut === 'en_cours' && (
                    <button
                      className="modo-btn-resoudre"
                      onClick={() => changerStatut(a.id, 'resolu')}
                      disabled={processingIds.includes(a.id)}
                    >
                      {processingIds.includes(a.id) ? 'Traitement...' : '🏁 Marquer comme résolue'}
                    </button>
                  )}
                  {a.statut === 'resolu' && (
                    <button
                      className="modo-btn-cloturer"
                      onClick={() => changerStatut(a.id, 'cloture')}
                      disabled={processingIds.includes(a.id)}
                    >
                      {processingIds.includes(a.id) ? 'Traitement...' : '🔒 Clôturer l\'alerte'}
                    </button>
                  )}
                  <button
                    className="modo-btn-detail"
                    onClick={() => navigate(`/alertes/${a.id}`)}
                  >
                    👁️ Voir détails
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