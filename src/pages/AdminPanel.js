import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  Users,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [recompenses, setRecompenses] = useState([]);
  const [stats, setStats] = useState({
    total_en_attente: 0,
    total_depose: 0,
    total_attribue: 0,
    total_commission: 0,
  });
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/accueil');
      return;
    }
    chargerDonnees();
  }, [navigate]);

  const chargerDonnees = async () => {
    setLoading(true);
    setErreur('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErreur('Vous devez être connecté.');
        setLoading(false);
        return;
      }

      const res = await api.get('/signalements/admin/recompenses/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setRecompenses(data);

      const en_attente = data.filter(r => r.statut === 'en_attente').length;
      const depose = data.filter(r => r.statut === 'depose').length;
      const attribue = data.filter(r => r.statut === 'attribuee').length;
      const commission = data
        .filter(r => r.statut === 'attribuee')
        .reduce((acc, r) => acc + (parseInt(r.commission) || 0), 0);

      setStats({
        total_en_attente: en_attente,
        total_depose: depose,
        total_attribue: attribue,
        total_commission: commission,
      });
    } catch (error) {
      console.error('Erreur:', error);
      setErreur('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  const confirmerDepot = async (recompenseId) => {
    if (!window.confirm('Confirmer le dépôt de cette récompense ?')) return;
    
    setProcessing(true);
    setErreur('');
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      await api.post(`/signalements/recompense/confirmer-depot/${recompenseId}/`, {}, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setMessage('Dépôt confirmé avec succès !');
      chargerDonnees();
    } catch (error) {
      console.error('Erreur:', error);
      setErreur('Erreur lors de la confirmation.');
    } finally {
      setProcessing(false);
    }
  };

  const getStatutInfo = (statut) => {
    const infos = {
      'en_attente': { label: 'En attente', icon: Clock, color: '#f39c12', bg: '#FFF8E1' },
      'depose': { label: 'Dépôt effectué', icon: Wallet, color: '#3498db', bg: '#E3F2FD' },
      'en_cours': { label: 'En cours', icon: TrendingUp, color: '#9b59b6', bg: '#F3E5F5' },
      'attribuee': { label: 'Attribuée 🎉', icon: CheckCircle, color: '#2ecc71', bg: '#E8F5E9' },
      'refusee': { label: 'Refusée', icon: XCircle, color: '#e74c3c', bg: '#FFEBEE' },
    };
    return infos[statut] || { label: statut, icon: AlertTriangle, color: '#95a5a6', bg: '#f1f3f5' };
  };

  if (loading) {
    return (
      <div className={`admin-panel-page ${darkMode ? 'dark-mode' : ''}`}>
        <Header />
        <div className="admin-loading">Chargement...</div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={`admin-panel-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className="admin-panel-container">
        <div className="admin-header">
          <div className="admin-header-left">
            <button className="admin-back" onClick={() => navigate('/accueil')}>
              <ArrowLeft size={20} />
              Retour
            </button>
            <div>
              <h1>
                <Shield size={28} color="#1a5490" />
                Administration
              </h1>
              <p>Gestion des récompenses et des transactions</p>
            </div>
          </div>
          <button className="admin-refresh" onClick={chargerDonnees}>
            <RefreshCw size={18} />
            Actualiser
          </button>
        </div>

        <div className="admin-stats">
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
              <Wallet size={24} color="#3498db" />
            </div>
            <div>
              <span className="stat-value">{stats.total_depose}</span>
              <span className="stat-label">Dépôts effectués</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#E8F5E9' }}>
              <CheckCircle size={24} color="#2ecc71" />
            </div>
            <div>
              <span className="stat-value">{stats.total_attribue}</span>
              <span className="stat-label">Récompenses attribuées</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#F3E5F5' }}>
              <DollarSign size={24} color="#9b59b6" />
            </div>
            <div>
              <span className="stat-value">{stats.total_commission} FCFA</span>
              <span className="stat-label">Commission totale (4%)</span>
            </div>
          </div>
        </div>

        {message && <div className="admin-success">{message}</div>}
        {erreur && <div className="admin-error">{erreur}</div>}

        <div className="admin-table-container">
          <h2>Transactions en attente</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Auteur</th>
                  <th>Alerte</th>
                  <th>Montant</th>
                  <th>Commission</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recompenses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-empty">
                      <Users size={32} color="#d0d0d8" />
                      <p>Aucune transaction</p>
                    </td>
                  </tr>
                ) : (
                  recompenses.map((item) => {
                    const statutInfo = getStatutInfo(item.statut);
                    const Icon = statutInfo.icon;
                    return (
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td>{item.auteur?.username || 'N/A'}</td>
                        <td>{item.alerte?.type_alerte?.replace(/_/g, ' ') || 'N/A'}</td>
                        <td><strong>{item.montant_total} FCFA</strong></td>
                        <td>{item.commission || 0} FCFA</td>
                        <td>
                          <span className="statut-badge" style={{ background: statutInfo.bg, color: statutInfo.color }}>
                            <Icon size={14} />
                            {statutInfo.label}
                          </span>
                        </td>
                        <td>
                          {item.statut === 'en_attente' && (
                            <button
                              className="btn-confirmer"
                              onClick={() => confirmerDepot(item.id)}
                              disabled={processing}
                            >
                              <CheckCircle size={16} />
                              Confirmer
                            </button>
                          )}
                          {item.statut === 'depose' && (
                            <span className="status-ok"> Déjà confirmé</span>
                          )}
                          {item.statut === 'attribuee' && (
                            <span className="status-done"> Attribuée</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default AdminPanel;