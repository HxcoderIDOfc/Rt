import './styles.css';

const appVersion = '0.5.0-demo';
const langKey = 'axynera_v04_language';
const sessionKey = 'axynera_v04_session';
const profileKey = 'axynera_v04_profile';
const permissionKey = 'axynera_v05_permissions_seen';
const statusKey = 'axynera_v05_statuses';
const dayMs = 24 * 60 * 60 * 1000;

const app = document.querySelector('#app');

const languages = [
  { code: 'id', name: 'Indonesia', native: 'Bahasa Indonesia', flag: 'ID' },
  { code: 'en', name: 'English', native: 'English', flag: 'EN' },
  { code: 'ms', name: 'Melayu', native: 'Bahasa Melayu', flag: 'MY' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: 'JP' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: 'KR' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: 'AR' }
];

const navTabs = [
  { id: 'chat', label: 'Chat', icon: '●' },
  { id: 'groups', label: 'Grup', icon: '◆' },
  { id: 'status', label: 'Status', icon: '◉' },
  { id: 'server', label: 'Server', icon: '▣' },
  { id: 'calls', label: 'Panggilan', icon: '☎' }
];

const badges = {
  verify: '<span class="mini-badge verify">✓</span>',
  dev: '<span class="mini-badge dev">&lt;/&gt;</span>',
  vip: '<span class="mini-badge vip">♛</span>'
};

const chats = [
  { name: 'Nera Bot', avatar: 'NB', bio: 'Halo! Ada yang bisa Nera bantu?', time: '12:28', unread: 3, badges: ['verify', 'dev', 'vip'] },
  { name: 'Build APK', avatar: 'BA', bio: 'Build berhasil untuk versi 2.4.1', time: '11:15', unread: 2, badges: ['dev', 'vip'] },
  { name: 'Cloud Team', avatar: 'CT', bio: 'Deploy ke server selesai.', time: '10:42', unread: 5, badges: ['verify'] },
  { name: 'Dev Community', avatar: 'DC', bio: 'Diskusi seputar pengembangan...', time: '09:30', unread: 12, badges: ['dev'] },
  { name: 'Axynera Updates', avatar: 'AX', bio: 'Versi 2.4.0 telah dirilis.', time: 'Kemarin', unread: 0, badges: ['verify'] }
];

const groups = [
  { name: 'Axynera Dev', avatar: 'AD', bio: 'Fadhil: Update modul selesai.', meta: '128 member', badges: ['dev', 'vip'] },
  { name: 'Design Squad', avatar: 'DS', bio: 'Mockup terbaru sudah siap.', meta: '86 member', badges: ['verify'] },
  { name: 'Server Crew', avatar: 'SC', bio: 'Backup server done.', meta: '64 member', badges: ['dev'] },
  { name: 'AI Lab', avatar: 'AI', bio: 'Model training complete.', meta: '73 member', badges: ['verify', 'dev'] }
];

const defaultStatuses = [
  { name: 'Nera Bot', avatar: 'NB', title: 'GIF demo', hoursAgo: 2 },
  { name: 'Cloud Team', avatar: 'CT', title: 'Cloud ready', hoursAgo: 7 },
  { name: 'Design Hub', avatar: 'DH', title: 'Mockup baru', hoursAgo: 19 },
  { name: 'AI Lab', avatar: 'AI', title: 'Expired demo', hoursAgo: 28 }
];

const servers = [
  { name: 'Axynera HQ', avatar: 'HQ', bio: '128 members', channels: ['pengumuman', 'update', 'diskusi'] },
  { name: 'AI Lab', avatar: 'AI', bio: '96 members', channels: ['bot', 'model', 'prompt'] },
  { name: 'Build Room', avatar: 'BR', bio: '64 members', channels: ['apk', 'worker', 'release'] }
];

const calls = [
  { name: 'Nera Bot', avatar: 'NB', bio: 'Voice', time: '12:22', badges: ['verify', 'dev', 'vip'] },
  { name: 'Fadhil', avatar: 'FA', bio: 'Voice', time: '11:45', badges: ['dev'] },
  { name: 'Nina', avatar: 'NI', bio: 'Video', time: 'Kemarin', badges: ['verify'] },
  { name: 'Cloud Team', avatar: 'CT', bio: 'Video', time: '2 hari lalu', badges: ['verify'] }
];

const permissionList = ['Camera', 'Mic', 'Location', 'Contacts', 'Storage', 'SMS'];
let activeTab = 'chat';
let showProfileModal = false;
let showPermissionModal = false;

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

function getStoredStatuses() {
  const stored = safeJson(localStorage.getItem(statusKey));
  if (Array.isArray(stored) && stored.length) {
    return stored;
  }
  const seed = defaultStatuses.map((status) => ({
    ...status,
    createdAt: new Date(Date.now() - status.hoursAgo * 60 * 60 * 1000).toISOString()
  }));
  localStorage.setItem(statusKey, JSON.stringify(seed));
  return seed;
}

function setProfile(profile) {
  localStorage.setItem(profileKey, JSON.stringify(profile));
}

function getActiveStatuses() {
  return getStoredStatuses()
    .filter((status) => Date.now() - new Date(status.createdAt).getTime() < dayMs)
    .map((status) => {
      const ageMs = Date.now() - new Date(status.createdAt).getTime();
      const hours = Math.max(0, Math.floor(ageMs / (60 * 60 * 1000)));
      return { ...status, meta: hours <= 0 ? 'Baru saja' : `${hours} jam lalu` };
    });
}

function ensurePermissionPrompt() {
  if (!localStorage.getItem(permissionKey)) {
    showPermissionModal = true;
  }
}

async function requestRuntimePermissions() {
  const results = [];

  if ('Notification' in window) {
    const result = await Notification.requestPermission();
    results.push(`Notifikasi: ${result}`);
  }

  if (navigator.mediaDevices?.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach((track) => track.stop());
      results.push('Kamera/Mic: granted');
    } catch {
      results.push('Kamera/Mic: belum diizinkan');
    }
  }

  if (navigator.geolocation) {
    await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          results.push('Lokasi: granted');
          resolve();
        },
        () => {
          results.push('Lokasi: belum diizinkan');
          resolve();
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
      );
    });
  }

  results.push('Kontak/Storage/SMS: siap via izin Android');
  localStorage.setItem(permissionKey, JSON.stringify({ requestedAt: new Date().toISOString(), results }));
  return results;
}

function initials(name) {
  return String(name || 'AX')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function badgeMarkup(list = []) {
  return `<span class="badge-line">${list.map((badge) => badges[badge]).join('')}</span>`;
}

function avatarMarkup(value, fallback = 'AX', className = '') {
  const profile = typeof value === 'object' ? value : null;
  if (profile?.photo) {
    return `<button class="avatar ${className}" data-profile-open="true"><img src="${profile.photo}" alt="${profile.name || 'Profile'}" /></button>`;
  }
  const label = profile?.avatar || value || fallback;
  return `<button class="avatar ${className}" data-profile-open="true">${label}</button>`;
}

function logoMarkup() {
  return '<div class="ax-logo"><span>A</span><span>X</span></div>';
}

function render() {
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
  ensurePermissionPrompt();
  renderDashboard(language, session, profile);
}

function renderSplash(next) {
  app.innerHTML = `
    <main class="screen splash-screen">
      <div class="bubble-pattern"></div>
      <section class="splash-center">
        ${logoMarkup()}
        <h1>Axynera</h1>
        <p>Terhubung. Aman. Fleksibel.</p>
        <div class="loading-bar"><span></span></div>
      </section>
    </main>
  `;
  window.setTimeout(next, 750);
}

function renderLanguage() {
  const current = getLanguage();
  const suggested = current || languages.find((lang) => lang.code === (navigator.language || 'id').slice(0, 2)) || languages[0];
  app.innerHTML = `
    <main class="screen setup-screen">
      <div class="setup-head">
        <span class="round-icon">◎</span>
        <h1>Choose your language</h1>
        <p>Pilih bahasa aplikasi</p>
      </div>
      <section class="language-list">
        ${languages.map((lang) => `
          <button class="select-row ${lang.code === suggested.code ? 'active' : ''}" data-code="${lang.code}">
            <span class="flag">${lang.flag}</span>
            <span><strong>${lang.name}</strong><small>${lang.native}</small></span>
            <i>${lang.code === suggested.code ? '✓' : '›'}</i>
          </button>
        `).join('')}
      </section>
      <footer class="sticky-action"><button id="saveLanguage" class="primary-button">Lanjut</button></footer>
    </main>
  `;

  let selected = suggested;
  document.querySelectorAll('.select-row').forEach((button) => {
    button.addEventListener('click', () => {
      selected = languages.find((lang) => lang.code === button.dataset.code) || languages[0];
      localStorage.setItem(langKey, JSON.stringify(selected));
      renderLanguage();
    });
  });
  document.querySelector('#saveLanguage').addEventListener('click', () => {
    localStorage.setItem(langKey, JSON.stringify(selected));
    renderPhoneLogin(selected);
  });
}

function renderPhoneLogin(language) {
  app.innerHTML = `
    <main class="screen setup-screen">
      <button class="back-button" type="button">‹</button>
      <div class="setup-head">
        <span class="round-icon">▯</span>
        <h1>Masukkan nomor HP</h1>
        <p>Kami akan mengirimkan kode OTP untuk verifikasi demo.</p>
      </div>
      <form id="phoneForm" class="form-stack">
        <label>Negara<select name="country"><option value="+62">Indonesia (+62)</option><option value="+60">Malaysia (+60)</option><option value="+1">US/Canada (+1)</option></select></label>
        <label>Nomor HP<input name="phone" inputmode="tel" value="81234567890" autocomplete="tel" /></label>
        <div class="otp-card"><small>Kode OTP Demo</small><strong>1 2 3 4 5 6</strong><span>Tidak akan mengirim SMS.</span></div>
        <button class="primary-button" type="submit">Masuk Demo</button>
      </form>
      <p class="fine-print">${language.name} aktif. Login masih demo lokal.</p>
    </main>
  `;
  document.querySelector('.back-button').addEventListener('click', () => renderLanguage());
  document.querySelector('#phoneForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    localStorage.setItem(sessionKey, JSON.stringify({ phone: `${form.get('country')}${form.get('phone')}`, createdAt: new Date().toISOString() }));
    renderProfileSetup(language, getSession());
  });
}

function renderProfileSetup(language, session) {
  app.innerHTML = `
    <main class="screen setup-screen">
      <button class="back-button" type="button">‹</button>
      <div class="setup-title"><h1>Setup Profile</h1><p>Lengkapi informasi profil Anda</p></div>
      <form id="profileForm" class="form-stack">
        <label class="avatar-upload">
          <input id="photoInput" type="file" accept="image/*,.gif" />
          <span id="avatarPreview" class="avatar big">IP</span>
          <strong>Foto Profil</strong><small>GIF didukung</small>
        </label>
        <label class="cover-upload">
          <input id="coverInput" type="file" accept="image/*,.gif" />
          <span id="coverPreview">Sampul / Thumbnail (Gambar / GIF)</span>
        </label>
        <label>Nama<input name="name" value="Axynera User" /></label>
        <label>Username<input name="username" value="axynera_user" /></label>
        <div class="permission-row">${permissionList.map((item) => `<span>${item} ✓</span>`).join('')}</div>
        <button class="primary-button" type="submit">Simpan Profile</button>
      </form>
      <p class="fine-print">Nomor: ${session.phone}. Bahasa: ${language.name}.</p>
    </main>
  `;

  let photo = '';
  let cover = '';
  document.querySelector('.back-button').addEventListener('click', () => renderPhoneLogin(language));
  document.querySelector('#photoInput').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photo = String(reader.result);
      document.querySelector('#avatarPreview').innerHTML = `<img src="${photo}" alt="Preview profile" />`;
    };
    reader.readAsDataURL(file);
  });
  document.querySelector('#coverInput').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      cover = String(reader.result);
      document.querySelector('#coverPreview').innerHTML = `<img src="${cover}" alt="Preview cover" />`;
    };
    reader.readAsDataURL(file);
  });
  document.querySelector('#profileForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || 'Axynera User').trim();
    setProfile({ name, username: String(form.get('username') || 'axynera_user').replace(/^@/, ''), avatar: initials(name), photo, cover, bio: 'Build beyond chat.', theme: 'Light', richPresence: true });
    renderDashboard(language, session, getProfile());
  });
}

function renderRows(items, type = 'chat') {
  return items.map((item) => `
    <article class="list-item">
      <button class="avatar">${item.avatar}</button>
      <div>
        <strong>${item.name}${badgeMarkup(item.badges)}</strong>
        <p>${item.bio}</p>
      </div>
      <aside>
        <small>${item.time || item.meta || ''}</small>
        ${item.unread ? `<b>${item.unread}</b>` : ''}
        ${type === 'calls' ? '<button class="mini-action">Call</button>' : ''}
      </aside>
    </article>
  `).join('');
}

function renderContent(profile) {
  if (activeTab === 'groups') {
    return `<header class="page-title"><h2>Grup</h2><button>＋</button></header><section class="list-stack">${renderRows(groups)}</section>`;
  }
  if (activeTab === 'status') {
    const activeStatuses = getActiveStatuses();
    return `
      <header class="page-title"><h2>Status</h2><button>▣</button></header>
      <section class="status-me">${avatarMarkup(profile, 'IP')}<div><strong>Status saya</strong><p>Demo status otomatis hilang setelah 24 jam</p></div><span>24j</span></section>
      <section class="status-grid">${activeStatuses.map((item) => `<article><span class="avatar">${item.avatar}</span><strong>${item.name}</strong><p>${item.title}</p><small>${item.meta} • tersisa ${Math.max(1, 24 - Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (60 * 60 * 1000)))}j</small></article>`).join('')}</section>
      ${activeStatuses.length ? '' : '<p class="empty-note">Belum ada status aktif.</p>'}
    `;
  }
  if (activeTab === 'server') {
    return `
      <header class="page-title"><h2>Server</h2><button>＋</button></header>
      <section class="server-grid">${servers.map((server) => `<article><span class="avatar">${server.avatar}</span><strong>${server.name}</strong><p>${server.bio}</p></article>`).join('')}</section>
      <section class="channel-list">${servers[0].channels.map((channel) => `<button># ${channel}<span>DEV</span></button>`).join('')}</section>
    `;
  }
  if (activeTab === 'calls') {
    return `<header class="page-title"><h2>Panggilan</h2><button>⋮</button></header><div class="segmented"><button class="active">Voice</button><button>Video</button></div><section class="list-stack">${renderRows(calls, 'calls')}</section>`;
  }
  return `
    <div class="segmented"><button class="active">Semua</button><button>Belum Dibaca</button><button>Favorit</button></div>
    <section class="list-stack">${renderRows(chats)}</section>
  `;
}

function renderDashboard(language, session, profile) {
  const title = navTabs.find((tab) => tab.id === activeTab)?.label || 'Chat';
  app.innerHTML = `
    <main class="app-shell">
      <header class="topbar">
        <div class="topbar-left">
          ${avatarMarkup(profile, 'IP', 'top-avatar')}
          <div><h1>Axynera</h1><p>${title} • ${profile.theme || 'Light'}</p></div>
        </div>
        <div class="topbar-actions"><button>⌕</button><button id="settingsBtn">⚙</button></div>
      </header>
      <section class="content">${renderContent(profile)}</section>
      <nav class="bottom-nav">${navTabs.map((tab) => `<button class="${activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}"><span>${tab.icon}</span>${tab.label}</button>`).join('')}</nav>
      ${showProfileModal ? renderProfileModal(profile) : ''}
      ${showPermissionModal ? renderPermissionModal() : ''}
    </main>
  `;

  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      activeTab = button.dataset.tab;
      showProfileModal = false;
      renderDashboard(language, session, profile);
    });
  });
  document.querySelectorAll('[data-profile-open]').forEach((button) => {
    button.addEventListener('click', () => {
      showProfileModal = true;
      renderDashboard(language, session, profile);
    });
  });
  document.querySelector('#settingsBtn').addEventListener('click', () => renderSettings(language, session, profile));
  document.querySelector('#closeModal')?.addEventListener('click', () => {
    showProfileModal = false;
    renderDashboard(language, session, profile);
  });
  document.querySelector('#editProfile')?.addEventListener('click', () => renderProfileSetup(language, session));
  document.querySelector('#allowPermissions')?.addEventListener('click', async () => {
    const button = document.querySelector('#allowPermissions');
    button.textContent = 'Meminta izin...';
    button.disabled = true;
    await requestRuntimePermissions();
    showPermissionModal = false;
    renderDashboard(language, session, profile);
  });
  document.querySelector('#skipPermissions')?.addEventListener('click', () => {
    localStorage.setItem(permissionKey, JSON.stringify({ skippedAt: new Date().toISOString() }));
    showPermissionModal = false;
    renderDashboard(language, session, profile);
  });
}

function renderProfileModal(profile) {
  return `
    <div class="modal-shade">
      <section class="profile-modal">
        <button id="closeModal" class="close-button">×</button>
        <div class="cover">${profile.cover ? `<img src="${profile.cover}" alt="Cover" />` : ''}</div>
        ${avatarMarkup(profile, 'IP', 'profile-avatar')}
        <h2>${profile.name}${badgeMarkup(['verify', 'dev', 'vip'])}</h2>
        <p>@${profile.username}</p>
        <small class="bio">${profile.bio}</small>
        <div class="presence-card"><span>🎮 Playing</span><strong>Axynera Quest</strong></div>
        <div class="presence-card"><span>♪ Listening</span><strong>Neon Drive</strong></div>
        <div class="modal-actions"><button>Message</button><button>Call</button><button id="editProfile">Edit</button></div>
      </section>
    </div>
  `;
}

function renderPermissionModal() {
  return `
    <div class="modal-shade">
      <section class="permission-modal">
        <span class="round-icon">▣</span>
        <h2>Izin Axynera</h2>
        <p>Aktifkan izin demo supaya kamera, mic, lokasi, notifikasi, storage, kontak, dan SMS siap dipakai saat fiturnya dibuat.</p>
        <div class="permission-grid">
          ${permissionList.map((item) => `<span>${item}</span>`).join('')}
          <span>Notifications</span>
        </div>
        <small>Kontak, SMS, dan storage sudah disiapkan di manifest Android. Popup asli muncul sesuai dukungan perangkat.</small>
        <div class="modal-actions permission-actions">
          <button id="skipPermissions">Nanti</button>
          <button id="allowPermissions">Izinkan semua</button>
        </div>
      </section>
    </div>
  `;
}

function renderSettings(language, session, profile) {
  app.innerHTML = `
    <main class="app-shell settings-page">
      <header class="topbar simple"><button id="backDashboard">‹</button><h1>Pengaturan</h1></header>
      <section class="settings-list">
        <article>${avatarMarkup(profile, 'IP')}<div><strong>${profile.name}${badgeMarkup(['verify', 'dev', 'vip'])}</strong><p>@${profile.username}</p></div><span>›</span></article>
        <button><span>Bahasa</span><strong>${language.name}</strong></button>
        <button><span>Tema</span><strong>${profile.theme || 'Light'}</strong></button>
        <button><span>Rich Presence</span><strong>Opt-in</strong></button>
        <button id="permissionSettings"><span>Izin Aplikasi</span><strong>Kelola</strong></button>
        <button class="danger" id="logout">Keluar Demo</button>
      </section>
    </main>
  `;

  document.querySelector('#backDashboard').addEventListener('click', () => renderDashboard(language, session, profile));
  document.querySelector('#logout').addEventListener('click', () => {
    localStorage.removeItem(sessionKey);
    localStorage.removeItem(profileKey);
    showProfileModal = false;
    render();
  });
  document.querySelector('#permissionSettings').addEventListener('click', () => {
    showPermissionModal = true;
    renderDashboard(language, session, profile);
  });
  document.querySelector('[data-profile-open]')?.addEventListener('click', () => {
    showProfileModal = true;
    renderDashboard(language, session, profile);
  });
}

render();
