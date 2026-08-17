const PROFILE_KEY = 'axynera_v04_profile';
let profileEditorHistoryActive = false;

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
}

function setProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function initials(name) {
  return String(name || 'AX')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function injectStyles() {
  if (document.querySelector('#axynera-profile-settings-fix-style')) return;
  const style = document.createElement('style');
  style.id = 'axynera-profile-settings-fix-style';
  style.textContent = `
    .topbar-actions .top-avatar { order: 99; margin-left: 2px; }
    .topbar-actions #settingsBtn { order: 98; }
    .settings-list > article:first-child { cursor: pointer; }
    .settings-profile-editor-shade {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: end center;
      background: rgba(13, 20, 38, .36);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .settings-profile-editor {
      width: min(100%, 520px);
      max-height: 92dvh;
      overflow: auto;
      border-radius: 28px 28px 0 0;
      padding: 20px 18px calc(22px + env(safe-area-inset-bottom));
      background: #fff;
      color: #182036;
      box-shadow: 0 -18px 60px rgba(20, 40, 90, .18);
    }
    .settings-profile-editor-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
    }
    .settings-profile-editor-head h2 { margin: 0; font-size: 20px; }
    .settings-profile-editor-back,
    .settings-profile-editor-close {
      width: 38px;
      height: 38px;
      border: 0;
      border-radius: 50%;
      font-size: 24px;
      background: #eef3ff;
      color: #27406f;
    }
    .settings-profile-editor-title { display: flex; align-items: center; gap: 10px; }
    .settings-profile-preview { position: relative; margin-bottom: 22px; }
    .settings-profile-cover {
      height: 128px;
      overflow: hidden;
      border-radius: 20px;
      background: linear-gradient(135deg, #dce8ff, #e8f9ff);
    }
    .settings-profile-cover img { width: 100%; height: 100%; object-fit: cover; }
    .settings-profile-avatar {
      position: absolute;
      left: 18px;
      bottom: -28px;
      width: 72px;
      height: 72px;
      overflow: hidden;
      display: grid;
      place-items: center;
      border: 5px solid #fff;
      border-radius: 50%;
      background: #4f7cff;
      color: #fff;
      font-weight: 800;
      font-size: 20px;
    }
    .settings-profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .settings-profile-form { display: grid; gap: 13px; padding-top: 18px; }
    .settings-profile-form label { display: grid; gap: 7px; font-size: 13px; font-weight: 700; }
    .settings-profile-form input,
    .settings-profile-form textarea {
      width: 100%; box-sizing: border-box; border: 1px solid #dce4f4;
      border-radius: 14px; padding: 12px 13px; background: #f8faff;
      color: #182036; font: inherit; outline: none;
    }
    .settings-profile-form textarea { min-height: 82px; resize: vertical; }
    .settings-profile-upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .settings-profile-upload {
      position: relative; display: grid !important; place-items: center;
      min-height: 48px; border-radius: 14px; background: #eef4ff;
      color: #315dba; text-align: center;
    }
    .settings-profile-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .settings-profile-save {
      border: 0; border-radius: 15px; padding: 13px 16px;
      background: linear-gradient(135deg, #4f7cff, #43b9f6);
      color: #fff; font-weight: 800; font-size: 15px;
    }
  `;
  document.head.appendChild(style);
}

function syncNavbarOrder() {
  document.querySelectorAll('.topbar-actions').forEach((actions) => {
    const avatar = actions.querySelector('.top-avatar');
    const menu = actions.querySelector('#settingsBtn');
    if (avatar && menu && avatar.previousElementSibling !== menu) actions.append(menu, avatar);
  });
}

function updateSettingsProfileRow() {
  const profile = getProfile();
  const row = document.querySelector('.settings-list > article:first-child');
  if (!profile || !row) return;
  const name = row.querySelector('strong');
  const username = row.querySelector('p');
  const avatar = row.querySelector('.avatar');
  if (name) {
    const badges = name.querySelector('.badge-line')?.outerHTML || '';
    name.innerHTML = `${profile.name || 'Axynera User'}${badges}`;
  }
  if (username) username.textContent = `@${profile.username || 'axynera_user'}`;
  if (avatar) avatar.innerHTML = profile.photo ? `<img src="${profile.photo}" alt="${profile.name || 'Profile'}" />` : initials(profile.name);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function closeProfileEditor({ fromHistory = false } = {}) {
  const shade = document.querySelector('.settings-profile-editor-shade');
  if (!shade) return;
  shade.remove();
  if (profileEditorHistoryActive && !fromHistory && history.state?.axyneraProfileEditor) history.back();
  profileEditorHistoryActive = false;
}

function openProfileEditor() {
  if (document.querySelector('.settings-profile-editor-shade')) return;
  const profile = getProfile();
  if (!profile) return;

  if (!history.state?.axyneraProfileEditor) {
    history.pushState({ ...(history.state || {}), axyneraProfileEditor: true }, '', location.href);
    profileEditorHistoryActive = true;
  }

  const shade = document.createElement('div');
  shade.className = 'settings-profile-editor-shade';
  shade.innerHTML = `
    <section class="settings-profile-editor" role="dialog" aria-modal="true" aria-label="Edit profil">
      <div class="settings-profile-editor-head">
        <div class="settings-profile-editor-title">
          <button class="settings-profile-editor-back" type="button" aria-label="Kembali">‹</button>
          <h2>Edit Profil</h2>
        </div>
        <button class="settings-profile-editor-close" type="button" aria-label="Tutup">×</button>
      </div>
      <div class="settings-profile-preview">
        <div class="settings-profile-cover">${profile.cover ? `<img src="${profile.cover}" alt="Sampul profil" />` : ''}</div>
        <div class="settings-profile-avatar" id="settingsAvatarPreview">${profile.photo ? `<img src="${profile.photo}" alt="Foto profil" />` : initials(profile.name)}</div>
      </div>
      <form class="settings-profile-form" id="settingsProfileForm">
        <div class="settings-profile-upload-grid">
          <label class="settings-profile-upload">Ganti Foto<input id="settingsPhotoInput" type="file" accept="image/*,.gif" /></label>
          <label class="settings-profile-upload">Ganti Sampul<input id="settingsCoverInput" type="file" accept="image/*,.gif" /></label>
        </div>
        <label>Nama<input name="name" value="${String(profile.name || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" maxlength="50" /></label>
        <label>Username<input name="username" value="${String(profile.username || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" maxlength="32" /></label>
        <label>Bio<textarea name="bio" maxlength="160">${String(profile.bio || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</textarea></label>
        <button class="settings-profile-save" type="submit">Simpan Perubahan</button>
      </form>
    </section>
  `;
  document.body.appendChild(shade);

  let photo = profile.photo || '';
  let cover = profile.cover || '';
  const close = () => closeProfileEditor();
  shade.querySelector('.settings-profile-editor-back').addEventListener('click', close);
  shade.querySelector('.settings-profile-editor-close').addEventListener('click', close);
  shade.addEventListener('click', (event) => { if (event.target === shade) close(); });

  shade.querySelector('#settingsPhotoInput').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    photo = await fileToDataUrl(file);
    shade.querySelector('#settingsAvatarPreview').innerHTML = `<img src="${photo}" alt="Foto profil" />`;
  });

  shade.querySelector('#settingsCoverInput').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    cover = await fileToDataUrl(file);
    shade.querySelector('.settings-profile-cover').innerHTML = `<img src="${cover}" alt="Sampul profil" />`;
  });

  shade.querySelector('#settingsProfileForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || 'Axynera User').trim() || 'Axynera User';
    const username = String(form.get('username') || 'axynera_user').trim().replace(/^@+/, '').replace(/\s+/g, '_') || 'axynera_user';
    const bio = String(form.get('bio') || '').trim();
    setProfile({ ...profile, name, username, bio, avatar: initials(name), photo, cover });
    updateSettingsProfileRow();
    close();
  });
}

injectStyles();

const observer = new MutationObserver(() => {
  syncNavbarOrder();
  updateSettingsProfileRow();
});
observer.observe(document.documentElement, { childList: true, subtree: true });
syncNavbarOrder();

window.addEventListener('popstate', () => {
  if (document.querySelector('.settings-profile-editor-shade')) {
    closeProfileEditor({ fromHistory: true });
  }
});

document.addEventListener('click', (event) => {
  const topAvatar = event.target.closest('.topbar-actions .top-avatar');
  if (topAvatar) {
    const settingsButton = document.querySelector('.topbar-actions #settingsBtn');
    if (settingsButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      settingsButton.click();
      return;
    }
  }

  const editProfile = event.target.closest('#editProfile');
  if (editProfile) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const closeModal = document.querySelector('#closeModal');
    if (closeModal) closeModal.click();
    const settingsButton = document.querySelector('#settingsBtn');
    if (settingsButton) settingsButton.click();
    queueMicrotask(openProfileEditor);
    return;
  }

  const profileRow = event.target.closest('.settings-list > article:first-child');
  if (profileRow) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openProfileEditor();
  }
}, true);
