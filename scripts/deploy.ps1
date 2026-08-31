# =========================================================
# PHS Rambots - New Machine Deployment Script
# Usage (elevated PowerShell): irm https://phsrambots.org/deploy.ps1 | iex
# =========================================================

# --- 0. Ensure running as Administrator ---
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Administrator privileges required. Requesting elevation..." -ForegroundColor Yellow
    if ($PSCommandPath) {
        # Running from a saved .ps1 file
        Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    } else {
        # Running via irm | iex (no local file), re-launch the same way elevated
        Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"irm https://phsrambots.org/scripts/deploy.ps1 | iex`""
    }
    exit
}

Write-Host "=== Starting Rambots deployment ===" -ForegroundColor Cyan

# --- Helper: get a download URL for the latest GitHub release asset matching a pattern ---
function Get-LatestGithubAsset {
    param(
        [Parameter(Mandatory)][string]$Repo,     # e.g. "mjansen4857/pathplanner"
        [Parameter(Mandatory)][string]$Pattern    # e.g. "*win*.exe"
    )
    $headers = @{ "User-Agent" = "PHS-Rambots-Deploy-Script" }
    $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest" -Headers $headers
    $asset = $release.assets | Where-Object { $_.name -like $Pattern } | Select-Object -First 1
    if (-not $asset) {
        Write-Host "  Could not find an asset matching '$Pattern' in $Repo latest release ($($release.tag_name))." -ForegroundColor Red
        return $null
    }
    return $asset.browser_download_url
}

# --- 1. Install Reemo (remote access) ---
Write-Host "Installing Reemo..." -ForegroundColor Yellow
$exe = "$env:TEMP\reemo.exe"
Invoke-WebRequest "https://download.reemo.io/reemo.setup.x64.exe" -OutFile $exe
Start-Process $exe -ArgumentList "/S" -Wait
$configDir = "C:\Program Files\Reemo\service"
$configPath = Join-Path $configDir "reemo.ini"
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}
$content = @"
[auth]
token=7c5910993c15
"@
Set-Content -Path $configPath -Value $content -Encoding ASCII
Write-Host "Reemo config written." -ForegroundColor Green

# --- 2. Run WinUtil with pre-exported config ---
Write-Host "Running WinUtil (apps, tweaks, DNS, Edge debloat, OOSU)..." -ForegroundColor Yellow
$winutilConfig = "https://phsrambots.org/scripts/ctt.config.json"
& ([ScriptBlock]::Create((irm "https://christitus.com/win"))) -Config $winutilConfig

# --- 3. Conditionally enable Ultimate Performance power plan ---
Write-Host "Checking chassis type for power plan..." -ForegroundColor Yellow
$chassisTypes = (Get-CimInstance -ClassName Win32_SystemEnclosure).ChassisTypes
$laptopTypes = 8,9,10,11,12,14,18,21,30,31,32
$isLaptop = ($chassisTypes | Where-Object { $laptopTypes -contains $_ }).Count -gt 0
if (-not $isLaptop) {
    $guid = "e9a42b02-d5df-448d-aa00-03f14749eb61"
    powercfg -duplicatescheme $guid | Out-Null
    $newPlan = (powercfg -list | Select-String "Ultimate Performance").Line -replace ".*: (.*) \(.*", '$1'
    powercfg -setactive $newPlan.Trim()
    Write-Host "Ultimate Performance power plan enabled (desktop detected)." -ForegroundColor Green
} else {
    Write-Host "Laptop detected - skipping Ultimate Performance." -ForegroundColor Green
}

# --- 4. Install WPILib VS Code ---
# Note: as of this writing WPILib's installer has no silent/unattended switch,
# so this downloads the offline .iso, mounts it, and launches the installer
# for the user to click through (Everything / Tools Only, etc).
Write-Host "Downloading WPILib..." -ForegroundColor Yellow
$wpilibIsoUrl = Get-LatestGithubAsset -Repo "wpilibsuite/allwpilib" -Pattern "WPILib_Windows-*.iso"
if ($wpilibIsoUrl) {
    $wpilibIso = "$env:TEMP\WPILib_Windows.iso"
    Invoke-WebRequest $wpilibIsoUrl -OutFile $wpilibIso
    Write-Host "Mounting WPILib installer image..." -ForegroundColor Yellow
    $mount = Mount-DiskImage -ImagePath $wpilibIso -PassThru
    $driveLetter = ($mount | Get-Volume).DriveLetter
    $installerExe = Get-ChildItem -Path "${driveLetter}:\" -Filter "WPILibInstaller.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($installerExe) {
        Write-Host "Launching WPILib installer - please complete the setup wizard..." -ForegroundColor Yellow
        Start-Process $installerExe.FullName -Wait
        Write-Host "WPILib installer closed." -ForegroundColor Green
    } else {
        Write-Host "  Could not locate WPILibInstaller.exe on the mounted image." -ForegroundColor Red
    }
    Dismount-DiskImage -ImagePath $wpilibIso | Out-Null
} else {
    Write-Host "  Skipping WPILib (download link not found)." -ForegroundColor Red
}

# --- 5. Install PathPlanner ---
Write-Host "Installing PathPlanner..." -ForegroundColor Yellow
$ppUrl = Get-LatestGithubAsset -Repo "mjansen4857/pathplanner" -Pattern "*windows*setup*.exe"
if (-not $ppUrl) { $ppUrl = Get-LatestGithubAsset -Repo "mjansen4857/pathplanner" -Pattern "*.exe" }
if ($ppUrl) {
    $ppExe = "$env:TEMP\pathplanner-setup.exe"
    Invoke-WebRequest $ppUrl -OutFile $ppExe
    Start-Process $ppExe -ArgumentList "/VERYSILENT /SUPPRESSMSGBOXES /NORESTART" -Wait
    Write-Host "PathPlanner installed." -ForegroundColor Green
} else {
    Write-Host "  Skipping PathPlanner (download link not found)." -ForegroundColor Red
}

# --- 6. Install Elastic Dashboard ---
Write-Host "Installing Elastic Dashboard..." -ForegroundColor Yellow
$elasticUrl = Get-LatestGithubAsset -Repo "Gold872/elastic_dashboard" -Pattern "*windows*setup*.exe"
if (-not $elasticUrl) { $elasticUrl = Get-LatestGithubAsset -Repo "Gold872/elastic_dashboard" -Pattern "*.exe" }
if ($elasticUrl) {
    $elasticExe = "$env:TEMP\elastic-setup.exe"
    Invoke-WebRequest $elasticUrl -OutFile $elasticExe
    Start-Process $elasticExe -ArgumentList "/VERYSILENT /SUPPRESSMSGBOXES /NORESTART" -Wait
    Write-Host "Elastic Dashboard installed." -ForegroundColor Green
} else {
    Write-Host "  Skipping Elastic Dashboard (download link not found)." -ForegroundColor Red
}

# --- 7. Ask if this machine is for driving ---
$driveAnswer = Read-Host "Will this machine be used for driving? (Y/N)"
if ($driveAnswer -match '^[Yy]') {
    # Phoenix Tuner X is distributed via the Microsoft Store; install it via winget.
    Write-Host "Installing Phoenix Tuner X..." -ForegroundColor Yellow
    try {
        winget install --id 9NVV4PWDW27Z -s msstore --accept-package-agreements --accept-source-agreements -e
        Write-Host "Phoenix Tuner X installed." -ForegroundColor Green
    } catch {
        Write-Host "  winget install failed - install Phoenix Tuner X manually from the Microsoft Store." -ForegroundColor Red
    }
} else {
    Write-Host "Skipping driving station software." -ForegroundColor Green
}

# --- 8. Wrap up and restart ---
Write-Host "Congratulations! Everything has been installed." -ForegroundColor Cyan
Write-Host "The machine will restart in:" -ForegroundColor Cyan
for ($i = 5; $i -ge 0; $i--) {
    Write-Host $i -ForegroundColor Cyan
    Start-Sleep -Seconds 1
}
Restart-Computer -Force
