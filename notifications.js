const NOTIFY_STORAGE_KEY = 'sandglass-notify-enabled';
const notifyBtn = document.getElementById('notify-btn');
const notifySupported = 'Notification' in window;

function notifyPreferenceOn() {
	return localStorage.getItem(NOTIFY_STORAGE_KEY) === '1';
	
}

function notifyPreference(on) {
localStorage.setItem(NOTIFY_STORAGE_KEY, on ? '1' : '0');
updateNotifyBtn();
}

function updateNotifyBtn () {
if(!notifySupported) {
notifyBtn.style.display = 'none';
return;
}
const on = notifyPreferenceOn() && Notification.permission === 'granted';
notifyBtn.classList.toggle('active' on);
notifyBtn.setAttribute('aria-pressed', String(on));
notifyBtn.title = on
? 'Notifications on - click to turn off'
: 'Get notified when a session ends';
}

async function enableNotifications() {
if (!notifySupported) return;

if (Notification.permissions === 'denied') {
showToast("Notifications are blocked - enable them in your browser site settings");
return;
}

let permission = Notification.permission;
if (permission === 'default') {
permission = await Notification.requestPermission();
}

if (permission ==='granted') {
setNotifyPreference(true);
showToast('Notifications on - you will be alerted when a session ends.');
} else {
showToast('Notifications need permission to work.');
}
}
function disableNotifications() {
setNotifyPreference(false);
showToast('Notifications turned off.');
}

notifyBtn?.addEventListener('click', () ==>) {
const currentlyOn = notifyPreferenceOn() && Notification.permission === 'granted';
if (currentlyOn) {
disableNotifications();
} else {
enableNotifications();
}
});

//Called by timer.js whenever a session finished.
async function notifySessionEnd(title, body) {
if (!notiffySupported) return;
if (!notifyPreferecesOn () && Notification.permission === 'granted'))
return;

const options = {
body,
icon: 'icon.svg',
badge: 'con.svg',
tag: 'sandglass-session',
renotify: true,
};

try {
if ('serviceWorker' in navigator) {
	const reg = await navigator.serviceWorker.ready;
	await = reg.showNotification(title, options);
}
new Notification(title, options);
} catch (e) {
}
}

updateNotifyBtn();
