/**
 * ⚡ VUBBIO ULTRA v7.0.0 — Ultimate Jubbio Mod Suite & Client Engine
 * (Vencord / BetterDiscord / Discord Power-User Edition)
 * 
 * 🔒 Tam Kalıcılık (Permanent Persistence):
 * - Uygulamadan çıkıp tekrar girildiğinde HİÇBİR ayar, tema, duvar kağıdı, profil veya mesaj kaybolmaz.
 * - Dual Storage (localStorage + sessionStorage) & Akıllı Durum Koruyucu.
 * - /api/v1/auth/me ve Zustand Store çift yönlü kilitlenerek sunucunun profili sıfırlaması engellenir.
 * 
 * 🎨 Görsel & CSS Genişletmeleri:
 * - 🖼️ Canlı Duvar Kağıdı Motoru (Özel resim/GIF arkaplan + Şeffaflık & Bulanıklık slider'ları)
 * - 🌈 12 Hazır CSS & Görsel FX (RGB Hareketli Kenarlık, Buzlu Cam, Yuvarlak/Petek Avatar, Neon Işıma vb.)
 * - 🎨 10 Efsanevi Tema & 🔤 Google Fonts Tipografi Motoru
 * - 💻 Canlı CSS Editörü & Hızlı Kod Şablonları
 * 
 * 🚀 Gelişmiş Güç Araçları:
 * - 🌐 Mesaj Üstü Hızlı Araçlar: Tek tıkla Türkçe'ye Çeviri (Translate API), ID Kopyalama, Avatar Büyütme
 * - 🔊 Sentetik Ses Efektleri Motoru (Arcade 8-Bit, Sci-Fi, Glass, Minimal bildirim sesleri & test butonu)
 * - 🖥️ 4K 60FPS Ekran Paylaşımı (WebRTC 2160p60) & 🔊 384kbps Opus HD Stüdyo Sesi
 * - 📢 %300 Donanımsal Ses Güçlendirici (Web Audio API & Kompresör)
 * - 🕵️ Kalıcı Message Logger & Audit Log (Silinen & düzenlenen mesajlar)
 * - 🎭 FakeNitro Emojiler & 👻 Hayalet Modu (No-Typing & Anti-Track)
 * - ⌨️ Sohbet Kısayolları (/shrug, /mock, /clap, /tableflip vb.) & 4000 Karakter Sayacı
 * - 🛠️ Hızlı Notlar & Pano + 💾 JSON Yedekleme & İçe/Dışa Aktarma
 */

(function VubbioUltraLoader() {
  'use strict';

  // Yeniden yükleme temizliği
  if (window.__VUBBIO_LOADED__) {
    const ids = [
      'vubbio-badge-root',
      'vubbio-modal-root',
      'vubbio-custom-css',
      'vubbio-theme-style',
      'vubbio-font-style',
      'vubbio-wallpaper-layer',
      'vubbio-fx-style',
      'vubbio-toast-container',
      'vubbio-char-counter',
      'vubbio-quick-bar'
    ];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    console.log('[Vubbio] Önceki UI temizlendi, Vubbio Ultra v7.0 güncelleniyor...');
  }
  window.__VUBBIO_LOADED__ = true;

  const VERSION = '7.0.0';
  const NAME = 'Vubbio Ultra';

  console.log(
    `%c⚡ ${NAME} v${VERSION} aktif%c — Visual FX, CSS Suite & Next-Gen Power Tools`,
    'color: #ADFF08; font-weight: bold; font-size: 13px; background: #070a12; padding: 5px 12px; border-radius: 8px; border: 1px solid #ADFF08; box-shadow: 0 0 14px rgba(173,255,8,0.4);',
    'color: #94a3b8; font-size: 12px; margin-left: 6px;'
  );

  // ============================================================
  // KALICI DEPOLAMA MOTORU (STORAGE PERSISTENCE)
  // ============================================================
  const STORAGE_KEYS = {
    SETTINGS: 'vubbio_settings_v7',
    PROFILE:  'vubbio_profile_v7',
    PEERS:    'vubbio_peers_v7',
    AUDIT:    'vubbio_audit_v7',
    NOTES:    'vubbio_notes_v7'
  };

  const StorageEngine = {
    get(key, fallback) {
      try {
        const val = localStorage.getItem(key);
        if (val !== null && val !== undefined) return JSON.parse(val);
      } catch {}
      try {
        const sVal = sessionStorage.getItem(key);
        if (sVal !== null && sVal !== undefined) return JSON.parse(sVal);
      } catch {}
      return fallback;
    },
    set(key, val) {
      try {
        const str = JSON.stringify(val);
        localStorage.setItem(key, str);
        sessionStorage.setItem(key, str);
      } catch (e) {
        console.warn('[Vubbio] Depolama hatası:', e);
      }
    }
  };

  // Zero-Width Steganografi
  const VUBBIO_MARKER = '\uFEFF\u200D\u200B\u200C';
  const ZW_CHARS = ['\u200B', '\u200C', '\u200D', '\uFEFF'];

  function encodeVubbioData(data) {
    try {
      const json = JSON.stringify(data);
      const bytes = new TextEncoder().encode(json);
      let zw = VUBBIO_MARKER;
      for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        zw += ZW_CHARS[(b >> 6) & 3];
        zw += ZW_CHARS[(b >> 4) & 3];
        zw += ZW_CHARS[(b >> 2) & 3];
        zw += ZW_CHARS[b & 3];
      }
      return zw;
    } catch {
      return '';
    }
  }

  function decodeVubbioData(text) {
    if (!text || typeof text !== 'string' || !text.includes(VUBBIO_MARKER)) return null;
    try {
      const idx = text.indexOf(VUBBIO_MARKER);
      const raw = text.slice(idx + VUBBIO_MARKER.length);
      const bytes = [];
      let cur = 0;
      let count = 0;

      for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        const val = ZW_CHARS.indexOf(ch);
        if (val === -1) break;
        cur = (cur << 2) | val;
        count++;
        if (count === 4) {
          bytes.push(cur);
          cur = 0;
          count = 0;
        }
      }

      if (bytes.length === 0) return null;
      const json = new TextDecoder().decode(new Uint8Array(bytes));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function stripVubbioData(text) {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/[\u200B\u200C\u200D\uFEFF]/g, '').trim();
  }

  // Varsayılan Ayarlar
  const defaultSettings = {
    // Nexus & Medya
    nexusUnlocker: true,
    screenShare4k: true,
    voiceHd: true,
    volumeBooster: false,
    volumeBoostLevel: 1.5,
    soundPack: 'arcade', // 'arcade', 'scifi', 'glass', 'minimal', 'off'

    // Sohbet, Gizlilik & Çeviri
    messageLogger: true,
    logEditedMessages: true,
    stealthTyping: true,
    antiTrack: true,
    serverEmotes: true,
    chatShortcuts: true,
    charCounter: true,
    quickTranslate: true,

    // Temalar, Fontlar & Duvar Kağıdı
    activeTheme: 'default',
    activeFont: 'default',
    customCss: '',
    wallpaperEnabled: false,
    wallpaperUrl: '',
    wallpaperOpacity: 0.35,
    wallpaperBlur: 4,

    // 12 Hazır CSS Efekti
    fxGlass: false,
    fxRgbBorder: false,
    fxRoundAvatar: true,
    fxSquircleAvatar: false,
    fxCompactChat: false,
    fxGlowUsernames: true,
    fxModernScrollbars: true,
    fxSmoothTransitions: true,
    fxHideBlocked: false,
    fxRoleColorGlow: false,
    fxHoverTilt: true,
    fxCustomFontSize: 14,

    // Sistem
    showToasts: true,
    badgeGlow: true
  };

  const defaultProfile = {
    avatarUrl: '',
    bannerUrl: '',
    myUserId: '',
    customStatus: '⚡ Vubbio Ultra Kullanıyor',
    customStatusType: 'PLAYING',
    badgeNexus: true,
    badgeVubbio: true,
    badgeEarly: true,
    badgeVerified: true,
    // Slot 1
    customBadgeEnabled: false,
    customBadgeName: 'Proje Lideri',
    customBadgeDesc: 'Vubbio Özel Üyesi',
    customBadgeIcon: '👑',
    // Slot 2
    customBadge2Enabled: false,
    customBadge2Name: 'Vubbio VIP',
    customBadge2Desc: 'Elit Kullanıcı',
    customBadge2Icon: '⚡',
    // Slot 3
    customBadge3Enabled: false,
    customBadge3Name: 'Bug Hunter',
    customBadge3Desc: 'Hata Avcısı',
    customBadge3Icon: '🛡️'
  };

  let settings = { ...defaultSettings, ...StorageEngine.get(STORAGE_KEYS.SETTINGS, {}) };
  let customProfile = { ...defaultProfile, ...StorageEngine.get(STORAGE_KEYS.PROFILE, {}) };
  let peerCache = StorageEngine.get(STORAGE_KEYS.PEERS, {});
  let persistentAuditLog = StorageEngine.get(STORAGE_KEYS.AUDIT, []);
  let persistentNotes = StorageEngine.get(STORAGE_KEYS.NOTES, [
    { id: 1, title: 'Vubbio Not Panosu', content: 'Buraya sık kullandığınız metinleri, kanal ID\'lerini ve şablonları kaydedebilirsiniz. Tek tıkla kopyalanır ve asla kaybolmaz!' }
  ]);

  function saveSettings() {
    StorageEngine.set(STORAGE_KEYS.SETTINGS, settings);
  }

  function saveProfile() {
    StorageEngine.set(STORAGE_KEYS.PROFILE, customProfile);
  }

  function savePeerCache() {
    StorageEngine.set(STORAGE_KEYS.PEERS, peerCache);
  }

  function saveAuditLog() {
    StorageEngine.set(STORAGE_KEYS.AUDIT, persistentAuditLog.slice(0, 100));
  }

  function saveNotes() {
    StorageEngine.set(STORAGE_KEYS.NOTES, persistentNotes);
  }

  // Rozet İkonları
  const BADGE_ICONS = {
    nexus: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23c084fc"/><stop offset="100%" stop-color="%237c3aed"/></linearGradient></defs><circle cx="16" cy="16" r="15" fill="url(%23g1)" stroke="%23e9d5ff" stroke-width="1.5"/><path d="M9 20h14l-1.5-7-4 3-1.5-6-1.5 6-4-3z" fill="%23ffffff"/><circle cx="8.5" cy="12.5" r="1.5" fill="%23fef08a"/><circle cx="16" cy="9.5" r="1.5" fill="%23fef08a"/><circle cx="23.5" cy="12.5" r="1.5" fill="%23fef08a"/></svg>',
    vubbio: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23111827"/><stop offset="100%" stop-color="%23090d16"/></linearGradient></defs><circle cx="16" cy="16" r="15" fill="url(%23g2)" stroke="%23ADFF08" stroke-width="1.8"/><path d="M17 7l-7 10h6l-2 8 8-11h-6l3-7z" fill="%23ADFF08"/></svg>',
    early: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2338bdf8"/><stop offset="100%" stop-color="%230284c7"/></linearGradient></defs><circle cx="16" cy="16" r="15" fill="url(%23g3)" stroke="%23bae6fd" stroke-width="1.5"/><polygon points="16,8 21,13 18,22 14,22 11,13" fill="%23ffffff"/><polygon points="16,10 19,13 17,20 15,20 13,13" fill="%237dd3fc"/></svg>',
    verified: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="%232563eb" stroke="%2393c5fd" stroke-width="1.5"/><path d="M10 16.5l4 4 8.5-8.5" fill="none" stroke="%23ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function createEmojiBadgeSvg(emoji) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="%231e293b" stroke="%23ADFF08" stroke-width="1.5"/><text x="16" y="21" font-size="16" text-anchor="middle">${encodeURIComponent(emoji || '⭐')}</text></svg>`;
  }

  function getBadgesForConfig(cfg) {
    const list = [];
    if (cfg.badgeNexus) list.push({ id: 'v_nexus', name: 'Jubbio Nexus Pro', description: 'Jubbio Nexus Pro Üyesi', icon_url: BADGE_ICONS.nexus });
    if (cfg.badgeVubbio) list.push({ id: 'v_vip', name: 'Vubbio VIP', description: 'Vubbio VIP Mod Kullanıcısı', icon_url: BADGE_ICONS.vubbio });
    if (cfg.badgeEarly) list.push({ id: 'v_early', name: 'Erken Destekçi', description: 'Jubbio Erken Destekçisi', icon_url: BADGE_ICONS.early });
    if (cfg.badgeVerified) list.push({ id: 'v_verified', name: 'Doğrulanmış Üye', description: 'Onaylanmış Profil', icon_url: BADGE_ICONS.verified });
    if (cfg.customBadgeEnabled && cfg.customBadgeName) {
      list.push({
        id: 'v_custom_1',
        name: cfg.customBadgeName,
        description: cfg.customBadgeDesc || 'Özel Vubbio Rozeti 1',
        icon_url: cfg.customBadgeIcon?.startsWith('http') || cfg.customBadgeIcon?.startsWith('data:') ? cfg.customBadgeIcon : createEmojiBadgeSvg(cfg.customBadgeIcon)
      });
    }
    if (cfg.customBadge2Enabled && cfg.customBadge2Name) {
      list.push({
        id: 'v_custom_2',
        name: cfg.customBadge2Name,
        description: cfg.customBadge2Desc || 'Özel Vubbio Rozeti 2',
        icon_url: cfg.customBadge2Icon?.startsWith('http') || cfg.customBadge2Icon?.startsWith('data:') ? cfg.customBadge2Icon : createEmojiBadgeSvg(cfg.customBadge2Icon)
      });
    }
    if (cfg.customBadge3Enabled && cfg.customBadge3Name) {
      list.push({
        id: 'v_custom_3',
        name: cfg.customBadge3Name,
        description: cfg.customBadge3Desc || 'Özel Vubbio Rozeti 3',
        icon_url: cfg.customBadge3Icon?.startsWith('http') || cfg.customBadge3Icon?.startsWith('data:') ? cfg.customBadge3Icon : createEmojiBadgeSvg(cfg.customBadge3Icon)
      });
    }
    return list;
  }

  // 10 Efsanevi Tema Koleksiyonu
  const THEMES = {
    default: '',
    oled: `
      body, #root, .bg-surface-base, .bg-surface-raised, .bg-surface-overlay { background-color: #000000 !important; }
      .border-border-default, .border-border-subtle { border-color: #121212 !important; }
      aside, nav, [class*="sidebar"] { background-color: #030303 !important; }
    `,
    cyberpunk: `
      body, #root { background-color: #080612 !important; }
      .bg-surface-base { background-color: #0c081e !important; }
      .bg-surface-raised { background-color: #120d2c !important; }
      .text-accent-primary, .text-accent-primary-text { color: #d946ef !important; }
      .bg-accent-primary { background-color: #c026d3 !important; }
      .border-border-default { border-color: rgba(192, 38, 211, 0.25) !important; }
    `,
    catppuccin: `
      body, #root, .bg-surface-base { background-color: #1e1e2e !important; }
      .bg-surface-raised { background-color: #181825 !important; }
      .bg-surface-overlay { background-color: #313244 !important; }
      .text-text-primary { color: #cdd6f4 !important; }
      .text-accent-primary { color: #89b4fa !important; }
      .bg-accent-primary { background-color: #89b4fa !important; color: #11111b !important; }
    `,
    neon: `
      body, #root, .bg-surface-base { background-color: #050805 !important; }
      .bg-surface-raised { background-color: #081008 !important; }
      .border-border-default { border-color: rgba(173, 255, 8, 0.2) !important; }
      .text-accent-primary { color: #ADFF08 !important; }
      .bg-accent-primary { background-color: #ADFF08 !important; color: #000000 !important; }
    `,
    dracula: `
      body, #root, .bg-surface-base { background-color: #282a36 !important; }
      .bg-surface-raised { background-color: #21222c !important; }
      .bg-surface-overlay { background-color: #44475a !important; }
      .text-accent-primary { color: #bd93f9 !important; }
      .bg-accent-primary { background-color: #bd93f9 !important; color: #282a36 !important; }
      .border-border-default { border-color: rgba(189, 147, 249, 0.2) !important; }
    `,
    nord: `
      body, #root, .bg-surface-base { background-color: #2e3440 !important; }
      .bg-surface-raised { background-color: #242933 !important; }
      .bg-surface-overlay { background-color: #3b4252 !important; }
      .text-accent-primary { color: #88c0d0 !important; }
      .bg-accent-primary { background-color: #88c0d0 !important; color: #2e3440 !important; }
      .border-border-default { border-color: rgba(136, 192, 208, 0.2) !important; }
    `,
    tokyo: `
      body, #root, .bg-surface-base { background-color: #1a1b26 !important; }
      .bg-surface-raised { background-color: #16161e !important; }
      .bg-surface-overlay { background-color: #24283b !important; }
      .text-accent-primary { color: #7aa2f7 !important; }
      .bg-accent-primary { background-color: #bb9af7 !important; color: #1a1b26 !important; }
      .border-border-default { border-color: rgba(122, 162, 247, 0.2) !important; }
    `,
    rose: `
      body, #root, .bg-surface-base { background-color: #191724 !important; }
      .bg-surface-raised { background-color: #1f1d2e !important; }
      .bg-surface-overlay { background-color: #26233a !important; }
      .text-accent-primary { color: #ebbcba !important; }
      .bg-accent-primary { background-color: #eb6f92 !important; color: #191724 !important; }
      .border-border-default { border-color: rgba(235, 188, 186, 0.2) !important; }
    `,
    sunset: `
      body, #root, .bg-surface-base { background-color: #140b24 !important; }
      .bg-surface-raised { background-color: #1e1035 !important; }
      .bg-surface-overlay { background-color: #2b174a !important; }
      .text-accent-primary { color: #ff71ce !important; }
      .bg-accent-primary { background-color: #01cdfe !important; color: #0b021a !important; }
      .border-border-default { border-color: rgba(255, 113, 206, 0.25) !important; }
    `
  };

  // Google Fonts
  const FONTS = {
    default: '',
    inter: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      body, button, input, textarea, select { font-family: 'Inter', sans-serif !important; }
    `,
    jetbrains: `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      body, button, input, textarea, select { font-family: 'JetBrains Mono', monospace !important; }
    `,
    fira: `
      @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap');
      body, button, input, textarea, select { font-family: 'Fira Code', monospace !important; }
    `,
    outfit: `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
      body, button, input, textarea, select { font-family: 'Outfit', sans-serif !important; }
    `,
    poppins: `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
      body, button, input, textarea, select { font-family: 'Poppins', sans-serif !important; }
    `
  };

  // ============================================================
  // SENTETİK SES MOTORU (SYNTHETIC SOUND FX)
  // ============================================================
  const SoundFX = {
    ctx: null,
    getCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    },
    play(pack = settings.soundPack) {
      if (pack === 'off') return;
      const ctx = this.getCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (pack === 'arcade') {
        // 8-bit retro arpeggio
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.05); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (pack === 'scifi') {
        // Neon sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (pack === 'glass') {
        // High crystalline chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (pack === 'minimal') {
        // Subtle soft blip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    }
  };

  // Vubbio Ana Mod Nesnesi
  const Vubbio = {
    version: VERSION,
    settings,
    customProfile,
    peerCache,
    authStore: null,
    subStore: null,
    deletedMessages: new Map(),
    messageAuditLog: persistentAuditLog,
    audioNodes: new WeakMap(),

    // Toast Bildirim Sistemi
    toast(title, message, type = 'info', duration = 3500) {
      if (!settings.showToasts) return;
      let container = document.getElementById('vubbio-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'vubbio-toast-container';
        container.style.cssText = `
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
          max-width: 360px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      const colors = {
        success: { border: '#22c55e', icon: '✓', glow: 'rgba(34, 197, 94, 0.3)' },
        info:    { border: '#38bdf8', icon: 'ℹ', glow: 'rgba(56, 189, 248, 0.3)' },
        warning: { border: '#eab308', icon: '⚠', glow: 'rgba(234, 179, 8, 0.3)' },
        danger:  { border: '#ef4444', icon: '✕', glow: 'rgba(239, 68, 68, 0.3)' },
        vubbio:  { border: '#ADFF08', icon: '⚡', glow: 'rgba(173, 255, 8, 0.4)' }
      };
      const themeColor = colors[type] || colors.info;

      toast.style.cssText = `
        pointer-events: auto;
        background: rgba(10, 15, 26, 0.94);
        border: 1px solid ${themeColor.border};
        box-shadow: 0 10px 30px -5px rgba(0,0,0,0.8), 0 0 20px ${themeColor.glow};
        backdrop-filter: blur(16px);
        color: #ffffff;
        padding: 12px 16px;
        border-radius: 12px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        opacity: 0;
        transform: translateX(40px) scale(0.95);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
      `;

      toast.innerHTML = `
        <div style="width:24px;height:24px;border-radius:50%;background:${themeColor.glow};border:1px solid ${themeColor.border};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:${themeColor.border};flex-shrink:0;">
          ${themeColor.icon}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:700;color:#ffffff;line-height:1.2;margin-bottom:2px;">${title}</div>
          <div style="font-size:12px;color:#94a3b8;line-height:1.4;word-break:break-word;">${message}</div>
        </div>
      `;

      container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0) scale(1)';
      });

      const dismiss = () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px) scale(0.9)';
        setTimeout(() => toast.remove(), 300);
      };

      toast.addEventListener('click', dismiss);
      setTimeout(dismiss, duration);
      SoundFX.play();
    },

    registerPeer(userId, data) {
      if (!userId || !data) return;
      this.peerCache[String(userId)] = {
        avatarUrl: data.a || data.avatarUrl || '',
        bannerUrl: data.b || data.bannerUrl || '',
        badges: data.g || data.badges || ['nexus', 'vubbio'],
        updatedAt: Date.now()
      };
      savePeerCache();
      this.syncDOMImages();
    },

    getPeer(userId) {
      return this.peerCache[String(userId)] || null;
    },

    inspectAndPatchUser(user) {
      if (!user || typeof user !== 'object' || !user.id) return user;

      const isMe = (customProfile.myUserId && String(user.id) === String(customProfile.myUserId)) ||
                   (this.authStore?.getState()?.user?.id && String(user.id) === String(this.authStore.getState().user.id));

      if (isMe) {
        if (customProfile.avatarUrl) {
          user.avatar_url = customProfile.avatarUrl;
          user.avatar = customProfile.avatarUrl;
        }
        if (customProfile.bannerUrl) {
          user.banner_url = customProfile.bannerUrl;
          user.banner = customProfile.bannerUrl;
        }
        return user;
      }

      const bio = user.bio;
      if (bio && typeof bio === 'string' && bio.includes(VUBBIO_MARKER)) {
        const decoded = decodeVubbioData(bio);
        if (decoded) {
          this.registerPeer(user.id, decoded);
          if (decoded.a) { user.avatar_url = decoded.a; user.avatar = decoded.a; }
          if (decoded.b) { user.banner_url = decoded.b; user.banner = decoded.b; }
          user.bio = stripVubbioData(bio);
        }
      }

      const peer = this.getPeer(user.id);
      if (peer) {
        if (peer.avatarUrl) { user.avatar_url = peer.avatarUrl; user.avatar = peer.avatarUrl; }
        if (peer.bannerUrl) { user.banner_url = peer.bannerUrl; user.banner = peer.bannerUrl; }
      }

      return user;
    },

    // ============================================================
    // THEMES, WALLPAPER & 12 HAZIR CSS FX MOTORU
    // ============================================================
    applyTheme() {
      // 1. Tema & Özel CSS
      let themeEl = document.getElementById('vubbio-theme-style');
      if (!themeEl) {
        themeEl = document.createElement('style');
        themeEl.id = 'vubbio-theme-style';
        document.head.appendChild(themeEl);
      }

      let fontEl = document.getElementById('vubbio-font-style');
      if (!fontEl) {
        fontEl = document.createElement('style');
        fontEl.id = 'vubbio-font-style';
        document.head.appendChild(fontEl);
      }

      let fxEl = document.getElementById('vubbio-fx-style');
      if (!fxEl) {
        fxEl = document.createElement('style');
        fxEl.id = 'vubbio-fx-style';
        document.head.appendChild(fxEl);
      }

      const selectedTheme = THEMES[settings.activeTheme] || '';
      const userCss = settings.customCss || '';
      themeEl.textContent = selectedTheme + '\n' + userCss;

      const selectedFont = FONTS[settings.activeFont] || '';
      fontEl.textContent = selectedFont;

      // 2. Canlı Duvar Kağıdı Motoru
      let wallLayer = document.getElementById('vubbio-wallpaper-layer');
      if (settings.wallpaperEnabled && settings.wallpaperUrl) {
        if (!wallLayer) {
          wallLayer = document.createElement('div');
          wallLayer.id = 'vubbio-wallpaper-layer';
          document.body.prepend(wallLayer);
        }
        wallLayer.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -999999;
          background-image: url('${settings.wallpaperUrl}');
          background-size: cover;
          background-position: center;
          filter: blur(${settings.wallpaperBlur}px);
          opacity: ${settings.wallpaperOpacity};
          pointer-events: none;
          transform: scale(1.03);
          transition: all 0.3s ease;
        `;
      } else if (wallLayer) {
        wallLayer.remove();
      }

      // 3. 12 Hazır Görsel & CSS FX Blokları
      let fxCss = '';
      if (settings.fxGlass || settings.wallpaperEnabled) {
        fxCss += `
          body, #root, .bg-surface-base, aside, nav, [class*="sidebar"] {
            background-color: rgba(10, 15, 26, 0.72) !important;
            backdrop-filter: blur(20px) saturate(160%) !important;
          }
        `;
      }
      if (settings.fxRgbBorder) {
        fxCss += `
          @keyframes vb-rgb-border {
            0% { border-color: #ff0055; box-shadow: 0 0 15px rgba(255,0,85,0.4); }
            33% { border-color: #00ffcc; box-shadow: 0 0 15px rgba(0,255,204,0.4); }
            66% { border-color: #ADFF08; box-shadow: 0 0 15px rgba(173,255,8,0.4); }
            100% { border-color: #ff0055; box-shadow: 0 0 15px rgba(255,0,85,0.4); }
          }
          [role="dialog"], .vubbio-modal { animation: vb-rgb-border 6s infinite linear !important; }
        `;
      }
      if (settings.fxRoundAvatar) {
        fxCss += `
          img[class*="avatar"], .vubbio-preview-avatar { border-radius: 50% !important; }
        `;
      }
      if (settings.fxSquircleAvatar) {
        fxCss += `
          img[class*="avatar"], .vubbio-preview-avatar { border-radius: 28% !important; }
        `;
      }
      if (settings.fxCompactChat) {
        fxCss += `
          [data-message-id] { padding-top: 2px !important; padding-bottom: 2px !important; line-height: 1.35 !important; }
        `;
      }
      if (settings.fxGlowUsernames) {
        fxCss += `
          [class*="author"], [class*="username"] { text-shadow: 0 0 8px rgba(173, 255, 8, 0.5) !important; }
        `;
      }
      if (settings.fxModernScrollbars) {
        fxCss += `
          ::-webkit-scrollbar { width: 5px !important; height: 5px !important; }
          ::-webkit-scrollbar-track { background: transparent !important; }
          ::-webkit-scrollbar-thumb { background: rgba(173, 255, 8, 0.3) !important; border-radius: 10px !important; }
          ::-webkit-scrollbar-thumb:hover { background: #ADFF08 !important; }
        `;
      }
      if (settings.fxSmoothTransitions) {
        fxCss += `
          [data-message-id] { animation: vb-msg-appear 0.2s ease-out forwards; }
          @keyframes vb-msg-appear { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        `;
      }
      if (settings.fxHideBlocked) {
        fxCss += `
          [data-is-blocked="true"], [class*="blocked-message"] { display: none !important; }
        `;
      }
      if (settings.fxRoleColorGlow) {
        fxCss += `
          [data-message-id]:hover { background: rgba(255, 255, 255, 0.02) !important; border-radius: 6px; }
        `;
      }
      if (settings.fxHoverTilt) {
        fxCss += `
          button:hover, .vubbio-badge-card:hover { transform: translateY(-2px); transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important; }
        `;
      }
      if (settings.fxCustomFontSize) {
        fxCss += `
          [data-message-id] [class*="content"] { font-size: ${settings.fxCustomFontSize}px !important; }
        `;
      }

      fxEl.textContent = fxCss;
    },

    // ============================================================
    // WEBRTC & MEDIA ENHANCER (4K 60FPS + 384kbps + SES GÜÇLENDİRİCİ)
    // ============================================================
    setupMediaEnhancers() {
      if (window.__VUBBIO_MEDIA_PATCHED__) return;
      window.__VUBBIO_MEDIA_PATCHED__ = true;

      const self = this;

      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const origGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getDisplayMedia = async function(constraints = {}) {
          if (settings.screenShare4k) {
            constraints = constraints || {};
            if (typeof constraints.video !== 'object' || constraints.video === null) {
              constraints.video = {};
            }
            constraints.video.width = { ideal: 3840, max: 3840 };
            constraints.video.height = { ideal: 2160, max: 2160 };
            constraints.video.frameRate = { ideal: 60, max: 60 };
            self.toast('4K 60FPS Yayın', 'Ekran paylaşımı 4K 60FPS modunda başlatıldı.', 'vubbio');
          }
          return origGetDisplayMedia(constraints);
        };
      }

      if (window.RTCPeerConnection) {
        const origSetLocalDescription = RTCPeerConnection.prototype.setLocalDescription;
        RTCPeerConnection.prototype.setLocalDescription = function(desc) {
          if (settings.voiceHd && desc && desc.sdp) {
            desc.sdp = desc.sdp.replace(
              /(a=fmtp:\d+ .*?)(maxaveragebitrate=\d+)?(.*)/g,
              (match, prefix, oldBitrate, suffix) => {
                if (match.includes('opus/48000') || prefix.includes('111') || prefix.includes('opus')) {
                  return `${prefix}maxaveragebitrate=384000;stereo=1;sprop-stereo=1;cbr=1;useinbandfec=1${suffix}`;
                }
                return match;
              }
            );
          }
          return origSetLocalDescription.apply(this, arguments);
        };
      }

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const boostElement = (mediaEl) => {
          if (!mediaEl || !(mediaEl instanceof HTMLMediaElement)) return;
          if (self.audioNodes.has(mediaEl)) {
            const data = self.audioNodes.get(mediaEl);
            const level = settings.volumeBooster ? (settings.volumeBoostLevel || 1.5) : 1.0;
            data.gainNode.gain.setValueAtTime(level, data.ctx.currentTime);
            return;
          }
          try {
            const ctx = new AudioCtx();
            const source = ctx.createMediaElementSource(mediaEl);
            const gainNode = ctx.createGain();
            const compressor = ctx.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-2, ctx.currentTime);
            compressor.knee.setValueAtTime(30, ctx.currentTime);
            compressor.ratio.setValueAtTime(12, ctx.currentTime);
            compressor.attack.setValueAtTime(0, ctx.currentTime);
            compressor.release.setValueAtTime(0.25, ctx.currentTime);

            const level = settings.volumeBooster ? (settings.volumeBoostLevel || 1.5) : 1.0;
            gainNode.gain.setValueAtTime(level, ctx.currentTime);

            source.connect(gainNode);
            gainNode.connect(compressor);
            compressor.connect(ctx.destination);

            self.audioNodes.set(mediaEl, { ctx, gainNode });
          } catch {}
        };

        setInterval(() => {
          if (settings.volumeBooster) {
            document.querySelectorAll('audio, video').forEach(boostElement);
          }
        }, 2000);
      }
    },

    // ============================================================
    // NETWORK INTERCEPTORS & /AUTH/ME ÇİFT YÖNLÜ KALICI KORUYUCU
    // ============================================================
    setupInterceptors() {
      if (window.__VUBBIO_FETCH_PATCHED__) return;
      window.__VUBBIO_FETCH_PATCHED__ = true;

      const self = this;

      const origFetch = window.fetch;
      window.fetch = async function(url, options = {}) {
        const u = String(url || '');

        if (settings.antiTrack) {
          if (u.includes('google-analytics') || u.includes('hotjar') || u.includes('sentry') || u.includes('/metrics') || u.includes('/analytics')) {
            return new Response('{}', { status: 200 });
          }
        }

        if (settings.stealthTyping && (u.includes('/typing') || u.includes('/typing-start'))) {
          return new Response('{}', { status: 200 });
        }

        // GET /api/v1/auth/me Koruması
        if (u.includes('/auth/me') || u.includes('/users/@me')) {
          const res = await origFetch.apply(this, arguments);
          try {
            const clone = res.clone();
            const json = await clone.json();
            if (json && json.id) {
              customProfile.myUserId = String(json.id);
              saveProfile();
              if (customProfile.avatarUrl) {
                json.avatar_url = customProfile.avatarUrl;
                json.avatar = customProfile.avatarUrl;
              }
              if (customProfile.bannerUrl) {
                json.banner_url = customProfile.bannerUrl;
                json.banner = customProfile.bannerUrl;
              }
              return new Response(JSON.stringify(json), {
                status: res.status,
                statusText: res.statusText,
                headers: res.headers
              });
            }
          } catch {}
          return res;
        }

        if (settings.nexusUnlocker) {
          if (u.includes('/subscriptions/status')) {
            return new Response(JSON.stringify({
              subscription: {
                id: 777777,
                status: 'active',
                source: 'vubbio',
                currentPeriodStart: new Date(Date.now() - 30 * 86400000).toISOString(),
                currentPeriodEnd: new Date(Date.now() + 3650 * 86400000).toISOString(),
                cancelledAt: null,
                plan: { id: 1, slug: 'nexus-monthly', name: 'Nexus', tier: 'pro' }
              }
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
          }

          if (u.includes('/subscriptions/plans')) {
            return new Response(JSON.stringify({
              plans: [{
                id: 1,
                slug: 'nexus-monthly',
                name: 'Nexus',
                is_active: true,
                interval: 'MONTHLY',
                price: '0',
                features: { badge: true, animatedAvatar: true, profileBanner: true, profileTheme: true, maxMessageLength: 4000, uploadLimit: 104857600 }
              }]
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
          }
        }

        return origFetch.apply(this, arguments);
      };

      const OrigXHR = window.XMLHttpRequest;
      class PatchedXHR extends OrigXHR {
        open(method, url, ...args) {
          this._vubbio_url = String(url || '');
          this._vubbio_method = (method || 'GET').toUpperCase();
          return super.open(method, url, ...args);
        }

        send(body) {
          const u = this._vubbio_url || '';
          const m = this._vubbio_method;

          if (settings.stealthTyping && u.includes('/typing')) {
            return this._respondJson({ success: true });
          }

          if (settings.nexusUnlocker) {
            if (u.includes('/subscriptions/status')) {
              return this._respondJson({
                subscription: {
                  id: 777777,
                  status: 'active',
                  source: 'vubbio',
                  currentPeriodStart: new Date(Date.now() - 30 * 86400000).toISOString(),
                  currentPeriodEnd: new Date(Date.now() + 3650 * 86400000).toISOString(),
                  cancelledAt: null,
                  plan: { id: 1, slug: 'nexus-monthly', name: 'Nexus', tier: 'pro' }
                }
              });
            }

            if (u.includes('/subscriptions/plans')) {
              return this._respondJson({
                plans: [{
                  id: 1,
                  slug: 'nexus-monthly',
                  name: 'Nexus',
                  is_active: true,
                  interval: 'MONTHLY',
                  price: '0',
                  features: { badge: true, animatedAvatar: true, profileBanner: true, profileTheme: true, maxMessageLength: 4000, uploadLimit: 104857600 }
                }]
              });
            }
          }

          if (u.includes('/badges')) {
            const match = u.match(/\/users\/([^\/]+)\/badges/);
            const targetId = match ? match[1] : null;
            const myId = customProfile.myUserId || self.authStore?.getState()?.user?.id;

            if (targetId && String(targetId) === String(myId)) {
              return this._respondJson({ badges: getBadgesForConfig(customProfile) });
            }

            const peer = targetId ? self.getPeer(targetId) : null;
            if (peer) {
              const peerBadges = [];
              if (peer.badges?.includes('nexus')) peerBadges.push({ id: 'v_nex', name: 'Jubbio Nexus Pro', description: 'Vubbio Nexus Pro', icon_url: BADGE_ICONS.nexus });
              if (peer.badges?.includes('vubbio')) peerBadges.push({ id: 'v_vip', name: 'Vubbio VIP', description: 'Vubbio VIP Mod', icon_url: BADGE_ICONS.vubbio });
              if (peer.badges?.includes('early')) peerBadges.push({ id: 'v_ear', name: 'Erken Destekçi', description: 'Erken Destekçi', icon_url: BADGE_ICONS.early });
              if (peer.badges?.includes('verified')) peerBadges.push({ id: 'v_ver', name: 'Doğrulanmış', description: 'Doğrulanmış Profil', icon_url: BADGE_ICONS.verified });
              return this._respondJson({ badges: peerBadges });
            }
          }

          if (u.includes('/auth/me/profile') && m === 'PATCH') {
            if (body instanceof FormData) {
              const avatarFile = body.get('avatar_url');
              const bannerFile = body.get('banner_url');
              let rawBio = body.get('bio') || '';
              const displayName = body.get('display_name');
              const profileTheme = body.get('profile_theme');

              const processFile = (file, cb) => {
                if (file && (file instanceof File || file instanceof Blob)) {
                  const reader = new FileReader();
                  reader.onload = () => cb(reader.result);
                  reader.readAsDataURL(file);
                } else if (typeof file === 'string') {
                  cb(file);
                } else {
                  cb(null);
                }
              };

              processFile(avatarFile, (avData) => {
                processFile(bannerFile, (baData) => {
                  if (avData) customProfile.avatarUrl = avData;
                  if (baData) customProfile.bannerUrl = baData;
                  saveProfile();

                  const cleanBio = stripVubbioData(rawBio);
                  const stegoPayload = {
                    a: customProfile.avatarUrl,
                    b: customProfile.bannerUrl,
                    g: ['nexus', 'vubbio', 'early', 'verified', customProfile.customBadgeName]
                  };
                  const encodedBio = cleanBio + ' ' + encodeVubbioData(stegoPayload);

                  const safeFormData = new FormData();
                  if (displayName) safeFormData.append('display_name', displayName);
                  safeFormData.append('bio', encodedBio);
                  if (profileTheme) safeFormData.append('profile_theme', profileTheme);

                  try {
                    window.fetch('/api/v1/auth/me/profile', { method: 'PATCH', body: safeFormData }).catch(() => {});
                  } catch {}

                  const curUser = self.authStore?.getState()?.user || {};
                  const updatedUser = {
                    ...curUser,
                    display_name: displayName || curUser.display_name,
                    bio: cleanBio,
                    avatar_url: customProfile.avatarUrl || curUser.avatar_url,
                    avatar: customProfile.avatarUrl || curUser.avatar,
                    banner_url: customProfile.bannerUrl || curUser.banner_url,
                    banner: customProfile.bannerUrl || curUser.banner,
                    profile_theme: profileTheme || curUser.profile_theme
                  };

                  self.authStore?.getState()?.setUser(updatedUser);
                  self.syncDOMImages();

                  return this._respondJson({ success: true, user: updatedUser });
                });
              });
              return;
            }
          }

          const origOnLoad = this.onload;
          this.onload = function(e) {
            try {
              let data = null;
              if (this.responseType === 'json' && typeof this.response === 'object') {
                data = this.response;
              } else if (this.responseText) {
                data = JSON.parse(this.responseText);
              }

              if (data) {
                let modified = false;

                if (u.includes('/auth/me')) {
                  if (data.id) {
                    customProfile.myUserId = String(data.id);
                    saveProfile();
                  }
                  if (customProfile.avatarUrl) {
                    data.avatar_url = customProfile.avatarUrl;
                    data.avatar = customProfile.avatarUrl;
                    modified = true;
                  }
                  if (customProfile.bannerUrl) {
                    data.banner_url = customProfile.bannerUrl;
                    data.banner = customProfile.bannerUrl;
                    modified = true;
                  }
                } else if (data.id && (data.username || data.display_name)) {
                  self.inspectAndPatchUser(data);
                  modified = true;
                } else if (Array.isArray(data)) {
                  for (const item of data) {
                    if (item && item.id) {
                      self.inspectAndPatchUser(item);
                      if (item.user) self.inspectAndPatchUser(item.user);
                      if (item.author) self.inspectAndPatchUser(item.author);
                      modified = true;
                    }
                  }
                } else if (data.messages && Array.isArray(data.messages)) {
                  for (const m of data.messages) {
                    if (m.author) self.inspectAndPatchUser(m.author);
                    if (m.user) self.inspectAndPatchUser(m.user);
                    if (m.id) self.deletedMessages.set(String(m.id), m);
                    modified = true;
                  }
                } else if (data.user && data.user.id) {
                  self.inspectAndPatchUser(data.user);
                  modified = true;
                }

                if (modified) {
                  const newStr = JSON.stringify(data);
                  Object.defineProperty(this, 'responseText', { get: () => newStr, configurable: true });
                  Object.defineProperty(this, 'response', {
                    get: () => (this.responseType === 'json' ? data : newStr),
                    configurable: true
                  });
                }
              }
            } catch {}
            if (origOnLoad) origOnLoad.call(this, e);
          };

          return super.send(body);
        }

        _respondJson(data) {
          const jsonStr = JSON.stringify(data);
          setTimeout(() => {
            try {
              Object.defineProperty(this, 'readyState', { get: () => 4, configurable: true });
              Object.defineProperty(this, 'status', { get: () => 200, configurable: true });
              Object.defineProperty(this, 'statusText', { get: () => 'OK', configurable: true });
              Object.defineProperty(this, 'responseText', { get: () => jsonStr, configurable: true });
              Object.defineProperty(this, 'response', {
                get: () => (this.responseType === 'json' ? data : jsonStr),
                configurable: true
              });
              this.getAllResponseHeaders = () => 'content-type: application/json\r\n';
              this.getResponseHeader = (h) => (h.toLowerCase() === 'content-type' ? 'application/json' : null);

              const ev = new Event('load');
              if (typeof this.onload === 'function') this.onload(ev);
              if (typeof this.onreadystatechange === 'function') this.onreadystatechange(ev);
              if (typeof this.onloadend === 'function') this.onloadend(ev);

              this.dispatchEvent(new Event('readystatechange'));
              this.dispatchEvent(ev);
              this.dispatchEvent(new Event('loadend'));
            } catch {}
          }, 10);
        }
      }

      window.XMLHttpRequest = PatchedXHR;
    },

    // ============================================================
    // WEBSOCKET & KALICI MESSAGE LOGGER
    // ============================================================
    setupWebSocketHook() {
      if (window.__VUBBIO_WS_PATCHED__) return;
      window.__VUBBIO_WS_PATCHED__ = true;

      const self = this;
      const OrigWS = window.WebSocket;

      window.WebSocket = function(...args) {
        const ws = new OrigWS(...args);

        const origSend = ws.send;
        ws.send = function(data) {
          if (settings.stealthTyping && typeof data === 'string') {
            try {
              const parsed = JSON.parse(data);
              if (parsed.t === 'TYPING_START' || parsed.event === 'typing' || parsed.type === 'typing') {
                return;
              }
            } catch {}
          }
          return origSend.call(this, data);
        };

        ws.addEventListener('message', (event) => {
          try {
            if (typeof event.data === 'string') {
              const msg = JSON.parse(event.data);
              if (!msg) return;

              if (msg.author) self.inspectAndPatchUser(msg.author);
              if (msg.user) self.inspectAndPatchUser(msg.user);

              if (msg.t === 'MESSAGE_CREATE' || msg.event === 'message_created' || msg.type === 'message') {
                const mData = msg.d || msg.message || msg.data || msg;
                if (mData && mData.id) {
                  self.deletedMessages.set(String(mData.id), mData);
                }
              }

              if (settings.messageLogger && (msg.t === 'MESSAGE_DELETE' || msg.event === 'message_deleted' || msg.type === 'delete_message')) {
                const mid = String(msg.d?.id || msg.message_id || msg.id);
                const cached = self.deletedMessages.get(mid);
                const authorName = cached?.author?.display_name || cached?.author?.username || 'Biri';
                const content = cached?.content || '(İçerik önbellekte yok)';

                self.messageAuditLog.unshift({
                  id: mid,
                  author: authorName,
                  content: content,
                  type: 'deleted',
                  timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                });
                if (self.messageAuditLog.length > 100) self.messageAuditLog.pop();
                saveAuditLog();

                self.toast('Mesaj Silindi', `${authorName}: "${content.substring(0, 45)}${content.length > 45 ? '...' : ''}"`, 'danger');

                setTimeout(() => {
                  const msgEl = document.querySelector(`[data-message-id="${mid}"]`);
                  if (msgEl) {
                    msgEl.style.setProperty('border-left', '3px solid #ef4444', 'important');
                    msgEl.style.setProperty('background-color', 'rgba(239, 68, 68, 0.1)', 'important');
                    if (!msgEl.querySelector('.vubbio-deleted-tag')) {
                      const tag = document.createElement('span');
                      tag.className = 'vubbio-deleted-tag';
                      tag.textContent = ' [SİLİNDİ]';
                      tag.style.cssText = 'color:#ef4444;font-size:10px;font-weight:bold;margin-left:6px;background:rgba(239,68,68,0.15);padding:1px 5px;border-radius:4px;';
                      const header = msgEl.querySelector('[class*="header"], [class*="author"]') || msgEl;
                      header.appendChild(tag);
                    }
                  }
                }, 50);
              }

              if (settings.logEditedMessages && (msg.t === 'MESSAGE_UPDATE' || msg.event === 'message_updated' || msg.type === 'update_message')) {
                const mData = msg.d || msg.message || msg.data || msg;
                const mid = String(mData?.id || msg.message_id);
                const oldMsg = self.deletedMessages.get(mid);
                const oldContent = oldMsg?.content || '';
                const newContent = mData?.content || '';

                if (oldContent && newContent && oldContent !== newContent) {
                  const authorName = oldMsg?.author?.display_name || oldMsg?.author?.username || 'Biri';
                  self.messageAuditLog.unshift({
                    id: mid,
                    author: authorName,
                    oldContent,
                    newContent,
                    type: 'edited',
                    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                  });
                  if (self.messageAuditLog.length > 100) self.messageAuditLog.pop();
                  saveAuditLog();

                  self.toast('Mesaj Düzenlendi', `${authorName}: "${oldContent.substring(0, 30)}..." → "${newContent.substring(0, 30)}..."`, 'warning');

                  setTimeout(() => {
                    const msgEl = document.querySelector(`[data-message-id="${mid}"]`);
                    if (msgEl && !msgEl.querySelector('.vubbio-edited-tag')) {
                      msgEl.style.setProperty('border-left', '3px solid #eab308', 'important');
                      const tag = document.createElement('span');
                      tag.className = 'vubbio-edited-tag';
                      tag.title = `Eski Metin: ${oldContent}`;
                      tag.textContent = ` [DÜZENLENDİ: "${oldContent.substring(0, 25)}${oldContent.length > 25 ? '...' : ''}"]`;
                      tag.style.cssText = 'color:#eab308;font-size:10px;font-weight:600;margin-left:6px;background:rgba(234,179,8,0.15);padding:1px 5px;border-radius:4px;cursor:help;';
                      const header = msgEl.querySelector('[class*="header"], [class*="author"]') || msgEl;
                      header.appendChild(tag);
                    }
                  }, 50);
                }
              }
            }
          } catch {}
        });

        return ws;
      };
    },

    // ============================================================
    // SOHBET KISAYOLLARI & KARAKTER SAYACI
    // ============================================================
    setupChatTools() {
      if (window.__VUBBIO_CHAT_PATCHED__) return;
      window.__VUBBIO_CHAT_PATCHED__ = true;

      const self = this;
      const SHORTCUTS = {
        '/shrug': '¯\\_(ツ)_/¯',
        '/tableflip': '(╯°□°)╯︵ ┻━┻',
        '/unflip': '┬─┬ノ( º _ ºノ)',
        '/lenny': '( ͡° ͜ʖ ͡°)',
        '/disapproval': 'ಠ_ಠ',
        '/vubbio': '⚡ Vubbio Ultra Mod Suite v7.0',
        '/heart': '💖',
        '/fire': '🔥'
      };

      document.addEventListener('keydown', (e) => {
        if (!settings.chatShortcuts) return;
        const target = e.target;
        if (!target || !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable)) return;

        if (e.key === 'Enter' || e.key === ' ') {
          let val = target.value || target.innerText || '';
          const trimmed = val.trim();

          // 1. Standart kısayollar
          if (SHORTCUTS[trimmed]) {
            e.preventDefault();
            const rep = SHORTCUTS[trimmed];
            if (target.value !== undefined) target.value = rep; else target.innerText = rep;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            self.toast('Kısayol', `${trimmed} → ${rep}`, 'vubbio', 1200);
            return;
          }

          // 2. /mock <metin> (tExT lIkE tHiS)
          if (trimmed.startsWith('/mock ')) {
            e.preventDefault();
            const raw = trimmed.slice(6);
            const mock = raw.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
            if (target.value !== undefined) target.value = mock; else target.innerText = mock;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            return;
          }

          // 3. /clap <metin> (Metin 👏 Arasına 👏 Alkış)
          if (trimmed.startsWith('/clap ')) {
            e.preventDefault();
            const clap = trimmed.slice(6).split(' ').join(' 👏 ');
            if (target.value !== undefined) target.value = clap; else target.innerText = clap;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            return;
          }

          // 4. /reverse <metin>
          if (trimmed.startsWith('/reverse ')) {
            e.preventDefault();
            const rev = trimmed.slice(9).split('').reverse().join('');
            if (target.value !== undefined) target.value = rev; else target.innerText = rev;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            return;
          }
        }
      }, true);

      // Karakter Sayacı
      const updateCounter = () => {
        if (!settings.charCounter) {
          const c = document.getElementById('vubbio-char-counter');
          if (c) c.remove();
          return;
        }

        const activeInput = document.querySelector('textarea[placeholder*="mesaj"], [contenteditable="true"], textarea');
        if (!activeInput) return;

        let counterEl = document.getElementById('vubbio-char-counter');
        if (!counterEl) {
          counterEl = document.createElement('div');
          counterEl.id = 'vubbio-char-counter';
          counterEl.style.cssText = `
            position: fixed;
            bottom: 74px;
            right: 85px;
            z-index: 99999;
            background: rgba(10, 15, 26, 0.88);
            border: 1px solid rgba(173, 255, 8, 0.4);
            backdrop-filter: blur(12px);
            color: #ADFF08;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 4px;
          `;
          document.body.appendChild(counterEl);
        }

        const length = (activeInput.value || activeInput.innerText || '').length;
        counterEl.innerHTML = `<span>⚡</span> ${length} / 4000`;
        counterEl.style.display = length > 0 ? 'flex' : 'none';
      };

      setInterval(updateCounter, 500);
    },

    // ============================================================
    // MESAJ ÜSTÜ HIZLI ARAÇLAR & GOOGLE ÇEVİRİ (QUICK MESSAGE TOOLBAR)
    // ============================================================
    setupMessageQuickToolbar() {
      if (window.__VUBBIO_QUICK_BAR_PATCHED__) return;
      window.__VUBBIO_QUICK_BAR_PATCHED__ = true;

      const self = this;
      let bar = document.getElementById('vubbio-quick-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'vubbio-quick-bar';
        bar.style.cssText = `
          position: absolute;
          display: none;
          gap: 4px;
          background: rgba(10, 15, 26, 0.95);
          border: 1px solid rgba(173, 255, 8, 0.4);
          box-shadow: 0 8px 24px rgba(0,0,0,0.6);
          backdrop-filter: blur(16px);
          padding: 4px 6px;
          border-radius: 8px;
          z-index: 99999;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          user-select: none;
        `;
        document.body.appendChild(bar);
      }

      let currentTargetMessage = null;

      document.addEventListener('mouseover', (e) => {
        const msgEl = e.target.closest('[data-message-id]');
        if (msgEl && msgEl !== currentTargetMessage) {
          currentTargetMessage = msgEl;
          const rect = msgEl.getBoundingClientRect();
          bar.style.top = `${window.scrollY + rect.top - 28}px`;
          bar.style.right = `${window.innerWidth - rect.right + 16}px`;
          bar.style.display = 'flex';

          bar.innerHTML = `
            <button class="vb-q-btn" id="vb-q-copy" title="Metni Kopyala" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;padding:2px 6px;border-radius:4px;">📋</button>
            <button class="vb-q-btn" id="vb-q-trans" title="Türkçe'ye Çevir" style="background:transparent;border:none;color:#ADFF08;cursor:pointer;padding:2px 6px;border-radius:4px;font-weight:bold;">🌐 Çevir</button>
            <button class="vb-q-btn" id="vb-q-id" title="Mesaj ID Kopyala" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;padding:2px 6px;border-radius:4px;">🆔</button>
          `;

          bar.querySelector('#vb-q-copy')?.addEventListener('click', () => {
            const text = msgEl.querySelector('[class*="content"]')?.innerText || msgEl.innerText;
            navigator.clipboard.writeText(text);
            self.toast('Kopyalandı', 'Mesaj panoya kopyalandı.', 'info', 1500);
          });

          bar.querySelector('#vb-q-id')?.addEventListener('click', () => {
            const mid = msgEl.getAttribute('data-message-id');
            navigator.clipboard.writeText(mid);
            self.toast('ID Kopyalandı', `Mesaj ID: ${mid}`, 'info', 1500);
          });

          bar.querySelector('#vb-q-trans')?.addEventListener('click', async () => {
            const contentEl = msgEl.querySelector('[class*="content"]') || msgEl;
            const text = contentEl.innerText;
            try {
              const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(text)}`);
              const data = await res.json();
              const translated = data[0].map(x => x[0]).join('');

              if (!msgEl.querySelector('.vb-translated-box')) {
                const trBox = document.createElement('div');
                trBox.className = 'vb-translated-box';
                trBox.style.cssText = `
                  margin-top: 6px;
                  padding: 6px 10px;
                  background: rgba(173, 255, 8, 0.08);
                  border-left: 3px solid #ADFF08;
                  border-radius: 4px;
                  font-size: 12px;
                  color: #e2e8f0;
                `;
                trBox.innerHTML = `<span style="color:#ADFF08;font-weight:bold;font-size:10px;margin-right:6px;">[TÜRKÇE ÇEVİRİ]:</span> ${translated}`;
                contentEl.appendChild(trBox);
                self.toast('Çeviri Yapıldı', 'Mesaj Türkçe\'ye çevrildi.', 'vubbio', 1500);
              }
            } catch (err) {
              self.toast('Çeviri Hatası', 'Çeviri servisine ulaşılamadı.', 'danger', 2000);
            }
          });
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (!e.target.closest('[data-message-id]') && !e.target.closest('#vubbio-quick-bar')) {
          bar.style.display = 'none';
          currentTargetMessage = null;
        }
      });
    },

    // ============================================================
    // FAKENITRO & EMOJİ KİLİT KALDIRICI
    // ============================================================
    setupFakeNitro() {
      if (window.__VUBBIO_EMOJI_PATCHED__) return;
      window.__VUBBIO_EMOJI_PATCHED__ = true;

      const self = this;
      document.addEventListener('click', (e) => {
        if (!settings.serverEmotes) return;
        const target = e.target;
        const emojiCard = target.closest('[data-nexus-locked="true"], [class*="locked"], [class*="disabled"]');
        if (emojiCard) {
          const img = emojiCard.querySelector('img');
          if (img && img.src) {
            e.stopPropagation();
            e.preventDefault();
            const chatInput = document.querySelector('textarea, [contenteditable="true"]');
            if (chatInput) {
              if (chatInput.value !== undefined) {
                chatInput.value += ` ${img.src} `;
              } else {
                chatInput.innerText += ` ${img.src} `;
              }
              chatInput.dispatchEvent(new Event('input', { bubbles: true }));
              self.toast('FakeNitro Emoji', 'Kilitli emoji mesaja eklendi!', 'vubbio', 2000);
            }
          }
        }
      }, true);
    },

    // ============================================================
    // ZUSTAND STORES & ÇİFT YÖNLÜ KALICI KİLİT
    // ============================================================
    async hookStores() {
      if (this._storesHooked) return;
      this._storesHooked = true;

      try {
        const scriptEl = document.querySelector('script[type="module"][src*="index-"]') ||
                         document.querySelector('script[src*="index-"]');
        const src = scriptEl ? scriptEl.getAttribute('src') : './assets/index-BTphJn22.js';

        const mainModule = await import(src);
        if (mainModule) {
          if (mainModule.f && typeof mainModule.f.getState === 'function') {
            this.authStore = mainModule.f;

            const origSetUser = this.authStore.getState().setUser;
            if (origSetUser && !origSetUser.__vubbio) {
              const hooked = function(u) {
                if (u) {
                  if (customProfile.avatarUrl) {
                    u.avatar_url = customProfile.avatarUrl;
                    u.avatar = customProfile.avatarUrl;
                  }
                  if (customProfile.bannerUrl) {
                    u.banner_url = customProfile.bannerUrl;
                    u.banner = customProfile.bannerUrl;
                  }
                  if (u.id) {
                    customProfile.myUserId = String(u.id);
                    saveProfile();
                  }
                }
                return origSetUser.call(this, u);
              };
              hooked.__vubbio = true;
              this.authStore.getState().setUser = hooked;
            }

            if (typeof this.authStore.subscribe === 'function') {
              this.authStore.subscribe((state) => {
                if (state?.user) {
                  const u = state.user;
                  if (u.id) customProfile.myUserId = String(u.id);
                  if (customProfile.avatarUrl && (u.avatar_url !== customProfile.avatarUrl || u.avatar !== customProfile.avatarUrl)) {
                    u.avatar_url = customProfile.avatarUrl;
                    u.avatar = customProfile.avatarUrl;
                  }
                  if (customProfile.bannerUrl && (u.banner_url !== customProfile.bannerUrl || u.banner !== customProfile.bannerUrl)) {
                    u.banner_url = customProfile.bannerUrl;
                    u.banner = customProfile.bannerUrl;
                  }
                }
              });
            }

            this.syncAuthStore();
          }

          if (mainModule.H && typeof mainModule.H.getState === 'function') {
            this.subStore = mainModule.H;
            this.syncSubStore();
          }
        }
      } catch (err) {
        console.warn('[Vubbio] Store bağlama:', err.message);
      }

      setInterval(() => {
        if (this.subStore)  this.syncSubStore();
        if (this.authStore) this.syncAuthStore();
        this.syncDOMImages();
      }, 1500);
    },

    syncSubStore() {
      if (!this.subStore || !settings.nexusUnlocker) return;
      const cur = this.subStore.getState();
      if (!cur.currentSubscription || cur.currentSubscription.planId !== 'nexus') {
        this.subStore.setState({
          plans: [{
            id: 'nexus',
            name: 'Nexus',
            tier: 'pro',
            features: [
              { key: 'badge', value: true },
              { key: 'animatedAvatar', value: true },
              { key: 'profileBanner', value: true },
              { key: 'profileTheme', value: true },
              { key: 'maxMessageLength', value: 4000 }
            ],
            pricing: [{ id: 'nexus-monthly', backendId: 1, interval: 'monthly', price: 0 }]
          }],
          currentSubscription: {
            id: '777777',
            planId: 'nexus',
            pricingId: 'nexus-monthly',
            status: 'active',
            source: 'vubbio',
            currentPeriodStart: new Date(Date.now() - 30 * 86400000).toISOString(),
            currentPeriodEnd: new Date(Date.now() + 3650 * 86400000).toISOString(),
            cancelledAt: null
          },
          error: null,
          isLoading: false
        });
      }
    },

    syncAuthStore() {
      if (!this.authStore) return;
      const user = this.authStore.getState()?.user;
      if (!user) return;

      if (user.id && !customProfile.myUserId) {
        customProfile.myUserId = String(user.id);
        saveProfile();
      }

      let changed = false;
      const nextUser = { ...user };

      if (customProfile.avatarUrl && (user.avatar_url !== customProfile.avatarUrl || user.avatar !== customProfile.avatarUrl)) {
        nextUser.avatar_url = customProfile.avatarUrl;
        nextUser.avatar = customProfile.avatarUrl;
        changed = true;
      }

      if (customProfile.bannerUrl && (user.banner_url !== customProfile.bannerUrl || user.banner !== customProfile.bannerUrl)) {
        nextUser.banner_url = customProfile.bannerUrl;
        nextUser.banner = customProfile.bannerUrl;
        changed = true;
      }

      if (changed) {
        this.authStore.getState().setUser(nextUser);
      }
    },

    syncDOMImages() {
      const curUser = this.authStore?.getState()?.user;
      const myId = String(customProfile.myUserId || curUser?.id || '');
      const myUsername = (curUser?.username || '').toLowerCase();
      const myDisplayName = (curUser?.display_name || '').toLowerCase();

      // Kendi Avatarı
      if (customProfile.avatarUrl) {
        document.querySelectorAll('img').forEach(img => {
          const alt = (img.getAttribute('alt') || '').toLowerCase();
          const src = img.getAttribute('src') || '';
          if (
            (myUsername && alt.includes(myUsername)) ||
            (myDisplayName && alt.includes(myDisplayName)) ||
            (myId && img.closest(`[data-user-id="${myId}"]`)) ||
            img.closest('[data-current-user="true"]')
          ) {
            if (src !== customProfile.avatarUrl) {
              img.src = customProfile.avatarUrl;
            }
          }
        });
      }

      // Kendi Banner'ı
      if (customProfile.bannerUrl) {
        const dialogBanners = document.querySelectorAll(
          '[role="dialog"] div.bg-cover, ' +
          '[role="dialog"] div.bg-center, ' +
          '[role="dialog"] div[class*="banner"], ' +
          '[data-current-user="true"] div.bg-cover'
        );
        dialogBanners.forEach(div => {
          const rect = div.getBoundingClientRect();
          if (rect.width >= 240 && rect.height >= 60) {
            const target = `url("${customProfile.bannerUrl}")`;
            const current = div.style.backgroundImage || '';
            if (!current.includes(customProfile.bannerUrl.substring(0, 40))) {
              div.style.setProperty('background-image', target, 'important');
              div.style.setProperty('background-size', 'cover', 'important');
              div.style.setProperty('background-position', 'center', 'important');
              div.style.setProperty('opacity', '1', 'important');
            }
          }
        });

        document.querySelectorAll('img[alt="Banner"]').forEach(img => {
          if (img.src !== customProfile.bannerUrl) img.src = customProfile.bannerUrl;
        });
      }

      // Peer Avatarları & Banner'ları
      for (const [peerId, peerData] of Object.entries(this.peerCache)) {
        if (!peerData) continue;
        if (peerData.avatarUrl) {
          document.querySelectorAll(
            `img[alt*="${peerId}"], [data-user-id="${peerId}"] img`
          ).forEach(img => {
            if (img.src !== peerData.avatarUrl) img.src = peerData.avatarUrl;
          });
        }
        if (peerData.bannerUrl) {
          document.querySelectorAll(
            `[role="dialog"][data-user-id="${peerId}"] div.bg-cover, ` +
            `[data-user-id="${peerId}"] div.bg-cover`
          ).forEach(div => {
            div.style.setProperty('background-image', `url("${peerData.bannerUrl}")`, 'important');
          });
        }
      }
    },

    // ============================================================
    // VUBBIO ULTRA UI & MOD MENÜSÜ (8 SEKMELİ KAPSAMLI SUITE)
    // ============================================================
    injectUI() {
      const oldBadge = document.getElementById('vubbio-badge-root');
      if (oldBadge) oldBadge.remove();
      const oldModal = document.getElementById('vubbio-modal-root');
      if (oldModal) oldModal.remove();
      const oldStyle = document.getElementById('vubbio-custom-css');
      if (oldStyle) oldStyle.remove();

      const curUser = this.authStore?.getState()?.user;
      const initialName = curUser?.display_name || curUser?.username || 'Kullanıcı';
      const initialHandle = '@' + (curUser?.username || 'jubbio');

      const style = document.createElement('style');
      style.id = 'vubbio-custom-css';
      style.textContent = `
        /* ===== VUBBIO ULTRA AESTHETIC SUITE ===== */
        @keyframes vb-glow {
          0%, 100% { opacity: 0.8; transform: scale(1); filter: drop-shadow(0 0 10px #ADFF08); }
          50% { opacity: 0.35; transform: scale(0.9); filter: drop-shadow(0 0 2px #ADFF08); }
        }

        @keyframes vb-modal-in {
          0% { transform: scale(0.95) translateY(12px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        #vubbio-badge-root {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', 'Segoe UI', Roboto, sans-serif;
          user-select: none;
        }

        .vubbio-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(8, 12, 22, 0.88);
          border: 1px solid rgba(173, 255, 8, 0.4);
          backdrop-filter: blur(24px) saturate(160%);
          color: #ffffff;
          padding: 8px 16px 8px 12px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 12px 35px -8px rgba(0, 0, 0, 0.75), 0 0 24px rgba(173, 255, 8, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vubbio-pill:hover {
          background: rgba(13, 20, 36, 0.95);
          border-color: #ADFF08;
          box-shadow: 0 16px 45px -8px rgba(0, 0, 0, 0.85), 0 0 35px rgba(173, 255, 8, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25);
          transform: translateY(-2px) scale(1.03);
        }

        .vubbio-pill-icon-box {
          width: 22px;
          height: 22px;
          background: linear-gradient(135deg, #ADFF08 0%, #22c55e 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #070a12;
          font-size: 12px;
          font-weight: 900;
          box-shadow: 0 0 12px rgba(173, 255, 8, 0.6);
        }

        .vubbio-pill-label {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vubbio-pill-label span.name {
          color: #ffffff;
          font-weight: 800;
        }

        .vubbio-pill-label span.badge {
          background: rgba(173, 255, 8, 0.2);
          color: #ADFF08;
          border: 1px solid rgba(173, 255, 8, 0.4);
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .vubbio-pill-shortcut {
          font-size: 10px;
          color: #64748b;
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 2px;
        }

        /* ===== MODAL ===== */
        #vubbio-modal-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(2, 6, 17, 0.75);
          backdrop-filter: blur(16px);
          z-index: 1000000;
          display: none;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', 'Segoe UI', Roboto, sans-serif;
        }

        #vubbio-modal-root.active {
          display: flex;
        }

        .vubbio-modal {
          width: 980px;
          max-width: 96vw;
          height: 720px;
          max-height: 94vh;
          background: rgba(10, 15, 26, 0.96);
          border: 1px solid rgba(173, 255, 8, 0.28);
          border-radius: 20px;
          box-shadow: 0 35px 80px -15px rgba(0, 0, 0, 0.95), 0 0 50px rgba(173, 255, 8, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(40px);
          display: flex;
          flex-direction: row;
          overflow: hidden;
          animation: vb-modal-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          color: #ffffff;
        }

        /* ===== SIDEBAR ===== */
        .vubbio-modal-sidebar {
          width: 224px;
          flex-shrink: 0;
          background: rgba(7, 10, 18, 0.95);
          border-right: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          flex-direction: column;
          padding: 18px 12px 14px;
          user-select: none;
        }

        .vubbio-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 2px 8px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 12px;
        }

        .vubbio-sidebar-logo {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #ADFF08 0%, #22c55e 100%);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #070a12;
          font-size: 18px;
          font-weight: 900;
          box-shadow: 0 0 16px rgba(173, 255, 8, 0.45);
        }

        .vubbio-sidebar-title {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vubbio-sidebar-ver {
          font-size: 9.5px;
          font-weight: 800;
          background: rgba(173, 255, 8, 0.15);
          color: #ADFF08;
          padding: 1px 5px;
          border-radius: 4px;
          border: 1px solid rgba(173, 255, 8, 0.3);
        }

        .vubbio-sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .vubbio-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #94a3b8;
          font-size: 12.5px;
          font-weight: 600;
          padding: 9px 12px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.18s ease;
          text-align: left;
          width: 100%;
        }

        .vubbio-tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        .vubbio-tab-btn.active {
          color: #ADFF08;
          background: rgba(173, 255, 8, 0.1);
          border: 1px solid rgba(173, 255, 8, 0.25);
          font-weight: 700;
          box-shadow: 0 2px 12px rgba(173, 255, 8, 0.15);
        }

        .vubbio-tab-btn .tab-icon {
          font-size: 15px;
          width: 20px;
          display: inline-flex;
          justify-content: center;
        }

        .vubbio-sidebar-footer {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vubbio-sidebar-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #22c55e;
          font-weight: 600;
          padding: 0 4px;
        }

        .vubbio-live-dot {
          width: 7px;
          height: 7px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 8px #22c55e;
        }

        /* ===== RIGHT MAIN PANEL ===== */
        .vubbio-modal-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: rgba(11, 15, 26, 0.88);
        }

        .vubbio-main-topbar {
          padding: 16px 26px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: rgba(255, 255, 255, 0.01);
        }

        .vubbio-topbar-info h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .vubbio-topbar-info p {
          margin: 2px 0 0;
          font-size: 12px;
          color: #94a3b8;
        }

        .vubbio-topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vubbio-search-box {
          position: relative;
          width: 210px;
        }

        .vubbio-search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 9999px;
          padding: 6px 12px 6px 30px;
          font-size: 12px;
          color: #ffffff;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .vubbio-search-input:focus {
          border-color: #ADFF08;
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 12px rgba(173, 255, 8, 0.2);
        }

        .vubbio-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 11px;
          color: #64748b;
          pointer-events: none;
        }

        .vubbio-modal-close {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #94a3b8;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .vubbio-modal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #ef4444;
        }

        /* ===== MODAL BODY ===== */
        .vubbio-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 22px 26px;
        }

        .vubbio-tab-content {
          display: none;
          animation: vb-fade-in 0.18s ease forwards;
        }

        .vubbio-tab-content.active {
          display: block;
        }

        @keyframes vb-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ===== LIVE PROFILE CARD ===== */
        .vubbio-live-card {
          border-radius: 14px;
          background: rgba(18, 24, 38, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.07);
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        .vubbio-preview-banner {
          height: 110px;
          background-size: cover;
          background-position: center;
          background-color: #1e293b;
          position: relative;
        }

        .vubbio-preview-body {
          padding: 0 18px 16px;
          display: flex;
          align-items: flex-end;
          gap: 14px;
          margin-top: -38px;
          position: relative;
        }

        .vubbio-preview-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          border: 3.5px solid #0b0f1a;
          background: #0b0f1a;
          object-fit: cover;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        }

        .vubbio-preview-info {
          flex: 1;
          margin-bottom: 2px;
        }

        .vubbio-preview-name {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
        }

        .vubbio-preview-handle {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .vubbio-preview-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .vubbio-preview-badge-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          object-fit: contain;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));
        }

        /* ===== CARDS & INPUTS ===== */
        .vubbio-card {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          padding: 15px 18px;
          margin-bottom: 14px;
        }

        .vubbio-card-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 11px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vubbio-card-title .sub {
          font-size: 10.5px;
          font-weight: normal;
          color: #ADFF08;
          background: rgba(173, 255, 8, 0.12);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .vubbio-input-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .vubbio-text-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12.5px;
          color: #ffffff;
          outline: none;
          transition: border-color 0.2s;
        }

        .vubbio-text-input:focus {
          border-color: #ADFF08;
          background: rgba(255, 255, 255, 0.06);
        }

        .vubbio-btn-file {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 11.5px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .vubbio-btn-file:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .vubbio-btn-danger-sm {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 8px;
          padding: 8px 12px;
          color: #ef4444;
          font-size: 11.5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .vubbio-btn-danger-sm:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* BADGES */
        .vubbio-badge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 8px;
        }

        .vubbio-badge-card {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          padding: 9px 11px;
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          transition: all 0.18s;
        }

        .vubbio-badge-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(173, 255, 8, 0.35);
        }

        .vubbio-badge-card img {
          width: 22px;
          height: 22px;
        }

        .vubbio-badge-card span {
          font-size: 11.5px;
          font-weight: 600;
          color: #e2e8f0;
        }

        /* TOGGLE ROWS */
        .vubbio-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 11px;
          margin-bottom: 9px;
          transition: all 0.18s;
        }

        .vubbio-toggle-row:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .vubbio-toggle-text h4 {
          margin: 0 0 3px 0;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .vubbio-toggle-text p {
          margin: 0;
          font-size: 11.5px;
          color: #94a3b8;
          line-height: 1.35;
        }

        .vubbio-switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 22px;
          flex-shrink: 0;
        }

        .vubbio-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .vubbio-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.12);
          transition: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 22px;
        }

        .vubbio-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 50%;
        }

        input:checked + .vubbio-slider {
          background-color: #ADFF08;
        }

        input:checked + .vubbio-slider:before {
          transform: translateX(18px);
          background-color: #070a12;
        }

        /* THEMES */
        .vubbio-theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 10px;
          margin-bottom: 18px;
        }

        .vubbio-theme-card {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 11px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.18s;
        }

        .vubbio-theme-card:hover {
          border-color: rgba(173, 255, 8, 0.35);
          transform: translateY(-2px);
        }

        .vubbio-theme-card.active {
          border-color: #ADFF08;
          background: rgba(173, 255, 8, 0.08);
          box-shadow: 0 0 16px rgba(173, 255, 8, 0.22);
        }

        .vubbio-theme-card h4 {
          margin: 0 0 3px 0;
          font-size: 12.5px;
          font-weight: 700;
          color: #ffffff;
        }

        .vubbio-theme-card p {
          margin: 0 0 8px 0;
          font-size: 10.5px;
          color: #94a3b8;
          line-height: 1.3;
        }

        .vubbio-theme-swatches {
          display: flex;
          gap: 5px;
        }

        .vubbio-theme-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .vubbio-css-textarea {
          width: 100%;
          height: 160px;
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 9px;
          padding: 11px;
          color: #e2e8f0;
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
          font-size: 11.5px;
          resize: vertical;
          outline: none;
          line-height: 1.45;
          box-sizing: border-box;
        }

        .vubbio-css-textarea:focus {
          border-color: #ADFF08;
        }

        .vubbio-snippet-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 9px;
        }

        .vubbio-btn-snippet {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          color: #94a3b8;
          font-size: 10.5px;
          font-weight: 600;
          padding: 5px 9px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.18s;
        }

        .vubbio-btn-snippet:hover, .vubbio-btn-snippet.active {
          color: #ADFF08;
          border-color: #ADFF08;
          background: rgba(173, 255, 8, 0.1);
        }

        .vubbio-audit-item {
          background: rgba(255, 255, 255, 0.025);
          border-left: 3px solid #ef4444;
          padding: 9px 12px;
          border-radius: 7px;
          margin-bottom: 7px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .vubbio-audit-item.edited {
          border-left-color: #eab308;
        }

        .vubbio-audit-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10.5px;
        }

        .vubbio-audit-author {
          font-weight: bold;
          color: #ffffff;
        }

        .vubbio-audit-time {
          color: #64748b;
        }

        .vubbio-audit-content {
          font-size: 11.5px;
          color: #cbd5e1;
          word-break: break-word;
        }

        .vubbio-note-item {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          padding: 11px 13px;
          margin-bottom: 9px;
        }

        .vubbio-note-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .vubbio-note-title {
          font-weight: 700;
          font-size: 12.5px;
          color: #ffffff;
        }

        .vubbio-note-content {
          font-size: 11.5px;
          color: #94a3b8;
          white-space: pre-wrap;
          line-height: 1.4;
        }

        /* ===== FOOTER ===== */
        .vubbio-modal-footer {
          padding: 13px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(6, 9, 16, 0.75);
        }

        .vubbio-btn-apply {
          background: linear-gradient(135deg, #ADFF08 0%, #22c55e 100%);
          border: none;
          color: #070a12;
          font-size: 12.5px;
          font-weight: 800;
          padding: 9px 20px;
          border-radius: 9px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          box-shadow: 0 0 18px rgba(173, 255, 8, 0.35);
          transition: all 0.18s;
        }

        .vubbio-btn-apply:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 25px rgba(173, 255, 8, 0.55);
        }

        .vubbio-btn-reset {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 11.5px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.18s;
        }

        .vubbio-btn-reset:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.25);
        }
      `;
      document.head.appendChild(style);

      // Pill Widget
      const pillRoot = document.createElement('div');
      pillRoot.id = 'vubbio-badge-root';
      pillRoot.innerHTML = `
        <div class="vubbio-pill" id="vubbio-open-btn" title="Vubbio Ultra Mod Menüsünü Aç (Ctrl + Shift + V)">
          <div class="vubbio-pill-icon-box">⚡</div>
          <div class="vubbio-pill-label">
            <span class="name">Vubbio</span>
            <span class="badge">Ultra v${VERSION}</span>
          </div>
          <span class="vubbio-pill-shortcut">Ctrl+Shift+V</span>
        </div>
      `;
      document.body.appendChild(pillRoot);

      // Main Modal
      const modalRoot = document.createElement('div');
      modalRoot.id = 'vubbio-modal-root';
      modalRoot.innerHTML = `
        <div class="vubbio-modal">
          <!-- Left Sidebar -->
          <div class="vubbio-modal-sidebar">
            <div class="vubbio-sidebar-brand">
              <div class="vubbio-sidebar-logo">⚡</div>
              <div>
                <div class="vubbio-sidebar-title">
                  Vubbio <span class="vubbio-sidebar-ver">v${VERSION}</span>
                </div>
                <div style="font-size:11px;color:#64748b;margin-top:2px;">Ultra Client Engine</div>
              </div>
            </div>

            <!-- Vertical Navigation -->
            <div class="vubbio-sidebar-nav">
              <button class="vubbio-tab-btn active" data-tab="tab-mesh">
                <span class="tab-icon">🎨</span> Profil & Rozetler
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-themes">
                <span class="tab-icon">🎭</span> Temalar & Duvar
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-css-fx">
                <span class="tab-icon">✨</span> Görsel FX & CSS
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-chat">
                <span class="tab-icon">💬</span> Sohbet & Gizlilik
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-nexus">
                <span class="tab-icon">🔊</span> Ses & WebRTC
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-audit">
                <span class="tab-icon">📜</span> Mesaj Günlüğü
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-notes">
                <span class="tab-icon">📝</span> Hızlı Notlar
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-backup">
                <span class="tab-icon">⚙️</span> Sistem & Yedek
              </button>
            </div>

            <!-- Sidebar Footer -->
            <div class="vubbio-sidebar-footer">
              <div class="vubbio-sidebar-status">
                <span class="vubbio-live-dot"></span> Kalıcı Kayıt Aktif
              </div>
              <div style="font-size:10.5px;color:#475569;display:flex;align-items:center;justify-content:space-between;padding:0 4px;">
                <span>Kısayol</span>
                <kbd style="background:rgba(255,255,255,0.06);padding:2px 5px;border-radius:4px;color:#94a3b8;">Ctrl+Shift+V</kbd>
              </div>
            </div>
          </div>

          <!-- Right Content Panel -->
          <div class="vubbio-modal-main">
            <!-- Main Top Bar -->
            <div class="vubbio-main-topbar">
              <div class="vubbio-topbar-info">
                <h3 id="vb-topbar-title">Profil & Rozetler</h3>
                <p id="vb-topbar-sub">GIF avatar, afiş ve özel rozetlerini yönet</p>
              </div>
              <div class="vubbio-topbar-actions">
                <div class="vubbio-search-box">
                  <span class="vubbio-search-icon">🔍</span>
                  <input type="text" class="vubbio-search-input" id="vb-modal-search" placeholder="Özellik veya ayar ara...">
                </div>
                <button class="vubbio-modal-close" id="vubbio-close-btn" title="Kapat">✕</button>
              </div>
            </div>

            <!-- Body -->
            <div class="vubbio-modal-body">
              <!-- TAB 1: PROFİL & ROZETLER -->
              <div class="vubbio-tab-content active" id="tab-mesh">
              <!-- Live Preview Card -->
              <div class="vubbio-live-card">
                <div class="vubbio-preview-banner" id="vb-preview-banner" style="${customProfile.bannerUrl ? `background-image: url('${customProfile.bannerUrl}');` : ''}"></div>
                <div class="vubbio-preview-body">
                  <img class="vubbio-preview-avatar" id="vb-preview-avatar" src="${customProfile.avatarUrl || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23475569\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg>'}" alt="Avatar">
                  <div class="vubbio-preview-info">
                    <div class="vubbio-preview-name">${initialName}</div>
                    <div class="vubbio-preview-handle">${initialHandle}</div>
                    <div class="vubbio-preview-badges" id="vb-preview-badges">
                      ${customProfile.badgeNexus ? `<img class="vubbio-preview-badge-icon" src="${BADGE_ICONS.nexus}" title="Nexus Pro">` : ''}
                      ${customProfile.badgeVubbio ? `<img class="vubbio-preview-badge-icon" src="${BADGE_ICONS.vubbio}" title="Vubbio VIP">` : ''}
                      ${customProfile.badgeEarly ? `<img class="vubbio-preview-badge-icon" src="${BADGE_ICONS.early}" title="Erken Destekçi">` : ''}
                      ${customProfile.badgeVerified ? `<img class="vubbio-preview-badge-icon" src="${BADGE_ICONS.verified}" title="Doğrulanmış">` : ''}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Banner Input -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span>🖼️</span> Hareketli Kapak Resmi (GIF Banner)
                  <span class="sub">Otomatik Kalıcı</span>
                </div>
                <div class="vubbio-input-row">
                  <input type="text" class="vubbio-text-input" id="vb-banner-url" placeholder="GIF linki yapıştırın (Tenor, Giphy, CDN)..." value="${customProfile.bannerUrl.startsWith('data:') ? '(Yüklenen GIF Dosyası)' : customProfile.bannerUrl}">
                  <label class="vubbio-btn-file">
                    📁 Dosya Seç
                    <input type="file" id="vb-banner-file" accept=".gif,image/*" style="display:none;">
                  </label>
                  <button type="button" class="vubbio-btn-danger-sm" id="vb-clear-banner" title="Kaldır">✕</button>
                </div>
              </div>

              <!-- Avatar Input -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span>🎬</span> Hareketli Profil Resmi (GIF PP)
                  <span class="sub">Otomatik Kalıcı</span>
                </div>
                <div class="vubbio-input-row">
                  <input type="text" class="vubbio-text-input" id="vb-avatar-url" placeholder="Avatar GIF linki yapıştırın..." value="${customProfile.avatarUrl.startsWith('data:') ? '(Yüklenen GIF Dosyası)' : customProfile.avatarUrl}">
                  <label class="vubbio-btn-file">
                    📁 Dosya Seç
                    <input type="file" id="vb-avatar-file" accept=".gif,image/*" style="display:none;">
                  </label>
                  <button type="button" class="vubbio-btn-danger-sm" id="vb-clear-avatar" title="Kaldır">✕</button>
                </div>
              </div>

              <!-- Rozet Seçici -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span>👑</span> Standart Profil Rozetleri
                </div>
                <div class="vubbio-badge-grid">
                  <label class="vubbio-badge-card">
                    <input type="checkbox" id="vb-badge-nexus" ${customProfile.badgeNexus ? 'checked' : ''}>
                    <img src="${BADGE_ICONS.nexus}" alt="Nexus">
                    <span>Nexus Pro</span>
                  </label>
                  <label class="vubbio-badge-card">
                    <input type="checkbox" id="vb-badge-vubbio" ${customProfile.badgeVubbio ? 'checked' : ''}>
                    <img src="${BADGE_ICONS.vubbio}" alt="VIP">
                    <span>Vubbio VIP</span>
                  </label>
                  <label class="vubbio-badge-card">
                    <input type="checkbox" id="vb-badge-early" ${customProfile.badgeEarly ? 'checked' : ''}>
                    <img src="${BADGE_ICONS.early}" alt="Early">
                    <span>Erken Destekçi</span>
                  </label>
                  <label class="vubbio-badge-card">
                    <input type="checkbox" id="vb-badge-verified" ${customProfile.badgeVerified ? 'checked' : ''}>
                    <img src="${BADGE_ICONS.verified}" alt="Verified">
                    <span>Doğrulanmış</span>
                  </label>
                </div>
              </div>

              <!-- Özel Rozet Slot 1 -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span>✨</span> Özel Rozet Tasarlayıcı — Slot 1
                  <label class="vubbio-switch" style="margin-left: auto;">
                    <input type="checkbox" id="vb-custom-badge-en" ${customProfile.customBadgeEnabled ? 'checked' : ''}>
                    <span class="vubbio-slider"></span>
                  </label>
                </div>
                <div class="vubbio-input-row">
                  <input type="text" class="vubbio-text-input" style="max-width:70px;text-align:center;font-size:16px;" id="vb-custom-badge-icon" placeholder="👑" value="${customProfile.customBadgeIcon || '👑'}">
                  <input type="text" class="vubbio-text-input" id="vb-custom-badge-name" placeholder="Rozet Adı (Örn: Proje Lideri)" value="${customProfile.customBadgeName || ''}">
                  <input type="text" class="vubbio-text-input" id="vb-custom-badge-desc" placeholder="Açıklama / Tooltip" value="${customProfile.customBadgeDesc || ''}">
                </div>
              </div>

              <!-- Özel Rozet Slot 2 -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span>⚡</span> Özel Rozet Tasarlayıcı — Slot 2
                  <label class="vubbio-switch" style="margin-left: auto;">
                    <input type="checkbox" id="vb-custom-badge2-en" ${customProfile.customBadge2Enabled ? 'checked' : ''}>
                    <span class="vubbio-slider"></span>
                  </label>
                </div>
                <div class="vubbio-input-row">
                  <input type="text" class="vubbio-text-input" style="max-width:70px;text-align:center;font-size:16px;" id="vb-custom-badge2-icon" placeholder="⚡" value="${customProfile.customBadge2Icon || '⚡'}">
                  <input type="text" class="vubbio-text-input" id="vb-custom-badge2-name" placeholder="Rozet Adı (Örn: Elit Mod)" value="${customProfile.customBadge2Name || ''}">
                  <input type="text" class="vubbio-text-input" id="vb-custom-badge2-desc" placeholder="Açıklama / Tooltip" value="${customProfile.customBadge2Desc || ''}">
                </div>
              </div>

              <!-- Özel Rozet Slot 3 -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span>🛡️</span> Özel Rozet Tasarlayıcı — Slot 3
                  <label class="vubbio-switch" style="margin-left: auto;">
                    <input type="checkbox" id="vb-custom-badge3-en" ${customProfile.customBadge3Enabled ? 'checked' : ''}>
                    <span class="vubbio-slider"></span>
                  </label>
                </div>
                <div class="vubbio-input-row">
                  <input type="text" class="vubbio-text-input" style="max-width:70px;text-align:center;font-size:16px;" id="vb-custom-badge3-icon" placeholder="🛡️" value="${customProfile.customBadge3Icon || '🛡️'}">
                  <input type="text" class="vubbio-text-input" id="vb-custom-badge3-name" placeholder="Rozet Adı (Örn: Hata Avcısı)" value="${customProfile.customBadge3Name || ''}">
                  <input type="text" class="vubbio-text-input" id="vb-custom-badge3-desc" placeholder="Açıklama / Tooltip" value="${customProfile.customBadge3Desc || ''}">
                </div>
              </div>
            </div>

            <!-- TAB 2: TEMALAR & DUVAR KAĞIDI -->
            <div class="vubbio-tab-content" id="tab-themes">
              <!-- Canlı Duvar Kağıdı -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span>🖼️</span> Canlı Duvar Kağıdı Motoru (Custom Wallpaper)
                  <label class="vubbio-switch" style="margin-left: auto;">
                    <input type="checkbox" id="vb-opt-wall-en" ${settings.wallpaperEnabled ? 'checked' : ''}>
                    <span class="vubbio-slider"></span>
                  </label>
                </div>
                <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Jubbio arkaplanına istediğiniz resmi veya hareketli GIF'i yerleştirir.</p>
                <div class="vubbio-input-row" style="margin-bottom:12px;">
                  <input type="text" class="vubbio-text-input" id="vb-wall-url" placeholder="Duvar kağıdı resim veya GIF linki..." value="${settings.wallpaperUrl}">
                  <button type="button" class="vubbio-btn-snippet" id="vb-wall-preset-anime">Anime</button>
                  <button type="button" class="vubbio-btn-snippet" id="vb-wall-preset-cyber">Cyber</button>
                  <button type="button" class="vubbio-btn-snippet" id="vb-wall-preset-space">Space</button>
                </div>
                <div style="display:flex;gap:20px;">
                  <div style="flex:1;">
                    <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Şeffaflık: <span id="vb-wall-op-val" style="color:#ADFF08;">${Math.round(settings.wallpaperOpacity * 100)}%</span></div>
                    <input type="range" id="vb-wall-op" min="0.1" max="1" step="0.05" value="${settings.wallpaperOpacity}" style="width:100%;accent-color:#ADFF08;">
                  </div>
                  <div style="flex:1;">
                    <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Bulanıklık: <span id="vb-wall-blur-val" style="color:#ADFF08;">${settings.wallpaperBlur}px</span></div>
                    <input type="range" id="vb-wall-blur" min="0" max="15" step="1" value="${settings.wallpaperBlur}" style="width:100%;accent-color:#ADFF08;">
                  </div>
                </div>
              </div>

              <div class="vubbio-card-title"><span>🎨</span> Hazır Renk Temaları</div>
              <div class="vubbio-theme-grid">
                <div class="vubbio-theme-card ${settings.activeTheme === 'default' ? 'active' : ''}" data-theme="default">
                  <h4>Varsayılan Gece</h4>
                  <p>Orijinal Jubbio gece teması</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#1e293b;"></div><div class="vubbio-theme-dot" style="background:#0f172a;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'oled' ? 'active' : ''}" data-theme="oled">
                  <h4>Pure OLED Black</h4>
                  <p>Saf derin siyah, AMOLED dostu</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#000000;"></div><div class="vubbio-theme-dot" style="background:#111111;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'cyberpunk' ? 'active' : ''}" data-theme="cyberpunk">
                  <h4>Cyberpunk Neon</h4>
                  <p>Fütüristik neon mor ve fuşya</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#090014;"></div><div class="vubbio-theme-dot" style="background:#d946ef;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'catppuccin' ? 'active' : ''}" data-theme="catppuccin">
                  <h4>Catppuccin Mocha</h4>
                  <p>Göz yormayan yumuşak pastel</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#1e1e2e;"></div><div class="vubbio-theme-dot" style="background:#89b4fa;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'neon' ? 'active' : ''}" data-theme="neon">
                  <h4>Neon Matrix</h4>
                  <p>Vubbio elektrik yeşili siber tema</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#050805;"></div><div class="vubbio-theme-dot" style="background:#ADFF08;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'dracula' ? 'active' : ''}" data-theme="dracula">
                  <h4>Dracula Pro</h4>
                  <p>Kült koyu vampir moru</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#282a36;"></div><div class="vubbio-theme-dot" style="background:#bd93f9;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'nord' ? 'active' : ''}" data-theme="nord">
                  <h4>Arctic Nord</h4>
                  <p>Soğuk İskandinav arktik mavisi</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#2e3440;"></div><div class="vubbio-theme-dot" style="background:#88c0d0;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'tokyo' ? 'active' : ''}" data-theme="tokyo">
                  <h4>Tokyo Night</h4>
                  <p>Gece Tokyo neonu ve mavi</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#1a1b26;"></div><div class="vubbio-theme-dot" style="background:#7aa2f7;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'rose' ? 'active' : ''}" data-theme="rose">
                  <h4>Rosé Pine</h4>
                  <p>Sıcak pastel pembe & gül</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#191724;"></div><div class="vubbio-theme-dot" style="background:#ebbcba;"></div></div>
                </div>
                <div class="vubbio-theme-card ${settings.activeTheme === 'sunset' ? 'active' : ''}" data-theme="sunset">
                  <h4>Synthwave Sunset</h4>
                  <p>80'ler retro gün batımı</p>
                  <div class="vubbio-theme-swatches"><div class="vubbio-theme-dot" style="background:#140b24;"></div><div class="vubbio-theme-dot" style="background:#ff71ce;"></div></div>
                </div>
              </div>

              <!-- Google Fonts Seçici -->
              <div class="vubbio-card">
                <div class="vubbio-card-title"><span>🔤</span> Yazı Tipi (Google Fonts)</div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                  <button class="vubbio-btn-snippet ${settings.activeFont === 'default' ? 'active' : ''}" data-font="default">Sistem Varsayılan</button>
                  <button class="vubbio-btn-snippet ${settings.activeFont === 'inter' ? 'active' : ''}" data-font="inter">Inter (Modern)</button>
                  <button class="vubbio-btn-snippet ${settings.activeFont === 'jetbrains' ? 'active' : ''}" data-font="jetbrains">JetBrains Mono (Kod)</button>
                  <button class="vubbio-btn-snippet ${settings.activeFont === 'fira' ? 'active' : ''}" data-font="fira">Fira Code</button>
                  <button class="vubbio-btn-snippet ${settings.activeFont === 'outfit' ? 'active' : ''}" data-font="outfit">Outfit (Şık)</button>
                  <button class="vubbio-btn-snippet ${settings.activeFont === 'poppins' ? 'active' : ''}" data-font="poppins">Poppins (Geometrik)</button>
                </div>
              </div>
            </div>

            <!-- TAB 3: GÖRSEL EFEKTLER & CSS -->
            <div class="vubbio-tab-content" id="tab-css-fx">
              <div class="vubbio-card-title"><span>✨</span> 12 Hazır Görsel Efekt & Stil Modu</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>🕶️ Buzlu Cam (Glassmorphism)</h4><p>Pencereleri yarı şeffaf buzlu cam yapar</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-glass" ${settings.fxGlass ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>🌈 RGB Neon Kenarlık</h4><p>Pencerelere akıcı RGB gökkuşağı kenarlığı</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-rgb" ${settings.fxRgbBorder ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>🔲 Tam Yuvarlak Avatarlar</h4><p>Kullanıcı resimlerini %100 daire yapar</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-round" ${settings.fxRoundAvatar ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>⬛ Yumuşak Kare (Squircle)</h4><p>Avatarları iOS tarzı yumuşak kare yapar</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-squircle" ${settings.fxSquircleAvatar ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>📏 Kompakt Mesaj Modu</h4><p>Boşlukları azaltarak daha çok mesaj gösterir</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-compact" ${settings.fxCompactChat ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>💫 Neon Parlayan İsimler</h4><p>Kullanıcı adlarına neon ışıma efekti</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-glow" ${settings.fxGlowUsernames ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>⚡ İnce Modern Scrollbar</h4><p>Kaydırma çubuğunu ultra ince yeşil yapar</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-scroll" ${settings.fxModernScrollbars ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>🌟 Yumuşak Mesaj Kayması</h4><p>Yeni mesajlar yumuşakça yukarı kayar</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-anim" ${settings.fxSmoothTransitions ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>🚫 Engellenenleri Gizle</h4><p>Engelli mesaj çubuklarını tamamen yok eder</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-block" ${settings.fxHideBlocked ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
                <div class="vubbio-toggle-row" style="margin:0;">
                  <div class="vubbio-toggle-text"><h4>🎯 Buton & Rozet 3D Hover</h4><p>Butonlara ve kartlara dinamik eğim efekti</p></div>
                  <label class="vubbio-switch"><input type="checkbox" id="vb-fx-tilt" ${settings.fxHoverTilt ? 'checked' : ''}><span class="vubbio-slider"></span></label>
                </div>
              </div>

              <!-- Canlı CSS Editörü -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span>💻</span> Canlı Özel CSS Editörü
                  <span class="sub">Otomatik Kalıcı</span>
                </div>
                <div class="vubbio-snippet-row">
                  <span style="font-size:11px;color:#94a3b8;margin-right:4px;">Hazır Kodlar:</span>
                  <button class="vubbio-btn-snippet" id="vb-snip-custom-1">Koyu Mesaj Kutusu</button>
                  <button class="vubbio-btn-snippet" id="vb-snip-custom-2">Neon Başlıklar</button>
                  <button class="vubbio-btn-snippet" id="vb-snip-custom-3">Gizli Profil Paneli</button>
                </div>
                <textarea class="vubbio-css-textarea" id="vb-custom-css-input" placeholder="/* Özel CSS kodlarınızı buraya yazın... */">${settings.customCss || ''}</textarea>
              </div>
            </div>

            <!-- TAB 4: SOHBET & GİZLİLİK -->
            <div class="vubbio-tab-content" id="tab-chat">
              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🕵️ Silinen Mesajları Görme (MessageLogger)</h4>
                  <p>Biri mesaj sildiğinde silinmez; kırmızı sol çizgi ve [SİLİNDİ] ibaresiyle ekranda tutulur</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-logger" ${settings.messageLogger ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>✏️ Düzenlenen Mesajları Takip Etme (Edit Tracker)</h4>
                  <p>Düzenlenen mesajların orijinal metnini hafızada tutar ve fareyle üzerine gelindiğinde gösterir</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-editlog" ${settings.logEditedMessages ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🌐 Tek Tıkla Türkçe Çeviri (Quick Translate)</h4>
                  <p>Her mesajın üzerine gelindiğinde açılan çubuktan yabancı dildeki mesajları Türkçe'ye çevirir</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-trans" ${settings.quickTranslate ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>👻 Gizli Yazma (No-Typing Stealth)</h4>
                  <p>Sohbet kutusuna yazarken karşı tarafa "Yazıyor..." bildirimi gönderilmesini önler</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-stealth" ${settings.stealthTyping ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🎭 Her Yerde Sunucu Emojileri (FakeNitro)</h4>
                  <p>Başka sunucuların kilitli emojilerini tıklandığında engeli kaldırıp direkt gönderir</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-emotes" ${settings.serverEmotes ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>⌨️ Gelişmiş Sohbet Komutları</h4>
                  <p>/shrug, /tableflip, /lenny, /mock, /clap, /reverse kısayollarını otomatik dönüştürür</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-shortcuts" ${settings.chatShortcuts ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>📏 4000 Karakter Sayacı Rozeti</h4>
                  <p>Mesaj yazarken sağ altta zarif Nexus kilitsiz karakter sayacını gösterir</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-charcounter" ${settings.charCounter ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🚫 Anti-Track & Telemetri Engelleyici</h4>
                  <p>Jubbio arka plan analitik ve izleme isteklerini engelleyerek pingi düşürür</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-antitrack" ${settings.antiTrack ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>
            </div>

            <!-- TAB 5: SES, SOUND FX & WEBRTC -->
            <div class="vubbio-tab-content" id="tab-nexus">
              <!-- Sentetik Bildirim Sesleri -->
              <div class="vubbio-card">
                <div class="vubbio-card-title"><span>🔔</span> Özel Sentetik Bildirim Sesleri</div>
                <p style="font-size:12px;color:#94a3b8;margin-bottom:12px;">Web Audio API ile harici dosya indirmeden saf ses sentezleme.</p>
                <div style="display:flex;gap:10px;align-items:center;">
                  <button type="button" class="vubbio-btn-snippet ${settings.soundPack === 'arcade' ? 'active' : ''}" data-sound="arcade">🎮 8-Bit Arcade</button>
                  <button type="button" class="vubbio-btn-snippet ${settings.soundPack === 'scifi' ? 'active' : ''}" data-sound="scifi">⚡ Sci-Fi Synth</button>
                  <button type="button" class="vubbio-btn-snippet ${settings.soundPack === 'glass' ? 'active' : ''}" data-sound="glass">💎 Glass Chime</button>
                  <button type="button" class="vubbio-btn-snippet ${settings.soundPack === 'minimal' ? 'active' : ''}" data-sound="minimal">💧 Minimal Blip</button>
                  <button type="button" class="vubbio-btn-snippet ${settings.soundPack === 'off' ? 'active' : ''}" data-sound="off">🔇 Sessiz</button>
                  <button type="button" class="vubbio-btn-apply" id="vb-test-sound" style="padding:5px 12px;font-size:11px;margin-left:auto;">▶ Sesi Dinle</button>
                </div>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🏆 Nexus Abonelik Kilidi Açıcı</h4>
                  <p>4000 karakter mesaj, 100MB dosya yükleme ve abonelik kısıtlamalarını kaldırır</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-nexus" ${settings.nexusUnlocker ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🖥️ 4K 60FPS Ekran Paylaşımı (WebRTC Unlock)</h4>
                  <p>Yayın açarken 2160p (4K UHD) ve 60 FPS kare hızı kilidini otomatik olarak açar</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-screen" ${settings.screenShare4k ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🔊 384kbps HD Stüdyo Sesi</h4>
                  <p>Ses odalarında Opus SDP patcher ile kristal netliğinde ve 384kbps stüdyo ses kalitesi</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-voice" ${settings.voiceHd ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>📢 %300 Ses Güçlendirici (Volume Booster)</h4>
                  <p>Kısık sesli arkadaşlarınızın ve yayın seslerini Web Audio API ile %300'e kadar yükseltir</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-volboost" ${settings.volumeBooster ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-card" id="vb-vol-slider-card" style="${settings.volumeBooster ? '' : 'display:none;'}">
                <div class="vubbio-card-title">
                  <span>🎚️</span> Güçlendirme Düzeyi: <span id="vb-vol-label" style="color:#ADFF08;font-weight:bold;">${Math.round(settings.volumeBoostLevel * 100)}%</span>
                </div>
                <input type="range" id="vb-vol-slider" min="1.0" max="3.0" step="0.1" value="${settings.volumeBoostLevel}" style="width:100%;accent-color:#ADFF08;">
              </div>
            </div>

            <!-- TAB 6: KALICI MESAJ GÜNLÜĞÜ (AUDIT LOG) -->
            <div class="vubbio-tab-content" id="tab-audit">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                <div class="vubbio-card-title" style="margin:0;"><span>📜</span> Kalıcı Yakalanan Mesajlar (${this.messageAuditLog.length})</div>
                <button class="vubbio-btn-danger-sm" id="vb-clear-audit">Tarihçeyi Temizle</button>
              </div>
              <div id="vb-audit-list"></div>
            </div>

            <!-- TAB 7: HIZLI NOTLAR & PANO -->
            <div class="vubbio-tab-content" id="tab-notes">
              <div class="vubbio-card">
                <div class="vubbio-card-title"><span>📝</span> Yeni Not Ekle</div>
                <div style="display:flex;flex-direction:column;gap:10px;">
                  <input type="text" class="vubbio-text-input" id="vb-note-title" placeholder="Başlık...">
                  <textarea class="vubbio-text-input" id="vb-note-content" placeholder="Not içeriği, link veya metin..." style="height:70px;resize:vertical;"></textarea>
                  <button type="button" class="vubbio-btn-snippet" id="vb-add-note" style="align-self:flex-start;padding:8px 16px;color:#ADFF08;border-color:#ADFF08;">+ Notu Kaydet</button>
                </div>
              </div>
              <div class="vubbio-card-title"><span>📋</span> Kayıtlı Notlar</div>
              <div id="vb-notes-list"></div>
            </div>

            <!-- TAB 8: YEDEKLEME & SİSTEM -->
            <div class="vubbio-tab-content" id="tab-backup">
              <div class="vubbio-card">
                <div class="vubbio-card-title"><span>💾</span> Tüm Yapılandırmayı Yedekle</div>
                <p style="font-size:12px;color:#94a3b8;margin-bottom:14px;">Profilinizi, özel rozetlerinizi, temalarınızı, duvar kağıdınızı ve CSS kodlarınızı tek bir JSON dosyası olarak indirin.</p>
                <div style="display:flex;gap:12px;">
                  <button type="button" class="vubbio-btn-apply" id="vb-export-backup" style="font-size:12px;padding:8px 16px;">
                    <span>📥</span> Yedeği İndir (JSON)
                  </button>
                  <label class="vubbio-btn-file" style="display:flex;align-items:center;gap:6px;">
                    <span>📤</span> Yedek Yükle
                    <input type="file" id="vb-import-backup-file" accept=".json" style="display:none;">
                  </label>
                </div>
              </div>

              <div class="vubbio-card">
                <div class="vubbio-card-title"><span>🛡️</span> Fabrika Ayarlarına Sıfırla</div>
                <p style="font-size:12px;color:#94a3b8;margin-bottom:14px;">Tüm Vubbio ayarlarını, özel temaları ve profili ilk orijinal haline geri döndürür.</p>
                <button type="button" class="vubbio-btn-danger-sm" id="vb-danger-reset">Tüm Ayarları Sıfırla</button>
              </div>
            </div>
            </div>

            <!-- Main Footer -->
            <div class="vubbio-modal-footer">
              <div style="font-size:11.5px;color:#64748b;display:flex;align-items:center;gap:6px;">
                <span style="color:#ADFF08;">⚡</span> Değişiklikler anında kalıcı olarak kaydedilir
              </div>
              <div style="display:flex;gap:10px;align-items:center;">
                <button class="vubbio-btn-reset" id="vb-close-footer-btn">Kapat</button>
                <button class="vubbio-btn-apply" id="vb-apply-all">
                  <span>💾</span> Kaydet & Senkronize Et
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalRoot);

      // Event Handlers
      const openBtn = document.getElementById('vubbio-open-btn');
      const closeBtn = document.getElementById('vubbio-close-btn');
      const closeFooterBtn = document.getElementById('vb-close-footer-btn');

      const openModal = () => {
        modalRoot.classList.add('active');
        this.renderAuditLog();
        this.renderNotes();
      };

      const closeModal = () => modalRoot.classList.remove('active');

      openBtn.addEventListener('click', openModal);
      closeBtn.addEventListener('click', closeModal);
      closeFooterBtn.addEventListener('click', closeModal);
      modalRoot.addEventListener('click', (e) => {
        if (e.target === modalRoot) closeModal();
      });

      // Tab Titles Metadata
      const tabMeta = {
        'tab-mesh':   { title: 'Profil & Rozetler', sub: 'GIF avatar, afiş ve özel rozetlerini yönet' },
        'tab-themes': { title: 'Temalar & Duvar Kağıdı', sub: 'Canlı arka plan ve 10 profesyonel renk teması' },
        'tab-css-fx': { title: 'Görsel Efektler & CSS', sub: 'Buzlu cam, RGB kenarlıklar ve canlı CSS editörü' },
        'tab-chat':   { title: 'Sohbet & Gizlilik', sub: 'Mesaj takipçisi, çeviri, gizli yazma ve FakeNitro' },
        'tab-nexus':  { title: 'Ses & WebRTC Geliştiricisi', sub: '4K ekran paylaşımı, stüdyo sesi ve ses yükseltici' },
        'tab-audit':  { title: 'Mesaj Günlüğü', sub: 'Yakalanan silinmiş ve düzenlenmiş mesaj kayıtları' },
        'tab-notes':  { title: 'Hızlı Notlar', sub: 'Sohbet sırasında erişebileceğiniz kalıcı not defteri' },
        'tab-backup': { title: 'Sistem & Yedekleme', sub: 'JSON yapılandırma yedekleme ve sistem ayarları' }
      };

      // Tabs
      modalRoot.querySelectorAll('.vubbio-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modalRoot.querySelectorAll('.vubbio-tab-btn').forEach(b => b.classList.remove('active'));
          modalRoot.querySelectorAll('.vubbio-tab-content').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          const tabId = btn.getAttribute('data-tab');
          document.getElementById(tabId)?.classList.add('active');
          if (tabMeta[tabId]) {
            const tEl = document.getElementById('vb-topbar-title');
            const sEl = document.getElementById('vb-topbar-sub');
            if (tEl) tEl.textContent = tabMeta[tabId].title;
            if (sEl) sEl.textContent = tabMeta[tabId].sub;
          }
          if (tabId === 'tab-audit') this.renderAuditLog();
          if (tabId === 'tab-notes') this.renderNotes();
        });
      });

      // Search Box
      const searchInput = document.getElementById('vb-modal-search');
      searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        modalRoot.querySelectorAll('.vubbio-toggle-row, .vubbio-card, .vubbio-theme-card').forEach(el => {
          if (!query) {
            el.style.display = '';
            el.style.boxShadow = '';
          } else {
            const text = el.innerText.toLowerCase();
            if (text.includes(query)) {
              el.style.display = '';
              el.style.boxShadow = '0 0 10px rgba(173, 255, 8, 0.3)';
            } else {
              el.style.display = 'none';
              el.style.boxShadow = '';
            }
          }
        });
      });

      // Themes
      modalRoot.querySelectorAll('.vubbio-theme-card').forEach(card => {
        card.addEventListener('click', () => {
          modalRoot.querySelectorAll('.vubbio-theme-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          settings.activeTheme = card.getAttribute('data-theme');
          saveSettings();
          this.applyTheme();
          this.toast('Tema Kaydedildi', `${card.querySelector('h4').innerText} teması aktifleştirildi.`, 'vubbio', 1500);
        });
      });

      // Fonts
      modalRoot.querySelectorAll('[data-font]').forEach(btn => {
        btn.addEventListener('click', () => {
          modalRoot.querySelectorAll('[data-font]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          settings.activeFont = btn.getAttribute('data-font');
          saveSettings();
          this.applyTheme();
          this.toast('Yazı Tipi Kaydedildi', `Font güncellendi.`, 'vubbio', 1500);
        });
      });

      // Wallpaper Handlers
      const wallEnToggle = document.getElementById('vb-opt-wall-en');
      const wallUrlInput = document.getElementById('vb-wall-url');
      const wallOpSlider = document.getElementById('vb-wall-op');
      const wallBlurSlider = document.getElementById('vb-wall-blur');
      const wallOpVal = document.getElementById('vb-wall-op-val');
      const wallBlurVal = document.getElementById('vb-wall-blur-val');

      wallEnToggle?.addEventListener('change', (e) => {
        settings.wallpaperEnabled = e.target.checked;
        saveSettings();
        this.applyTheme();
      });

      wallUrlInput?.addEventListener('input', (e) => {
        settings.wallpaperUrl = e.target.value.trim();
        saveSettings();
        this.applyTheme();
      });

      wallOpSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        settings.wallpaperOpacity = val;
        wallOpVal.textContent = `${Math.round(val * 100)}%`;
        saveSettings();
        this.applyTheme();
      });

      wallBlurSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        settings.wallpaperBlur = val;
        wallBlurVal.textContent = `${val}px`;
        saveSettings();
        this.applyTheme();
      });

      // Wallpaper Presets
      document.getElementById('vb-wall-preset-anime')?.addEventListener('click', () => {
        wallUrlInput.value = 'https://images.alphacoders.com/131/1311096.jpeg';
        settings.wallpaperUrl = wallUrlInput.value;
        settings.wallpaperEnabled = true;
        wallEnToggle.checked = true;
        saveSettings();
        this.applyTheme();
      });

      document.getElementById('vb-wall-preset-cyber')?.addEventListener('click', () => {
        wallUrlInput.value = 'https://images.alphacoders.com/115/1154562.jpg';
        settings.wallpaperUrl = wallUrlInput.value;
        settings.wallpaperEnabled = true;
        wallEnToggle.checked = true;
        saveSettings();
        this.applyTheme();
      });

      document.getElementById('vb-wall-preset-space')?.addEventListener('click', () => {
        wallUrlInput.value = 'https://images.alphacoders.com/909/909641.png';
        settings.wallpaperUrl = wallUrlInput.value;
        settings.wallpaperEnabled = true;
        wallEnToggle.checked = true;
        saveSettings();
        this.applyTheme();
      });

      // 12 Visual FX Toggles
      const fxMap = [
        ['vb-fx-glass', 'fxGlass'],
        ['vb-fx-rgb', 'fxRgbBorder'],
        ['vb-fx-round', 'fxRoundAvatar'],
        ['vb-fx-squircle', 'fxSquircleAvatar'],
        ['vb-fx-compact', 'fxCompactChat'],
        ['vb-fx-glow', 'fxGlowUsernames'],
        ['vb-fx-scroll', 'fxModernScrollbars'],
        ['vb-fx-anim', 'fxSmoothTransitions'],
        ['vb-fx-block', 'fxHideBlocked'],
        ['vb-fx-tilt', 'fxHoverTilt']
      ];

      fxMap.forEach(([elId, prop]) => {
        document.getElementById(elId)?.addEventListener('change', (e) => {
          settings[prop] = e.target.checked;
          if (prop === 'fxRoundAvatar' && e.target.checked) {
            settings.fxSquircleAvatar = false;
            const sq = document.getElementById('vb-fx-squircle');
            if (sq) sq.checked = false;
          }
          if (prop === 'fxSquircleAvatar' && e.target.checked) {
            settings.fxRoundAvatar = false;
            const rd = document.getElementById('vb-fx-round');
            if (rd) rd.checked = false;
          }
          saveSettings();
          this.applyTheme();
        });
      });

      // Sound Pack Selector
      modalRoot.querySelectorAll('[data-sound]').forEach(btn => {
        btn.addEventListener('click', () => {
          modalRoot.querySelectorAll('[data-sound]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          settings.soundPack = btn.getAttribute('data-sound');
          saveSettings();
          SoundFX.play(settings.soundPack);
          this.toast('Ses Paketi', `"${settings.soundPack}" paketi seçildi.`, 'vubbio', 1200);
        });
      });

      document.getElementById('vb-test-sound')?.addEventListener('click', () => {
        SoundFX.play(settings.soundPack);
      });

      // CSS Snippets
      const cssInput = document.getElementById('vb-custom-css-input');
      const addSnippet = (snippet) => {
        cssInput.value = (cssInput.value.trim() ? cssInput.value + '\n\n' : '') + snippet;
        settings.customCss = cssInput.value;
        saveSettings();
        this.applyTheme();
        this.toast('CSS Eklendi', 'Özel kod şablonu eklendi.', 'vubbio', 1500);
      };

      cssInput?.addEventListener('input', () => {
        settings.customCss = cssInput.value;
        saveSettings();
        this.applyTheme();
      });

      document.getElementById('vb-snip-custom-1')?.addEventListener('click', () => {
        addSnippet('/* Koyu Mesaj Kutusu */\n.chat-box, textarea { background: #080c16 !important; border-radius: 12px !important; }');
      });
      document.getElementById('vb-snip-custom-2')?.addEventListener('click', () => {
        addSnippet('/* Neon Başlıklar */\nh1, h2, h3, h4 { color: #ADFF08 !important; text-shadow: 0 0 10px rgba(173,255,8,0.4); }');
      });
      document.getElementById('vb-snip-custom-3')?.addEventListener('click', () => {
        addSnippet('/* Gizli Profil Paneli */\n[class*="user-popout"] { box-shadow: 0 0 40px rgba(0,0,0,0.9) !important; border: 1px solid #ADFF08 !important; }');
      });

      // Volume Slider
      const volToggle = document.getElementById('vb-opt-volboost');
      const volSliderCard = document.getElementById('vb-vol-slider-card');
      const volSlider = document.getElementById('vb-vol-slider');
      const volLabel = document.getElementById('vb-vol-label');

      volToggle?.addEventListener('change', (e) => {
        volSliderCard.style.display = e.target.checked ? 'block' : 'none';
        settings.volumeBooster = e.target.checked;
        saveSettings();
      });

      volSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        settings.volumeBoostLevel = val;
        volLabel.textContent = `${Math.round(val * 100)}%`;
        saveSettings();
      });

      // Live Profile Previews
      const previewAvatar = document.getElementById('vb-preview-avatar');
      const previewBanner = document.getElementById('vb-preview-banner');
      const avatarUrlInput = document.getElementById('vb-avatar-url');
      const bannerUrlInput = document.getElementById('vb-banner-url');
      const avatarFileInput = document.getElementById('vb-avatar-file');
      const bannerFileInput = document.getElementById('vb-banner-file');

      avatarUrlInput?.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val && !val.startsWith('(')) {
          previewAvatar.src = val;
          customProfile.avatarUrl = val;
          saveProfile();
        }
      });

      bannerUrlInput?.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val && !val.startsWith('(')) {
          previewBanner.style.backgroundImage = `url('${val}')`;
          customProfile.bannerUrl = val;
          saveProfile();
        }
      });

      avatarFileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            customProfile.avatarUrl = reader.result;
            previewAvatar.src = reader.result;
            avatarUrlInput.value = `(${file.name} Yüklendi)`;
            saveProfile();
            this.toast('Avatar Yüklendi', 'Yeni GIF/Resim kaydedildi.', 'success', 2000);
          };
          reader.readAsDataURL(file);
        }
      });

      bannerFileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            customProfile.bannerUrl = reader.result;
            previewBanner.style.backgroundImage = `url('${reader.result}')`;
            bannerUrlInput.value = `(${file.name} Yüklendi)`;
            saveProfile();
            this.toast('Banner Yüklendi', 'Yeni GIF/Resim kaydedildi.', 'success', 2000);
          };
          reader.readAsDataURL(file);
        }
      });

      document.getElementById('vb-clear-avatar')?.addEventListener('click', () => {
        customProfile.avatarUrl = '';
        avatarUrlInput.value = '';
        previewAvatar.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23475569"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
        saveProfile();
      });

      document.getElementById('vb-clear-banner')?.addEventListener('click', () => {
        customProfile.bannerUrl = '';
        bannerUrlInput.value = '';
        previewBanner.style.backgroundImage = 'linear-gradient(135deg, rgba(173,255,8,0.2) 0%, rgba(30,41,59,0.8) 100%)';
        saveProfile();
      });

      // Audit Log
      document.getElementById('vb-clear-audit')?.addEventListener('click', () => {
        this.messageAuditLog = [];
        persistentAuditLog = [];
        saveAuditLog();
        this.renderAuditLog();
        this.toast('Tarihçe Temizlendi', 'Mesaj günlüğü sıfırlandı.', 'info', 1500);
      });

      // Notes
      document.getElementById('vb-add-note')?.addEventListener('click', () => {
        const titleInput = document.getElementById('vb-note-title');
        const contentInput = document.getElementById('vb-note-content');
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        if (!title && !content) return;

        persistentNotes.unshift({
          id: Date.now(),
          title: title || 'Not',
          content: content || ''
        });
        saveNotes();
        titleInput.value = '';
        contentInput.value = '';
        this.renderNotes();
        this.toast('Not Kaydedildi', 'Not panosuna eklendi.', 'vubbio', 1500);
      });

      // Export Backup (JSON)
      document.getElementById('vb-export-backup')?.addEventListener('click', () => {
        const bundle = {
          version: VERSION,
          timestamp: new Date().toISOString(),
          settings,
          profile: customProfile,
          notes: persistentNotes,
          audit: persistentAuditLog.slice(0, 50)
        };
        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `vubbio-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        this.toast('Yedek İndirildi', 'Tüm ayarlar JSON olarak kaydedildi.', 'success', 2500);
      });

      // Import Backup (JSON)
      const importInput = document.getElementById('vb-import-backup-file');
      importInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const data = JSON.parse(reader.result);
              if (data.settings) settings = { ...defaultSettings, ...data.settings };
              if (data.profile) customProfile = { ...defaultProfile, ...data.profile };
              if (data.notes) persistentNotes = data.notes;
              saveSettings();
              saveProfile();
              saveNotes();
              this.applyTheme();
              this.syncDOMImages();
              this.toast('Yedek Yüklendi', 'Tüm ayarlar geri yüklendi!', 'success', 2500);
              setTimeout(() => location.reload(), 1200);
            } catch (err) {
              alert('Yedek dosyası geçersiz: ' + err.message);
            }
          };
          reader.readAsText(file);
        }
      });

      // Save & Apply Button
      const applyBtn = document.getElementById('vb-apply-all');
      applyBtn?.addEventListener('click', () => {
        const isValidUrl = (v) => v && !v.startsWith('(') && (
          v.startsWith('http://') || v.startsWith('https://') ||
          v.startsWith('data:') || v.startsWith('blob:') || v.startsWith('//')
        );

        const aVal = avatarUrlInput.value.trim();
        if (isValidUrl(aVal)) customProfile.avatarUrl = aVal;

        const bVal = bannerUrlInput.value.trim();
        if (isValidUrl(bVal)) customProfile.bannerUrl = bVal;

        customProfile.badgeNexus    = document.getElementById('vb-badge-nexus')?.checked ?? true;
        customProfile.badgeVubbio   = document.getElementById('vb-badge-vubbio')?.checked ?? true;
        customProfile.badgeEarly    = document.getElementById('vb-badge-early')?.checked ?? true;
        customProfile.badgeVerified = document.getElementById('vb-badge-verified')?.checked ?? true;

        customProfile.customBadgeEnabled = document.getElementById('vb-custom-badge-en')?.checked ?? false;
        customProfile.customBadgeIcon    = document.getElementById('vb-custom-badge-icon')?.value.trim() || '👑';
        customProfile.customBadgeName    = document.getElementById('vb-custom-badge-name')?.value.trim() || 'Proje Lideri';
        customProfile.customBadgeDesc    = document.getElementById('vb-custom-badge-desc')?.value.trim() || 'Vubbio Özel Üyesi';

        customProfile.customBadge2Enabled = document.getElementById('vb-custom-badge2-en')?.checked ?? false;
        customProfile.customBadge2Icon    = document.getElementById('vb-custom-badge2-icon')?.value.trim() || '⚡';
        customProfile.customBadge2Name    = document.getElementById('vb-custom-badge2-name')?.value.trim() || 'Vubbio VIP';
        customProfile.customBadge2Desc    = document.getElementById('vb-custom-badge2-desc')?.value.trim() || 'Elit Kullanıcı';

        customProfile.customBadge3Enabled = document.getElementById('vb-custom-badge3-en')?.checked ?? false;
        customProfile.customBadge3Icon    = document.getElementById('vb-custom-badge3-icon')?.value.trim() || '🛡️';
        customProfile.customBadge3Name    = document.getElementById('vb-custom-badge3-name')?.value.trim() || 'Bug Hunter';
        customProfile.customBadge3Desc    = document.getElementById('vb-custom-badge3-desc')?.value.trim() || 'Hata Avcısı';

        saveProfile();

        settings.nexusUnlocker     = document.getElementById('vb-opt-nexus')?.checked ?? true;
        settings.messageLogger     = document.getElementById('vb-opt-logger')?.checked ?? true;
        settings.logEditedMessages = document.getElementById('vb-opt-editlog')?.checked ?? true;
        settings.quickTranslate    = document.getElementById('vb-opt-trans')?.checked ?? true;
        settings.stealthTyping     = document.getElementById('vb-opt-stealth')?.checked ?? true;
        settings.antiTrack         = document.getElementById('vb-opt-antitrack')?.checked ?? true;
        settings.serverEmotes      = document.getElementById('vb-opt-emotes')?.checked ?? true;
        settings.chatShortcuts     = document.getElementById('vb-opt-shortcuts')?.checked ?? true;
        settings.charCounter       = document.getElementById('vb-opt-charcounter')?.checked ?? true;
        settings.screenShare4k     = document.getElementById('vb-opt-screen')?.checked ?? true;
        settings.voiceHd           = document.getElementById('vb-opt-voice')?.checked ?? true;
        settings.volumeBooster     = document.getElementById('vb-opt-volboost')?.checked ?? false;
        settings.customCss         = document.getElementById('vb-custom-css-input')?.value || '';

        saveSettings();
        this.applyTheme();

        const curUser = this.authStore?.getState()?.user;
        if (curUser) {
          const cleanBio = stripVubbioData(curUser.bio || '');
          const stego = encodeVubbioData({
            a: customProfile.avatarUrl,
            b: customProfile.bannerUrl,
            g: ['nexus', 'vubbio', 'early', 'verified', customProfile.customBadgeName]
          });

          const fd = new FormData();
          fd.append('bio', cleanBio + ' ' + stego);
          try {
            window.fetch('/api/v1/auth/me/profile', { method: 'PATCH', body: fd }).catch(() => {});
          } catch {}

          const nextUser = {
            ...curUser,
            avatar_url: customProfile.avatarUrl || curUser.avatar_url,
            avatar:     customProfile.avatarUrl || curUser.avatar,
            banner_url: customProfile.bannerUrl || curUser.banner_url,
            banner:     customProfile.bannerUrl || curUser.banner
          };
          this.authStore.getState().setUser(nextUser);
        }

        this.syncSubStore();
        this.syncDOMImages();

        this.toast('Kalıcı Olarak Kaydedildi', 'Tüm ayarlar ve profil senkronize edildi!', 'success', 2500);

        applyBtn.innerHTML = '<span>✓</span> Kalıcı Olarak Kaydedildi!';
        applyBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        setTimeout(() => {
          applyBtn.innerHTML = '<span>💾</span> Kaydet & Senkronize Et';
          applyBtn.style.background = '';
          modalRoot.classList.remove('active');
        }, 1200);
      });

      document.getElementById('vb-danger-reset')?.addEventListener('click', () => {
        if (confirm('Tüm ayarlar, özel temalar ve profil sıfırlansın mı?')) {
          localStorage.clear();
          sessionStorage.clear();
          location.reload();
        }
      });
    },

    renderAuditLog() {
      const container = document.getElementById('vb-audit-list');
      if (!container) return;

      if (this.messageAuditLog.length === 0) {
        container.innerHTML = `
          <div style="text-align:center;padding:40px;color:#64748b;font-size:13px;">
            Henüz yakalanan silinen veya düzenlenen mesaj yok.
          </div>
        `;
        return;
      }

      container.innerHTML = this.messageAuditLog.map(item => `
        <div class="vubbio-audit-item ${item.type}">
          <div class="vubbio-audit-header">
            <span class="vubbio-audit-author">${item.author}</span>
            <span class="vubbio-audit-time">${item.timestamp} • ${item.type === 'deleted' ? '🗑️ SİLİNDİ' : '✏️ DÜZENLENDİ'}</span>
          </div>
          <div class="vubbio-audit-content">
            ${item.type === 'deleted'
              ? `<span style="color:#ef4444;font-weight:600;">[Silinen Metin]:</span> ${item.content}`
              : `<span style="color:#eab308;font-weight:600;">[Eski]:</span> ${item.oldContent} <br><span style="color:#22c55e;font-weight:600;">[Yeni]:</span> ${item.newContent}`
            }
          </div>
        </div>
      `).join('');
    },

    renderNotes() {
      const container = document.getElementById('vb-notes-list');
      if (!container) return;

      if (persistentNotes.length === 0) {
        container.innerHTML = `
          <div style="text-align:center;padding:30px;color:#64748b;font-size:13px;">
            Kayıtlı notunuz bulunmuyor.
          </div>
        `;
        return;
      }

      container.innerHTML = persistentNotes.map(n => `
        <div class="vubbio-note-item" data-id="${n.id}">
          <div class="vubbio-note-header">
            <span class="vubbio-note-title">${n.title}</span>
            <div style="display:flex;gap:6px;">
              <button type="button" class="vubbio-btn-snippet vb-copy-note" data-content="${encodeURIComponent(n.content)}">📋 Kopyala</button>
              <button type="button" class="vubbio-btn-danger-sm vb-delete-note" data-id="${n.id}" style="padding:4px 8px;font-size:11px;">✕</button>
            </div>
          </div>
          <div class="vubbio-note-content">${n.content}</div>
        </div>
      `).join('');

      container.querySelectorAll('.vb-copy-note').forEach(btn => {
        btn.addEventListener('click', () => {
          const txt = decodeURIComponent(btn.getAttribute('data-content'));
          navigator.clipboard.writeText(txt);
          this.toast('Kopyalandı', 'Not panoya kopyalandı.', 'vubbio', 1500);
        });
      });

      container.querySelectorAll('.vb-delete-note').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = Number(btn.getAttribute('data-id'));
          persistentNotes = persistentNotes.filter(x => x.id !== id);
          saveNotes();
          this.renderNotes();
        });
      });
    },

    init() {
      this.applyTheme();
      this.setupInterceptors();
      this.setupWebSocketHook();
      this.setupMediaEnhancers();
      this.setupChatTools();
      this.setupMessageQuickToolbar();
      this.setupFakeNitro();
      this.hookStores();

      // Global hotkey: Ctrl + Shift + V
      if (!window.__VUBBIO_HOTKEY__) {
        window.__VUBBIO_HOTKEY__ = true;
        window.addEventListener('keydown', (e) => {
          if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
            e.preventDefault();
            const modal = document.getElementById('vubbio-modal-root');
            if (modal) {
              const isActive = modal.classList.toggle('active');
              if (isActive) {
                this.renderAuditLog();
                this.renderNotes();
              }
            }
          }
        });
      }

      const start = () => {
        this.injectUI();
        this.syncDOMImages();
        this.applyTheme();
        this.toast('Vubbio Ultra Hazır', 'v7.0 Visual FX & Power Tools yüklendi.', 'vubbio', 3000);
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }

      console.log('%c[Vubbio] ⚡ Vubbio v7.0.0 Ultra Suite başarıyla yüklendi!', 'color: #ADFF08; font-weight: bold;');
    }
  };

  window.Vubbio = Vubbio;
  Vubbio.init();
})();
