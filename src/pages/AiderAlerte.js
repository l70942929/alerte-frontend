import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft,
  Send,
  MapPin,
  Calendar,
  Award,
  FileText,
  Image,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './AiderAlerte.css';

function AiderAlerte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [alerte, setAlerte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [preuve, setPreuve] = useState('');
  const [erreur, setErreur] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const chargerAlerte = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`signalements/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setAlerte(res.data);
      } catch (err) {
        setErreur('Impossible de charger l\'alerte');
      } finally {
        setLoading(false);
      }
    };
    chargerAlerte();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErreur('Veuillez décrire comment vous pouvez aider.');
      return;
    }

    setSubmitting(true);
    setErreur('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await api.post(`/signalements/aider/${id}/`, {
        message: message,
        preuve: preuve
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      setSuccess('Votre aide a été proposée avec succès ! L\'auteur sera notifié.');
      setTimeout(() => navigate(`/alertes/${id}`), 3000);
    } catch (err) {
      setErreur(err.response?.data?.error || 'Erreur lors de la soumission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`aider-page ${darkMode ? 'dark-mode' : ''}`}>
        <Header />
        <div className="aider-loading">Chargement...</div>
        <BottomNav />
      </div>
    );
  }

  if (erreur && !alerte) {
    return (
      <div className={`aider-page ${darkMode ? 'dark-mode' : ''}`}>
        <Header />
        <div className="aider-error">{erreur}</div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={`aider-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className="aider-container">
        <button className="aider-back" onClick={() => navigate(`/alertes/${id}`)}>
          <ArrowLeft size={20} />
          Retour à l'alerte
        </button>

        <div className="aider-header">
          <h1>
            <Award size={28} color="#f5ab35" />
            Proposer mon aide
          </h1>
          <p>Apportez votre contribution pour résoudre cette alerte</p>
        </div>

        <div className="aider-alerte-info">
          <h3>
            <AlertTriangle size={18} color="#e74c3c" />
            {alerte?.type_alerte?.replace(/_/g, ' ')}
          </h3>
          <p className="aider-lieu">
            <MapPin size={16} />
            {alerte?.localisation || 'Lieu non précisé'}
          </p>
          <p className="aider-date">
            <Calendar size={16} />
            {alerte?.date_soumission && new Date(alerte.date_soumission).toLocaleDateString('fr-FR')}
          </p>
          {alerte?.montant_recompense > 0 && (
            <div className="aider-recompense">
              <Award size={20} color="#f5ab35" />
              <span>
                Récompense : <strong>{alerte.montant_recompense} FCFA</strong>
                <small>(Commission 4% incluse)</small>
              </span>
            </div>
          )}
        </div>

        <form className="aider-form" onSubmit={handleSubmit}>
          <div className="aider-form-group">
            <label>
              <FileText size={18} />
              Comment pouvez-vous aider ?
              <span className="required">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="Décrivez précisément ce que vous savez et comment cela peut aider..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="aider-form-group">
            <label>
              <Image size={18} />
              Preuve (optionnel)
            </label>
            <input
              type="text"
              placeholder="Lien vers une photo, un document, une vidéo..."
              value={preuve}
              onChange={(e) => setPreuve(e.target.value)}
              disabled={submitting}
            />
            <small>Vous pouvez fournir un lien vers une preuve hébergée ailleurs.</small>
          </div>

          {erreur && (
            <div className="aider-error-msg">
              <AlertTriangle size={18} />
              {erreur}
            </div>
          )}

          {success && (
            <div className="aider-success-msg">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          <button
            type="submit"
            className="aider-submit"
            disabled={submitting || !message.trim()}
          >
            {submitting ? (
              'Envoi en cours...'
            ) : (
              <>
                <Send size={18} />
                Proposer mon aide
              </>
            )}
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}

export default AiderAlerte;