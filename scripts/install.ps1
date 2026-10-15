# ⚡ Vubbio PowerShell Yükleyici
# Yönetici olarak çalıştırın

param(
    [string]$Command = "install",
    [string]$JubbioPath = "$env:LOCALAPPDATA\Programs\jubbio-client"
)

$Host.UI.RawUI.WindowTitle = "Vubbio Installer"

function Write-Banner {
    Clear-Host
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║          ⚡  VUBBIO  INSTALLER  ⚡          ║" -ForegroundColor Green
    Write-Host "║     Jubbio Nexus Mod Loader v1.0.0        ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
}

function Write-Step {
    param([string]$msg, [string]$color = "Cyan")
    Write-Host "  → $msg" -ForegroundColor $color
}

function Write-OK {
    param([string]$msg)
    Write-Host "  ✓ $msg" -ForegroundColor Green
}

function Write-Error-Msg {
    param([string]$msg)
    Write-Host "  ✗ $msg" -ForegroundColor Red
}

Write-Banner

$VubbioDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ScriptDir = Split-Path -Parent $VubbioDir
$NodeScript = Join-Path $ScriptDir "installer\install.js"

# Node.js kontrolü
Write-Step "Node.js kontrol ediliyor..."
try {
    $nodeVersion = node --version 2>&1
    Write-OK "Node.js bulundu: $nodeVersion"
} catch {
    Write-Error-Msg "Node.js bulunamadı! https://nodejs.org adresinden indirin."
    Read-Host "Çıkmak için Enter'a basın"
    exit 1
}

# Jubbio kontrolü
Write-Step "Jubbio dizini kontrol ediliyor: $JubbioPath"
if (-not (Test-Path $JubbioPath)) {
    Write-Error-Msg "Jubbio bulunamadı: $JubbioPath"
    $JubbioPath = Read-Host "Jubbio yolu girin (veya Enter'a basarak iptal edin)"
    if (-not $JubbioPath) { exit 1 }
}
Write-OK "Jubbio bulundu"

# Jubbio kapatılıyor mu?
$jubbioProcess = Get-Process -Name "Jubbio" -ErrorAction SilentlyContinue
if ($jubbioProcess) {
    Write-Step "Jubbio kapatılıyor..." "Yellow"
    $jubbioProcess | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-OK "Jubbio kapatıldı"
}

# Installer çalıştır
Write-Step "Vubbio yükleniyor..."
Write-Host ""

$env:DEBUG = ""
node $NodeScript $Command $JubbioPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "  ┌─────────────────────────────────────────┐" -ForegroundColor Green
    Write-Host "  │  ✅ Vubbio kurulumu tamamlandı!          │" -ForegroundColor Green
    Write-Host "  │  Jubbio'yu açın ve ⚡ rozeti arayın.    │" -ForegroundColor Green
    Write-Host "  └─────────────────────────────────────────┘" -ForegroundColor Green
    
    # Jubbio'yu aç
    $openJubbio = Read-Host "`n  Jubbio'yu şimdi açmak ister misiniz? (E/H)"
    if ($openJubbio -eq "E" -or $openJubbio -eq "e" -or $openJubbio -eq "Y" -or $openJubbio -eq "y") {
        $jubbioExe = Join-Path $JubbioPath "Jubbio.exe"
        if (Test-Path $jubbioExe) {
            Start-Process $jubbioExe
            Write-OK "Jubbio başlatıldı!"
        }
    }
} else {
    Write-Error-Msg "Kurulum başarısız oldu!"
}

Write-Host ""
Read-Host "Çıkmak için Enter'a basın"
