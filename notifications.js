// ---------- Local notifications ----------
// Sandglass has no backend, so this uses the browser Notification API
// (fired through the service worker registration) rather than true
// server-sent push. It alerts you when a session ends even if this
// tab is backgrounded or minimized, as long as the browser is running.

const NOTIFY_STORAGE_KEY = 'sandglass-notify-enabled';
const notifyBtn = document.getElementById('notify-btn');

const notifySupported = 'Notification' in window;

function notifyPreferenceOn() {
  return localStorage.getItem(NOTIFY_STORAGE_KEY) === '1';
}

function setNotifyPreference(on) {
  localStorage.setItem(NOTIFY_STORAGE_KEY, on ? '1' : '0');
  updateNotifyBtn();
}

function updateNotifyBtn() {
  if (!notifySupported) {
    notifyBtn.style.display = 'none';
    return;
  }
  const on = notifyPreferenceOn() && Notification.permission === 'granted';
  notifyBtn.classList.toggle('active', on);
  notifyBtn.setAttribute('aria-pressed', String(on));
  notifyBtn.title = on
    ? 'Notifications on — click to turn off'
    : 'Get notified when a session ends';
}

async function enableNotifications() {
  if (!notifySupported) return;

  if (Notification.permission === 'denied') {
    showToast("Notifications are blocked — enable them in your browser's site settings.");
    return;
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission === 'granted') {
    setNotifyPreference(true);
    showToast('Notifications on — you\u2019ll be alerted when a session ends.');
  } else {
    showToast('Notifications need permission to work.');
  }
}

function disableNotifications() {
  setNotifyPreference(false);
  showToast('Notifications turned off.');
}

notifyBtn?.addEventListener('click', () => {
  const currentlyOn = notifyPreferenceOn() && Notification.permission === 'granted';
  if (currentlyOn) {
    disableNotifications();
  } else {
    enableNotifications();
  }
});

// Called by timer.js whenever a session finishes.
async function notifySessionEnd(title, body) {
  if (!notifySupported) return;
  if (!(notifyPreferenceOn() && Notification.permission === 'granted')) return;

  const options = {
    body,
    icon: 'icon.svg',
    badge: 'icon.svg',
    tag: 'sandglass-session',
    renotify: true,
  };

  try {
    // Prefer showing via the service worker so the notification can still
    // appear if this tab is backgrounded (works while the browser is open).
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, options);
      return;
    }
    new Notification(title, options);
  } catch (e) {
    // Notifications aren't critical to the app working; fail quietly.
  }
}

updateNotifyBtn();
