import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import api from '../services/api';
import './Messagerie.css';

function Messagerie() {
  const [contacts, setContacts] = useState([]);
  const [actif, setActif] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMsg, setNouveauMsg] = useState('');
  const [recherche, setRecherche] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [erreur, setErreur] = useState('');
  const [menuMessage, setMenuMessage] = useState(null); // Pour le menu contextuel
  const threadRef = useRef(null);
  const username = localStorage.getItem('username');

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

  // Copier le message
  const copierMessage = (contenu) => {
    navigator.clipboard.writeText(contenu);
    setMenuMessage(null);
    alert('Message copié !');
  };

  // Supprimer le message
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

  // Modifier le message (éditer)
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

  // Transférer le message (ouvrir liste des contacts)
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

  return (
    <div className="msg-page">
      <Header />

      <div className={`msg-layout ${actif ? 'chat-open' : ''}`}>
        <aside className="msg-contacts">
          <div className="msg-panel-head">
            <div>
              <h2 className="msg-contacts-title">Messages</h2>
              <p className="msg-contacts-subtitle">Choisissez un contact</p>
            </div>
            <span className="material-symbols-outlined">forum</span>
          </div>

          <div className="msg-search">
            <span className="material-symbols-outlined">search</span>
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
              <span className="material-symbols-outlined">group_off</span>
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
                    <span className="msg-contact-nom">{contact.username}</span>
                    <span className="msg-contact-ville">
                      {contact.localisation || 'Cameroun'}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <main className="msg-chat">
          {!actif ? (
            <div className="msg-empty">
              <span className="material-symbols-outlined">mark_unread_chat_alt</span>
              <p>Sélectionnez un contact pour commencer</p>
              <small>Vos conversations s'afficheront ici.</small>
            </div>
          ) : (
            <>
              <div className="msg-chat-header">
                <button type="button" className="msg-back" onClick={fermerChatMobile} aria-label="Retour aux contacts">
                  <span className="material-symbols-outlined">arrow_back</span>
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
                  <span className="material-symbols-outlined">error</span>
                  {erreur}
                </div>
              )}

              <div className="msg-thread" ref={threadRef}>
                {loadingMessages ? (
                  <div className="msg-state">Chargement de la conversation...</div>
                ) : messages.length === 0 ? (
                  <div className="msg-no-messages">
                    <span className="material-symbols-outlined">waving_hand</span>
                    <p>Commencez la conversation avec {actif.username}</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id || `${message.date_envoi}-${index}`}
                      className={`msg-bubble ${estMoi(message) ? 'moi' : 'autre'}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (estMoi(message)) {
                          setMenuMessage(menuMessage === message.id ? null : message.id);
                        }
                      }}
                    >
                      <p>{message.contenu}</p>
                      {message.date_envoi && (
                        <span className="msg-time">
                          {new Date(message.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}

                      {/* Menu contextuel (clic droit) */}
                      {menuMessage === message.id && estMoi(message) && (
                        <div className="msg-context-menu">
                          <button onClick={() => copierMessage(message.contenu)}>Copier</button><br></br>
                          <button onClick={() => modifierMessage(message.id, message.contenu)}>Modifier</button><br></br>
                          <button onClick={() => transfererMessage(message.contenu)}>Transférer</button><br></br>
                          <button onClick={() => supprimerMessage(message.id)}>Supprimer</button>
                        </div>
                      )}
                    </div>
                  ))
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
                  <span className="material-symbols-outlined">send</span>
                  Envoyer
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