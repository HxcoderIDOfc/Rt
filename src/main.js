import './styles.css';

const appVersion = '0.3.0-demo';
const langKey = 'axynera_v03_language';
const sessionKey = 'axynera_v03_session';
const profileKey = 'axynera_v03_profile';

const app = document.querySelector('#app');

const languages = [
  { code: 'id', name: 'Indonesia', hello: 'Halo' },
  { code: 'en', name: 'English', hello: 'Hello' },
  { code: 'ms', name: 'Melayu', hello: 'Hai' },
  { code: 'ja', name: 'Japanese', hello: 'Konnichiwa' },
  { code: 'ko', name: 'Korean', hello: 'Annyeong' },
  { code: 'ar', name: 'Arabic', hello: 'Marhaban' },
  { code: 'hi', name: 'Hindi', hello: 'Namaste' },
  { code: 'es', name: 'Spanish', hello: 'Hola' },
  { code: 'fr', name: 'French', hello: 'Bonjour' },
  { code: 'pt', name: 'Portuguese', hello: 'Ola' }
];

const permissionList = ['Internet', 'Storage', 'Camera', 'Microphone', 'Location', 'Contacts', 'SMS', 'Notifications'];
const tabs = [
  { id: 'chat', label: 'Chat', icon: 'C' },
  { id: 'groups', label: 'Grup', icon: 'G' },
  { id: 'status', label: 'Status', icon: 'S' },
  { id: 'server', label: 'Server', icon: 'V' },
  { id: 'calls', label: 'Panggilan', icon: 'P' }
];

const chatItems = [
  { name: 'Nera Bot', message: 'AI nanti disambungkan ke Worker.', time: '22:14', badge: 2, avatar: 'NB' },
  { name: 'Build APK', message: 'v0.3 demo siap dibuild manual.', time: '21:58', badge: 1, avatar: 'BA' },
  { name: 'Cloud Team', message: 'Auth nomor HP demo dulu.', time: '20:35', badge: 0, avatar: 'CT' }
];
const groupItems = [
  { name: 'Axynera Dev', message: 'Diskusi Worker, APK, dan UI.', avatar: 'AD' },
  { name: 'Server Crew', message: 'Channel server siap diisi.', avatar: 'SC' },
  { name: 'Design Lab', message: 'Tema app mobile messenger.', avatar: 'DL' }
];
const statusItems = [
  { name: 'Iprime', note: 'Axynera v0.3 demo online', avatar: 'IP' },
  { name: 'Nera Bot', note: 'Menunggu endpoint AI', avatar: 'NB' }
];
const serverItems = [
  { name: 'Axynera HQ', note: 'Server utama', avatar: 'AX' },
  { name: 'AI Lab', note: 'Channel AI dan eksperimen', avatar: 'AI' }
];
const callItems = [
  { name: 'Cloud Team', note: 'Demo panggilan suara', avatar: 'CT' },
  { name: 'Build APK', note: 'Demo panggilan video', avatar: 'BA' }
];

let activeTab = 'chat';

function safeJson(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function getLanguage() {
  return safeJson(localStorage.getItem(langKey));
}

function getSession() {
  return safeJson(localStorage.getItem(sessionKey));
}

function getProfile() {
  return safeJson(localStorage.getItem(profileKey));
}

function initials(name) {
  return String(name || 'Axynera')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function avatarMarkup(profile, fallback = 'AX') {
  if (profile?.photo) {
    return `<span class="avatar image"><img src="${profile.photo}" alt="${profile.name || 'Profile'}" /></span>`;
  }
  return `<span class="avatar">${profile?.avatar || fallback}</span>`;
}

function route() {
  const language = getLanguage();
  const session = getSession();
  const profile = getProfile();

  if (!language) {
    renderSplash(() => renderLanguage());
    return;
  }
  if (!session) {
    renderSplash(() => renderPhoneLogin(language));
    return;
  }
  if (!profile) {
    renderProfileSetup(language, session);
    return;
  }
  renderDashboard(language, session, profile);
}

function renderSplash(next) {
  app.innerHTML = `
    <main class="splash-screen">
      <div class="splash-orbit"></div>
      <section class="splash-card">
        <div class="brand-mark">AX</div>
        <h1>Axynera</h1>
        <p>Private messenger demo v${appVersion}</p>
        <div class="loading-bar"><span></span></div>
      </section>
    </main>
  `;
  window.setTimeout(next, 950);
}

function renderLanguage() {
  const browserCode = (navigator.language || 'id').slice(0, 2);
  const suggested = languages.find((lang) => lang.code === browserCode) || languages[0];

  app.innerHTML = `
    <main class="onboarding-page">
      <section class="phone-preview">
        <div class="preview-top"><span class="brand-mark small">AX</span><span>Axynera</span></div>
        <h1>Pilih bahasa</h1>
        <p>Dipakai sekali untuk setup awal. Nanti bisa diubah lagi dari Settings.</p>
        <div class="language-pill">${suggested.hello}, ${suggested.name}</div>
      </section>
      <section class="setup-card">
        <p class="eyebrow">Step 1</p>
        <h2>Bahasa aplikasi</h2>
        <div class="language-grid">
          ${languages.map((lang) => `
            <button class="language-option ${lang.code === suggested.code ? 'active' : ''}" data-code="${lang.code}">
              <strong>${lang.name}</strong><span>${lang.hello}</span>
            </button>
          `).join('')}
        </div>
        <button id="saveLanguage" class="primary-button">Lanjut</button>
      </section>
    </main>
  `;

  let selected = suggested;
  document.querySelectorAll('.language-option').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.language-option').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      selected = languages.find((lang) => lang.code === button.dataset.code) || languages[0];
    });
  });
  document.querySelector('#saveLanguage').addEventListener('click', () => {
    localStorage.setItem(langKey, JSON.stringify(selected));
    renderPhoneLogin(selected);
  });
}

function renderPhoneLogin(language) {
  app.innerHTML = `
    <main class="onboarding-page">
      <section class="phone-preview login-visual">
        <div class="preview-top"><span class="brand-mark small">AX</span><span>Axynera</span></div>
        <h1>Masuk pakai nomor HP</h1>
        <p>Kode OTP masih demo. Nomor apa saja langsung masuk ke tahap profile.</p>
        <div class="mock-chat"><span>+62 812 0000 0000</span><strong>Kode demo: 123456</strong></div>
      </section>
      <section class="setup-card">
        <p class="eyebrow">Step 2</p>
        <h2>Verifikasi nomor</h2>
        <form id="phoneForm" class="stack-form">
          <label>Negara
            <select name="country">
              <option value="+62">Indonesia (+62)</option>
              <option value="+60">Malaysia (+60)</option>
              <option value="+1">US/Canada (+1)</option>
              <option value="+81">Japan (+81)</option>
            </select>
          </label>
          <label>Nomor HP<input name="phone" inputmode="tel" value="81200000000" autocomplete="tel" /></label>
          <label>Kode demo<input name="otp" inputmode="numeric" value="123456" maxlength="6" /></label>
          <button class="primary-button" type="submit">Masuk Demo</button>
        </form>
        <p class="fine-print">${language.hello}. Login ini belum kirim SMS beneran.</p>
      </section>
    </main>
  `;

  document.querySelector('#phoneForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const session = {
      phone: `${form.get('country')}${form.get('phone')}`,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(sessionKey, JSON.stringify(session));
    renderProfileSetup(language, session);
  });
}

function renderProfileSetup(language, session) {
  app.innerHTML = `
    <main class="onboarding-page">
      <section class="phone-preview profile-visual">
        <div class="profile-avatar-live" id="profileAvatarLive">IP</div>
        <h1>Buat profile dulu</h1>
        <p>Untuk akun baru: foto, nama, dan username disiapkan sebelum masuk dashboard.</p>
        <div class="permission-cloud">${permissionList.map((item) => `<span>${item}</span>`).join('')}</div>
      </section>
      <section class="setup-card">
        <p class="eyebrow">Step 3</p>
        <h2>Edit profile</h2>
        <form id="profileForm" class="stack-form">
          <label class="upload-box"><input id="photoInput" name="photo" type="file" accept="image/*" /><span>Upload foto demo</span><small>Preview lokal, belum upload server.</small></label>
          <label>Nama<input name="name" value="Iprime" autocomplete="name" /></label>
          <label>Username<input name="username" value="iprime" autocomplete="username" /></label>
          <button class="primary-button" type="submit">Masuk Dashboard</button>
        </form>
        <p class="fine-print">Nomor aktif: ${session.phone}. Bahasa: ${language.name}.</p>
      </section>
    </main>
  `;

  let photo = '';
  const liveAvatar = document.querySelector('#profileAvatarLive');
  document.querySelector('#photoInput').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photo = String(reader.result);
      liveAvatar.innerHTML = `<img src="${photo}" alt="Preview profile" />`;
      liveAvatar.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  });

  document.querySelector('#profileForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || 'Iprime').trim();
    const username = String(form.get('username') || 'iprime').trim().replace(/^@/, '');
    const profile = { name, username, photo, avatar: initials(name), bio: 'Axynera demo user' };
    localStorage.setItem(profileKey, JSON.stringify(profile));
    renderDashboard(language, session, profile);
  });
}

function renderList(items, type) {
  return items.map((item) => `
    <article class="list-item">
      <span class="avatar">${item.avatar}</span>
      <div><strong>${item.name}</strong><p>${item.message || item.note}</p></div>
      <aside>
        ${item.time ? `<small>${item.time}</small>` : ''}
        ${item.badge ? `<b>${item.badge}</b>` : ''}
        ${type === 'calls' ? '<button class="round-action">Call</button>' : ''}
      </aside>
    </article>
  `).join('');
}

function tabContent(profile) {
  if (activeTab === 'groups') return `<div class="list-stack">${renderList(groupItems, 'groups')}</div>`;
  if (activeTab === 'status') {
    return `
      <section class="status-hero">${avatarMarkup(profile, 'IP')}<div><strong>Status saya</strong><p>Tap untuk tambah status demo.</p></div><button class="round-action">+</button></section>
      <div class="list-stack">${renderList(statusItems, 'status')}</div>
    `;
  }
  if (activeTab === 'server') {
    return `
      <section class="server-card"><p class="eyebrow">Axynera Server</p><h2>Channel komunitas</h2><p>Server demo untuk nanti dihubungkan ke backend realtime dan AI.</p></section>
      <div class="list-stack">${renderList(serverItems, 'server')}</div>
    `;
  }
  if (activeTab === 'calls') return `<div class="list-stack">${renderList(callItems, 'calls')}</div>`;
  return `<div class="list-stack">${renderList(chatItems, 'chat')}</div>`;
}

function renderDashboard(language, session, profile) {
  const title = tabs.find((tab) => tab.id === activeTab)?.label || 'Chat';
  app.innerHTML = `
    <main class="mobile-shell">
      <header class="app-topbar">
        <div><p class="eyebrow">Axynera v${appVersion}</p><h1>${title}</h1></div>
        <div class="topbar-actions"><button class="icon-button">Search</button><button id="settingsBtn" class="icon-button">Setting</button></div>
      </header>
      <section class="profile-strip">
        ${avatarMarkup(profile, 'IP')}
        <div><strong>${profile.name}</strong><p>@${profile.username} - ${session.phone}</p></div>
        <span>${language.name}</span>
      </section>
      <section class="content-panel">${tabContent(profile)}</section>
      <nav class="bottom-nav">
        ${tabs.map((tab) => `<button class="${tab.id === activeTab ? 'active' : ''}" data-tab="${tab.id}"><span>${tab.icon}</span>${tab.label}</button>`).join('')}
      </nav>
    </main>
  `;

  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      activeTab = button.dataset.tab;
      renderDashboard(language, session, profile);
    });
  });
  document.querySelector('#settingsBtn').addEventListener('click', () => renderSettings(language, session, profile));
}

function renderSettings(language, session, profile) {
  app.innerHTML = `
    <main class="mobile-shell settings-shell">
      <header class="app-topbar">
        <button id="backDashboard" class="icon-button">Back</button>
        <div><p class="eyebrow">Pengaturan</p><h1>Settings</h1></div>
      </header>
      <section class="settings-card">${avatarMarkup(profile, 'IP')}<div><strong>${profile.name}</strong><p>@${profile.username} - ${session.phone}</p></div></section>
      <section class="settings-card column">
        <h2>Izin APK</h2>
        <p>Untuk versi demo, izin disiapkan di manifest. Runtime request native bisa ditambah saat plugin camera, contact, location, dan notification dipasang.</p>
        <div class="permission-grid">${permissionList.map((item) => `<span>${item}</span>`).join('')}</div>
      </section>
      <section class="settings-actions"><button id="resetLanguage" class="ghost-button">Ubah Bahasa</button><button id="logout" class="danger-button">Logout Demo</button></section>
    </main>
  `;

  document.querySelector('#backDashboard').addEventListener('click', () => renderDashboard(language, session, profile));
  document.querySelector('#resetLanguage').addEventListener('click', () => {
    localStorage.removeItem(langKey);
    route();
  });
  document.querySelector('#logout').addEventListener('click', () => {
    localStorage.removeItem(sessionKey);
    localStorage.removeItem(profileKey);
    route();
  });
}

route();
