import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Award,
  ArrowLeft,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Users,
  Calendar,
  MapPin,
} from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './MesRecompenses.css';

function MesRecompenses() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [recompenses, setRecompenses] = useState([]);
  const [stats, setStats] = useState({
    total_gagne: 0,
    total_en_attente: 0,
    total_termine: 0,
    nombre_contributions: 0,
  });
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/connexion');
      return;
    }
    chargerDonnees();
  }, [navigate]);

  const chargerDonnees = async () => {
    setLoading(true);
    setErreur('');
    try {
      // Récupérer les récompenses gagnées par l'utilisateur
      const res = await api.get('/signalements/recompenses-mes/');
      setRecompenses(res.data);

      // Calculer les statistiques
      const total_gagne = res.data
        .filter(r => r.statut === 'attribuee' || r.statut === 'recompensee')
        .reduce((acc, r) => acc + (r.montant || 0), 0);
      
      const total_en_attente = res.data
        .filter(r => r.statut === 'en_attente' || r.statut === 'depose')
        .length;
      
      const total_termine = res.data
        .filter(r => r.statut === 'attribuee' || r.statut === 'recompensee')
        .length;

      setStats({
        total_gagne,
        total_en_attente,
        total_termine,
        nombre_contributions: res.data.length,
      });
    } catch (error) {
      setErreur('Impossible de charger vos récompenses.');
    } finally {
      setLoading(false);
    }
  };

  const getStatutInfo = (statut) => {
    const infos = {
      'en_attente': { label: 'En attente', icon: Clock, color: '#f39c12', bg: '#FFF8E1' },
      'depose': { label: 'Dépôt confirmé', icon: Wallet, color: '#3498db', bg: '#E3F2FD' },
      'en_cours': { label: 'En cours', icon: TrendingUp, color: '#9b59b6', bg: '#F3E5F5' },
      'validee': { label: 'Validée', icon: CheckCircle, color: '#2ecc71', bg: '#E8F5E9' },
      'recompensee': { label: 'Récompensée 🎉', icon: Award, color: '#f5ab35', bg: '#FFF8E1' },
      'refusee': { label: 'Refusée', icon: XCircle, color: '#e74c3c', bg: '#FFEBEE' },
    };
    return infos[statut] || { label: statut, icon: AlertTriangle, color: '#95a5a6', bg: '#f1f3f5' };
  };

  if (loading) {
    return (
      <div className={`mes-recompenses-page ${darkMode ? 'dark-mode' : ''}`}>
        <Header />
        <div className="mes-recompenses-loading">Chargement...</div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={`mes-recompenses-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className="mes-recompenses-container">
        <button className="mes-recompenses-back" onClick={() => navigate('/accueil')}>
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="mes-recompenses-header">
          <h1>
            <Award size={28} color="#f5ab35" />
            Mes Récompenses
          </h1>
          <p>Suivez vos gains et contributions</p>
        </div>

        {/* Statistiques */}
        <div className="mes-recompenses-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#E8F5E9' }}>
              <Wallet size={24} color="#2ecc71" />
            </div>
            <div>
              <span className="stat-value">{stats.total_gagne} FCFA</span>
              <span className="stat-label">Total gagné</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#FFF8E1' }}>
              <Clock size={24} color="#f39c12" />
            </div>
            <div>
              <span className="stat-value">{stats.total_en_attente}</span>
              <span className="stat-label">En attente</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#E3F2FD' }}>
              <CheckCircle size={24} color="#3498db" />
            </div>
            <div>
              <span className="stat-value">{stats.total_termine}</span>
              <span className="stat-label">Terminées</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#F3E5F5' }}>
              <Users size={24} color="#9b59b6" />
            </div>
            <div>
              <span className="stat-value">{stats.nombre_contributions}</span>
              <span className="stat-label">Contributions</span>
            </div>
          </div>
        </div>

        {erreur && (
          <div className="mes-recompenses-error">{erreur}</div>
        )}

        {/* Liste des récompenses */}
        <div className="mes-recompenses-list">
          <h2>Historique des récompenses</h2>
          {recompenses.length === 0 ? (
            <div className="mes-recompenses-empty">
              <Trophy size={48} color="#d0d0d8" />
              <p>Aucune récompense pour le moment</p>
              <span>Participez à des alertes pour gagner des récompenses !</span>
            </div>
          ) : (
            recompenses.map((item) => {
              const statutInfo = getStatutInfo(item.statut);
              const Icon = statutInfo.icon;
              return (
                <div key={item.id} className="recompense-item">
                  <div className="recompense-item-left">
                    <div className="recompense-icon" style={{ background: statutInfo.bg }}>
                      <Icon size={20} color={statutInfo.color} />
                    </div>
                    <div className="recompense-info">
                      <h4>{item.alerte?.type_alerte?.replace(/_/g, ' ') || 'Alerte'}</h4>
                      <p className="recompense-lieu">
                        <MapPin size={14} />
                        {item.alerte?.localisation || 'Lieu non précisé'}
                      </p>
                      <p className="recompense-date">
                        <Calendar size={14} />
                        {item.date_creation && new Date(item.date_creation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="recompense-item-right">
                    <span className="recompense-montant">
                      +{item.montant || item.montant_recompense || 0} FCFA
                    </span>
                    <span className="recompense-statut" style={{ color: statutInfo.color }}>
                      {statutInfo.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default MesRecompenses;