# ⚡ Vubbio — Jubbio Nexus Mod Loader

> Vencord/BetterDiscord tarzı Jubbio modifikasyon sistemi. Jubbio Nexus'un paralı özelliklerini ücretsiz açar.

---

## 📂 Proje Yapısı

```
Vubbio/
├── src/
│   └── index.js          ← Ana mod script (renderer'a inject edilir)
├── installer/
│   └── install.js        ← Node.js ASAR patcher
├── scripts/
│   └── install.ps1       ← PowerShell yükleyici (kolay kullanım)
└── package.json
```

---

## 🚀 Kurulum

### Yöntem 1 — Node.js ile (Önerilen)

```powershell
cd C:\Users\selam\Desktop\Vubbio
node installer/install.js install
```

### Yöntem 2 — PowerShell ile

```powershell
powershell -ExecutionPolicy Bypass -File scripts\install.ps1
```

---

## 🔧 Komutlar

| Komut | Açıklama |
|-------|----------|
| `node installer/install.js install` | Vubbio'yu kur |
| `node installer/install.js uninstall` | Vubbio'yu kaldır |
| `node installer/install.js status` | Kurulum durumu |
| `node installer/install.js repair` | Bozuk kurulumu onar / yeniden kur |

---

## ⚙️ Nasıl Çalışır?

Vubbio, **Vencord** ve **BetterDiscord** ile aynı tekniği kullanır:

```
Jubbio app.asar
    └── electron/main.cjs
            ↓ PATCH
    └── electron/main.cjs (+ Vubbio loader kodu)
```

1. **ASAR Patch** — `app.asar` içindeki `electron/main.cjs` dosyasına Vubbio loader kodu eklenir
2. **Renderer Injection** — Jubbio açıldığında `dom-ready` event'inde `src/index.js` renderer process'e inject edilir
3. **API Interception** — `fetch`, `XMLHttpRequest` ve `WebSocket` override edilir

### Açılan Özellikler (src/index.js)

| Sistem | Ne Yapar |
|--------|----------|
| **Fetch Interceptor** | `/api/nexus/subscription` ve benzeri endpoint'leri yakalar, sahte Pro yanıtı döner |
| **XHR Interceptor** | XMLHttpRequest tabanlı subscription kontrollerini bypass eder |
| **WebSocket Interceptor** | Realtime `SUBSCRIPTION_CANCELLED` event'lerini düşürür |
| **Storage Patcher** | `localStorage`/`sessionStorage`'daki subscription cache'ini override eder |
| **DOM Unlocker** | `data-nexus-lock` gibi premium UI kilit attributelerini kaldırır |
| **State Patcher** | Zustand/Redux store'larını bulup `isPremium: true` şeklinde patch eder |
| **UI Badge** | Sağ altta ⚡ Vubbio rozeti + plugin yönetim paneli |

---

## 🔄 Güncelleme

`src/index.js` dosyasını düzenleyin → Jubbio'yu yeniden açın.  
*(Installer'ı tekrar çalıştırmaya gerek yok — script AppData'dan okunur)*

---

## 🛡️ Kaldırma

```powershell
node installer/install.js uninstall
```

Orijinal `app.asar.vubbio-backup` dosyası geri yüklenir. Jubbio tamamen temizlenir.

---

## ⚠️ Notlar

- Jubbio güncellenirse kurulumu **yeniden yapın** (`install.js install`)
- Yedek dosya: `jubbio-client/resources/app.asar.vubbio-backup`
- Vubbio script: `%APPDATA%\Vubbio\index.js`
