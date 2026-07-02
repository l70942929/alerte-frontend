// Service de gestion des notifications
import api from './api';

// ==========================================
// NOTIFICATIONS LOCALES (localStorage)
// ==========================================

// Récupérer toutes les notifications de l'utilisateur connecté
export const getNotifications = () => {
  const username = localStorage.getItem('username');
  if (!username) return [];
  
  const stored = localStorage.getItem(`notifications_${username}`);
  return stored ? JSON.parse(stored) : [];
};

// Sauvegarder les notifications
const saveNotifications = (notifications) => {
  const username = localStorage.getItem('username');
  if (!username) return;
  localStorage.setItem(`notifications_${username}`, JSON.stringify(notifications));
};

// Ajouter une notification pour un utilisateur spécifique
export const addNotificationForUser = (username, title, message, type = 'info', alerteId = null) => {
  const key = `notifications_${username}`;
  const stored = localStorage.getItem(key);
  const notifications = stored ? JSON.parse(stored) : [];
  
  const newNotification = {
    id: Date.now(),
    title,
    message,
    type,
    alerteId,
    date: new Date().toISOString(),
    lu: false
  };
  notifications.unshift(newNotification);
  localStorage.setItem(key, JSON.stringify(notifications));
  
  // Si l'utilisateur est connecté, déclencher un événement
  const currentUser = localStorage.getItem('username');
  if (currentUser === username) {
    window.dispatchEvent(new CustomEvent('newNotification', { detail: newNotification }));
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
};

// Ajouter une notification pour l'utilisateur actuel
export const addNotification = (title, message, type = 'info', alerteId = null) => {
  const currentUser = localStorage.getItem('username');
  if (currentUser) {
    addNotificationForUser(currentUser, title, message, type, alerteId);
  }
};

// Marquer une notification comme lue
export const markAsRead = (notificationId) => {
  const notifications = getNotifications();
  const updated = notifications.map(notif => 
    notif.id === notificationId ? { ...notif, lu: true } : notif
  );
  saveNotifications(updated);
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// Marquer toutes comme lues
export const markAllAsRead = () => {
  const notifications = getNotifications();
  const updated = notifications.map(notif => ({ ...notif, lu: true }));
  saveNotifications(updated);
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// Supprimer une notification
export const deleteNotification = (notificationId) => {
  const notifications = getNotifications();
  const filtered = notifications.filter(notif => notif.id !== notificationId);
  saveNotifications(filtered);
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// Vider toutes les notifications
export const clearAllNotifications = () => {
  saveNotifications([]);
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

// Compter les non lues
export const getUnreadCount = () => {
  const notifications = getNotifications();
  return notifications.filter(notif => !notif.lu).length;
};

// ==========================================
// GESTION DES ÉCOUTEURS D'ÉVÉNEMENTS
// ==========================================

// Ajouter un écouteur pour les nouvelles notifications
export const addListener = (callback) => {
  // Écouter l'événement newNotification
  const handler = (event) => {
    if (callback) {
      callback(event.detail);
    }
  };
  
  window.addEventListener('newNotification', handler);
  
  // Retourner une fonction pour supprimer l'écouteur
  return () => {
    window.removeEventListener('newNotification', handler);
  };
};

// Ajouter un écouteur pour les mises à jour des notifications
export const addUpdateListener = (callback) => {
  const handler = () => {
    if (callback) {
      callback();
    }
  };
  
  window.addEventListener('notificationsUpdated', handler);
  
  return () => {
    window.removeEventListener('notificationsUpdated', handler);
  };
};

// ==========================================
// NOTIFICATIONS DE MESSAGES (BACKEND)
// ==========================================

// Récupérer les notifications de messages depuis le backend
export const fetchMessageNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return [];
    
    const res = await api.get('/messagerie/notifications/', {
      headers: { Authorization: `Token ${token}` }
    });
    
    if (!res.data || !Array.isArray(res.data)) return [];
    
    const messageNotifs = res.data.map(msg => ({
      id: `msg_${msg.id}`,
      title: `📩 Nouveau message de ${msg.expediteur || 'Inconnu'}`,
      message: msg.contenu || 'Nouveau message',
      type: 'success',
      alerteId: null,
      date: msg.date || new Date().toISOString(),
      lu: msg.lu || false,
      messageId: msg.id,
      conversationId: msg.conversation_id
    }));
    
    return messageNotifs;
  } catch (error) {
    console.error('Erreur chargement notifications messages:', error);
    return [];
  }
};

// Marquer une notification de message comme lue
export const markMessageNotificationAsRead = async (messageId) => {
  try {
    const token = localStorage.getItem('token');
    await api.post(`/messagerie/notifications/marquer-lu/${messageId}/`, {}, {
      headers: { Authorization: `Token ${token}` }
    });
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};

// Ajouter une notification pour un nouveau message
export const addMessageNotification = (username, expediteur, contenu) => {
  const key = `notifications_${username}`;
  const stored = localStorage.getItem(key);
  const notifications = stored ? JSON.parse(stored) : [];
  
  const newNotification = {
    id: `msg_${Date.now()}`,
    title: `📩 Nouveau message de ${expediteur}`,
    message: contenu.length > 100 ? contenu.substring(0, 100) + '...' : contenu,
    type: 'success',
    alerteId: null,
    date: new Date().toISOString(),
    lu: false,
    messageId: Date.now(),
    conversationId: null
  };
  
  notifications.unshift(newNotification);
  localStorage.setItem(key, JSON.stringify(notifications));
  
  const currentUser = localStorage.getItem('username');
  if (currentUser === username) {
    window.dispatchEvent(new CustomEvent('newNotification', { detail: newNotification }));
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
};

// ==========================================
// NOTIFICATIONS BACKEND (BDD)
// ==========================================

// Récupérer les notifications depuis le backend (BDD)
export const fetchBackendNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return [];
    
    const res = await api.get('/auth/notifications/', {
      headers: { Authorization: `Token ${token}` }
    });
    
    return res.data || [];
  } catch (error) {
    console.error('Erreur chargement notifications backend:', error);
    return [];
  }
};

// Marquer une notification comme lue (backend)
export const markBackendNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    await api.post(`/auth/notifications/marquer-lue/${notificationId}/`, {}, {
      headers: { Authorization: `Token ${token}` }
    });
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};

// ==========================================
// POLLING
// ==========================================

let pollingInterval = null;

export const startPolling = (onNewMessage) => {
  if (pollingInterval) clearInterval(pollingInterval);
  
  checkMessages(onNewMessage);
  
  pollingInterval = setInterval(() => {
    checkMessages(onNewMessage);
  }, 30000);
};

export const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const checkMessages = async (onNewMessage) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const messages = await fetchMessageNotifications();
    if (!messages || messages.length === 0) return;
    
    const unreadMessages = messages.filter(m => !m.lu);
    
    if (unreadMessages.length > 0 && onNewMessage) {
      onNewMessage(unreadMessages);
    }
  } catch (error) {
    console.error('Erreur polling messages:', error);
  }
};