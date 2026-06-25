// Service de gestion des notifications

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