import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Trophy,
  Star,
  Award,
  Medal,
  ArrowLeft,
  TrendingUp,
  Gift,
  Clock,
  CheckCircle,
  User,
  AlertTriangle,
  Eye,
  Heart,
  Shield,
  Target,
} from 'lucide-react';
import api from '../services/api';
import './Points.css';

function Points() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [points, setPoints] = useState(0);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/connexion');
      return;
    }

    const fetchData = async () => {
      try {
        const [pointsRes, historiqueRes] = await Promise.all([
          api.get('/auth/mes-points/'),
          api.get('/auth/historique-points/')
        ]);
        setPoints(pointsRes.data);
        setHistorique(historiqueRes.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleReclamation = async () => {
    try {
      const res = await api.post('/auth/reclamation-recompense/');
      setMessage(res.data.message);
      const pointsRes = await api.get('/auth/mes-points/');
      setPoints(pointsRes.data);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erreur lors de la réclamation.');
    }
  };

  const getIcon = (type) => {
    const icons = {
      'Inscription': <User size={16} />,
      "Soumission d'alerte": <AlertTriangle size={16} />,
      'Alerte vérifiée': <CheckCircle size={16} />,
      'Alerte résolue': <Trophy size={16} />,
      'Objet/personne retrouvé(e)': <Star size={16} />,
      'Bonus': <Gift size={16} />,
    };
    return icons[type] || <Award size={16} />;
  };

  const getBadge = (points) => {
    if (points >= 100) return { icon: Trophy, label: 'Citoyen d\'élite 🏆', color: '#f5ab35' };
    if (points >= 75) return { icon: Star, label: 'Citoyen vigilant ⭐', color: '#2ecc71' };
    if (points >= 50) return { icon: Medal, label: 'Citoyen engagé 🥈', color: '#3498db' };
    if (points >= 25) return { icon: Shield, label: 'Citoyen actif 🥉', color: '#1a5490' };
    return { icon: Target, label: 'Nouveau citoyen 🎯', color: '#5a5a7a' };
  };

  const pourcentage = Math.min((points.points / 100) * 100, 100);
  const badge = getBadge(points.points);
  const BadgeIcon = badge.icon;

  if (loading) {
    return (
      <div className={`points-page ${darkMode ? 'dark-mode' : ''}`}>
        <div className="points-loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className={`points-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="points-container">
        <button className="points-back" onClick={() => navigate('/accueil')}>
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="points-header">
          <div className="points-title">
            <Trophy size={32} color="#f5ab35" />
            <h1>Mes Points</h1>
          </div>
          <p className="points-subtitle">
            {points.points >= 100 ? '🎉 Félicitations ! Vous avez atteint 100 points !' : 'Gagnez des points en participant à la communauté'}
          </p>
        </div>

        {/* BADGE */}
        <div className="badge-card">
          <div className="badge-icon" style={{ color: badge.color }}>
            <BadgeIcon size={40} />
          </div>
          <div className="badge-info">
            <h3>{badge.label}</h3>
            <p>Niveau {points.points >= 25 ? Math.floor(points.points / 25) + 1 : 1} / 5</p>
          </div>
        </div>

        <div className="points-card">
          <div className="points-circle">
            <div className="points-number">{points.points}</div>
            <div className="points-label">Points</div>
          </div>

          <div className="points-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${pourcentage}%` }}
              />
            </div>
            <div className="progress-text">
              <span>{points.points} / 100 points</span>
              <span>{points.points_restants > 0 ? `${points.points_restants} points restants` : '✅ Objectif atteint !'}</span>
            </div>
          </div>

          {/* Conditions d'attribution des points */}
          <div className="points-conditions">
            <h3>Comment gagner des points ?</h3>
            <div className="conditions-grid">
              <div className="condition-item">
                <User size={18} color="#3498db" />
                <div>
                  <span className="condition-label">Inscription</span>
                  <span className="condition-points">+10 pts</span>
                </div>
              </div>
              <div className="condition-item">
                <AlertTriangle size={18} color="#e74c3c" />
                <div>
                  <span className="condition-label">Soumettre une alerte</span>
                  <span className="condition-points">+15 pts</span>
                </div>
              </div>
              <div className="condition-item">
                <CheckCircle size={18} color="#2ecc71" />
                <div>
                  <span className="condition-label">Alerte vérifiée</span>
                  <span className="condition-points">+20 pts</span>
                </div>
              </div>
              <div className="condition-item">
                <Trophy size={18} color="#f39c12" />
                <div>
                  <span className="condition-label">Alerte résolue</span>
                  <span className="condition-points">+25 pts</span>
                </div>
              </div>
              <div className="condition-item">
                <Star size={18} color="#f5ab35" />
                <div>
                  <span className="condition-label">Objet/personne retrouvé(e)</span>
                  <span className="condition-points">+30 pts</span>
                </div>
              </div>
            </div>
          </div>

          {points.peut_avoir_recompense && (
            <button className="btn-reclamation" onClick={handleReclamation}>
              <Gift size={20} />
              Réclamer ma récompense 🎉
            </button>
          )}

          {message && (
            <div className={`reclamation-message ${message.includes('Félicitations') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="historique-section">
          <h2>
            <TrendingUp size={20} />
            Historique des points
          </h2>
          <div className="historique-list">
            {historique.length === 0 ? (
              <div className="historique-empty">
                <Medal size={40} />
                <p>Aucune transaction pour le moment.</p>
                <span>Commencez à participer pour gagner des points !</span>
              </div>
            ) : (
              historique.map((item, index) => (
                <div key={index} className="historique-item">
                  <div className="historique-icon">
                    {getIcon(item.type_transaction)}
                  </div>
                  <div className="historique-content">
                    <div className="historique-title">{item.type_transaction}</div>
                    <div className="historique-desc">{item.description}</div>
                    <div className="historique-date">
                      {new Date(item.date_creation).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className={`historique-points ${item.points > 0 ? 'positive' : 'negative'}`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Points;