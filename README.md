# ⚡ Vubbio Ultra v7.0 — Jubbio Client Mod Suite

> **Vencord & BetterDiscord** tarzı, Jubbio için geliştirilmiş en gelişmiş istemci modifikasyon ve eklenti paketi. Jubbio Nexus ücretli kısıtlamalarını kaldırır, gelişmiş görsel FX motoru, canlı duvar kağıdı, çeviri araçları ve medya özellikleri sunar.

---

## 🎨 Yeni: Canlı Duvar Kağıdı & Görsel FX Motoru (CSS Expansion)

### 🖼️ Canlı Duvar Kağıdı (Custom Wallpaper Engine)
- Jubbio arkaplanına istediğiniz resim veya hareketli GIF linkini koyabilirsiniz.
- **Şeffaflık Slider'ı (%10 - %100):** Duvar kağıdının görünürlüğünü ayarlayın.
- **Bulanıklık (Blur) Slider'ı (0px - 15px):** Arka planı buzlu cam gibi bulanıklaştırarak metinlerin net okunmasını sağlayın.
- Tek tıkla Anime, Cyberpunk ve Space hazır arka plan şablonları!

### ✨ 12 Hazır Görsel Efekt & Stil Modu (Tek Tıkla Aktif)
1. **🕶️ Buzlu Cam (Glassmorphism):** Tüm Jubbio pencerelerini yarı saydam modern buzlu cam görünümüne geçirir.
2. **🌈 RGB Neon Kenarlık:** Pencerelerin etrafında dönen akıcı gökkuşağı neon ışık efekti.
3. **🔲 Tam Yuvarlak Avatarlar:** Kullanıcı resimlerini %100 kusursuz daire yapar.
4. **⬛ Yumuşak Kare (Squircle):** Avatarları iOS tarzı yumuşatılmış kareye dönüştürür.
5. **📏 Kompakt Mesaj Modu:** Satır aralıklarını azaltarak ekranda 2 kat daha fazla mesaj gösterir.
6. **💫 Neon Parlayan İsimler:** Kullanıcı adlarına parıltı ve neon aurası ekler.
7. **⚡ İnce Modern Scrollbar:** Çirkin kalın kaydırma çubuklarını ultra ince elektrik yeşili neon çubuğa çevirir.
8. **🌟 Yumuşak Mesaj Kayması:** Yeni gelen iletiler ekranda yumuşak bir kayma animasyonuyla belirir.
9. **🚫 Engellenenleri Gizle:** Engellenen kullanıcı çubuklarını ekrandan tamamen siler.
10. **🎯 3D Hover & Eğim:** Buton ve kartların üzerine gelindiğinde dinamik eğim ve kalkma efekti uygular.

---

## 🚀 Güç Araçları & Yeni Özellikler

### 🌐 Mesaj Üzeri Hızlı Araç Çubuğu (Quick Message Bar)
- Herhangi bir mesajın üzerine fareyi getirdiğinizde minik hızlı işlem çubuğu belirir:
  - **🌐 Çevir:** Yabancı dildeki mesajı Google Translate altyapısıyla tek tıkla mesajın altında Türkçe'ye çevirir!
  - **📋 Kopyala:** Mesaj metnini panoya kopyalar.
  - **🆔 ID:** Mesaj ID'sini tek tıkla alır.

### 🔔 Sentetik Ses Efektleri Motoru (Sound FX Engine)
- Web Audio API ile harici dosya yükü olmadan gerçek zamanlı sentezlenen özel bildirim sesleri:
  - 🎮 **8-Bit Arcade:** Retro arcade melodisi
  - ⚡ **Sci-Fi Synth:** Fütüristik siber frekans sweep'i
  - 💎 **Glass Chime:** Kristal berraklığında cam tınısı
  - 💧 **Minimal Blip:** Yumuşak minimalist tıklama
  - ▶ **Sesi Dinle:** Ayarlarken anında sesleri test edin!

### ⌨️ Gelişmiş Sohbet Komutları
- `/mock <metin>` ➔ `tExT lIkE tHiS` (SpongeBob alayı)
- `/clap <metin>` ➔ `Metin 👏 Arasına 👏 Alkış`
- `/reverse <metin>` ➔ `nitem sıret` (Ters çevirme)
- `/shrug`, `/tableflip`, `/unflip`, `/lenny`, `/disapproval`, `/vubbio`

### 🔒 %100 Kalıcı Kayıt (Permanent Persistence)
- Uygulamayı kapatsanız veya yeniden başlatsanız bile **tüm profiliniz, hareketli avatarınız, banner'ınız, 3 özel rozetiniz, seçtiğiniz tema, font, ses seviyesi ve notlarınız korunur**.
- `/api/v1/auth/me` çift yönlü kilitlenerek sunucunun yerel profilinizi sıfırlaması engellenir.

---

## 📂 Proje Mimarisi

```
Vubbio/
├── src/
│   └── index.js          ← Vubbio Ultra v7.0 ana mod scripti
├── installer/
│   └── install.js        ← Zero-Shift ASAR patcher & senkronizasyon motoru
├── scripts/
│   └── install.ps1       ← PowerShell tek tıkla kurulum
└── package.json
```

---

## 🚀 Hızlı Başlangıç

### Kurulum

```powershell
cd C:\Users\selam\Desktop\Vubbio
node installer/install.js install
```

### Kod Güncellemelerini Senkronize Etme (Sync)

```powershell
node installer/install.js sync
```

Ardından Jubbio açıkken `Ctrl + R` veya `F5` tuşlayarak anında test edebilirsiniz!

---

## ⌨️ Klavye Kısayolları

| Kısayol | İşlev |
|---------|-------|
| `Ctrl + Shift + V` | Vubbio Ultra Mod Menüsünü Aç / Kapat |
| `/mock <metin>` | `mEtİn bÖyLe yAzIlIr` |
| `/clap <metin>` | `Metin 👏 Arasına 👏 Alkış` |
| `/reverse <metin>` | Metni tersten yazar |
| `/shrug` | `¯\_(ツ)_/¯` ekler |
| `/tableflip` | `(╯°□°)╯︵ ┻━┻` ekler |
| `/unflip` | `┬─┬ノ( º _ ºノ)` ekler |
| `/lenny` | `( ͡° ͜ʖ ͡°)` ekler |
| `/disapproval` | `ಠ_ಠ` ekler |
| `/vubbio` | `⚡ Vubbio Ultra Mod Suite v7.0` ekler |
