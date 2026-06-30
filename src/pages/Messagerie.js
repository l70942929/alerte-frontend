import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  MessageSquare,
  CheckCircle,
  Circle,
  Send,
  ArrowLeft,
  Search,
  Users,
  WifiOff,
  Copy,
  Edit,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import api from '../services/api';
import './Messagerie.css';

function Messagerie() {
  const { darkMode } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [actif, setActif] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMsg, setNouveauMsg] = useState('');
  const [recherche, setRecherche] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [erreur, setErreur] = useState('');
  const [menuMessage, setMenuMessage] = useState(null);
  const [nonLusParContact, setNonLusParContact] = useState({});
  const threadRef = useRef(null);
  const username = localStorage.getItem('username');

  // Charger les contacts
  useEffect(() => {
    const chargerContacts = async () => {
      setLoadingContacts(true);
      setErreur('');
      try {
        const res = await api.get('auth/utilisateurs/');
        const autres = Array.isArray(res.data)
          ? res.data.filter(u => u.username !== username)
          : [];
        setContacts(autres);
        
        // Charger les non lus pour chaque contact
        const nonLus = {};
        for (const contact of autres) {
          try {
            const convRes = await api.get(`messagerie/conversation/?user_id=${contact.id}`);
            const nonLusCount = convRes.data.filter(msg => 
              !msg.lu && msg.expediteur_nom === contact.username
            ).length;
            if (nonLusCount > 0) {
              nonLus[contact.id] = nonLusCount;
            }
          } catch (e) {
            // Ignorer
          }
        }
        setNonLusParContact(nonLus);
      } catch {
        setErreur("Impossible de charger les contacts.");
        setContacts([]);
      } finally {
        setLoadingContacts(false);
      }
    };
    chargerContacts();
  }, [username]);

  const ouvrirChat = async (contact) => {
    setActif(contact);
    setMessages([]);
    setNouveauMsg('');
    setLoadingMessages(true);
    setErreur('');
    try {
      const res = await api.get(`messagerie/conversation/?user_id=${contact.id}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
      
      // Marquer les messages non lus comme lus
      const nonLus = res.data.filter(msg => 
        !msg.lu && msg.expediteur_nom === contact.username
      );
      if (nonLus.length > 0) {
        await api.post(`messagerie/marquer-lu/?user_id=${contact.id}`);
        // Mettre à jour le compteur
        setNonLusParContact(prev => ({
          ...prev,
          [contact.id]: 0
        }));
      }
    } catch (error) {
      setErreur("Impossible de charger la conversation.");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const envoyer = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    const contenu = nouveauMsg.trim();
    if (!contenu || !actif) return;
    setNouveauMsg('');
    setErreur('');
    try {
      const res = await api.post('messagerie/', {
        destinataire: actif.id,
        contenu: contenu,
      });
      setMessages(prev => [...prev, res.data]);
    } catch (error) {
      setNouveauMsg(contenu);
      setErreur(error.response?.data?.detail || "Erreur lors de l'envoi.");
    }
  };

  const copierMessage = (contenu) => {
    navigator.clipboard.writeText(contenu);
    setMenuMessage(null);
    alert('Message copié !');
  };

  const supprimerMessage = async (id) => {
    if (window.confirm('Supprimer ce message ?')) {
      try {
        await api.delete(`messagerie/${id}/`);
        setMessages(messages.filter((msg) => msg.id !== id));
        setMenuMessage(null);
      } catch (error) {
        alert("Impossible de supprimer le message");
      }
    }
  };

  const modifierMessage = async (id, ancienContenu) => {
    const nouveauContenu = prompt('Modifier le message :', ancienContenu);
    if (nouveauContenu && nouveauContenu.trim() !== ancienContenu) {
      try {
        await api.patch(`messagerie/${id}/`, { contenu: nouveauContenu });
        setMessages(messages.map(msg => msg.id === id ? { ...msg, contenu: nouveauContenu } : msg));
        setMenuMessage(null);
      } catch (error) {
        alert("Impossible de modifier le message");
      }
    } else {
      setMenuMessage(null);
    }
  };

  const transfererMessage = async (contenu) => {
    const reponse = window.prompt('Transférer à quel utilisateur ? (nom exact)');
    if (reponse && reponse.trim()) {
      const destinataire = contacts.find(c => c.username.toLowerCase() === reponse.trim().toLowerCase());
      if (destinataire) {
        try {
          await api.post('messagerie/', {
            destinataire: destinataire.id,
            contenu: `[Transféré] ${contenu}`,
          });
          alert(`Message transféré à ${destinataire.username}`);
          setMenuMessage(null);
        } catch (error) {
          alert("Erreur lors du transfert");
        }
      } else {
        alert(`Utilisateur "${reponse}" non trouvé`);
      }
    } else {
      setMenuMessage(null);
    }
  };

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, loadingMessages]);

  const fermerChatMobile = () => {
    setActif(null);
    setMessages([]);
    setNouveauMsg('');
    setErreur('');
    setMenuMessage(null);
  };

  const estMoi = (msg) => {
    return (
      msg.expediteur_nom === username ||
      msg.expediteur_username === username ||
      msg.sender_username === username
    );
  };

  const filteredContacts = contacts.filter(c =>
    c.username.toLowerCase().includes(recherche.toLowerCase())
  );

  const totalNonLus = Object.values(nonLusParContact).reduce((a, b) => a + b, 0);

  return (
    <div className={`msg-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />

      <div className={`msg-layout ${actif ? 'chat-open' : ''}`}>
        <aside className="msg-contacts">
          <div className="msg-panel-head">
            <div>
              <h2 className="msg-contacts-title">
                <MessageSquare size={20} />
                Messages
                {totalNonLus > 0 && (
                  <span className="msg-unread-badge">{totalNonLus}</span>
                )}
              </h2>
              <p className="msg-contacts-subtitle">Choisissez un contact</p>
            </div>
          </div>

          <div className="msg-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Rechercher un contact"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>

          {loadingContacts ? (
            <div className="msg-state">Chargement des contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="msg-no-contacts">
              <Users size={40} />
              <p>Aucun contact disponible</p>
              <small>Les autres citoyens inscrits apparaîtront ici.</small>
            </div>
          ) : (
            <div className="msg-contact-list">
              {filteredContacts.map((contact) => (
                <button
                  type="button"
                  key={contact.id}
                  className={`msg-contact ${actif?.id === contact.id ? 'active' : ''}`}
                  onClick={() => ouvrirChat(contact)}
                >
                  <span className="msg-avatar">
                    {(contact.username || '?').charAt(0).toUpperCase()}
                  </span>
                  <span className="msg-contact-info">
                    <span className="msg-contact-nom">
                      {contact.username}
                      {nonLusParContact[contact.id] > 0 && (
                        <span className="msg-non-lu-badge">
                          {nonLusParContact[contact.id]}
                        </span>
                      )}
                    </span>
                    <span className="msg-contact-ville">
                      {contact.localisation || 'Cameroun'}
                    </span>
                  </span>
                  {nonLusParContact[contact.id] > 0 && (
                    <span className="msg-non-lu-dot" />
                  )}
                </button>
              ))}
            </div>
          )}
        </aside>

        <main className="msg-chat">
          {!actif ? (
            <div className="msg-empty">
              <MessageSquare size={48} />
              <p>Sélectionnez un contact pour commencer</p>
              <small>Vos conversations s'afficheront ici.</small>
            </div>
          ) : (
            <>
              <div className="msg-chat-header">
                <button type="button" className="msg-back" onClick={fermerChatMobile} aria-label="Retour aux contacts">
                  <ArrowLeft size={20} />
                </button>
                <span className="msg-avatar">
                  {(actif.username || '?').charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="msg-chat-nom">{actif.username}</p>
                  <p className="msg-chat-status">{actif.localisation || 'Cameroun'}</p>
                </div>
              </div>

              {erreur && (
                <div className="msg-error">
                  <WifiOff size={16} />
                  {erreur}
                </div>
              )}

              <div className="msg-thread" ref={threadRef}>
                {loadingMessages ? (
                  <div className="msg-state">Chargement de la conversation...</div>
                ) : messages.length === 0 ? (
                  <div className="msg-no-messages">
                    <span className="msg-no-emoji">👋</span>
                    <p>Commencez la conversation avec {actif.username}</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const estEnvoye = estMoi(message);
                    return (
                      <div
                        key={message.id || `${message.date_envoi}-${index}`}
                        className={`msg-bubble ${estEnvoye ? 'moi' : 'autre'}`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (estEnvoye) {
                            setMenuMessage(menuMessage === message.id ? null : message.id);
                          }
                        }}
                      >
                        <p>{message.contenu}</p>
                        <div className="msg-footer">
                          <span className="msg-time">
                            {message.date_envoi && new Date(message.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {estEnvoye && (
                            <span className="msg-status">
                              {message.lu ? <CheckCircle size={12} /> : <Circle size={12} />}
                            </span>
                          )}
                        </div>

                        {menuMessage === message.id && estEnvoye && (
                          <div className="msg-context-menu">
                            <button onClick={() => copierMessage(message.contenu)}>
                              <Copy size={14} /> Copier
                            </button>
                            <button onClick={() => modifierMessage(message.id, message.contenu)}>
                              <Edit size={14} /> Modifier
                            </button>
                            <button onClick={() => transfererMessage(message.contenu)}>
                              <Share2 size={14} /> Transférer
                            </button>
                            <button onClick={() => supprimerMessage(message.id)}>
                              <Trash2 size={14} /> Supprimer
                            </button>
                            <button onClick={() => setMenuMessage(null)}>
                              <X size={14} /> Fermer
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <form className="msg-input-row" onSubmit={envoyer}>
                <input
                  type="text"
                  placeholder={`Message à ${actif.username}...`}
                  value={nouveauMsg}
                  onChange={(e) => setNouveauMsg(e.target.value)}
                />
                <button type="submit" disabled={!nouveauMsg.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default Messagerie;