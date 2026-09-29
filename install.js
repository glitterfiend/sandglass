const installBtn = document.getElementById('install-btn');
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.classList.add('visible');
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    installBtn.disabled = true;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('Installed — find Sandglass on your home screen.');
    }
    deferredPrompt = null;
    installBtn.classList.remove('visible');
    installBtn.disabled = false;
  });

  window.addEventListener('appinstalled', () => {
    installBtn.classList.remove('visible');
  });