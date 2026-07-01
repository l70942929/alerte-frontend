import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  AlertTriangle,
  Search,
  Package,
  Eye,
  Heart,
  MapPin,
  Calendar,
  Send,
  Camera,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Info,
  Lightbulb,
  Shield,
  Award,
} from 'lucide-react';
import api from '../services/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './SoumettreAlerte.css';

function SoumettreAlerte() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [form, setForm] = useState({
    type_alerte: '',
    description: '',
    localisation: '',
    date_evenement: '',
    photoFile: null,
    anonyme: false,
    montant_recompense: '', // ← NOUVEAU CHAMP
  });
  const [position, setPosition] = useState(null);
  const [searching, setSearching] = useState(false);
  const [etape, setEtape] = useState(1);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  // Configuration des types d'alertes avec Lucide React
  const types = [
    { 
      value: 'kidnapping', 
      label: 'Kidnapping', 
      icon: AlertTriangle, 
      desc: "Enlèvement d'une personne", 
      color: '#C62828',
      bg: '#FFEBEE',
      border: '#E53935',
    },
    { 
      value: 'disparition', 
      label: 'Disparition', 
      icon: Search, 
      desc: 'Personne portée disparue', 
      color: '#0D47A1',
      bg: '#E3F2FD',
      border: '#1976D2',
    },
    { 
      value: 'perte_objet', 
      label: "Perte d'objet", 
      icon: Package, 
      desc: 'Objet perdu ou volé', 
      color: '#E65100',
      bg: '#FFF3E0',
      border: '#FF9800',
    },
    { 
      value: 'decouverte', 
      label: 'Découverte', 
      icon: Eye, 
      desc: 'Personne ou objet trouvé', 
      color: '#1B5E20',
      bg: '#E8F5E9',
      border: '#43A047',
    },
    { 
      value: 'accident', 
      label: 'Accident', 
      icon: Heart, 
      desc: 'Victime non identifiée', 
      color: '#6A1B9A',
      bg: '#F3E5F5',
      border: '#9C27B0',
    },
  ];

  const typeActif = types.find((type) => type.value === form.type_alerte);

  // Fix Leaflet default icon paths
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  const DEFAULT_CENTER = [4.05, 9.7];

  const utiliserMaPosition = () => {
    if (!navigator.geolocation) {
      setErreur("La géolocalisation n'est pas disponible sur ce navigateur.");
      return;
    }
    setErreur('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = coords.latitude.toFixed(6);
        const lng = coords.longitude.toFixed(6);
        setPosition({ lat, lng });
        setForm((prev) => ({
          ...prev,
          localisation: prev.localisation || `${lat}, ${lng}`,
        }));
      },
      () => setErreur("Impossible d'obtenir votre position. Vérifiez l'autorisation du navigateur."),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const rechercherAdresse = async () => {
    const q = form.localisation && form.localisation.trim();
    if (!q) {
      setErreur('Veuillez saisir une adresse ou un lieu à rechercher.');
      return;
    }
    setErreur('');
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'fr' } });
      const data = await res.json();
      if (data && data[0]) {
        const lat = Number(data[0].lat).toFixed(6);
        const lng = Number(data[0].lon).toFixed(6);
        setPosition({ lat, lng });
        setForm((prev) => ({ ...prev, localisation: data[0].display_name }));
      } else {
        setErreur("Aucune correspondance trouvée pour l'adresse saisie.");
      }
    } catch (e) {
      setErreur("Erreur lors de la recherche d'adresse.");
    } finally {
      setSearching(false);
    }
  };

  function LocationMarker({ position }) {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        setPosition({ lat, lng });
        setForm((prev) => ({ ...prev, localisation: prev.localisation || `${lat}, ${lng}` }));
      },
    });

    if (!position) return null;
    return (
      <Marker position={[position.lat, position.lng]}>
        <Popup>Position sélectionnée : {position.lat}, {position.lng}</Popup>
      </Marker>
    );
  }

  const submit = async () => {
    if (!form.type_alerte) {
      setErreur('Veuillez sélectionner un type d\'alerte.');
      return;
    }
    if (!form.description) {
      setErreur('Veuillez décrire l\'incident.');
      return;
    }
    if (!form.localisation) {
      setErreur('Veuillez indiquer le lieu de l\'incident.');
      return;
    }
    if (!form.date_evenement) {
      setErreur('Veuillez indiquer la date de l\'incident.');
      return;
    }
    if (!form.photoFile) {
      setErreur('Veuillez ajouter une photo.');
      return;
    }

    setLoading(true);
    setErreur('');
    setMessage('');

    const formData = new FormData();
    formData.append('type_alerte', form.type_alerte);
    formData.append('description', form.description);
    formData.append('localisation', form.localisation);
    formData.append('date_evenement', new Date(form.date_evenement).toISOString());
    formData.append('anonyme', form.anonyme ? 'true' : 'false');

    // ==========================================
    // AJOUT DE LA RÉCOMPENSE
    // ==========================================
    if (form.montant_recompense && parseInt(form.montant_recompense) > 0) {
      formData.append('montant_recompense', form.montant_recompense);
      formData.append('recompense_active', 'true');
    }

    if (form.photoFile) {
      formData.append('photo', form.photoFile);
    }

    if (position) {
      formData.append('latitude', position.lat);
      formData.append('longitude', position.lng);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErreur('Vous devez être connecté pour soumettre une alerte.');
        setLoading(false);
        return;
      }

      await api.post('/signalements/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`,
        },
      });

      setMessage('Votre alerte a été soumise avec succès ! Elle sera vérifiée sous 15 minutes.');
      setTimeout(() => navigate('/alertes'), 3000);
    } catch (err) {
      console.error('Erreur complète:', err);
      if (err.response) {
        setErreur(`Erreur ${err.response.status}: ${err.response.data?.error || 'Vérifiez les informations saisies.'}`);
      } else {
        setErreur('Erreur lors de la soumission. Vérifiez votre connexion et réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calcul de la commission
  const montant = parseInt(form.montant_recompense) || 0;
  const commission = Math.floor(montant * 0.04);
  const net = montant - commission;

  return (
    <div className={`sa-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className="sa-layout">
        <main className="sa-main">
          <div className="sa-header">
            <h1>Signaler un incident</h1>
            <p>Renseignez les informations essentielles pour faciliter la vérification.</p>
            <div className="sa-steps">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`sa-step ${etape >= step ? 'done' : ''} ${etape === step ? 'active' : ''}`}
                >
                  <div className="sa-step-dot">
                    {etape > step ? <CheckCircle size={14} /> : step}
                  </div>
                  <span>{step === 1 ? 'Type' : step === 2 ? 'Détails' : 'Localisation'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ÉTAPE 1 : TYPE */}
          {etape === 1 && (
            <div className="sa-etape fade-up">
              <h2 className="sa-etape-title">
                <AlertTriangle size={20} />
                Type d'alerte
              </h2>
              <div className="sa-types-grid">
                {types.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      className={`sa-type-card ${form.type_alerte === type.value ? 'selected' : ''}`}
                      style={
                        form.type_alerte === type.value
                          ? { background: type.bg, borderColor: type.border, color: type.color }
                          : {}
                      }
                      onClick={() => setForm({ ...form, type_alerte: type.value })}
                    >
                      <div className="sa-type-icon-wrap" style={{ background: type.bg }}>
                        <Icon size={24} style={{ color: type.color }} />
                      </div>
                      <strong>{type.label}</strong>
                      <span className="sa-type-desc">{type.desc}</span>
                    </button>
                  );
                })}
              </div>
              <button className="sa-next" disabled={!form.type_alerte} onClick={() => setEtape(2)}>
                Suivant
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* ÉTAPE 2 : DÉTAILS */}
          {etape === 2 && (
            <div className="sa-etape fade-up">
              <h2 className="sa-etape-title">
                <Info size={20} />
                Informations descriptives
              </h2>
              <div className="sa-selected-type" style={{ color: typeActif?.color }}>
                {typeActif?.label} sélectionné
              </div>

              <div className="sa-fgrp">
                <label>Description détaillée <span className="req">*</span></label>
                <textarea
                  rows={5}
                  placeholder="Décrivez l'incident avec le maximum de détails..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="sa-fgrp">
                <label>Ajouter une photo <span className="req">*</span></label>
                <div className="sa-file-input">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, photoFile: e.target.files[0] })}
                  />
                  {form.photoFile && <small className="sa-file-name">{form.photoFile.name}</small>}
                </div>
              </div>

              <div className="sa-fgrp">
                <label>Date et heure de l'incident <span className="req">*</span></label>
                <div className="sa-date-input">
                  <Calendar size={20} />
                  <input
                    type="datetime-local"
                    value={form.date_evenement}
                    onChange={(e) => setForm({ ...form, date_evenement: e.target.value })}
                  />
                </div>
              </div>

              {/* ==========================================
                  RÉCOMPENSE
                  ========================================== */}
              <div className="sa-fgrp">
                <label>
                  <Award size={16} style={{ color: '#f5ab35' }} />
                  Montant de la récompense (FCFA)
                </label>
                <div className="sa-recompense-input">
                  <input
                    type="number"
                    placeholder="Ex: 10000"
                    value={form.montant_recompense}
                    onChange={(e) => setForm({ ...form, montant_recompense: e.target.value })}
                    min="0"
                  />
                  <small>
                    <strong>Optionnel</strong> - Proposer une récompense pour encourager les citoyens à aider.
                    {montant > 0 && (
                      <span style={{ display: 'block', marginTop: '4px' }}>
                        <span style={{ color: '#f39c12' }}> Commission (4%) : {commission} FCFA</span>
                        <br />
                        <span style={{ color: '#2ecc71' }}> Récompense nette : {net} FCFA</span>
                      </span>
                    )}
                  </small>
                </div>
              </div>

              <div className="sa-anon">
                <input
                  type="checkbox"
                  id="anon"
                  checked={form.anonyme}
                  onChange={(e) => setForm({ ...form, anonyme: e.target.checked })}
                />
                <label htmlFor="anon">
                  <User size={16} />
                  Signalement anonyme. Votre identité ne sera pas révélée.
                </label>
              </div>

              <div className="sa-nav">
                <button className="sa-prev" onClick={() => setEtape(1)}>
                  <ArrowLeft size={18} />
                  Précédent
                </button>
                <button
                  className="sa-next"
                  disabled={!form.description || !form.date_evenement || !form.photoFile}
                  onClick={() => setEtape(3)}
                >
                  Suivant
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : LOCALISATION */}
          {etape === 3 && (
            <div className="sa-etape fade-up">
              <h2 className="sa-etape-title">
                <MapPin size={20} />
                Localisation
              </h2>

              <div className="sa-fgrp">
                <label>Lieu précis de l'incident <span className="req">*</span></label>
                <div className="sa-location-input">
                  <MapPin size={20} />
                  <input
                    type="text"
                    placeholder="Ex: Quartier Bastos, Rue 1.072, Yaoundé"
                    value={form.localisation}
                    onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                  />
                </div>
              </div>

              <div className="sa-location-actions">
                <button type="button" className="sa-locate-btn" onClick={utiliserMaPosition}>
                  <MapPin size={18} />
                  Utiliser ma position
                </button>
                <button type="button" className="sa-search-btn" onClick={rechercherAdresse} disabled={searching}>
                  <Search size={18} />
                  {searching ? 'Recherche...' : "Rechercher l'adresse"}
                </button>
                {position && (
                  <span className="sa-coords">{position.lat}, {position.lng}</span>
                )}
              </div>

              <div className="sa-map">
                <MapContainer
                  center={position ? [position.lat, position.lng] : DEFAULT_CENTER}
                  zoom={position ? 13 : 6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={position} />
                </MapContainer>
              </div>

              {erreur && (
                <div className="sa-error">
                  <XCircle size={18} />
                  {erreur}
                </div>
              )}
              {message && (
                <div className="sa-success">
                  <CheckCircle size={18} />
                  {message}
                </div>
              )}

              <div className="sa-nav">
                <button className="sa-prev" onClick={() => setEtape(2)}>
                  <ArrowLeft size={18} />
                  Précédent
                </button>
                <button
                  className="sa-submit"
                  disabled={!form.localisation || loading}
                  onClick={submit}
                >
                  {loading ? <Loader2 size={18} className="spinning" /> : <Send size={18} />}
                  {loading ? 'Envoi...' : "Soumettre l'alerte"}
                </button>
              </div>
            </div>
          )}
        </main>

        <aside className="sa-aside">
          <div className="sa-conseils">
            <h3>
              <Lightbulb size={18} style={{ color: '#f5ab35' }} />
              Conseils d'urgence
            </h3>
            <p>Une description précise, une photo claire et un lieu exact facilitent la vérification.</p>
            <ul>
              <li><CheckCircle size={16} />Précisez la tenue vestimentaire exacte</li>
              <li><CheckCircle size={16} />Indiquez les signes particuliers</li>
              <li><CheckCircle size={16} />Donnez les derniers lieux fréquentés</li>
              <li><CheckCircle size={16} />Ajoutez une photo récente si possible</li>
            </ul>
          </div>

          <div className="sa-process">
            <h3>
              <Shield size={18} />
              Processus de modération
            </h3>
            <div className="sa-proc-step">
              <span>1</span>
              <p>Soumission du formulaire complet</p>
            </div>
            <div className="sa-proc-step">
              <span>2</span>
              <p>Vérification par la cellule de crise sous 15 minutes</p>
            </div>
            <div className="sa-proc-step">
              <span>3</span>
              <p>Diffusion de l'alerte sur le réseau national</p>
            </div>
          </div>
        </aside>
      </div>
      <BottomNav />
    </div>
  );
}

export default SoumettreAlerte;