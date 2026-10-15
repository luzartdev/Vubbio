/**
 * Vubbio v5.0 - Ultimate Jubbio Mod Suite (Vencord / BetterDiscord Edition)
 * 
 * Modüller:
 * 1. 🌐 P2P GIF Profil & Banner Ağı (Sadece Vubbio kullananlar birbirinin GIF PP ve Banner'ını görür)
 * 2. 👑 Özel Rozet Oluşturucu (Kendi istediğin simge, isim ve açıklamayla rozet yapma)
 * 3. 🎨 Tema Motoru & Canlı CSS (Pure OLED, Cyberpunk, Catppuccin Mocha, Neon Lime + CSS Editor)
 * 4. 🕵️ Message Logger (Silinen ve düzenlenen mesajları yakalama ve ekranda tutma)
 * 5. 🎭 FakeNitro Emojiler (Her sunucunun emojisini her yerde gönderebilme)
 * 6. 👻 Gizli Yazma (No-Typing) & Anti-Track (Telemetri engelleyici)
 * 7. 📢 %200 Ses Güçlendirici & 4K 60FPS Yayın & 384kbps HD Ses
 * 8. ⌨️ Kısayol: Ctrl + Shift + V ile menüyü anında açma/kapama
 */

(function VubbioLoader() {
  'use strict';

  if (window.__VUBBIO_LOADED__) {
    console.log('[Vubbio] Yenileniyor...');
  }
  window.__VUBBIO_LOADED__ = true;

  const VERSION = '5.0.0';
  const NAME = 'Vubbio Ultimate';

  console.log(
    `%c⚡ ${NAME} v${VERSION} aktif%c — Vencord-Style Complete Mod Suite`,
    'color: #ADFF08; font-weight: bold; font-size: 13px; background: #0b0f19; padding: 4px 10px; border-radius: 8px; border: 1px solid #ADFF08;',
    'color: #94a3b8; font-size: 12px; margin-left: 6px;'
  );

  // Storage Keys
  const SETTINGS_KEY = 'vubbio_settings_v5';
  const PROFILE_KEY = 'vubbio_custom_profile_v5';
  const PEERS_KEY = 'vubbio_peer_cache_v5';
  const THEME_CSS_KEY = 'vubbio_custom_css_code';

  // Zero-Width Steganography
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

  // Settings
  const defaultSettings = {
    nexusUnlocker: true,
    messageLogger: true,
    stealthTyping: true,
    antiTrack: true,
    serverEmotes: true,
    volumeBooster: false,
    activeTheme: 'default', // 'default', 'oled', 'cyberpunk', 'catppuccin', 'neon'
    customCss: '',
    screenShare4k: true,
    voiceHd: true,
    profileThemes: true
  };

  const defaultProfile = {
    avatarUrl: '',
    bannerUrl: '',
    badgeNexus: true,
    badgeVubbio: true,
    badgeEarly: true,
    badgeVerified: true,
    customBadgeEnabled: false,
    customBadgeName: 'Proje Lideri',
    customBadgeDesc: 'Vubbio Özel Üyesi',
    customBadgeIcon: '👑'
  };

  function loadSettings() {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      return s ? { ...defaultSettings, ...JSON.parse(s) } : { ...defaultSettings };
    } catch {
      return { ...defaultSettings };
    }
  }

  function saveSettings(s) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch (e) {
      console.error('[Vubbio] Ayar hatası:', e);
    }
  }

  function loadProfile() {
    try {
      const p = localStorage.getItem(PROFILE_KEY);
      return p ? { ...defaultProfile, ...JSON.parse(p) } : { ...defaultProfile };
    } catch {
      return { ...defaultProfile };
    }
  }

  function saveProfile(p) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    } catch (e) {
      console.error('[Vubbio] Profil hatası:', e);
    }
  }

  function loadPeerCache() {
    try {
      const c = localStorage.getItem(PEERS_KEY);
      return c ? JSON.parse(c) : {};
    } catch {
      return {};
    }
  }

  function savePeerCache(c) {
    try {
      localStorage.setItem(PEERS_KEY, JSON.stringify(c));
    } catch {}
  }

  const settings = loadSettings();
  let customProfile = loadProfile();
  let peerCache = loadPeerCache();

  // Vector Badges
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
    if (cfg.badgeNexus) {
      list.push({ id: 'v_nexus', name: 'Jubbio Nexus Pro', description: 'Jubbio Nexus Pro Üyesi', icon_url: BADGE_ICONS.nexus });
    }
    if (cfg.badgeVubbio) {
      list.push({ id: 'v_vip', name: 'Vubbio VIP', description: 'Vubbio Mod Kullanıcısı', icon_url: BADGE_ICONS.vubbio });
    }
    if (cfg.badgeEarly) {
      list.push({ id: 'v_early', name: 'Erken Destekçi', description: 'Jubbio Erken Destekçisi', icon_url: BADGE_ICONS.early });
    }
    if (cfg.badgeVerified) {
      list.push({ id: 'v_verified', name: 'Doğrulanmış Üye', description: 'Onaylanmış Profil', icon_url: BADGE_ICONS.verified });
    }
    if (cfg.customBadgeEnabled && cfg.customBadgeName) {
      list.push({
        id: 'v_custom',
        name: cfg.customBadgeName,
        description: cfg.customBadgeDesc || 'Özel Vubbio Rozeti',
        icon_url: cfg.customBadgeIcon?.startsWith('http') || cfg.customBadgeIcon?.startsWith('data:') ? cfg.customBadgeIcon : createEmojiBadgeSvg(cfg.customBadgeIcon)
      });
    }
    return list;
  }

  // Pre-built Themes
  const THEMES = {
    default: '',
    oled: `
      /* OLED / Pure Black Theme */
      body, #root, .bg-surface-base, .bg-surface-raised, .bg-surface-overlay {
        background-color: #000000 !important;
      }
      .border-border-default, .border-border-subtle {
        border-color: #161b22 !important;
      }
      aside, nav, [class*="sidebar"] {
        background-color: #020408 !important;
      }
    `,
    cyberpunk: `
      /* Cyberpunk Midnight Theme */
      body, #root {
        background-color: #080612 !important;
      }
      .bg-surface-base {
        background-color: #0c081e !important;
      }
      .bg-surface-raised {
        background-color: #120d2c !important;
      }
      .text-accent-primary, .text-accent-primary-text {
        color: #d946ef !important;
      }
      .bg-accent-primary {
        background-color: #c026d3 !important;
      }
      .border-border-default {
        border-color: rgba(192, 38, 211, 0.25) !important;
      }
    `,
    catppuccin: `
      /* Catppuccin Mocha Theme */
      body, #root, .bg-surface-base {
        background-color: #1e1e2e !important;
      }
      .bg-surface-raised {
        background-color: #181825 !important;
      }
      .bg-surface-overlay {
        background-color: #313244 !important;
      }
      .text-text-primary {
        color: #cdd6f4 !important;
      }
      .text-accent-primary {
        color: #89b4fa !important;
      }
      .bg-accent-primary {
        background-color: #89b4fa !important;
        color: #11111b !important;
      }
    `,
    neon: `
      /* Vubbio Neon Lime Matrix */
      body, #root, .bg-surface-base {
        background-color: #050805 !important;
      }
      .bg-surface-raised {
        background-color: #081008 !important;
      }
      .border-border-default {
        border-color: rgba(173, 255, 8, 0.2) !important;
      }
      .text-accent-primary {
        color: #ADFF08 !important;
      }
      .bg-accent-primary {
        background-color: #ADFF08 !important;
        color: #000000 !important;
      }
    `
  };

  const Vubbio = {
    version: VERSION,
    settings,
    customProfile,
    peerCache,
    authStore: null,
    subStore: null,
    deletedMessages: new Map(), // messageId -> messageObj

    registerPeer(userId, data) {
      if (!userId || !data) return;
      this.peerCache[String(userId)] = {
        avatarUrl: data.a || data.avatarUrl || '',
        bannerUrl: data.b || data.bannerUrl || '',
        badges: data.g || data.badges || ['nexus', 'vubbio'],
        updatedAt: Date.now()
      };
      savePeerCache(this.peerCache);
      this.syncDOMImages();
    },

    getPeer(userId) {
      return this.peerCache[String(userId)] || null;
    },

    inspectAndPatchUser(user) {
      if (!user || typeof user !== 'object') return user;

      if (user.bio && typeof user.bio === 'string' && user.bio.includes(VUBBIO_MARKER)) {
        const decoded = decodeVubbioData(user.bio);
        if (decoded) {
          this.registerPeer(user.id, decoded);
          if (decoded.a) { user.avatar_url = decoded.a; user.avatar = decoded.a; }
          if (decoded.b) { user.banner_url = decoded.b; user.banner = decoded.b; }
          user.bio = stripVubbioData(user.bio);
        }
      }

      const peer = this.getPeer(user.id);
      if (peer) {
        if (peer.avatarUrl) { user.avatar_url = peer.avatarUrl; user.avatar = peer.avatarUrl; }
        if (peer.bannerUrl) { user.banner_url = peer.bannerUrl; user.banner = peer.bannerUrl; }
      }

      const curId = this.authStore?.getState()?.user?.id;
      if (curId && String(user.id) === String(curId)) {
        if (customProfile.avatarUrl) { user.avatar_url = customProfile.avatarUrl; user.avatar = customProfile.avatarUrl; }
        if (customProfile.bannerUrl) { user.banner_url = customProfile.bannerUrl; user.banner = customProfile.bannerUrl; }
      }

      return user;
    },

    // ============================================================
    // THEME & CUSTOM CSS ENGINE
    // ============================================================
    applyTheme() {
      let themeEl = document.getElementById('vubbio-theme-style');
      if (!themeEl) {
        themeEl = document.createElement('style');
        themeEl.id = 'vubbio-theme-style';
        document.head.appendChild(themeEl);
      }

      const selected = THEMES[settings.activeTheme] || '';
      const userCss = settings.customCss || '';
      themeEl.textContent = selected + '\n' + userCss;
    },

    // ============================================================
    // NETWORK INTERCEPTORS
    // ============================================================
    setupInterceptors() {
      const self = this;

      // 1. Fetch Interceptor (Anti-Track & Subscription)
      const origFetch = window.fetch;
      window.fetch = async function(url, options = {}) {
        const u = String(url || '');

        // Anti-Track
        if (settings.antiTrack) {
          if (u.includes('google-analytics') || u.includes('hotjar') || u.includes('sentry') || u.includes('/metrics') || u.includes('/analytics')) {
            return new Response('{}', { status: 200 });
          }
        }

        // Silent Typing
        if (settings.stealthTyping && (u.includes('/typing') || u.includes('/typing-start'))) {
          return new Response('{}', { status: 200 });
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

      // 2. XHR Interceptor (Jubbio Axios)
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

          // Stealth Typing (XHR)
          if (settings.stealthTyping && u.includes('/typing')) {
            return this._respondJson({ success: true });
          }

          // Nexus Subscriptions
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

          // Badges
          if (u.includes('/badges')) {
            const match = u.match(/\/users\/([^\/]+)\/badges/);
            const targetId = match ? match[1] : null;
            const myId = self.authStore?.getState()?.user?.id;

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

          // Profile Update (PATCH /api/v1/auth/me/profile)
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
                  saveProfile(customProfile);

                  const cleanBio = stripVubbioData(rawBio);
                  const stegoPayload = {
                    a: customProfile.avatarUrl,
                    b: customProfile.bannerUrl,
                    g: ['nexus', 'vubbio', 'early', 'verified']
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

          // Inbound Patch
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

                if (data.id && (data.username || data.display_name)) {
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
                    // Cache message for Message Logger
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
    // WEBSOCKET & MESSAGE LOGGER HOOK
    // ============================================================
    setupWebSocketHook() {
      const self = this;
      const OrigWS = window.WebSocket;

      window.WebSocket = function(...args) {
        const ws = new OrigWS(...args);

        // Stealth Typing Outgoing
        const origSend = ws.send;
        ws.send = function(data) {
          if (settings.stealthTyping && typeof data === 'string') {
            try {
              const parsed = JSON.parse(data);
              if (parsed.t === 'TYPING_START' || parsed.event === 'typing' || parsed.type === 'typing') {
                return; // Drop typing packet
              }
            } catch {}
          }
          return origSend.call(this, data);
        };

        // Incoming Messages & Deletions
        ws.addEventListener('message', (event) => {
          try {
            if (typeof event.data === 'string') {
              const msg = JSON.parse(event.data);
              if (!msg) return;

              // Kullanıcı algılama
              if (msg.author) self.inspectAndPatchUser(msg.author);
              if (msg.user) self.inspectAndPatchUser(msg.user);

              // Message Logger: Mesaj Silindi Olayı
              if (settings.messageLogger && (msg.t === 'MESSAGE_DELETE' || msg.event === 'message_deleted' || msg.type === 'delete_message')) {
                const mid = String(msg.d?.id || msg.message_id || msg.id);
                if (mid) {
                  // Ekranda mesajı kırmızı yap ve [SİLİNDİ] etiketi koy
                  setTimeout(() => {
                    const msgEl = document.querySelector(`[data-message-id="${mid}"]`);
                    if (msgEl) {
                      msgEl.style.setProperty('border-left', '3px solid #ef4444', 'important');
                      msgEl.style.setProperty('background-color', 'rgba(239, 68, 68, 0.08)', 'important');
                      if (!msgEl.querySelector('.vubbio-deleted-tag')) {
                        const tag = document.createElement('span');
                        tag.className = 'vubbio-deleted-tag';
                        tag.textContent = ' [SİLİNDİ]';
                        tag.style.cssText = 'color:#ef4444;font-size:10px;font-weight:bold;margin-left:6px;';
                        const header = msgEl.querySelector('[class*="header"], [class*="author"]') || msgEl;
                        header.appendChild(tag);
                      }
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
    // STORES & DOM SYNC
    // ============================================================
    async hookStores() {
      try {
        const scriptEl = document.querySelector('script[type="module"][src*="index-"]') ||
                         document.querySelector('script[src*="index-"]');
        const src = scriptEl ? scriptEl.getAttribute('src') : './assets/index-BTphJn22.js';

        const mainModule = await import(src);
        if (mainModule) {
          if (mainModule.f && typeof mainModule.f.getState === 'function') {
            this.authStore = mainModule.f;
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
        if (this.subStore) this.syncSubStore();
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
      const myUsername = (curUser?.username || '').toLowerCase();
      const myDisplayName = (curUser?.display_name || '').toLowerCase();

      // Avatar
      if (customProfile.avatarUrl) {
        document.querySelectorAll('img').forEach(img => {
          const alt = (img.getAttribute('alt') || '').toLowerCase();
          const src = img.getAttribute('src') || '';
          if (
            (myUsername && alt.includes(myUsername)) ||
            (myDisplayName && alt.includes(myDisplayName)) ||
            img.closest('[data-current-user="true"]')
          ) {
            if (src !== customProfile.avatarUrl) img.src = customProfile.avatarUrl;
          }
        });
      }

      // Banner (ProfileModal & UserPanels)
      if (customProfile.bannerUrl) {
        const bannerContainers = document.querySelectorAll('div.bg-center.bg-cover, [role="dialog"] div.bg-cover, [role="dialog"] div[style*="linear-gradient"]');
        bannerContainers.forEach(div => {
          const rect = div.getBoundingClientRect();
          if (rect.height >= 70 && rect.width >= 200) {
            const currentBg = div.style.backgroundImage || '';
            const targetBg = `url("${customProfile.bannerUrl}")`;
            if (!currentBg.includes(customProfile.bannerUrl.slice(0, 40))) {
              div.style.setProperty('background-image', targetBg, 'important');
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

      // Eşlerin Banner & Avatarları
      for (const [peerId, peerData] of Object.entries(this.peerCache)) {
        if (peerData.avatarUrl) {
          document.querySelectorAll(`img[alt*="${peerId}"], [data-user-id="${peerId}"] img`).forEach(img => {
            if (img.src !== peerData.avatarUrl) img.src = peerData.avatarUrl;
          });
        }
        if (peerData.bannerUrl) {
          document.querySelectorAll(`[data-user-id="${peerId}"] div.bg-cover`).forEach(div => {
            div.style.setProperty('background-image', `url("${peerData.bannerUrl}")`, 'important');
          });
        }
      }
    },

    // ============================================================
    // VUBBIO ULTIMATE MOD MENÜSÜ & CANLI ÖNİZLEME
    // ============================================================
    injectUI() {
      const oldBadge = document.getElementById('vubbio-badge-root');
      if (oldBadge) oldBadge.remove();
      const oldModal = document.getElementById('vubbio-modal-root');
      if (oldModal) oldModal.remove();
      const oldStyle = document.getElementById('vubbio-custom-css');
      if (oldStyle) oldStyle.remove();

      const curUser = this.authStore?.getState()?.user;
      const initialName = curUser?.display_name || curUser?.username || 'Polat';
      const initialHandle = '@' + (curUser?.username || 'polatt');

      const style = document.createElement('style');
      style.id = 'vubbio-custom-css';
      style.textContent = `
        /* ===== VUBBIO ULTRA-MODERN AESTHETIC SUITE ===== */
        @keyframes vb-glow {
          0%, 100% { opacity: 0.8; transform: scale(1); filter: drop-shadow(0 0 8px #ADFF08); }
          50% { opacity: 0.35; transform: scale(0.9); filter: drop-shadow(0 0 2px #ADFF08); }
        }

        @keyframes vb-modal-in {
          0% { transform: scale(0.95) translateY(12px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes vb-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
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
          background: rgba(10, 15, 26, 0.85);
          border: 1px solid rgba(173, 255, 8, 0.35);
          backdrop-filter: blur(24px) saturate(160%);
          color: #ffffff;
          padding: 8px 16px 8px 12px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          box-shadow: 0 12px 35px -8px rgba(0, 0, 0, 0.7), 0 0 24px rgba(173, 255, 8, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vubbio-pill:hover {
          background: rgba(15, 23, 42, 0.95);
          border-color: #ADFF08;
          box-shadow: 0 16px 45px -8px rgba(0, 0, 0, 0.85), 0 0 35px rgba(173, 255, 8, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
          transform: translateY(-2px) scale(1.03);
        }

        .vubbio-pill:active {
          transform: translateY(0) scale(0.98);
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
          box-shadow: 0 0 10px rgba(173, 255, 8, 0.5);
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
          background: rgba(173, 255, 8, 0.18);
          color: #ADFF08;
          border: 1px solid rgba(173, 255, 8, 0.35);
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .vubbio-pill-shortcut {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 2px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Modal Backdrop */
        #vubbio-modal-root {
          position: fixed;
          inset: 0;
          z-index: 1000000;
          background: radial-gradient(ellipse at 50% 35%, rgba(173, 255, 8, 0.07) 0%, rgba(3, 7, 18, 0.88) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', 'Segoe UI', Roboto, sans-serif;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #vubbio-modal-root.active {
          opacity: 1;
          pointer-events: auto;
        }

        /* Modal Container */
        .vubbio-modal {
          width: 680px;
          max-width: 94vw;
          background: linear-gradient(165deg, rgba(17, 24, 39, 0.95) 0%, rgba(9, 13, 22, 0.98) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 35px 90px -15px rgba(0, 0, 0, 0.95), 0 0 60px rgba(173, 255, 8, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.14);
          overflow: hidden;
          animation: vb-modal-in 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        /* Ambient Top Light */
        .vubbio-modal::before {
          content: "";
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(173, 255, 8, 0.6), transparent);
          pointer-events: none;
        }

        /* Modal Header */
        .vubbio-modal-header {
          padding: 20px 26px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vubbio-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vubbio-logo-box {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #ADFF08 0%, #15803d 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #070a12;
          font-weight: 900;
          font-size: 18px;
          box-shadow: 0 0 20px rgba(173, 255, 8, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .vubbio-brand-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .vubbio-brand-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vubbio-modal-title {
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .vubbio-tag-v5 {
          font-size: 10px;
          background: linear-gradient(90deg, rgba(173, 255, 8, 0.2), rgba(34, 197, 94, 0.2));
          color: #ADFF08;
          border: 1px solid rgba(173, 255, 8, 0.4);
          padding: 2px 7px;
          border-radius: 9999px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .vubbio-modal-subtitle {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 500;
        }

        .vubbio-modal-close {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-size: 15px;
          cursor: pointer;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: all 0.18s ease;
        }

        .vubbio-modal-close:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #f87171;
          transform: rotate(90deg);
        }

        /* Segmented Tabs Navigation */
        .vubbio-tabs-wrapper {
          padding: 10px 24px;
          background: rgba(0, 0, 0, 0.25);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .vubbio-tabs {
          display: flex;
          background: rgba(13, 18, 30, 0.85);
          padding: 4px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          gap: 4px;
        }

        .vubbio-tab-btn {
          flex: 1;
          background: transparent;
          border: 1px solid transparent;
          color: #94a3b8;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          white-space: nowrap;
        }

        .vubbio-tab-btn:hover:not(.active) {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.04);
        }

        .vubbio-tab-btn.active {
          background: rgba(173, 255, 8, 0.12);
          color: #ADFF08;
          border-color: rgba(173, 255, 8, 0.3);
          box-shadow: 0 4px 15px -2px rgba(173, 255, 8, 0.25);
        }

        .vubbio-tab-btn span.icon {
          font-size: 14px;
        }

        /* Modal Body */
        .vubbio-modal-body {
          padding: 22px 26px;
          max-height: 64vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .vubbio-modal-body::-webkit-scrollbar {
          width: 6px;
        }
        .vubbio-modal-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .vubbio-modal-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
        }
        .vubbio-modal-body::-webkit-scrollbar-thumb:hover {
          background: rgba(173, 255, 8, 0.3);
        }

        .vubbio-tab-content {
          display: none;
          flex-direction: column;
          gap: 16px;
        }

        .vubbio-tab-content.active {
          display: flex;
        }

        /* Live Preview Discord-Style Profile Card */
        .vubbio-live-card {
          background: #0b0f19;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .vubbio-preview-banner {
          width: 100%;
          height: 125px;
          background: linear-gradient(135deg, rgba(173,255,8,0.2) 0%, rgba(30,41,59,0.8) 100%);
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .vubbio-preview-banner::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(11, 15, 25, 0.95) 100%);
        }

        .vubbio-preview-body {
          padding: 0 20px 18px 20px;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .vubbio-preview-avatar-wrapper {
          position: absolute;
          top: -46px;
          left: 20px;
          width: 86px;
          height: 86px;
          border-radius: 50%;
          border: 4px solid #0b0f19;
          background: #060911;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
          z-index: 2;
        }

        .vubbio-preview-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vubbio-preview-status {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #22c55e;
          border: 3px solid #0b0f19;
          box-shadow: 0 0 10px #22c55e;
        }

        .vubbio-preview-info {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .vubbio-preview-user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .vubbio-preview-name {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vubbio-preview-handle {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .vubbio-preview-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          padding: 5px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          min-height: 28px;
        }

        .vubbio-preview-badge-icon {
          width: 20px;
          height: 20px;
          object-fit: contain;
          transition: transform 0.15s ease;
        }

        .vubbio-preview-badge-icon:hover {
          transform: scale(1.2);
        }

        /* Glassmorphic Control Cards */
        .vubbio-card {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .vubbio-card-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vubbio-card-title span.icon {
          font-size: 15px;
        }

        .vubbio-card-title span.sub {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
          margin-left: auto;
        }

        /* Aesthetic Input Rows */
        .vubbio-input-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .vubbio-text-input {
          flex: 1;
          background: rgba(6, 10, 18, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.09);
          color: #f8fafc;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 12.5px;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .vubbio-text-input::placeholder {
          color: #64748b;
        }

        .vubbio-text-input:focus {
          border-color: #ADFF08;
          background: rgba(9, 14, 26, 0.9);
          box-shadow: 0 0 0 3px rgba(173, 255, 8, 0.15);
        }

        .vubbio-btn-file {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          transition: all 0.18s ease;
        }

        .vubbio-btn-file:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .vubbio-btn-danger-sm {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.25);
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .vubbio-btn-danger-sm:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.45);
        }

        /* Badge Grid */
        .vubbio-badge-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .vubbio-badge-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(6, 10, 18, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .vubbio-badge-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        .vubbio-badge-card input[type="checkbox"] {
          accent-color: #ADFF08;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .vubbio-badge-card img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
        }

        .vubbio-badge-card span {
          font-size: 12.5px;
          font-weight: 700;
          color: #f1f5f9;
        }

        /* Themes Grid */
        .vubbio-theme-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .vubbio-theme-card {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(6, 10, 18, 0.5);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        .vubbio-theme-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-2px);
        }

        .vubbio-theme-card.active {
          border-color: #ADFF08;
          background: rgba(173, 255, 8, 0.06);
          box-shadow: 0 0 25px rgba(173, 255, 8, 0.15);
        }

        .vubbio-theme-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vubbio-theme-card h4 {
          margin: 0;
          font-size: 13.5px;
          font-weight: 800;
          color: #ffffff;
        }

        .vubbio-theme-card p {
          margin: 0;
          font-size: 11.5px;
          color: #94a3b8;
          line-height: 1.4;
        }

        .vubbio-theme-swatches {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }

        .vubbio-theme-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Custom CSS Editor */
        .vubbio-css-container {
          display: flex;
          flex-direction: column;
          background: #080c14;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          overflow: hidden;
        }

        .vubbio-css-header {
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
          font-family: monospace;
        }

        .vubbio-css-textarea {
          width: 100%;
          height: 140px;
          background: transparent;
          border: none;
          color: #ADFF08;
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
          font-size: 12px;
          line-height: 1.5;
          padding: 12px 14px;
          outline: none;
          resize: vertical;
          box-sizing: border-box;
        }

        /* Toggle Rows */
        .vubbio-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 18px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .vubbio-toggle-row:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .vubbio-toggle-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .vubbio-toggle-text h4 {
          margin: 0;
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vubbio-toggle-text p {
          margin: 0;
          font-size: 11.5px;
          color: #94a3b8;
          line-height: 1.4;
        }

        /* Aesthetic iOS Glass Switch */
        .vubbio-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
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
          inset: 0;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vubbio-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vubbio-switch input:checked + .vubbio-slider {
          background: #ADFF08;
          border-color: #ADFF08;
          box-shadow: 0 0 16px rgba(173, 255, 8, 0.4);
        }

        .vubbio-switch input:checked + .vubbio-slider:before {
          transform: translateX(22px);
          background: #070a12;
        }

        /* Modal Footer */
        .vubbio-modal-footer {
          padding: 18px 26px;
          background: rgba(0, 0, 0, 0.35);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vubbio-btn-apply {
          background: linear-gradient(135deg, #ADFF08 0%, #84cc16 100%);
          color: #070a12;
          border: none;
          font-weight: 800;
          padding: 11px 26px;
          border-radius: 12px;
          font-size: 13px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(173, 255, 8, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vubbio-btn-apply:hover {
          background: linear-gradient(135deg, #c0ff38 0%, #9be21e 100%);
          transform: translateY(-1.5px) scale(1.02);
          box-shadow: 0 8px 28px rgba(173, 255, 8, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .vubbio-btn-apply:active {
          transform: translateY(0) scale(0.98);
        }

        .vubbio-btn-reset {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .vubbio-btn-reset:hover {
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.35);
          background: rgba(239, 68, 68, 0.08);
        }
      `;
      document.head.appendChild(style);

      // Trigger Pill (Bottom Right)
      const badgeRoot = document.createElement('div');
      badgeRoot.id = 'vubbio-badge-root';
      badgeRoot.innerHTML = `
        <div class="vubbio-pill" id="vubbio-open-btn" title="Vubbio Menüsü (Ctrl + Shift + V)">
          <div class="vubbio-pill-icon-box">⚡</div>
          <div class="vubbio-pill-label">
            <span class="name">Vubbio</span>
            <span class="badge">v${VERSION}</span>
          </div>
          <div class="vubbio-pill-shortcut">Ctrl+Shift+V</div>
        </div>
      `;
      document.body.appendChild(badgeRoot);

      // Render Modal
      const modalRoot = document.createElement('div');
      modalRoot.id = 'vubbio-modal-root';
      modalRoot.innerHTML = `
        <div class="vubbio-modal">
          <!-- Header -->
          <div class="vubbio-modal-header">
            <div class="vubbio-brand">
              <div class="vubbio-logo-box">⚡</div>
              <div class="vubbio-brand-info">
                <div class="vubbio-brand-row">
                  <div class="vubbio-modal-title">Vubbio Mod Suite</div>
                  <span class="vubbio-tag-v5">v${VERSION}</span>
                </div>
                <div class="vubbio-modal-subtitle">Vencord & BetterDiscord Style Client Engine</div>
              </div>
            </div>
            <button class="vubbio-modal-close" id="vubbio-close-btn" title="Kapat">✕</button>
          </div>

          <!-- Segmented Navigation Tabs -->
          <div class="vubbio-tabs-wrapper">
            <div class="vubbio-tabs">
              <button class="vubbio-tab-btn active" data-tab="tab-mesh">
                <span class="icon">🎨</span> Profil & Banner
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-themes">
                <span class="icon">🎭</span> Temalar & CSS
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-chat">
                <span class="icon">💬</span> Sohbet Modları
              </button>
              <button class="vubbio-tab-btn" data-tab="tab-nexus">
                <span class="icon">🔊</span> Ses & Nexus
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="vubbio-modal-body">
            <!-- TAB 1: P2P PROFİL & BANNER -->
            <div class="vubbio-tab-content active" id="tab-mesh">
              <!-- Live Profile Preview Card -->
              <div class="vubbio-live-card">
                <div class="vubbio-preview-banner" id="vb-preview-banner" style="${customProfile.bannerUrl ? `background-image: url('${customProfile.bannerUrl}');` : ''}"></div>
                <div class="vubbio-preview-body">
                  <div class="vubbio-preview-avatar-wrapper">
                    <img class="vubbio-preview-avatar" id="vb-preview-avatar" src="${customProfile.avatarUrl || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23475569\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg>'}" alt="Avatar">
                    <div class="vubbio-preview-status"></div>
                  </div>
                  <div class="vubbio-preview-info">
                    <div class="vubbio-preview-user-details">
                      <div class="vubbio-preview-name">${initialName}</div>
                      <div class="vubbio-preview-handle">${initialHandle}</div>
                    </div>
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
                  <span class="icon">🖼️</span> Hareketli Kapak Resmi (GIF Banner)
                  <span class="sub">P2P Senkronize</span>
                </div>
                <div class="vubbio-input-row">
                  <input type="text" class="vubbio-text-input" id="vb-banner-url" placeholder="GIF linki yapıştırın (Tenor, Giphy, CDN)..." value="${customProfile.bannerUrl.startsWith('data:') ? '(Yüklenen GIF Dosyası)' : customProfile.bannerUrl}">
                  <label class="vubbio-btn-file">
                    📁 Dosya
                    <input type="file" id="vb-banner-file" accept=".gif,image/*" style="display:none;">
                  </label>
                  <button type="button" class="vubbio-btn-danger-sm" id="vb-clear-banner" title="Kaldır">✕</button>
                </div>
              </div>

              <!-- Avatar Input -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span class="icon">🎬</span> Hareketli Profil Resmi (GIF PP)
                  <span class="sub">P2P Senkronize</span>
                </div>
                <div class="vubbio-input-row">
                  <input type="text" class="vubbio-text-input" id="vb-avatar-url" placeholder="Avatar GIF linki yapıştırın..." value="${customProfile.avatarUrl.startsWith('data:') ? '(Yüklenen GIF Dosyası)' : customProfile.avatarUrl}">
                  <label class="vubbio-btn-file">
                    📁 Dosya
                    <input type="file" id="vb-avatar-file" accept=".gif,image/*" style="display:none;">
                  </label>
                  <button type="button" class="vubbio-btn-danger-sm" id="vb-clear-avatar" title="Kaldır">✕</button>
                </div>
              </div>

              <!-- Rozet Seçici -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span class="icon">👑</span> Profil Rozetleri
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

              <!-- Özel Rozet Oluşturucu -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span class="icon">✨</span> Özel Rozet Tasarlayıcı (Custom Badge)
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
            </div>

            <!-- TAB 2: TEMALAR & CANLI CSS -->
            <div class="vubbio-tab-content" id="tab-themes">
              <div class="vubbio-theme-grid">
                <div class="vubbio-theme-card ${settings.activeTheme === 'default' ? 'active' : ''}" data-theme="default">
                  <div class="vubbio-theme-top">
                    <h4>Varsayılan Koyu</h4>
                  </div>
                  <p>Jubbio orijinal koyu gece teması</p>
                  <div class="vubbio-theme-swatches">
                    <div class="vubbio-theme-dot" style="background:#1e293b;"></div>
                    <div class="vubbio-theme-dot" style="background:#0f172a;"></div>
                    <div class="vubbio-theme-dot" style="background:#6366f1;"></div>
                  </div>
                </div>

                <div class="vubbio-theme-card ${settings.activeTheme === 'oled' ? 'active' : ''}" data-theme="oled">
                  <div class="vubbio-theme-top">
                    <h4>Pure OLED Black</h4>
                  </div>
                  <p>Saf derin siyah, AMOLED piller için ideal</p>
                  <div class="vubbio-theme-swatches">
                    <div class="vubbio-theme-dot" style="background:#000000;"></div>
                    <div class="vubbio-theme-dot" style="background:#111111;"></div>
                    <div class="vubbio-theme-dot" style="background:#ffffff;"></div>
                  </div>
                </div>

                <div class="vubbio-theme-card ${settings.activeTheme === 'cyberpunk' ? 'active' : ''}" data-theme="cyberpunk">
                  <div class="vubbio-theme-top">
                    <h4>Midnight Cyberpunk</h4>
                  </div>
                  <p>Fütüristik neon mor ve eflatun parıltılar</p>
                  <div class="vubbio-theme-swatches">
                    <div class="vubbio-theme-dot" style="background:#090014;"></div>
                    <div class="vubbio-theme-dot" style="background:#a855f7;"></div>
                    <div class="vubbio-theme-dot" style="background:#ec4899;"></div>
                  </div>
                </div>

                <div class="vubbio-theme-card ${settings.activeTheme === 'catppuccin' ? 'active' : ''}" data-theme="catppuccin">
                  <div class="vubbio-theme-top">
                    <h4>Catppuccin Mocha</h4>
                  </div>
                  <p>Göz yormayan şık ve yumuşak pastel renkler</p>
                  <div class="vubbio-theme-swatches">
                    <div class="vubbio-theme-dot" style="background:#1e1e2e;"></div>
                    <div class="vubbio-theme-dot" style="background:#cba6f7;"></div>
                    <div class="vubbio-theme-dot" style="background:#89b4fa;"></div>
                  </div>
                </div>

                <div class="vubbio-theme-card ${settings.activeTheme === 'neon' ? 'active' : ''}" data-theme="neon">
                  <div class="vubbio-theme-top">
                    <h4>Neon Matrix</h4>
                  </div>
                  <p>Vubbio elektrik yeşili siber tema</p>
                  <div class="vubbio-theme-swatches">
                    <div class="vubbio-theme-dot" style="background:#030712;"></div>
                    <div class="vubbio-theme-dot" style="background:#ADFF08;"></div>
                    <div class="vubbio-theme-dot" style="background:#22c55e;"></div>
                  </div>
                </div>
              </div>

              <!-- Canlı CSS Editörü -->
              <div class="vubbio-card">
                <div class="vubbio-card-title">
                  <span class="icon">💻</span> Canlı Özel CSS Editörü
                  <span class="sub">Anında uygulanır</span>
                </div>
                <div class="vubbio-css-container">
                  <div class="vubbio-css-header">
                    <span>custom.css</span>
                    <span>CSS3 Mode</span>
                  </div>
                  <textarea class="vubbio-css-textarea" id="vb-custom-css-input" placeholder="/* Özel CSS kodlarınızı buraya yazın (Örn: .chat-box { border-radius: 20px; } ) */">${settings.customCss || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- TAB 3: SOHBET & MESAJ MODLARI -->
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
                  <p>Başka sunucuların özel emojilerini tüm sunucularda ve özel mesajlarda kullanın</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-emotes" ${settings.serverEmotes ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🚫 Anti-Track & Telemetri Engelleyici</h4>
                  <p>Jubbio arka plan analitik ve izleme isteklerini engelleyerek bağlantıyı hızlandırır</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-antitrack" ${settings.antiTrack ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>
            </div>

            <!-- TAB 4: SES & NEXUS -->
            <div class="vubbio-tab-content" id="tab-nexus">
              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🏆 Nexus Abonelik Kilidi Açıcı</h4>
                  <p>4000 karakter mesaj sınırı, büyük dosya yükleme ve abonelik kısıtlamalarını kaldırır</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-nexus" ${settings.nexusUnlocker ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🖥️ 4K 60FPS Ekran Paylaşımı</h4>
                  <p>Yayın açarken çözünürlük ve 60 FPS kare hızı kilidini otomatik olarak açar</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-screen" ${settings.screenShare4k ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🔊 HD Stüdyo Sesi (384kbps)</h4>
                  <p>Ses odalarında kristal netliğinde ve yüksek bitrate stüdyo ses kalitesi</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-voice" ${settings.voiceHd ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>

              <div class="vubbio-toggle-row">
                <div class="vubbio-toggle-text">
                  <h4>🎨 Özel Profil Temaları & Renkleri</h4>
                  <p>Özel renk ve gradyan seçim kısıtlamalarını kaldırarak tam serbestlik sağlar</p>
                </div>
                <label class="vubbio-switch">
                  <input type="checkbox" id="vb-opt-themes" ${settings.profileThemes ? 'checked' : ''}>
                  <span class="vubbio-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="vubbio-modal-footer">
            <button class="vubbio-btn-reset" id="vb-reset-all">Tümünü Sıfırla</button>
            <button class="vubbio-btn-apply" id="vb-apply-all">
              <span>💾</span> Kaydet & Uygula
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modalRoot);

      // Event handlers
      const openBtn = document.getElementById('vubbio-open-btn');
      const closeBtn = document.getElementById('vubbio-close-btn');

      openBtn.addEventListener('click', () => modalRoot.classList.add('active'));
      closeBtn.addEventListener('click', () => modalRoot.classList.remove('active'));
      modalRoot.addEventListener('click', (e) => {
        if (e.target === modalRoot) modalRoot.classList.remove('active');
      });

      // Global Hotkey: Ctrl + Shift + V
      window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
          e.preventDefault();
          modalRoot.classList.toggle('active');
        }
      });

      // Tabs
      modalRoot.querySelectorAll('.vubbio-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modalRoot.querySelectorAll('.vubbio-tab-btn').forEach(b => b.classList.remove('active'));
          modalRoot.querySelectorAll('.vubbio-tab-content').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          const tabId = btn.getAttribute('data-tab');
          document.getElementById(tabId)?.classList.add('active');
        });
      });

      // Themes
      modalRoot.querySelectorAll('.vubbio-theme-card').forEach(card => {
        card.addEventListener('click', () => {
          modalRoot.querySelectorAll('.vubbio-theme-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          settings.activeTheme = card.getAttribute('data-theme');
          this.applyTheme();
        });
      });

      // Live Previews
      const previewAvatar = document.getElementById('vb-preview-avatar');
      const previewBanner = document.getElementById('vb-preview-banner');
      const previewBadges = document.getElementById('vb-preview-badges');
      const avatarUrlInput = document.getElementById('vb-avatar-url');
      const bannerUrlInput = document.getElementById('vb-banner-url');
      const avatarFileInput = document.getElementById('vb-avatar-file');
      const bannerFileInput = document.getElementById('vb-banner-file');

      avatarUrlInput?.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val && !val.startsWith('(')) previewAvatar.src = val;
      });

      bannerUrlInput?.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val && !val.startsWith('(')) previewBanner.style.backgroundImage = `url('${val}')`;
      });

      avatarFileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            customProfile.avatarUrl = reader.result;
            previewAvatar.src = reader.result;
            avatarUrlInput.value = `(${file.name} Yüklendi)`;
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
          };
          reader.readAsDataURL(file);
        }
      });

      document.getElementById('vb-clear-avatar')?.addEventListener('click', () => {
        customProfile.avatarUrl = '';
        avatarUrlInput.value = '';
        previewAvatar.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23475569"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
      });

      document.getElementById('vb-clear-banner')?.addEventListener('click', () => {
        customProfile.bannerUrl = '';
        bannerUrlInput.value = '';
        previewBanner.style.backgroundImage = 'linear-gradient(135deg, rgba(173,255,8,0.2) 0%, rgba(30,41,59,0.8) 100%)';
      });

      // Save & Apply
      const applyBtn = document.getElementById('vb-apply-all');
      applyBtn?.addEventListener('click', () => {
        const aVal = avatarUrlInput.value.trim();
        if (aVal && !aVal.startsWith('(') && aVal.startsWith('http')) customProfile.avatarUrl = aVal;

        const bVal = bannerUrlInput.value.trim();
        if (bVal && !bVal.startsWith('(') && bVal.startsWith('http')) customProfile.bannerUrl = bVal;

        customProfile.badgeNexus = document.getElementById('vb-badge-nexus')?.checked ?? true;
        customProfile.badgeVubbio = document.getElementById('vb-badge-vubbio')?.checked ?? true;
        customProfile.badgeEarly = document.getElementById('vb-badge-early')?.checked ?? true;
        customProfile.badgeVerified = document.getElementById('vb-badge-verified')?.checked ?? true;

        customProfile.customBadgeEnabled = document.getElementById('vb-custom-badge-en')?.checked ?? false;
        customProfile.customBadgeIcon = document.getElementById('vb-custom-badge-icon')?.value.trim() || '👑';
        customProfile.customBadgeName = document.getElementById('vb-custom-badge-name')?.value.trim() || 'Proje Lideri';
        customProfile.customBadgeDesc = document.getElementById('vb-custom-badge-desc')?.value.trim() || 'Vubbio Özel Üyesi';
        saveProfile(customProfile);

        settings.nexusUnlocker = document.getElementById('vb-opt-nexus')?.checked ?? true;
        settings.messageLogger = document.getElementById('vb-opt-logger')?.checked ?? true;
        settings.stealthTyping = document.getElementById('vb-opt-stealth')?.checked ?? true;
        settings.antiTrack = document.getElementById('vb-opt-antitrack')?.checked ?? true;
        settings.serverEmotes = document.getElementById('vb-opt-emotes')?.checked ?? true;
        settings.screenShare4k = document.getElementById('vb-opt-screen')?.checked ?? true;
        settings.voiceHd = document.getElementById('vb-opt-voice')?.checked ?? true;
        settings.profileThemes = document.getElementById('vb-opt-themes')?.checked ?? true;
        settings.customCss = document.getElementById('vb-custom-css-input')?.value || '';
        saveSettings(settings);

        this.applyTheme();

        // Kendi profilini P2P steganografi ile güncelle
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
            avatar: customProfile.avatarUrl || curUser.avatar,
            banner_url: customProfile.bannerUrl || curUser.banner_url,
            banner: customProfile.bannerUrl || curUser.banner
          };
          this.authStore.getState().setUser(nextUser);
        }

        this.syncSubStore();
        this.syncDOMImages();

        applyBtn.textContent = '✓ Başarıyla Uygulandı!';
        setTimeout(() => {
          applyBtn.textContent = '💾 Kaydet & Uygula';
          modalRoot.classList.remove('active');
        }, 1200);
      });

      document.getElementById('vb-reset-all')?.addEventListener('click', () => {
        if (confirm('Tüm ayarlar ve profil orijinal haline sıfırlansın mı?')) {
          customProfile = { ...defaultProfile };
          saveProfile(customProfile);
          settings.activeTheme = 'default';
          settings.customCss = '';
          saveSettings(settings);
          location.reload();
        }
      });
    },

    init() {
      this.applyTheme();
      this.setupInterceptors();
      this.setupWebSocketHook();
      this.hookStores();

      const start = () => {
        this.injectUI();
        this.hookStores();
        this.syncDOMImages();
        this.applyTheme();
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }

      console.log('%c[Vubbio] ⚡ Vubbio v5.0 Ultimate hazır!', 'color: #ADFF08; font-weight: bold;');
    }
  };

  window.Vubbio = Vubbio;
  Vubbio.init();
})();
