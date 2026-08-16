import './styles.css';

const appVersion = '0.2.0-demo';
const sessionKey = 'axynera_chat_demo_user';

const demoUser = {
  name: 'Iprime',
  email: 'demo@axynera.my.id',
  avatar: 'IP',
  status: 'Online'
};

const channels = [
  { id: 'home', label: 'Home', tag: 'Axynera HQ', unread: 0 },
  { id: 'general', label: 'General', tag: 'Public chat', unread: 4 },
  { id: 'dev', label: 'Developer', tag: 'Worker & APK', unread: 2 },
  { id: 'ai', label: 'Axynera AI', tag: 'CF Worker soon', unread: 0 }
];

const dmList = [
  { name: 'Nera Bot', status: 'AI standby', avatar: 'NB' },
  { name: 'Cloud Team', status: 'Storage ready', avatar: 'CT' },
  { name: 'Build Log', status: 'APK success', avatar: 'BL' }
];

const messages = [
  { from: 'Nera Bot', avatar: 'NB', text: 'Axynera chat demo aktif. Login email/password masih lokal dulu.' },
  { from: 'Iprime', avatar: 'IP', own: true, text: 'Mantap. Nanti backend login sama chat realtime pakai CF Worker.' },
  { from: 'Cloud Team', avatar: 'CT', text: 'Endpoint siap disambungkan: /auth/login, /rooms, /messages, /ai/chat.' }
];

const app = document.querySelector('#app');

function getUser() {
  const saved = localStorage.getItem(sessionKey);
  return saved ? JSON.parse(saved) : null;
}

function saveUser(form) {
  const email = form.get('email') || demoUser.email;
  const name = String(email).split('@')[0] || demoUser.name;
  localStorage.setItem(sessionKey, JSON.stringify({
    ...demoUser,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email
  }));
  render();
}

function logout() {
  localStorage.removeItem(sessionKey);
  render();
}

function renderLogin() {
  app.innerHTML = `
    <main class="auth-layout">
      <section class="auth-hero">
        <div class="brand-row">
          <div class="brand-mark">AX</div>
          <div>
            <strong>Axynera</strong>
            <span>Chat demo v${appVersion}</span>
          </div>
        </div>
        <h1>Chat app rasa Discord + WA.</h1>
        <p>Login demo dulu, backend-nya nanti dari Cloudflare Worker. AI tinggal masuk ke channel Axynera AI.</p>
        <div class="hero-preview">
          <div class="preview-bubble left">General sudah siap.</div>
          <div class="preview-bubble right">AI nanti di sini.</div>
          <div class="preview-bubble left">Realtime pakai Worker.</div>
        </div>
      </section>

      <section class="auth-card">
        <p class="eyebrow">Demo login</p>
        <h2>Masuk ke Axynera</h2>
        <p class="muted">Pakai email/password apa saja untuk demo. Data disimpan lokal dulu.</p>

        <form id="loginForm" class="login-form">
          <label>
            Email
            <input name="email" type="email" value="demo@axynera.my.id" autocomplete="email" />
          </label>
          <label>
            Password
            <input name="password" type="password" value="axynera123" autocomplete="current-password" />
          </label>
          <button class="primary-button" type="submit">Masuk Demo</button>
        </form>

        <div class="backend-note">
          <span>Backend target</span>
          <strong>https://api.axynera.my.id</strong>
        </div>
      </section>
    </main>
  `;

  document.querySelector('#loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    saveUser(new FormData(event.currentTarget));
  });
}

function renderServerRail() {
  return `
    <aside class="server-rail">
      <button class="server-dot active">AX</button>
      <button class="server-dot">AI</button>
      <button class="server-dot">CL</button>
      <button class="server-add">+</button>
    </aside>
  `;
}

function renderSidebar(user) {
  return `
    <aside class="chat-sidebar">
      <div class="sidebar-head">
        <div>
          <strong>Axynera Space</strong>
          <span>Demo server</span>
        </div>
        <button class="tiny-button">+</button>
      </div>

      <div class="section-title">Channels</div>
      <div class="channel-list">
        ${channels.map((channel) => `
          <button class="channel ${channel.id === 'general' ? 'active' : ''}" data-channel="${channel.id}">
            <span># ${channel.label}</span>
            ${channel.unread ? `<b>${channel.unread}</b>` : ''}
            <small>${channel.tag}</small>
          </button>
        `).join('')}
      </div>

      <div class="section-title">Direct Message</div>
      <div class="dm-list">
        ${dmList.map((dm) => `
          <button class="dm-item">
            <span class="mini-avatar">${dm.avatar}</span>
            <span>
              <strong>${dm.name}</strong>
              <small>${dm.status}</small>
            </span>
          </button>
        `).join('')}
      </div>

      <div class="user-bar">
        <span class="mini-avatar">${user.avatar}</span>
        <span>
          <strong>${user.name}</strong>
          <small>${user.status}</small>
        </span>
        <button id="logout" class="tiny-button">Keluar</button>
      </div>
    </aside>
  `;
}

function renderMessages() {
  return messages.map((message) => `
    <article class="message ${message.own ? 'own' : ''}">
      <span class="mini-avatar">${message.avatar}</span>
      <div>
        <strong>${message.from}</strong>
        <p>${message.text}</p>
      </div>
    </article>
  `).join('');
}

function renderChat(user) {
  app.innerHTML = `
    <main class="chat-app">
      ${renderServerRail()}
      ${renderSidebar(user)}

      <section class="chat-panel">
        <header class="chat-topbar">
          <button id="menuToggle" class="mobile-menu">☰</button>
          <div>
            <p class="eyebrow"># General</p>
            <h1>Axynera Chat</h1>
          </div>
          <div class="top-actions">
            <span class="status-pill"><i></i> Online</span>
            <button class="tiny-button">Cari</button>
          </div>
        </header>

        <div class="info-strip">
          <span>CF Worker backend demo</span>
          <strong>/auth/login /messages /ai/chat</strong>
        </div>

        <div class="message-list" id="messageList">
          ${renderMessages()}
        </div>

        <form id="messageForm" class="composer">
          <button type="button">+</button>
          <input name="message" placeholder="Ketik pesan demo..." autocomplete="off" />
          <button type="submit">Kirim</button>
        </form>
      </section>

      <aside class="right-panel">
        <section class="ai-card">
          <p class="eyebrow">Axynera AI</p>
          <h2>AI slot siap</h2>
          <p>Nanti tombol ini diarahkan ke Cloudflare Worker AI endpoint.</p>
          <button class="primary-button" type="button">Buka AI</button>
        </section>

        <section class="member-card">
          <h3>Online</h3>
          ${dmList.map((dm) => `
            <div class="member-row">
              <span class="mini-avatar">${dm.avatar}</span>
              <div>
                <strong>${dm.name}</strong>
                <small>${dm.status}</small>
              </div>
            </div>
          `).join('')}
        </section>
      </aside>
    </main>
  `;

  document.querySelector('#logout').addEventListener('click', logout);
  document.querySelector('#messageForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.currentTarget.elements.message;
    const text = input.value.trim();
    if (!text) return;
    messages.push({ from: user.name, avatar: user.avatar, own: true, text });
    input.value = '';
    renderChat(user);
  });
  document.querySelector('#menuToggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });
}

function render() {
  const user = getUser();
  if (!user) {
    renderLogin();
    return;
  }
  renderChat(user);
}

render();
