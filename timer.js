  // ---------- Timer logic ----------
  const WORK_SECONDS = 25 * 60;
  const REST_SECONDS = 5 * 60;
  const CIRCUMFERENCE = 2 * Math.PI * 90;

  const timeDisplay = document.getElementById('time-display');
  const dialProgress = document.getElementById('dial-progress');
  const primaryBtn = document.getElementById('primary-btn');
  const resetBtn = document.getElementById('reset-btn');
  const statusLabel = document.getElementById('status-label');
  const modeWorkBtn = document.getElementById('mode-work');
  const modeRestBtn = document.getElementById('mode-rest');
  const sessionCount = document.getElementById('session-count');
  const toast = document.getElementById('toast');

  dialProgress.style.strokeDasharray = CIRCUMFERENCE;

  let mode = 'work';
  let secondsLeft = WORK_SECONDS;
  let totalSeconds = WORK_SECONDS;
  let running = false;
  let tickHandle = null;
  let completedSessions = 0;

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function render() {
    timeDisplay.textContent = formatTime(secondsLeft);
    const fraction = secondsLeft / totalSeconds;
    dialProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);
    dialProgress.classList.toggle('rest', mode === 'rest');
    primaryBtn.textContent = running ? 'Pause' : (secondsLeft === totalSeconds ? 'Start' : 'Resume');
    statusLabel.textContent = running
      ? (mode === 'work' ? 'Focusing' : 'Resting')
      : (secondsLeft === totalSeconds ? 'Ready when you are' : 'Paused');
  }

  function setMode(next, opts = {}) {
    mode = next;
    modeWorkBtn.classList.toggle('active', mode === 'work');
    modeRestBtn.classList.toggle('active', mode === 'rest');
    modeWorkBtn.setAttribute('aria-selected', mode === 'work');
    modeRestBtn.setAttribute('aria-selected', mode === 'rest');
    if (!opts.keepTime) {
      totalSeconds = mode === 'work' ? WORK_SECONDS : REST_SECONDS;
      secondsLeft = totalSeconds;
    }
    stopTick();
    running = false;
    render();
  }

  function stopTick() {
    if (tickHandle) {
      clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  function tick() {
    secondsLeft -= 1;
    if (secondsLeft <= 0) {
      secondsLeft = 0;
      render();
      finishSession();
      return;
    }
    render();
  }

  function finishSession() {
    stopTick();
    running = false;
    if (mode === 'work') {
      completedSessions = Math.min(completedSessions + 1, 4);
      updateSessionDots();
      showToast('Focus session complete — take a rest.');
      notifySessionEnd('Focus session complete', 'Take a rest - you have earned it');
      setMode('rest');
    } else {
      showToast('Rest complete — ready for another round.');
      notifySessionEnd('Rest complete', 'Ready for another round?');
      setMode('work');
    }
  }

  function updateSessionDots() {
    const dots = sessionCount.querySelectorAll('.dot');
    dots.forEach((dot, i) => dot.classList.toggle('done', i < completedSessions));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  primaryBtn.addEventListener('click', () => {
    running = !running;
    if (running) {
      tickHandle = setInterval(tick, 1000);
    } else {
      stopTick();
    }
    render();
  });

  resetBtn.addEventListener('click', () => {
    stopTick();
    running = false;
    secondsLeft = totalSeconds;
    render();
  });

  modeWorkBtn.addEventListener('click', () => setMode('work'));
  modeRestBtn.addEventListener('click', () => setMode('rest'));

  render();