import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './SoumettreAlerte.css';

function SoumettreAlerte() {
  const [form, setForm] = useState({
    type_alerte: '',
    description: '',
    localisation: '',
    date_evenement: '',
    photoFile: '',
    anonyme: false,
  });
  const [position, setPosition] = useState(null);
  const [searching, setSearching] = useState(false);
  const [etape, setEtape] = useState(1);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const types = [
    { value: 'kidnapping', label: 'Kidnapping', icon: 'emergency', desc: "Enlèvement d'une personne", color: '#FFEBEE', border: '#E53935', text: '#C62828' },
    { value: 'disparition', label: 'Disparition', icon: 'search', desc: 'Personne portée disparue', color: '#E3F2FD', border: '#1976D2', text: '#0D47A1' },
    { value: 'perte_objet', label: "Perte d'objet", icon: 'inventory_2', desc: 'Objet perdu ou volé', color: '#FFF3E0', border: '#FF9800', text: '#E65100' },
    { value: 'decouverte', label: 'Découverte', icon: 'person_search', desc: 'Personne ou objet trouvé', color: '#E8F5E9', border: '#43A047', text: '#1B5E20' },
    { value: 'accident', label: 'Accident', icon: 'local_hospital', desc: 'Victime non identifiée', color: '#F3E5F5', border: '#9C27B0', text: '#6A1B9A' },
  ];

  const typeActif = types.find((type) => type.value === form.type_alerte);

  // Fix Leaflet default icon paths (webpack)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  const DEFAULT_CENTER = [4.05, 9.7]; // Douala

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
    if (!form.type_alerte || !form.description || !form.localisation || !form.date_evenement || !form.photoFile) {
      setErreur('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    setErreur('');

    const formData = new FormData();
    formData.append('type_alerte', form.type_alerte);
    formData.append('description', form.description);
    formData.append('localisation', form.localisation);
    formData.append('date_evenement', form.date_evenement ? new Date(form.date_evenement).toISOString() : '');
    formData.append('anonyme', form.anonyme);

    if (form.photoFile) {
      formData.append('photo', form.photoFile);
    }

    if (position) {
      formData.append('latitude', position.lat);
      formData.append('longitude', position.lng);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/signalements/', formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Votre alerte a été soumise. Elle sera vérifiée sous 15 minutes.');
      setTimeout(() => navigate('/alertes'), 3000);
    } catch (err) {
      setErreur('Erreur lors de la soumission. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sa-page">
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
                    {etape > step
                      ? <span className="material-symbols-outlined">check</span>
                      : step}
                  </div>
                  <span>{step === 1 ? 'Type' : step === 2 ? 'Détails' : 'Localisation'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── ÉTAPE 1 : TYPE ── */}
          {etape === 1 && (
            <div className="sa-etape fade-up">
              <h2 className="sa-etape-title">
                <span className="material-symbols-outlined">category</span>
                Type d'alerte
              </h2>
              <div className="sa-types-grid">
                {types.map((type) => (
                  <button
                    key={type.value}
                    className={`sa-type-card ${form.type_alerte === type.value ? 'selected' : ''}`}
                    style={
                      form.type_alerte === type.value
                        ? { background: type.color, borderColor: type.border, color: type.text }
                        : {}
                    }
                    onClick={() => setForm({ ...form, type_alerte: type.value })}
                  >
                    <span className="material-symbols-outlined sa-type-icon">{type.icon}</span>
                    <strong>{type.label}</strong>
                    <span className="sa-type-desc">{type.desc}</span>
                  </button>
                ))}
              </div>
              <button className="sa-next" disabled={!form.type_alerte} onClick={() => setEtape(2)}>
                Suivant <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}

          {/* ── ÉTAPE 2 : DÉTAILS ── */}
          {etape === 2 && (
            <div className="sa-etape fade-up">
              <h2 className="sa-etape-title">
                <span className="material-symbols-outlined">edit_note</span>
                Informations descriptives
              </h2>
              <div className="sa-selected-type">{typeActif?.label} sélectionné</div>

              <div className="sa-fgrp">
                <label>Description détaillée <span className="req">*</span></label>
                <textarea
                  rows={5}
                  placeholder="Décrivez l'incident avec le maximum de détails : caractéristiques physiques, tenue, circonstances..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="sa-fgrp">
                <label>Ajouter une photo <span className="req">*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, photoFile: e.target.files[0] })}
                />
                {form.photoFile && <small className="sa-file-name">{form.photoFile.name}</small>}
              </div>

              <div className="sa-fgrp">
                <label>Date et heure de l'incident <span className="req">*</span></label>
                <input
                  type="datetime-local"
                  value={form.date_evenement}
                  onChange={(e) => setForm({ ...form, date_evenement: e.target.value })}
                />
              </div>

              <div className="sa-anon">
                <input
                  type="checkbox"
                  id="anon"
                  checked={form.anonyme}
                  onChange={(e) => setForm({ ...form, anonyme: e.target.checked })}
                />
                <label htmlFor="anon">Signalement anonyme. Votre identité ne sera pas révélée.</label>
              </div>

              <div className="sa-nav">
                <button className="sa-prev" onClick={() => setEtape(1)}>
                  <span className="material-symbols-outlined">arrow_back</span> Précédent
                </button>
                <button
                  className="sa-next"
                  disabled={!form.description || !form.date_evenement || !form.photoFile}
                  onClick={() => setEtape(3)}
                >
                  Suivant <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 3 : LOCALISATION ── */}
          {etape === 3 && (
            <div className="sa-etape fade-up">
              <h2 className="sa-etape-title">
                <span className="material-symbols-outlined">location_on</span>
                Localisation
              </h2>

              <div className="sa-fgrp">
                <label>Lieu précis de l'incident <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="Ex: Quartier Bastos, Rue 1.072, Yaoundé"
                  value={form.localisation}
                  onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                />
              </div>

              <div className="sa-location-actions">
                <button type="button" className="sa-locate-btn" onClick={utiliserMaPosition}>
                  <span className="material-symbols-outlined">my_location</span>
                  Utiliser ma position
                </button>
                <button type="button" className="sa-search-btn" onClick={rechercherAdresse} disabled={searching}>
                  <span className="material-symbols-outlined">search</span>
                  {searching ? 'Recherche...' : "Rechercher l'adresse"}
                </button>
                {position && (
                  <span className="sa-coords">{position.lat}, {position.lng}</span>
                )}
              </div>

              {/* Carte Leaflet interactive */}
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
                <input type="hidden" name="latitude" value={position?.lat || ''} />
                <input type="hidden" name="longitude" value={position?.lng || ''} />
              </div>

              {erreur && (
                <div className="sa-error">
                  <span className="material-symbols-outlined">error</span>{erreur}
                </div>
              )}
              {message && (
                <div className="sa-success">
                  <span className="material-symbols-outlined">check_circle</span>{message}
                </div>
              )}

              <div className="sa-nav">
                <button className="sa-prev" onClick={() => setEtape(2)}>
                  <span className="material-symbols-outlined">arrow_back</span> Précédent
                </button>
                <button
                  className="sa-submit"
                  disabled={!form.localisation || loading}
                  onClick={submit}
                >
                  <span className="material-symbols-outlined">send</span>
                  {loading ? 'Envoi...' : "Soumettre l'alerte"}
                </button>
              </div>
            </div>
          )}
        </main>

        <aside className="sa-aside">
          <div className="sa-conseils">
            <h3>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>
                tips_and_updates
              </span>
              Conseils d'urgence
            </h3>
            <p>Une description précise, une photo claire et un lieu exact facilitent la vérification.</p>
            <ul>
              <li><span className="material-symbols-outlined">check_circle</span>Précisez la tenue vestimentaire exacte</li>
              <li><span className="material-symbols-outlined">check_circle</span>Indiquez les signes particuliers</li>
              <li><span className="material-symbols-outlined">check_circle</span>Donnez les derniers lieux fréquentés</li>
              <li><span className="material-symbols-outlined">check_circle</span>Ajoutez une photo récente si possible</li>
            </ul>
          </div>

          <div className="sa-process">
            <h3>Processus de modération</h3>
            <div className="sa-proc-step"><span>1</span><p>Soumission du formulaire complet</p></div>
            <div className="sa-proc-step"><span>2</span><p>Vérification par la cellule de crise sous 15 minutes</p></div>
            <div className="sa-proc-step"><span>3</span><p>Diffusion de l'alerte sur le réseau national</p></div>
          </div>
        </aside>
      </div>
      <BottomNav />
    </div>
  );
}

export default SoumettreAlerte;