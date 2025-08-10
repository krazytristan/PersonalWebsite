// Init AOS
AOS.init();

// Theme Toggle
function toggleDarkMode() {
  const html = document.documentElement;
  const icon = document.getElementById('theme-icon');
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  icon.textContent = isDark ? '🌙' : '🌞';
  icon.classList.add('rotate');
  setTimeout(() => icon.classList.remove('rotate'), 400);
}
document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);

// Splash Modal
function closeSplashModal() {
  document.getElementById('splash-modal').classList.add('hidden');
  localStorage.setItem('visited', 'true');
}
window.closeSplashModal = closeSplashModal; // so the button onclick works

// Audio Toggle
function toggleAudio() {
  const audio = document.getElementById('bg-audio');
  audio.paused ? audio.play() : audio.pause();
}
document.getElementById('audio-toggle').addEventListener('click', toggleAudio);

// Section Navigation (planets and nav)
function showSection(id) {
  document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  history.replaceState(null, null, '#' + id);
}
window.showSection = showSection; // to allow inline onclick attributes if needed

// Navigation buttons
document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', e => {
    const section = btn.getAttribute('data-section');
    showSection(section);
  });
});

// Planets (orbit links)
document.querySelectorAll('.planet').forEach(planet => {
  planet.addEventListener('click', () => {
    const section = planet.getAttribute('data-section');
    showSection(section);
  });
});

// Home section CTA buttons (View Projects, My Skills, Contact Me)
document.querySelectorAll('#home [data-section]').forEach(btn => {
  btn.addEventListener('click', e => {
    const section = btn.getAttribute('data-section');
    showSection(section);
  });
});

// On load
window.addEventListener('DOMContentLoaded', () => {
  const visited = localStorage.getItem('visited');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const icon = document.getElementById('theme-icon');

  if (!visited) document.getElementById('splash-modal').classList.remove('hidden');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    icon.textContent = '🌙';
  } else {
    icon.textContent = '🌞';
  }

  // Default or hash
  const hash = location.hash.replace('#', '') || 'home';
  showSection(hash);
});
