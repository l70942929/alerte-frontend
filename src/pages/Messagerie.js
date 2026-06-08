import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import api from '../services/api';
import './Messagerie.css';

// ...existing code...
function Messagerie() {
  const [contacts, setContacts] = useState([]);
  const [actif, setActif] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMsg, setNouveauMsg] = useState('');
  const [recherche, setRecherche] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [erreur, setErreur] = useState('');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ...existing code...

 const ouvrirChat = async (contact) => {
    setActif(contact);
    setMessages([]);
    setNouveauMsg('');
    setLoadingMessages(true);
    setErreur('');
    try {
      const res = await api.get(
        `messagerie/conversation/?user_id=${contact.id}`
      );
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setErreur(`Impossible de charger la conversation.`);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ...existing code...
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
      setErreur(
        error.response?.data?.detail ||
        "Erreur lors de l'envoi du message."
      );
    }
  };

  const supprimerMessage = async (id) => {
  try {
    await api.delete(`messagerie/${id}/`);

    setMessages(
      messages.filter((msg) => msg.id !== id)
    );
  } catch (error) {
    alert("Impossible de supprimer le message");
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
  };

  const estMoi = (msg) => {
    return (
      msg.expediteur_nom === username ||
      msg.expediteur_username === username ||
      msg.sender_username === username
    );
  };

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
          ) : contacts.length === 0 ? (
            <div className="msg-no-contacts">
              <span className="material-symbols-outlined">group_off</span>
              <p>Aucun contact disponible</p>
              <small>Les autres citoyens inscrits apparaîtront ici.</small>
            </div>
          ) : (
            <div className="msg-contact-list">
              {contacts.map((contact) => (
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
                <button
                  type="button"
                  className="msg-back"
                  onClick={fermerChatMobile}
                  aria-label="Retour aux contacts"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <span className="msg-avatar">
                  {(actif.username || '?').charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="msg-chat-nom">{actif.username}</p>
                  <p className="msg-chat-status">
                    {actif.localisation || 'Cameroun'}
                  </p>
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
  >
    <p>{message.contenu}</p>

    {message.date_envoi && (
      <span className="msg-time">
        {new Date(message.date_envoi).toLocaleTimeString(
          'fr-FR',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        )}
      </span>
    )}

    {estMoi(message) && (
      <button
        onClick={() => supprimerMessage(message.id)}
        style={{
          marginLeft: '10px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer'
        }}
      >
        delete
      </button>
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