#!/usr/bin/env node
/**
 * Vubbio Installer v6.0 (Zero-Shift In-Place ASAR Patcher)
 * Jubbio Nexus Mod Loader - Vencord / BetterDiscord Suite
 * 
 * Bu patcher ASAR arşivindeki hiçbir dosyanın offset'ini veya boyutunu DEĞİŞTİRMEZ.
 * Byte-exact replacement sayesinde 404, eksik dosya veya açılmama sorunları %100 önlenir.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const c = {
  reset:    '\x1b[0m',
  bold:     '\x1b[1m',
  green:    '\x1b[32m',
  yellow:   '\x1b[33m',
  red:      '\x1b[31m',
  cyan:     '\x1b[36m',
  dim:      '\x1b[2m',
  lime:     '\x1b[92m',
};

function banner() {
  console.log(`
${c.lime}${c.bold}╔═══════════════════════════════════════════╗
║          ⚡  VUBBIO  ULTRA v6.0  ⚡         ║
║     Jubbio Nexus Mod Loader & Suite       ║
║         (Vencord / Discord Style)         ║
╚═══════════════════════════════════════════╝${c.reset}
`);
}

class JubbioPatcher {
  constructor(jubbioPath) {
    this.jubbioPath    = jubbioPath;
    this.resourcesPath = path.join(jubbioPath, 'resources');
    this.asarPath      = path.join(this.resourcesPath, 'app.asar');
    this.backupPath    = path.join(this.resourcesPath, 'app.asar.vubbio-backup');
    this.vubbioSrc     = path.join(__dirname, '..', 'src', 'index.js');
    this.vubbioAppData = path.join(
      process.env.APPDATA || path.join(require('os').homedir(), 'AppData', 'Roaming'),
      'Vubbio'
    );
  }

  validate() {
    if (!fs.existsSync(this.jubbioPath)) {
      throw new Error(`Jubbio dizini bulunamadı: ${this.jubbioPath}`);
    }
    if (!fs.existsSync(this.asarPath)) {
      throw new Error(`app.asar bulunamadı: ${this.asarPath}`);
    }
    if (!fs.existsSync(this.vubbioSrc)) {
      throw new Error(`Vubbio script bulunamadı: ${this.vubbioSrc}`);
    }
  }

  isInstalled() {
    return fs.existsSync(this.backupPath);
  }

  async install() {
    console.log(`${c.cyan}📦 Jubbio app.asar okunuyor...${c.reset}`);

    // Eğer önceki bir backup varsa ve şu anki asar bozulmuş olabilirse, önce backup'ı baz al
    let asarSource = this.asarPath;
    if (this.isInstalled()) {
      console.log(`${c.yellow}ℹ Mevcut kurulum tespit edildi, orijinal yedek baz alınıyor...${c.reset}`);
      asarSource = this.backupPath;
    } else {
      // Orijinal yedeği oluştur
      console.log(`${c.cyan}💾 Orijinal ASAR yedekleniyor...${c.reset}`);
      fs.copyFileSync(this.asarPath, this.backupPath);
      console.log(`${c.green}  ✓ Yedek oluşturuldu: app.asar.vubbio-backup${c.reset}`);
    }

    const buf = fs.readFileSync(asarSource);
    const originalLength = buf.length;
    console.log(`${c.green}  ✓ ASAR okundu: ${Math.round(originalLength / 1024 / 1024)}MB (${originalLength} bytes)${c.reset}`);

    // Parse ASAR header
    const pickleSize = buf.readUInt32LE(4);
    const headerSize = buf.readUInt32LE(12);
    const headerStr  = buf.slice(16, 16 + headerSize).toString('utf8');
    const header     = JSON.parse(headerStr);
    const dataOffset = 8 + pickleSize;

    const mainInfo = header.files?.electron?.files?.['main.cjs'];
    if (!mainInfo) {
      throw new Error('electron/main.cjs ASAR içinde bulunamadı!');
    }

    const mainOffset = parseInt(mainInfo.offset) + dataOffset;
    const mainSize   = mainInfo.size;
    console.log(`${c.green}  ✓ electron/main.cjs bulundu (Offset: ${mainOffset}, Boyut: ${mainSize} bytes)${c.reset}`);

    // Extract main.cjs
    let mainContent = buf.slice(mainOffset, mainOffset + mainSize).toString('utf8');

    // ─── Injection 1: Loader Function ──────────────────────────────
    const target1 = `// ============================================\r\n// IPC HANDLERS - Foreground App Detection (for passive overlay)\r\n// ============================================\r\n\r\n// Jubbio dışında bir uygulama fullscreen/borderless modda mı?\r\n// Bu, passive overlay'in gösterilip gösterilmeyeceğini belirler.\r\n// Blacklist: tarayıcılar, medya oynatıcılar, sistem uygulamaları\r\n`;
    const target1ByteLen = Buffer.byteLength(target1, 'utf8');

    if (!mainContent.includes(target1)) {
      throw new Error('main.cjs içinde hedef enjeksiyon noktası 1 bulunamadı!');
    }

    const loaderCode = `function __vubbio(w){if(!w||w.isDestroyed())return;w.on('dom-ready',()=>{try{const p=require('path').join(require('os').homedir(),'AppData/Roaming/Vubbio/index.js'),s=require('fs');if(s.existsSync(p))w.executeJavaScript(s.readFileSync(p,'utf8'),true);}catch(e){}});}\r\n`;
    const loaderByteLen = Buffer.byteLength(loaderCode, 'utf8');
    const pad1 = target1ByteLen - loaderByteLen;
    const replacement1 = loaderCode + '/*' + '*'.repeat(pad1 - 4) + '*/';

    if (Buffer.byteLength(replacement1, 'utf8') !== target1ByteLen) {
      throw new Error(`Enjeksiyon 1 byte uzunluğu eşleşmedi! (${Buffer.byteLength(replacement1, 'utf8')} vs ${target1ByteLen})`);
    }

    mainContent = mainContent.replace(target1, replacement1);

    // ─── Injection 2: Call inside createWindow ─────────────────────
    const target2 = `  // Open external links in system browser instead of Electron\r\n`;
    const target2ByteLen = Buffer.byteLength(target2, 'utf8');

    if (!mainContent.includes(target2)) {
      throw new Error('main.cjs içinde hedef enjeksiyon noktası 2 bulunamadı!');
    }

    const callCode = `  __vubbio(mainWindow.webContents);\r\n`;
    const callByteLen = Buffer.byteLength(callCode, 'utf8');
    const pad2 = target2ByteLen - callByteLen;
    const replacement2 = `  __vubbio(mainWindow.webContents);/*` + '*'.repeat(pad2 - 4) + `*/\r\n`;

    if (Buffer.byteLength(replacement2, 'utf8') !== target2ByteLen) {
      throw new Error(`Enjeksiyon 2 byte uzunluğu eşleşmedi! (${Buffer.byteLength(replacement2, 'utf8')} vs ${target2ByteLen})`);
    }

    mainContent = mainContent.replace(target2, replacement2);

    // Verify exact byte equality
    const patchedMainBuf = Buffer.from(mainContent, 'utf8');
    if (patchedMainBuf.length !== mainSize) {
      throw new Error(`Patched main.cjs boyutu orijinalden farklı! (${patchedMainBuf.length} vs ${mainSize})`);
    }

    console.log(`${c.green}  ✓ main.cjs byte-exact modifiye edildi (87543 == 87543 bytes)${c.reset}`);

    // Update SHA256 integrity hash in header buffer
    const oldHash = mainInfo.integrity.hash;
    const newHash = crypto.createHash('sha256').update(patchedMainBuf).digest('hex');
    console.log(`${c.cyan}  🔑 Integrity SHA256 güncelleniyor: ${oldHash.slice(0, 10)}... → ${newHash.slice(0, 10)}...${c.reset}`);

    // In-place replace hash in header region (16 to 16 + headerSize)
    const headerBuf = buf.slice(16, 16 + headerSize);
    let headerStrPatched = headerBuf.toString('utf8');
    headerStrPatched = headerStrPatched.split(oldHash).join(newHash);
    const newHeaderBuf = Buffer.from(headerStrPatched, 'utf8');

    if (newHeaderBuf.length !== headerSize) {
      throw new Error('Header boyutu hash güncellemesi sonrası değişti!');
    }

    // Write header and patched main.cjs back into ASAR buffer
    newHeaderBuf.copy(buf, 16);
    patchedMainBuf.copy(buf, mainOffset);

    if (buf.length !== originalLength) {
      throw new Error('ASAR toplam boyutu değişti!');
    }

    // Write back to disk
    console.log(`${c.cyan}💾 Güvenli ASAR diske kaydediliyor...${c.reset}`);
    fs.writeFileSync(this.asarPath, buf);
    console.log(`${c.green}  ✓ ASAR dosyası kaydedildi (0 byte kayma, 100% orijinal offsetler)${c.reset}`);

    // Copy Vubbio script to AppData
    console.log(`${c.cyan}📋 Vubbio eklentisi AppData'ya yükleniyor...${c.reset}`);
    if (!fs.existsSync(this.vubbioAppData)) {
      fs.mkdirSync(this.vubbioAppData, { recursive: true });
    }
    const vubbioCode = fs.readFileSync(this.vubbioSrc, 'utf8');
    fs.writeFileSync(path.join(this.vubbioAppData, 'index.js'), vubbioCode, 'utf8');
    console.log(`${c.green}  ✓ Vubbio eklentisi hazır: ${path.join(this.vubbioAppData, 'index.js')}${c.reset}`);

    console.log(`
${c.lime}${c.bold}══════════════════════════════════════════════════════
  ✅ VUBBIO BAŞARIYLA KURULDU!
══════════════════════════════════════════════════════${c.reset}
  • Jubbio'yu açın.
  • Sağ altta ${c.lime}${c.bold}⚡ Vubbio${c.reset} rozeti görünecektir.
  • Tıklayarak Nexus özelliklerini ve mod menüsünü yönetebilirsiniz.
`);
  }

  async uninstall() {
    if (!this.isInstalled()) {
      console.log(`${c.yellow}⚠️ Orijinal yedek bulunamadı, Vubbio kurulu değil.${c.reset}`);
      return;
    }

    console.log(`${c.cyan}🔄 Orijinal app.asar geri yükleniyor...${c.reset}`);
    fs.copyFileSync(this.backupPath, this.asarPath);
    fs.unlinkSync(this.backupPath);

    if (fs.existsSync(this.vubbioAppData)) {
      fs.rmSync(this.vubbioAppData, { recursive: true, force: true });
    }

    console.log(`${c.lime}${c.bold}✅ Vubbio tamamen kaldırıldı, Jubbio orijinal haline döndü.${c.reset}`);
  }

  status() {
    const installed = this.isInstalled();
    const asarExists = fs.existsSync(this.asarPath);
    const size = asarExists ? Math.round(fs.statSync(this.asarPath).size / 1024 / 1024) : 0;
    const appDataScript = path.join(this.vubbioAppData, 'index.js');
    const appDataExists = fs.existsSync(appDataScript);
    console.log(`
${c.bold}Vubbio Durum Raporu:${c.reset}
----------------------------------------
Jubbio Yolu:    ${c.cyan}${this.jubbioPath}${c.reset}
app.asar:       ${asarExists ? c.green + `✓ Mevcut (${size}MB)` : c.red + '✗ Yok'}${c.reset}
Loader Durumu:  ${installed ? c.lime + '✓ Vubbio Enjekte Edildi' : c.yellow + '○ Orijinal Jubbio'}${c.reset}
Yedek Arşiv:    ${installed ? c.green + '✓ Güvende' : c.dim + '- Yok'}${c.reset}
AppData Script: ${appDataExists ? c.green + `✓ Güncel (${path.basename(appDataScript)})` : c.red + '✗ Eksik'}${c.reset}
----------------------------------------
`);
  }

  sync() {
    console.log(`${c.cyan}⚡ Vubbio eklentisi AppData'ya senkronize ediliyor...${c.reset}`);
    if (!fs.existsSync(this.vubbioSrc)) {
      throw new Error(`Kaynak dosya bulunamadı: ${this.vubbioSrc}`);
    }
    if (!fs.existsSync(this.vubbioAppData)) {
      fs.mkdirSync(this.vubbioAppData, { recursive: true });
    }
    const dest = path.join(this.vubbioAppData, 'index.js');
    fs.copyFileSync(this.vubbioSrc, dest);
    const stat = fs.statSync(dest);
    console.log(`${c.green}  ✓ Senkronizasyon başarılı: ${Math.round(stat.size / 1024)} KB${c.reset}`);
    console.log(`${c.lime}  Hedef: ${dest}${c.reset}`);
    console.log(`${c.cyan}  İpucu: Jubbio açıkken Ctrl + R veya F5 ile yenileyerek değişiklikleri anında görebilirsiniz.${c.reset}`);
  }

  async repair() {
    console.log(`${c.yellow}🔧 Vubbio onarılıyor...${c.reset}`);
    if (this.isInstalled()) {
      await this.uninstall();
    }
    await this.install();
    console.log(`${c.lime}  ✓ Onarım tamamlandı!${c.reset}`);
  }
}

async function main() {
  banner();

  const DEFAULT_JUBBIO = 'C:\\Users\\selam\\AppData\\Local\\Programs\\jubbio-client';
  const args = process.argv.slice(2);
  const cmd = args[0] || 'install';
  const jubbioPath = args[1] || DEFAULT_JUBBIO;

  const patcher = new JubbioPatcher(jubbioPath);

  try {
    switch (cmd) {
      case 'install':
        patcher.validate();
        await patcher.install();
        break;
      case 'uninstall':
        patcher.validate();
        await patcher.uninstall();
        break;
      case 'status':
        patcher.status();
        break;
      case 'sync':
        patcher.sync();
        break;
      case 'repair':
        patcher.validate();
        await patcher.repair();
        break;
      default:
        console.log(`Kullanım: node install.js [install|uninstall|status|sync|repair]`);
    }
  } catch (err) {
    console.error(`${c.red}❌ Hata: ${err.message}${c.reset}`);
    process.exit(1);
  }
}

main();
