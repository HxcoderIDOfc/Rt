import './styles.css';

const appVersion = '0.1.0';
const userKey = 'axynera_dummy_user';
const dummyUser = {
  name: 'Iprime',
  email: 'iprime@axynera.my.id',
  avatar: 'AX'
};

const app = document.querySelector('#app');

function getUser() {
  const saved = localStorage.getItem(userKey);
  return saved ? JSON.parse(saved) : null;
}

function saveUser() {
  localStorage.setItem(userKey, JSON.stringify(dummyUser));
  render();
}

function logout() {
  localStorage.removeItem(userKey);
  render();
}

function renderLogin() {
  app.innerHTML = `
    <main class="screen auth-screen">
      <section class="brand-panel">
        <div class="status-pill">
          <span></span>
          Axynera v${appVersion}
        </div>
        <div class="brand-mark">AX</div>
        <h1>Axynera</h1>
        <p>Versi awal app Axynera: login dummy, dashboard mobile, dan siap dibungkus jadi APK lewat Capacitor.</p>
      </section>

      <section class="login-card">
        <div>
          <p class="eyebrow">Dummy login</p>
          <h2>Masuk dulu, langsung gas.</h2>
          <p class="muted">Tombol Google ini masih demo. Nanti bisa diganti OAuth asli dari backend Cloudflare Worker.</p>
        </div>

        <button class="google-button" id="googleLogin" type="button">
          <span class="google-dot">G</span>
          Masuk dengan Google
        </button>

        <div class="login-foot">
          <span>Build</span>
          <strong>Vite + Capacitor v0.1</strong>
        </div>
      </section>
    </main>
  `;

  document.querySelector('#googleLogin').addEventListener('click', saveUser);
}

function renderDashboard(user) {
  app.innerHTML = `
    <main class="screen dashboard-screen">
      <nav class="topbar">
        <div class="mini-brand">
          <span>AX</span>
          <strong>Axynera <small>v0.1</small></strong>
        </div>
        <button class="icon-button" id="logout" type="button">Keluar</button>
      </nav>

      <section class="hero-card">
        <div class="avatar">${user.avatar}</div>
        <div>
          <p class="eyebrow">Console aktif</p>
          <h1>Selamat datang, ${user.name}</h1>
          <p>${user.email} - Axynera v${appVersion}</p>
        </div>
      </section>

      <section class="release-strip">
        <span>Release 0.1</span>
        <strong>Login dummy sudah aktif</strong>
      </section>

      <section class="quick-grid">
        <article>
          <span>Cloud</span>
          <strong>15 GB</strong>
          <p>Storage user siap dihubungkan.</p>
        </article>
        <article>
          <span>AI</span>
          <strong>Online</strong>
          <p>Route ke Worker API nanti.</p>
        </article>
        <article>
          <span>APK</span>
          <strong>Manual</strong>
          <p>Build APK hanya lewat Run workflow.</p>
        </article>
      </section>

      <section class="action-panel">
        <h2>Axynera v0.1</h2>
        <p>Base app sudah siap: login dummy, session lokal, dashboard, bottom nav, dan pipeline APK manual.</p>
        <button class="primary-button" type="button">Buka Dashboard</button>
      </section>

      <footer class="bottom-nav">
        <button class="active" type="button">Home</button>
        <button type="button">Cloud</button>
        <button type="button">Chat AI</button>
        <button type="button">Profile</button>
      </footer>
    </main>
  `;

  document.querySelector('#logout').addEventListener('click', logout);
}

function render() {
  const user = getUser();
  if (user) {
    renderDashboard(user);
    return;
  }

  renderLogin();
}

render();
