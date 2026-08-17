const CHAT_USERS = [
  { name: 'Nera Bot', avatar: 'NB', status: 'Online', badges: '✓ </> ♛' },
  { name: 'Build APK', avatar: 'BA', status: 'Terakhir aktif 11:15', badges: '</> ♛' },
  { name: 'Cloud Team', avatar: 'CT', status: 'Online', badges: '✓' },
  { name: 'Dev Community', avatar: 'DC', status: 'Terakhir aktif 09:30', badges: '</>' },
  { name: 'Axynera Updates', avatar: 'AX', status: 'Channel resmi', badges: '✓' }
];

const CHAT_STORAGE_KEY = 'axynera_v012_chat_messages';
let activeChatRoom = null;

function getStoredChats() {
  try {
    const data = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function saveStoredChats(data) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
}

function defaultMessages(index) {
  const name = CHAT_USERS[index]?.name || 'User';
  return [
    { side: 'them', text: `Halo 👋 Ini ruang chat dengan ${name}.`, time: '10:24' },
    { side: 'me', text: 'Sip, chat room-nya sudah jalan 😄', time: '10:25' },
    { side: 'them', text: index === 0 ? 'Kalau butuh bantuan AI, tekan logo Nera di atas tombol +.' : 'Mantap. Tinggal sambungkan backend pesan nanti.', time: '10:25' }
  ];
}

function messagesFor(index) {
  const all = getStoredChats();
  const key = String(index);
  if (!Array.isArray(all[key]) || !all[key].length) {
    all[key] = defaultMessages(index);
    saveStoredChats(all);
  }
  return all[key];
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function injectChatStyles() {
  if (document.querySelector('#axynera-chat-room-style')) return;
  const style = document.createElement('style');
  style.id = 'axynera-chat-room-style';
  style.textContent = `
    .axy-chat-room {
      position: fixed;
      inset: 0;
      z-index: 12000;
      display: grid;
      grid-template-rows: auto 1fr auto;
      background: linear-gradient(180deg, #f7faff 0%, #edf5ff 100%);
      color: #17213a;
      font-family: inherit;
      pointer-events: auto;
    }
    .axy-chat-room button,
    .axy-chat-room textarea,
    .axy-chat-room input { pointer-events: auto; }
    .axy-chat-topbar {
      min-height: 66px;
      padding: calc(8px + env(safe-area-inset-top)) 12px 8px;
      display: grid;
      grid-template-columns: 42px 44px 1fr auto;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,.94);
      border-bottom: 1px solid rgba(85,110,165,.12);
      backdrop-filter: blur(16px);
    }
    .axy-chat-back, .axy-chat-action, .axy-chat-plus, .axy-chat-send {
      border: 0;
      background: transparent;
      color: #2e426d;
      font: inherit;
    }
    .axy-chat-back { font-size: 34px; line-height: 1; }
    .axy-chat-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #5a7fff, #49c5f4);
      color: white;
      font-weight: 800;
      box-shadow: 0 6px 18px rgba(65,100,190,.22);
    }
    .axy-chat-user strong { display: block; font-size: 15px; }
    .axy-chat-user small { display: block; margin-top: 2px; color: #7d8aa9; font-size: 11px; }
    .axy-chat-actions { display: flex; gap: 4px; }
    .axy-chat-action {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: #eef4ff;
      font-size: 17px;
    }
    .axy-chat-messages {
      overflow-y: auto;
      padding: 18px 14px 92px;
      display: flex;
      flex-direction: column;
      gap: 9px;
      scroll-behavior: smooth;
    }
    .axy-chat-day {
      align-self: center;
      padding: 5px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.75);
      color: #7b89a6;
      font-size: 11px;
      margin: 2px 0 8px;
    }
    .axy-chat-bubble {
      max-width: min(78%, 430px);
      padding: 10px 12px 7px;
      border-radius: 18px;
      box-shadow: 0 7px 18px rgba(41,65,118,.07);
      line-height: 1.38;
      font-size: 14px;
      overflow-wrap: anywhere;
    }
    .axy-chat-bubble.them {
      align-self: flex-start;
      background: #fff;
      border-bottom-left-radius: 6px;
    }
    .axy-chat-bubble.me {
      align-self: flex-end;
      background: linear-gradient(135deg, #5b7fff, #4cbcf2);
      color: #fff;
      border-bottom-right-radius: 6px;
    }
    .axy-chat-bubble time {
      display: block;
      margin-top: 4px;
      text-align: right;
      font-size: 10px;
      opacity: .68;
    }
    .axy-chat-composer-wrap {
      position: relative;
      padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
      background: rgba(255,255,255,.96);
      border-top: 1px solid rgba(85,110,165,.12);
    }
    .axy-chat-composer {
      display: grid;
      grid-template-columns: 42px 1fr 42px;
      gap: 8px;
      align-items: end;
    }
    .axy-chat-plus, .axy-chat-send {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: #edf3ff;
      font-size: 24px;
      font-weight: 700;
    }
    .axy-chat-send {
      background: linear-gradient(135deg, #587cff, #47bff2);
      color: #fff;
      font-size: 18px;
    }
    .axy-chat-input {
      min-height: 42px;
      max-height: 116px;
      resize: none;
      border: 1px solid #dce5f6;
      border-radius: 16px;
      padding: 11px 13px;
      box-sizing: border-box;
      background: #f8faff;
      color: #17213a;
      font: inherit;
      outline: none;
    }
    .axy-ai-fab {
      position: absolute;
      left: 10px;
      bottom: calc(60px + env(safe-area-inset-bottom));
      width: 46px;
      height: 46px;
      border: 0;
      border-radius: 16px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #626dff, #42c8f4);
      box-shadow: 0 10px 28px rgba(63,99,211,.35);
      z-index: 3;
    }
    .axy-ai-fab img { width: 30px; height: 30px; object-fit: contain; }
    .axy-ai-panel {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: calc(116px + env(safe-area-inset-bottom));
      border-radius: 20px;
      padding: 14px;
      background: rgba(255,255,255,.98);
      border: 1px solid rgba(93,116,172,.14);
      box-shadow: 0 18px 44px rgba(32,50,94,.18);
      z-index: 4;
    }
    .axy-ai-panel-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .axy-ai-panel-head strong { font-size: 15px; }
    .axy-ai-panel-head button { border: 0; background: #edf3ff; width: 32px; height: 32px; border-radius: 10px; font-size: 18px; }
    .axy-ai-panel p { margin: 8px 0 10px; color: #6f7d9e; font-size: 12px; }
    .axy-ai-chip-row { display: flex; flex-wrap: wrap; gap: 7px; }
    .axy-ai-chip-row button { border: 0; border-radius: 999px; padding: 8px 10px; background: #edf4ff; color: #31599f; font-size: 12px; }
    @media (min-width: 700px) {
      .axy-chat-room { left: 50%; width: min(720px, 100%); transform: translateX(-50%); box-shadow: 0 0 50px rgba(30,50,100,.14); }
    }
  `;
  document.head.appendChild(style);
}

function renderMessages(container, index) {
  const list = messagesFor(index);
  container.innerHTML = `<div class="axy-chat-day">Hari ini</div>${list.map((message) => `
    <article class="axy-chat-bubble ${message.side === 'me' ? 'me' : 'them'}">
      <div>${escapeHtml(message.text)}</div>
      <time>${escapeHtml(message.time)}</time>
    </article>
  `).join('')}`;
  requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
}

function closeChatRoom() {
  document.querySelector('.axy-chat-room')?.remove();
  activeChatRoom = null;
}

function toggleAiPanel(room) {
  const current = room.querySelector('.axy-ai-panel');
  if (current) {
    current.remove();
    return;
  }
  const panel = document.createElement('section');
  panel.className = 'axy-ai-panel';
  panel.innerHTML = `
    <div class="axy-ai-panel-head"><strong>Nera AI ✨</strong><button type="button" aria-label="Tutup AI">×</button></div>
    <p>Asisten AI di dalam chat. Untuk sekarang ini panel demo, siap disambungkan ke API Axynera nanti.</p>
    <div class="axy-ai-chip-row">
      <button type="button" data-ai-text="Ringkas percakapan ini">Ringkas chat</button>
      <button type="button" data-ai-text="Bantu aku membalas pesan terakhir">Bantu balas</button>
      <button type="button" data-ai-text="Tulis balasan yang lebih santai">Balasan santai</button>
    </div>
  `;
  room.querySelector('.axy-chat-composer-wrap').appendChild(panel);
  panel.querySelector('.axy-ai-panel-head button').addEventListener('click', () => panel.remove());
  panel.querySelectorAll('[data-ai-text]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = room.querySelector('.axy-chat-input');
      input.value = button.dataset.aiText || '';
      input.focus();
      panel.remove();
    });
  });
}

function openChatRoom(index) {
  if (document.querySelector('.axy-chat-room')) return;
  injectChatStyles();
  const user = CHAT_USERS[index] || CHAT_USERS[0];
  activeChatRoom = index;
  const room = document.createElement('section');
  room.className = 'axy-chat-room';
  room.innerHTML = `
    <header class="axy-chat-topbar">
      <button class="axy-chat-back" type="button" aria-label="Kembali">‹</button>
      <div class="axy-chat-avatar">${escapeHtml(user.avatar)}</div>
      <div class="axy-chat-user"><strong>${escapeHtml(user.name)} <span style="font-size:10px;color:#6c7cff">${escapeHtml(user.badges)}</span></strong><small>${escapeHtml(user.status)}</small></div>
      <div class="axy-chat-actions"><button class="axy-chat-action" type="button">⌕</button><button class="axy-chat-action" type="button">⋮</button></div>
    </header>
    <main class="axy-chat-messages"></main>
    <footer class="axy-chat-composer-wrap">
      <button class="axy-ai-fab" type="button" aria-label="Nera AI"><img src="/assets/brand/axynera-app-icon-ax.png" alt="Nera AI" /></button>
      <form class="axy-chat-composer">
        <button class="axy-chat-plus" type="button" aria-label="Lampiran">+</button>
        <textarea class="axy-chat-input" rows="1" placeholder="Ketik pesan..."></textarea>
        <button class="axy-chat-send" type="submit" aria-label="Kirim">➤</button>
      </form>
    </footer>
  `;
  document.body.appendChild(room);

  const messages = room.querySelector('.axy-chat-messages');
  renderMessages(messages, index);

  room.querySelector('.axy-chat-back').addEventListener('click', closeChatRoom);
  room.querySelector('.axy-ai-fab').addEventListener('click', () => toggleAiPanel(room));
  room.querySelector('.axy-chat-plus').addEventListener('click', () => {
    const input = room.querySelector('.axy-chat-input');
    input.value = input.value ? `${input.value} 📎` : '📎 ';
    input.focus();
  });

  const input = room.querySelector('.axy-chat-input');
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 116)}px`;
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      room.querySelector('.axy-chat-composer').requestSubmit();
    }
  });

  room.querySelector('.axy-chat-composer').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const all = getStoredChats();
    const key = String(index);
    const list = Array.isArray(all[key]) ? all[key] : defaultMessages(index);
    const now = new Date();
    list.push({ side: 'me', text, time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` });
    all[key] = list;
    saveStoredChats(all);
    input.value = '';
    input.style.height = 'auto';
    renderMessages(messages, index);
  });
}

injectChatStyles();

document.addEventListener('click', (event) => {
  if (document.querySelector('.axy-chat-room')) return;
  if (event.target.closest('button, input, textarea, select, a, [data-profile-type]')) return;

  const item = event.target.closest('.content .list-stack .list-item');
  if (!item) return;

  const content = item.closest('.content');
  if (!content) return;
  const segmented = content.querySelector('.segmented');
  const isChatTab = segmented?.querySelector('button.active')?.textContent?.trim() === 'Semua';
  if (!isChatTab) return;

  const items = [...content.querySelectorAll('.list-stack .list-item')];
  const index = items.indexOf(item);
  if (index < 0 || index >= CHAT_USERS.length) return;

  openChatRoom(index);
});

window.addEventListener('popstate', () => {
  if (activeChatRoom !== null) closeChatRoom();
});
